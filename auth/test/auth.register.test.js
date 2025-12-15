const request = require("supertest");
const app = require("../src/app");
const User = require("../src/model/user.model");
describe("POST /api/auth/register", () => {
  


  it("should create a new user and return 201", async () => {
    const payload = {
      username: "testuser",
      email: "test@example.com",
      password: "secret123",
      fullName: { firstName: "Test", lastName: "User" }
    };

    const res = await request(app).post("/api/auth/register").send(payload);
    expect(res.status).toBe(201);
    // controller returns { message, user: { id, username, email, ... } }
    expect(res.body).toHaveProperty("message", "user registered successfully");
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toHaveProperty("id");
    expect(res.body.user).toHaveProperty("username", payload.username);
    expect(res.body.user).toHaveProperty("email", payload.email);
    expect(res.body.user).not.toHaveProperty("password");

    const userInDb = await User.findOne({ email: payload.email }).select('+password').lean();
    expect(userInDb).toBeTruthy();
    expect(userInDb.username).toBe(payload.username);
    expect(userInDb.password).toBeTruthy();
  });

  it("should return 400 for missing fields", async () => {
    const res = await request(app).post("/api/auth/register").send({ username: "x" });
    expect(res.status).toBe(400);
  });

  it("should not allow duplicate username/email", async () => {
    const payload = {
      username: "dupuser",
      email: "dup@example.com",
      password: "secret",
      fullName: { firstName: "D", lastName: "U" }
    };
    await request(app).post("/api/auth/register").send(payload);
    const res2 = await request(app).post("/api/auth/register").send(payload);
    expect(res2.status).toBe(409);
  });
});
