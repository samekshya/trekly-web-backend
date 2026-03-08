import request from "supertest";
import app from "../app";
import User from "../modules/user/user.model";
import mongoose from "mongoose";

const userData = {
  name: "Test User",
  email: "test@example.com",
  password: "password123",
};

describe("Auth Module Integration Tests", () => {
  // Test 1: Register a new user
  it("should register a new user successfully", async () => {
    const res = await request(app).post("/api/auth/register").send(userData);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("email", userData.email);
  });

  // Test 2: Fail duplicate email registration
  it("should fail to register with an existing email", async () => {
    await request(app).post("/api/auth/register").send(userData);
    const res = await request(app).post("/api/auth/register").send(userData);
    expect(res.status).toBe(409); // Or 409 depending on your service logic
  });

  // Test 3: Login successfully
  it("should login successfully with valid credentials", async () => {
    await request(app).post("/api/auth/register").send(userData);
    const res = await request(app).post("/api/auth/login").send({
      email: userData.email,
      password: userData.password,
    });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("token");
  });

  // Test 4: Fail login with wrong password
  it("should fail login with incorrect password", async () => {
    await request(app).post("/api/auth/register").send(userData);
    const res = await request(app).post("/api/auth/login").send({
      email: userData.email,
      password: "wrongpassword",
    });
    expect(res.status).toBe(401); // Or 400
  });

  // Test 5: Get current user (Me)
  it("should get current user profile with valid token", async () => {
    // 1. Register & Login
    await request(app).post("/api/auth/register").send(userData);
    const loginRes = await request(app).post("/api/auth/login").send({
      email: userData.email,
      password: userData.password,
    });
    const token = loginRes.body.data.token;

    // 2. Get Profile using Authorization header
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe(userData.email);
  });

  // Test 6: Fail Get Me without token
  it("should fail to get profile without token", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
  });

   // Test 7: Update user profile
  it("should update user profile successfully", async () => {
    // 1. Register & Login
    await request(app).post("/api/auth/register").send(userData);
    const loginRes = await request(app).post("/api/auth/login").send({
      email: userData.email,
      password: userData.password,
    });
    
    const token = loginRes.body.data.token;
    // Fix: Get the ID correctly from the nested user object
    const userId = loginRes.body.data.user._id || loginRes.body.data.user.id;

    // 2. Update Profile
    const updateData = { name: "Updated Name" };
    const res = await request(app)
      .put(`/api/auth/${userId}`)
      .set("Authorization", `Bearer ${token}`)
      .send(updateData);

    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe("Updated Name");
  });


  // Test 8: Prevent updating other user's profile
  it("should prevent updating another user's profile", async () => {
    // 1. Register & Login
    await request(app).post("/api/auth/register").send(userData);
    const loginRes = await request(app).post("/api/auth/login").send({
      email: userData.email,
      password: userData.password,
    });
    const token = loginRes.body.data.token;
    
    // 2. Try to update a different random ID
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .put(`/api/auth/${fakeId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Hacker" });

    expect(res.status).toBe(403); // Forbidden
  });
});
