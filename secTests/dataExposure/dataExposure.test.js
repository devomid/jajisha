const request = require("supertest");
const app = require("../../backend/app");

const user = {
    username: "exposureuser",
    firstName: "Exposure",
    lastName: "Test",
    email: "exposure@example.com",
    password: "StrongPassword123"
};

describe("Sensitive data exposure", () => {
    let token;

    beforeEach(async () => {
        const response = await request(app)
            .post("/api/user/su")
            .send(user);

        expect(response.statusCode).toBe(201);

        token = response.body.token;
    });

    it("should not expose the password after signup", async () => {
        const response = await request(app)
            .post("/api/user/su")
            .send({
                ...user,
                username: "anotheruser",
                email: "another@example.com"
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.user).not.toHaveProperty("password");
    });

    it("should not expose the password after sign-in", async () => {
        const response = await request(app)
            .post("/api/user/si")
            .send({
                email: user.email,
                password: user.password
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.user).not.toHaveProperty("password");
    });

    it("should not expose the password through returnMe", async () => {
        const response = await request(app)
            .get("/api/user/returnMe")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).not.toHaveProperty("password");
    });

    it("should not expose internal user ownership fields through the public toilet list", async () => {
        const response = await request(app)
            .get("/api/toilets");

        expect(response.statusCode).toBe(200);

        for (const toilet of response.body.toilets) {
            expect(toilet).not.toHaveProperty("createdBy");
            expect(toilet).not.toHaveProperty("reviews");
        }
    });

    it("should not expose stack traces through a normal 404 response", async () => {
        const response = await request(app)
            .get("/api/this-route-does-not-exist");

        expect(response.statusCode).toBe(404);
        expect(response.body).not.toHaveProperty("stack");
        expect(response.body).not.toHaveProperty("trace");
    });
});