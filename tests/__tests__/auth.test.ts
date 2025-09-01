import request from "supertest";
import app from "../../src/app";

describe("Auth API", () => {
  it("should register a new user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "seller1@test.com",
      password: "123456",
      name: "IU",
    });

    expect(res.status).toBe(201);
    expect(res.body.email).toBe("seller1@test.com");
  });

  it("should not allow duplicate emails", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "seller1@test.com",
      password: "123456",
      name: "Duplicate",
    });

    expect(res.status).toBe(400);
  });
});
