const request = require("supertest");
const app = require("../../backend/app");

const createUser = async (suffix) => {
    const response = await request(app)
        .post("/api/user/su")
        .send({
            username: `authuser${suffix}`,
            firstName: "Auth",
            lastName: "User",
            email: `authuser${suffix}@example.com`,
            password: "StrongPassword123"
        });

    expect(response.statusCode).toBe(201);

    return response.body;
};

describe("Authorization security", () => {
    it("should require authentication for user retrieval", async () => {
        const response = await request(app)
            .get("/api/user/returnMe");

        expect(response.statusCode).toBe(401);
    });

    it("should require authentication for account deletion", async () => {
        const response = await request(app)
            .delete("/api/user/rm");

        expect(response.statusCode).toBe(401);
    });

    it("should require authentication for toilet creation", async () => {
        const response = await request(app)
            .post("/api/toilets")
            .send({});

        expect(response.statusCode).toBe(401);
    });

    it("should require authentication for saving a toilet", async () => {
        const response = await request(app)
            .patch("/api/managment/saveToilets/507f1f77bcf86cd799439011");

        expect(response.statusCode).toBe(401);
    });

    it("should require authentication for removing a saved toilet", async () => {
        const response = await request(app)
            .delete("/api/managment/unSavedToilets/507f1f77bcf86cd799439011");

        expect(response.statusCode).toBe(401);
    });

    it("should require authentication for creating a review", async () => {
        const response = await request(app)
            .post("/api/managment/toiletManagement/507f1f77bcf86cd799439011")
            .send({
                reviewText: "This is a valid security test review.",
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

    it("should not allow a deleted user token to remain authorized", async () => {
        const user = await createUser("delete");

        const deleteResponse = await request(app)
            .delete("/api/user/rm")
            .set("Authorization", `Bearer ${user.token}`);

        expect(deleteResponse.statusCode).toBe(204);

        const response = await request(app)
            .get("/api/user/returnMe")
            .set("Authorization", `Bearer ${user.token}`);

        expect(response.statusCode).toBe(401);
    });
});