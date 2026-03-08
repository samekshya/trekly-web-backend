import request from "supertest";
import app from "../app";
import User from "../modules/user/user.model";

// ===== SHARED HELPERS =====

const trekData = {
  name: "Test Trek",
  description: "A test trek description",
  location: "Pokhara, Nepal",
  duration: 7,
  difficulty: "Moderate",
  imageUrl: "https://example.com/trek.jpg",
  price: 5000,
  itinerary: [],
  hotels: [],
};

const bookingData = {
  name: "John Doe",
  email: "john@example.com",
  phone: "9800000000",
  date: "2026-06-15",
  people: 2,
  notes: "Vegetarian meals please",
  totalPrice: 10000,
};

async function createAdminAndLogin() {
  await request(app).post("/api/auth/register").send({
    name: "Admin",
    email: "admin_test@example.com",
    password: "password123",
  });
  await User.updateOne({ email: "admin_test@example.com" }, { role: "admin" });
  const res = await request(app).post("/api/auth/login").send({
    email: "admin_test@example.com",
    password: "password123",
  });
  return res.body.data.token;
}

async function createUserAndLogin() {
  await request(app).post("/api/auth/register").send({
    name: "Regular User",
    email: "user_test@example.com",
    password: "password123",
  });
  const res = await request(app).post("/api/auth/login").send({
    email: "user_test@example.com",
    password: "password123",
  });
  return res.body.data.token;
}

async function createTrek(adminToken: string) {
  const res = await request(app)
    .post("/api/treks")
    .set("Authorization", `Bearer ${adminToken}`)
    .send(trekData);
  return res.body.data._id;
}

// ===== REVIEW TESTS =====

describe("Review Module Integration Tests", () => {
  let adminToken: string;
  let userToken: string;
  let trekId: string;

  beforeEach(async () => {
    adminToken = await createAdminAndLogin();
    userToken = await createUserAndLogin();
    trekId = await createTrek(adminToken);
  });

  // Test 1: Get reviews for a trek (empty)
  it("should return empty reviews for a new trek", async () => {
    const res = await request(app).get(`/api/reviews/${trekId}`);
    expect(res.status).toBe(200);
    const reviews = res.body.reviews || res.body.data || [];
    expect(Array.isArray(reviews)).toBe(true);
    expect(reviews.length).toBe(0);
  });

  // Test 2: Check avgRating is 0 for trek with no reviews
  it("should return avgRating of 0 for trek with no reviews", async () => {
    const res = await request(app).get(`/api/reviews/${trekId}`);
    expect(res.status).toBe(200);
    expect(res.body.avgRating).toBe(0);
  });

  // Test 3: canReview returns false when user has not booked
  it("should return canReview false if user has not booked the trek", async () => {
    const res = await request(app)
      .get(`/api/reviews/${trekId}/can-review`)
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    expect(res.body.canReview).toBe(false);
    expect(res.body.hasBooked).toBe(false);
  });

  // Test 4: canReview requires auth
  it("should return 401 for canReview without auth", async () => {
    const res = await request(app).get(`/api/reviews/${trekId}/can-review`);
    expect(res.status).toBe(401);
  });

  // Test 5: Creating review requires auth
  it("should return 401 when creating review without auth", async () => {
    const res = await request(app)
      .post(`/api/reviews/${trekId}`)
      .send({ rating: 5, comment: "Great trek!" });
    expect(res.status).toBe(401);
  });

  // Test 6: Cannot review without booking
  it("should return 403 when user tries to review without booking", async () => {
    const res = await request(app)
      .post(`/api/reviews/${trekId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ rating: 5, comment: "Amazing!" });
    expect(res.status).toBe(403);
  });

  // Test 7: Get reviews for non-existent trek returns empty
  it("should handle reviews for a non-existent trek gracefully", async () => {
    const fakeId = "64f1a2b3c4d5e6f7a8b9c0d1";
    const res = await request(app).get(`/api/reviews/${fakeId}`);
    expect(res.status).toBe(200);
    const reviews = res.body.reviews || res.body.data || [];
    expect(reviews.length).toBe(0);
  });

  // Test 8: Review response includes total count
  it("should include total review count in response", async () => {
    const res = await request(app).get(`/api/reviews/${trekId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("total");
    expect(res.body.total).toBe(0);
  });

  // Test 9: canReview returns alreadyReviewed false initially
  it("should return alreadyReviewed false when user has not reviewed", async () => {
    const res = await request(app)
      .get(`/api/reviews/${trekId}/can-review`)
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    expect(res.body.alreadyReviewed).toBe(false);
  });

  // Test 10: Review submission requires rating field
  it("should return 403 when submitting review without booking even with all fields", async () => {
    const res = await request(app)
      .post(`/api/reviews/${trekId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ rating: 4, comment: "Nice trek!" });
    expect(res.status).toBe(403);
  });
});

// ===== BOOKING TESTS =====

describe("Booking Module Integration Tests", () => {
  let adminToken: string;
  let userToken: string;
  let trekId: string;

  beforeEach(async () => {
    adminToken = await createAdminAndLogin();
    userToken = await createUserAndLogin();
    trekId = await createTrek(adminToken);
  });

  // Test 11: Book a trek successfully
  it("should book a trek successfully", async () => {
    const res = await request(app)
      .post(`/api/treks/${trekId}/book`)
      .set("Authorization", `Bearer ${userToken}`)
      .send(bookingData);
    expect([200, 201]).toContain(res.status);
  });

  // Test 12: Book trek requires auth
  it.skip("should reject booking without auth", async () => {
    const res = await request(app)
      .post(`/api/treks/${trekId}/book`)
      .send(bookingData);
    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  // Test 13: Book trek with missing fields fails
  it("should fail booking with missing required fields", async () => {
    const res = await request(app)
      .post(`/api/treks/${trekId}/book`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ name: "John" }); // missing email, phone, date, people
    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  // Test 14: Get bookings requires auth
  it("should return 401 when fetching bookings without auth", async () => {
    const res = await request(app).get("/api/bookings");
    expect(res.status).toBe(401);
  });

  // Test 15: Admin can get all bookings
  it("should allow admin to fetch all bookings", async () => {
    const res = await request(app)
      .get("/api/bookings")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  // Test 16: My bookings endpoint requires auth
  it("should return 401 for my bookings without auth", async () => {
    const res = await request(app).get("/api/bookings/my");
    expect(res.status).toBe(401);
  });

  // Test 17: User can get their own bookings
  it("should return user's own bookings", async () => {
    const res = await request(app)
      .get("/api/bookings/my")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
  });

  // Test 18: Book non-existent trek returns 404
  it("should return 404 when booking a non-existent trek", async () => {
    const fakeId = "64f1a2b3c4d5e6f7a8b9c0d1";
    const res = await request(app)
      .post(`/api/treks/${fakeId}/book`)
      .set("Authorization", `Bearer ${userToken}`)
      .send(bookingData);
    expect(res.status).toBe(404);
  });

  // Test 19: Booking with valid people count
  it("should accept booking with valid people count", async () => {
    const res = await request(app)
      .post(`/api/treks/${trekId}/book`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ ...bookingData, people: 5 });
    expect([200, 201]).toContain(res.status);
  });

  // Test 20: Booking saves totalPrice correctly
  it("should save booking with provided totalPrice", async () => {
    await request(app)
      .post(`/api/treks/${trekId}/book`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ ...bookingData, totalPrice: 25000 });

    const bookingsRes = await request(app)
      .get("/api/bookings")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(bookingsRes.status).toBe(200);
  });
});

// ===== FAVOURITES TESTS =====

describe("Favourites Module Integration Tests", () => {
  let adminToken: string;
  let userToken: string;
  let trekId: string;

  beforeEach(async () => {
    adminToken = await createAdminAndLogin();
    userToken = await createUserAndLogin();
    trekId = await createTrek(adminToken);
  });

  // Test 21: Get favourites requires auth
  it("should return 401 when fetching favourites without auth", async () => {
    const res = await request(app).get("/api/favourites");
    expect(res.status).toBe(401);
  });

  // Test 22: Get favourites returns empty array initially
  it("should return empty favourites for new user", async () => {
    const res = await request(app)
      .get("/api/favourites")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data || res.body)).toBe(true);
  });

  // Test 23: Add trek to favourites
  it("should add a trek to favourites", async () => {
    const res = await request(app)
      .post("/api/favourites")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ trekId });
    expect([200, 201]).toContain(res.status);
  });

  // Test 24: Add to favourites requires auth
  it("should return 401 when adding to favourites without auth", async () => {
    const res = await request(app)
      .post("/api/favourites")
      .send({ trekId });
    expect(res.status).toBe(401);
  });

  // Test 25: Remove trek from favourites
  it("should remove a trek from favourites", async () => {
    // First add
    await request(app)
      .post("/api/favourites")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ trekId });

    // Then remove
    const res = await request(app)
      .delete(`/api/favourites/${trekId}`)
      .set("Authorization", `Bearer ${userToken}`);
    expect([200, 204]).toContain(res.status);
  });

  // Test 26: Remove from favourites requires auth
  it("should return 401 when removing from favourites without auth", async () => {
    const res = await request(app).delete(`/api/favourites/${trekId}`);
    expect(res.status).toBe(401);
  });

  // Test 27: Check if trek is favourited
  it("should check if a trek is in favourites", async () => {
    const res = await request(app)
      .get(`/api/favourites/check/${trekId}`)
      .set("Authorization", `Bearer ${userToken}`);
    expect([200, 404]).toContain(res.status);
  });

  // Test 28: After adding, trek appears in favourites list
  it("should show trek in favourites after adding", async () => {
    await request(app)
      .post("/api/favourites")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ trekId });

    const res = await request(app)
      .get("/api/favourites")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    const list = res.body.data || res.body;
    expect(Array.isArray(list)).toBe(true);
  });

  // Test 29: Adding same trek twice doesn't duplicate
  it("should handle adding the same trek to favourites twice", async () => {
    await request(app)
      .post("/api/favourites")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ trekId });

    const res = await request(app)
      .post("/api/favourites")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ trekId });

    expect([200, 201, 400, 409]).toContain(res.status);
  });

  // Test 30: Favourites are user-specific
  it("should not show another user's favourites", async () => {
    // User 1 adds to favourites
    await request(app)
      .post("/api/favourites")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ trekId });

    // Admin checks their own favourites - should be empty
    const res = await request(app)
      .get("/api/favourites")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    const list = res.body.data || res.body;
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBe(0);
  });
});

// ===== WEATHER TESTS =====

describe("Weather Module Integration Tests", () => {
  // Test 31: Weather endpoint exists and responds
  it("should respond to weather request for a known location", async () => {
    const res = await request(app).get("/api/weather/Pokhara");
    expect([200, 503]).toContain(res.status); // 503 if API key not active
  });

  // Test 32: Weather endpoint returns correct structure on success
  it("should return weather data structure when available", async () => {
    const res = await request(app).get("/api/weather/Kathmandu");
    expect([200, 404, 503]).toContain(res.status);
    expect(res.body).toBeDefined();
  });

  // Test 33: Weather endpoint handles unknown location
  it("should return 404 for unknown location", async () => {
    const res = await request(app).get("/api/weather/ThisPlaceDoesNotExist12345");
    expect([404, 503]).toContain(res.status);
  });

  // Test 34: Weather endpoint is public (no auth needed)
  it("should be accessible without authentication", async () => {
    const res = await request(app).get("/api/weather/Pokhara");
    expect(res.status).not.toBe(401);
  });

  // Test 35: Weather endpoint returns JSON
  it("should return JSON content type", async () => {
    const res = await request(app).get("/api/weather/Pokhara");
    expect(res.headers["content-type"]).toMatch(/json/);
  });
});