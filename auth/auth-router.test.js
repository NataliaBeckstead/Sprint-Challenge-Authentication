const request = require("supertest");
const server = require("../api/server");
const db = require("../database/dbConfig");

beforeAll(() => db("users").truncate());

describe("POST /api/auth/register", () => {
  it("returns 201", () => {
    return request(server)
      .post("/api/auth/register")
      .send({ username: "toos", password: "toos" })
      .then((res) => {
        expect(res.status).toBe(201);
      });
  });

  it("creates a new user in the database", async () => {
    await request(server)
      .post("/api/auth/register")
      .send({ username: "mila", password: "mila" });
    const [user] = await db("users").where({ username: "mila" });
    expect(user.username).toBe("mila");
  });
});

describe("POST /api/auth/login", () => {
  it("returns 200", () => {
    return request(server)
      .post("/api/auth/login")
      .send({ username: "toos", password: "toos" })
      .then((res) => {
        expect(res.status).toBe(200);
      });
  });

  it("returns a 401 error to the client when providing incorrect credentials", async () => {
    const res = await request(server)
      .post("/api/auth/login")
      .send({ username: "toos", password: "toosya" });
    expect(res.status).toBe(401);
  });
});