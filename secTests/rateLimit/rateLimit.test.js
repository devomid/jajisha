const request = require("supertest");
const app = require("../../backend/app");
const authLimiter = require("../../backend/middlewares/signLimiter");

describe("Authentication rate-limit security", () => {
    beforeEach(async () => {
        await authLimiter.resetKey("127.0.0.1");
    });

    it("should block repeated authentication attempts", async () => {
        let response;

        for (let i = 0; i < 21; i++) {
            response = await request(app)
                .post("/api/user/si")
                .send({
                    email: "security-ratelimit@example.com",
                    password: "WrongPassword123"
                });
        }

        expect(response.statusCode).toBe(429);
        expect(response.body).toEqual({
            error: "Too many authentication attempts. Please try again later."
        });
    });
});