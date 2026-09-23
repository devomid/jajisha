const request = require("supertest");
const app = require("../../backend/app");

describe("Injection security", () => {
    it("should reject an object instead of a string for sign-in email", async () => {
        const response = await request(app)
            .post("/api/user/si")
            .send({
                email: {
                    $ne: null
                },
                password: "anything"
            });

        expect(response.statusCode).toBe(400);
        expect(response.body).not.toHaveProperty("token");
    });

    it("should reject an object instead of a string for sign-in password", async () => {
        const response = await request(app)
            .post("/api/user/si")
            .send({
                email: "attacker@example.com",
                password: {
                    $ne: null
                }
            });

        expect(response.statusCode).toBe(400);
        expect(response.body).not.toHaveProperty("token");
    });

    it("should reject an object as a signup email", async () => {
        const response = await request(app)
            .post("/api/user/su")
            .send({
                username: "injectionuser",
                firstName: "Injection",
                lastName: "User",
                email: {
                    $ne: null
                },
                password: "StrongPassword123"
            });

        expect(response.statusCode).toBe(400);
    });

    it("should reject an object as a signup username", async () => {
        const response = await request(app)
            .post("/api/user/su")
            .send({
                username: {
                    $ne: null
                },
                firstName: "Injection",
                lastName: "User",
                email: "injection@example.com",
                password: "StrongPassword123"
            });

        expect(response.statusCode).toBe(400);
    });

    it("should reject an invalid MongoDB-style toilet ID", async () => {
        const response = await request(app)
            .get("/api/toilets/reviews/$ne");

        expect(response.statusCode).toBe(400);
    });
});