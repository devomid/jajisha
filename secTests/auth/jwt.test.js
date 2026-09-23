const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../../backend/app");

describe("JWT security", () => {
    it("should reject a missing authorization header", async () => {
        const response = await request(app)
            .get("/api/user/returnMe");

        expect(response.statusCode).toBe(401);
    });

    it("should reject a malformed authorization header", async () => {
        const response = await request(app)
            .get("/api/user/returnMe")
            .set("Authorization", "NotBearer token");

        expect(response.statusCode).toBe(401);
    });

    it("should reject a Bearer header without a token", async () => {
        const response = await request(app)
            .get("/api/user/returnMe")
            .set("Authorization", "Bearer");

        expect(response.statusCode).toBe(401);
    });

    it("should reject an invalid JWT", async () => {
        const response = await request(app)
            .get("/api/user/returnMe")
            .set("Authorization", "Bearer invalid.jwt.token");

        expect(response.statusCode).toBe(401);
    });

    it("should reject a token signed with the wrong secret", async () => {
        const token = jwt.sign(
            { _id: "507f1f77bcf86cd799439011" },
            "wrong-secret"
        );

        const response = await request(app)
            .get("/api/user/returnMe")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(401);
    });

    it("should reject a token with an invalid user ID", async () => {
        const token = jwt.sign(
            { _id: "not-an-object-id" },
            process.env.SECRET_KEY
        );

        const response = await request(app)
            .get("/api/user/returnMe")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(401);
    });

    it("should reject a validly signed token for a nonexistent user", async () => {
        const token = jwt.sign(
            { _id: "507f1f77bcf86cd799439011" },
            process.env.SECRET_KEY
        );

        const response = await request(app)
            .get("/api/user/returnMe")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(401);
    });
});