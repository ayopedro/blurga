const mongoose = require("mongoose");
const app = require("../server");
const supertest = require("supertest");
const api = supertest(app);
const User = require("../models/User");
const { usersInDb } = require("./testFunctions");
jest.setTimeout(50000);

beforeAll(async () => {
  await User.deleteMany({});
});


describe("check environment variables", () => {
  test("check that node environment is test", () => {
    expect(process.env.NODE_ENV).toBe("test");
  });
});

describe("post request to auth/register", () => {
  test("with correct details successfully creates a user", async () => {
    const newUser = {
      firstname: "Ayotunde",
      lastname: "Pedro",
      email: "test1@gmail.com",
      password: "test123",
    };

    const usersInDbBefore = await usersInDb();
    const response = await api
      .post("/auth/register")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersInDbAfter = await usersInDb();
    expect(usersInDbBefore.length).toBe(usersInDbAfter.length - 1);
  });

  test("with incorrect details returns an error", async () => {
    const newUser = {
      firstname: "User",
      lastname: "One",
      email: "user1@mail.com",
    };

    const usersInDbBefore = await usersInDb();
    await api
      .post("/auth/register")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersInDbAfter = await usersInDb();
    expect(usersInDbBefore.length).toBe(usersInDbAfter.length);
  });
});

describe("POST request to /auth/login", () => {
  test("authenticate user if successful", async () => {
    const response = await api
      .post("/auth/login")
      .send({
        email: "test1@gmail.com",
        password: "test123",
      })
      .expect(200);

    expect(response.body).toHaveProperty("accessToken");
  });

  test("returns error if incorrect details are supplied", async () => {
    const response = await api
      .post("/auth/login")
      .send({
        email: "user1@email.com",
        password: "1234",
      })
      .expect(401);

    expect(response.body).not.toHaveProperty("token");
  });
});

afterAll(async () => {
  mongoose.connection.close();
});
