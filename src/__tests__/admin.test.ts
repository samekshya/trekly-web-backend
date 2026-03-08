import request from "supertest";
import app from "../app";
import User from "../modules/user/user.model";
import mongoose from "mongoose";

describe("Admin Module Integration Tests", () => {
  let adminToken: string;
  let userToken: string;

  beforeEach(async () => {
    // 1. Create an Admin user
    const adminRes = await request(app).post("/api/auth/register").send({
      name: "Admin User",
      email: "admin@example.com",
      password: "password123",
    });
    // Manually make them admin in the test DB
    await User.updateOne({ email: "admin@example.com" }, { role: "admin" });
    
    const adminLogin = await request(app).post("/api/auth/login").send({
      email: "admin@example.com",
      password: "password123",
    });
    adminToken = adminLogin.body.data.token;

    // 2. Create a Regular user
    await request(app).post("/api/auth/register").send({
      name: "Regular User",
      email: "user@example.com",
      password: "password123",
    });
    const userLogin = await request(app).post("/api/auth/login").send({
      email: "user@example.com",
      password: "password123",
    });
    userToken = userLogin.body.data.token;
  });

  // Test 10: Deny access to non-admins
  it("should deny access to GET /api/admin/users for regular users", async () => {
    const res = await request(app)
      .get("/api/admin/users")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.status).toBe(403);
  });

  // Test 11: Allow access to admins
  it("should allow admin to fetch all users", async () => {
    const res = await request(app)
      .get("/api/admin/users")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  // Test 12: Test Pagination
  it("should return pagination metadata in user list", async () => {
    const res = await request(app)
      .get("/api/admin/users?page=1&limit=1")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.body).toHaveProperty("pagination");
    expect(res.body.pagination.limit).toBe(1);
  });

  // Test 13: Admin create user
  it("should allow admin to create a new user via admin route", async () => {
    const res = await request(app)
      .post("/api/admin/users")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Created By Admin",
        email: "created@example.com",
        password: "password123",
        role: "user"
      });
    expect(res.status).toBe(201);
  });

    // Test 14: Admin delete user
  it("should allow admin to delete a user", async () => {
    // 1. Create a fresh user to delete
    const tempUser = await User.create({
      name: "Delete Me",
      email: "deleteme@example.com",
      password: "password123"
    });

    // 2. Delete them
    const res = await request(app)
      .delete(`/api/admin/users/${tempUser._id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toContain("deleted");
  });


  // Test 15: Delete non-existing user
  it("should return 404 when deleting non-existent user", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .delete(`/api/admin/users/${fakeId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(404);
  });

  // Test 16: Admin fetch single user
  it("should allow admin to fetch a single user by ID", async () => {
    const user = await User.findOne({ email: "user@example.com" });
    const res = await request(app)
      .get(`/api/admin/users/${user?._id}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe("user@example.com");
  });

  // Test 17: Admin update user role
  it("should allow admin to change a user's role", async () => {
    const user = await User.findOne({ email: "user@example.com" });
    const res = await request(app)
      .put(`/api/admin/users/${user?._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ role: "admin" });
    expect(res.status).toBe(200);
    expect(res.body.data.role).toBe("admin");
  });

  // Test 18: Admin search users
  it("should return filtered users when searching", async () => {
    const res = await request(app)
      .get("/api/admin/users?search=Regular")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.body.data.some((u: any) => u.name === "Regular User")).toBe(true);
  });

  // Test 19: Deny admin creation to regular users
  it("should block regular users from creating users via admin route", async () => {
    const res = await request(app)
      .post("/api/admin/users")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ name: "Hacker", email: "hacker@example.com", password: "123" });
    expect(res.status).toBe(403);
  });
});
