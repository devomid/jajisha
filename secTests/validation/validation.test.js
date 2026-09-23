const request = require("supertest");
const app = require("../../backend/app");

describe("Input validation security", () => {
    it("should reject non-string signup fields", async () => {
        const response = await request(app)
            .post("/api/user/su")
            .send({
                username: 123,
                firstName: "Test",
                lastName: "User",
                email: "validation@example.com",
                password: "StrongPassword123"
            });

        expect(response.statusCode).toBe(400);
    });

    it("should reject a password shorter than the minimum", async () => {
        const response = await request(app)
            .post("/api/user/su")
            .send({
                username: "shortpassword",
                firstName: "Test",
                lastName: "User",
                email: "shortpassword@example.com",
                password: "1234567"
            });

        expect(response.statusCode).toBe(400);
    });

    it("should reject an empty signup field", async () => {
        const response = await request(app)
            .post("/api/user/su")
            .send({
                username: "validuser",
                firstName: "",
                lastName: "User",
                email: "empty@example.com",
                password: "StrongPassword123"
            });

        expect(response.statusCode).toBe(400);
    });

    it("should reject malformed toilet IDs", async () => {
        const response = await request(app)
            .get("/api/toilets/reviews/not-a-valid-id");

        expect(response.statusCode).toBe(400);
    });

    it("should reject an invalid review ID", async () => {
        const response = await request(app)
            .post("/api/managment/toiletManagement/not-a-valid-id")
            .send({
                reviewText: "This review should never reach the database.",
                ratings: {
                    cleanliness: 5,
                    odor: 5,
                    amenitiesHealth: 5,
                    light: 5,
                    privacy: 5,
                    crowd: 5
                }
            });

        expect(response.statusCode).toBe(401);
    });

    it("should reject invalid toilet location data", async () => {
        const response = await request(app)
            .post("/api/toilets")
            .send({
                wcData: {
                    name: "Security Test Toilet",
                    location: {
                        latitude: 999,
                        longitude: 999
                    }
                }
            });

        expect(response.statusCode).toBe(401);
    });
});