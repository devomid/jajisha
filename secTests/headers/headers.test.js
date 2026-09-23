const request = require("supertest");
const app = require("../../backend/app");

describe("HTTP security headers", () => {
    it("should send security headers", async () => {
        const response = await request(app)
            .get("/health");

        expect(response.statusCode).toBe(200);

        expect(response.headers).toHaveProperty("x-content-type-options");
        expect(response.headers["x-content-type-options"]).toBe("nosniff");

        expect(response.headers).toHaveProperty("x-frame-options");
        expect(response.headers["x-frame-options"]).toBe("SAMEORIGIN");
    });

    it("should reject an unauthorized CORS origin", async () => {
        const response = await request(app)
            .get("/health")
            .set("Origin", "https://attacker.example");

        expect(response.statusCode).toBe(500);
    });

    it("should allow the configured client origin", async () => {
        const response = await request(app)
            .get("/health")
            .set("Origin", process.env.CLIENT_ORIGIN);

        expect(response.statusCode).toBe(200);
    });
});