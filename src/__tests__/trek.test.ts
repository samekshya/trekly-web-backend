import request from "supertest";
import app from "../app";
import User from "../modules/user/user.model";

// Sample trek data matching the backend model
const trekData = {
  name: "Everest Base Camp",
  description: "A classic Himalayan trek to the base of the world's highest peak.",
  location: "Solukhumbu, Nepal",
  duration: 14,
  difficulty: "Hard",
  imageUrl: "https://example.com/ebc.jpg",
  price: 1500,
  itinerary: [],
  hotels: [],
};

describe("Trek Module Integration Tests", () => {
  let adminToken: string;
  let createdTrekId: string;

  // Before each test: create an admin user and get token
  beforeEach(async () => {
    await request(app).post("/api/auth/register").send({
      name: "Admin User",
      email: "admin@example.com",
      password: "password123",
    });

    await User.updateOne({ email: "admin@example.com" }, { role: "admin" });

    const loginRes = await request(app).post("/api/auth/login").send({
      email: "admin@example.com",
      password: "password123",
    });

    adminToken = loginRes.body.data.token;
  });

  // Test 1: Create a trek successfully
  it("should create a new trek successfully", async () => {
    const res = await request(app)
      .post("/api/treks")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(trekData);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("_id");
    expect(res.body.data.name).toBe(trekData.name);

    createdTrekId = res.body.data._id;
  });

  // Test 2: Fail to create trek with missing required fields
  it("should fail to create a trek with missing required fields", async () => {
    const res = await request(app)
      .post("/api/treks")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Incomplete Trek" }); // missing required fields

    expect(res.status).toBe(500); // Mongoose validation error
    expect(res.body.success).toBe(false);
  });

  // Test 3: Get all treks
  it("should return a list of all treks", async () => {
    // First create one
    await request(app)
      .post("/api/treks")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(trekData);

    const res = await request(app).get("/api/treks");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  // Test 4: Get all treks returns pagination metadata
  it("should return pagination metadata with trek list", async () => {
    const res = await request(app).get("/api/treks?page=1&limit=5");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("pagination");
    expect(res.body.pagination).toHaveProperty("page");
    expect(res.body.pagination).toHaveProperty("total");
    expect(res.body.pagination).toHaveProperty("totalPages");
  });

  // Test 5: Get trek by ID
  it("should return a single trek by ID", async () => {
    // Create trek first
    const createRes = await request(app)
      .post("/api/treks")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(trekData);

    const id = createRes.body.data._id;

    const res = await request(app).get(`/api/treks/${id}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data._id).toBe(id);
    expect(res.body.data.name).toBe(trekData.name);
  });

  // Test 6: Return 404 for non-existent trek ID
  it("should return 404 for a non-existent trek ID", async () => {
    const fakeId = "64f1a2b3c4d5e6f7a8b9c0d1";

    const res = await request(app).get(`/api/treks/${fakeId}`);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  // Test 7: Update a trek
  it("should update a trek successfully", async () => {
    // Create trek first
    const createRes = await request(app)
      .post("/api/treks")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(trekData);

    const id = createRes.body.data._id;

    const res = await request(app)
      .put(`/api/treks/${id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Updated Trek Name", price: 2000 });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("Updated Trek Name");
  });

  // Test 8: Return 404 when updating non-existent trek
  it("should return 404 when updating a non-existent trek", async () => {
    const fakeId = "64f1a2b3c4d5e6f7a8b9c0d1";

    const res = await request(app)
      .put(`/api/treks/${fakeId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Ghost Trek" });

    expect(res.status).toBe(404);
  });

  // Test 9: Delete a trek
  it("should delete a trek successfully", async () => {
    // Create trek first
    const createRes = await request(app)
      .post("/api/treks")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(trekData);

    const id = createRes.body.data._id;

    const res = await request(app)
      .delete(`/api/treks/${id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain("deleted");
  });

  // Test 10: Return 404 when deleting non-existent trek
  it("should return 404 when deleting a non-existent trek", async () => {
    const fakeId = "64f1a2b3c4d5e6f7a8b9c0d1";

    const res = await request(app)
      .delete(`/api/treks/${fakeId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(404);
  });

  // Test 11: Filter treks by difficulty
  it("should filter treks by difficulty", async () => {
    // Create a Hard trek
    await request(app)
      .post("/api/treks")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(trekData); // difficulty: "Hard"

    // Create an Easy trek
    await request(app)
      .post("/api/treks")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ ...trekData, name: "Easy Walk", difficulty: "Easy" });

    const res = await request(app).get("/api/treks?difficulty=Hard");

    expect(res.status).toBe(200);
    expect(res.body.data.every((t: any) => t.difficulty === "Hard")).toBe(true);
  });

  // Test 12: Search treks by name
  it("should search treks by name", async () => {
    await request(app)
      .post("/api/treks")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(trekData); // name: "Everest Base Camp"

    const res = await request(app).get("/api/treks?search=Everest");

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(
      res.body.data.some((t: any) => t.name.includes("Everest"))
    ).toBe(true);
  });

  // Test 13: Search treks by location
  it("should search treks by location", async () => {
    await request(app)
      .post("/api/treks")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(trekData); // location: "Solukhumbu, Nepal"

    const res = await request(app).get("/api/treks?search=Solukhumbu");

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  // Test 14: Get all treks does not require auth
  it("should allow unauthenticated users to get all treks", async () => {
    const res = await request(app).get("/api/treks");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  // Test 15: Get trek by ID does not require auth
  it("should allow unauthenticated users to get a single trek", async () => {
    const createRes = await request(app)
      .post("/api/treks")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(trekData);

    const id = createRes.body.data._id;

    const res = await request(app).get(`/api/treks/${id}`);

    expect(res.status).toBe(200);
  });
});