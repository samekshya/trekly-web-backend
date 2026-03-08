import request from "supertest";
import app from "../app";
import User from "../modules/user/user.model";
import crypto from "crypto";

describe("Password Reset Integration Tests", () => {
  const userData = {
    name: "Reset User",
    email: "reset@example.com",
    password: "oldpassword123",
  };

  beforeEach(async () => {
    await User.create(userData);
  });

  // Test 20: Forgot password success
  it("should return success message for forgot password request", async () => {
    const res = await request(app)
      .post("/api/auth/forgot-password")
      .send({ email: userData.email });
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  // Test 21: Forgot password generates token in DB
  it("should store a hashed reset token in the database", async () => {
    await request(app)
      .post("/api/auth/forgot-password")
      .send({ email: userData.email });
    
    const user = await User.findOne({ email: userData.email });
    expect(user?.resetPasswordToken).toBeDefined();
    expect(user?.resetPasswordExpires).toBeDefined();
  });

  // Test 22: Reset password successfully
  it("should reset password with a valid token", async () => {
    // 1. Manually generate a token like the controller does
    const rawToken = "test-reset-token-123";
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    
    await User.updateOne(
      { email: userData.email },
      { 
        resetPasswordToken: hashedToken, 
        resetPasswordExpires: new Date(Date.now() + 15 * 60 * 1000) 
      }
    );

    // 2. Reset the password
    const res = await request(app)
      .post("/api/auth/reset-password")
      .send({ token: rawToken, password: "newpassword123" });

    expect(res.status).toBe(200);
    expect(res.body.message).toContain("successful");

    // 3. Verify new password works by logging in
    const loginRes = await request(app).post("/api/auth/login").send({
      email: userData.email,
      password: "newpassword123",
    });
    expect(loginRes.status).toBe(200);
  });

  // Test 23: Fail reset with invalid token
  it("should fail to reset password with an invalid token", async () => {
    const res = await request(app)
      .post("/api/auth/reset-password")
      .send({ token: "wrong-token", password: "newpassword123" });
    
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  // Test 24: Fail reset with expired token
  it("should fail to reset password with an expired token", async () => {
    const rawToken = "expired-token";
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    
    // Set expiry in the past
    await User.updateOne(
      { email: userData.email },
      { 
        resetPasswordToken: hashedToken, 
        resetPasswordExpires: new Date(Date.now() - 1000) 
      }
    );

    const res = await request(app)
      .post("/api/auth/reset-password")
      .send({ token: rawToken, password: "newpassword123" });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain("expired");
  });

  // Test 25: Clear token fields after successful reset
  it("should clear reset token fields after a successful reset", async () => {
    const rawToken = "cleanup-token";
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    
    await User.updateOne(
      { email: userData.email },
      { 
        resetPasswordToken: hashedToken, 
        resetPasswordExpires: new Date(Date.now() + 15 * 60 * 1000) 
      }
    );

    await request(app)
      .post("/api/auth/reset-password")
      .send({ token: rawToken, password: "newpassword123" });

    const user = await User.findOne({ email: userData.email });
    expect(user?.resetPasswordToken).toBeUndefined();
    expect(user?.resetPasswordExpires).toBeUndefined();
  });
});
