const request = require("supertest");
const app = require("../src/app");
const User = require("../src/model/user.model");
const connectDB = require("../src/db/db")

describe("POST /auth/register", () => {
  
    beforeAll(async()=>{
        await connectDB();
    });


  it("should create a new user and return 201", async () => {
    const payload = {
      username: "testuser",
      email: "test@example.com",
      password: "secret123",
      fullName: { firstName: "Test", lastName: "User" }
    };

    const res = await request(app).post("/auth/register").send(payload);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body).toHaveProperty("username", payload.username);
    expect(res.body).toHaveProperty("email", payload.email);
    expect(res.body).not.toHaveProperty("password");

    const userInDb = await User.findOne({ email: payload.email }).lean();
    expect(userInDb).toBeTruthy();
    expect(userInDb.username).toBe(payload.username);
    expect(userInDb.password).toBeTruthy();
  });

  it("should return 400 for missing fields", async () => {
    const res = await request(app).post("/auth/register").send({ username: "x" });
    expect(res.status).toBe(400);
  });

  it("should not allow duplicate username/email", async () => {
    const payload = {
      username: "dupuser",
      email: "dup@example.com",
      password: "secret",
      fullName: { firstName: "D", lastName: "U" }
    };
    await request(app).post("/auth/register").send(payload);
    const res2 = await request(app).post("/auth/register").send(payload);
    expect(res2.status).toBe(409);
  });
});
