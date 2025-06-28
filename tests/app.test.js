const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");

const User = require("../models/Users");
const Dog = require("../models/Dogs");

beforeAll(async () => {
  // connect to test DB
  await mongoose.connect("mongodb://localhost:27017/test-db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe("User Authentication", () => {
  const testUser = {
    username: "testuser",
    password: "testpass123",
  };

  it("should sign up a new user", async () => {
    const res = await request(app).post("/signup").send(testUser);
    expect(res.statusCode).toBe(201);
    expect(res.body.user).toBeDefined();
  });

  it("should log in with correct credentials", async () => {
    const res = await request(app).post("/login").send(testUser);
    expect(res.statusCode).toBe(200);
    expect(res.body.user).toBeDefined();
  });

  it("should reject login with wrong password", async () => {
    const res = await request(app).post("/login").send({
      username: testUser.username,
      password: "wrongpassword",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors.password).toBe("that password is incorrect");
  });
});

describe("Adopted Dogs", () => {
  let token;
  let userId;

  beforeAll(async () => {
    // login and grab JWT
    const loginRes = await request(app).post("/login").send({
      username: "testuser",
      password: "testpass123",
    });

    const cookie = loginRes.headers["set-cookie"][0];
    token = cookie.split(";")[0];
    const user = await User.findOne({ username: "testuser" });
    userId = user._id;

    // add an adopted dog
    await Dog.create({
      name: "Rex",
      description: "Friendly dog",
      adoptedBy: userId,
    });
  });

  it("should show adopted dogs for the logged-in user", async () => {
    const res = await request(app)
      .get("/adopted")
      .set("Cookie", token)
      .expect(200);

    expect(res.text).toContain("Rex");
  });
});
