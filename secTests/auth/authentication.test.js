const request = require("supertest");
const app = require("../../backend/app");

const validUser = {
    username: "securityuser",
    firstName: "Security",
    lastName: "User",
    email: "security@example.com",
    password: "StrongPassword123"
};

describe("Authentication security", () => {
    it("should reject sign-in without credentials", async () => {
        const response = await request(app)
            .post("/api/user/si")
            .send({});

        expect(response.statusCode).toBe(400);
        expect(response.body).not.toHaveProperty("token");
    });

    it("should reject invalid credentials", async () => {
        await request(app)
            .post("/api/user/su")
            .send(validUser);

        const response = await request(app)
            .post("/api/user/si")
            .send({
                email: validUser.email,
                password: "WrongPassword123"
            });

        expect(response.statusCode).toBe(401);
        expect(response.body).not.toHaveProperty("token");
    });

    it("should not authenticate with an invalid email", async () => {
        const response = await request(app)
            .post("/api/user/si")
            .send({
                email: "attacker@example.com",
                password: validUser.password
            });

        expect(response.statusCode).toBe(401);
        expect(response.body).not.toHaveProperty("token");
    });

    it("should not return a password in authentication responses", async () => {
        await request(app)
            .post("/api/user/su")
            .send(validUser);

        const response = await request(app)
            .post("/api/user/si")
            .send({
                email: validUser.email,
                password: validUser.password
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.user).not.toHaveProperty("password");
    });
});