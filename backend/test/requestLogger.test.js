const request = require("supertest");
const express = require("express");

const requestLogger = require("../logger/requestLogger");

describe("requestLogger middleware", () => {
    const createApp = () => {
        const app = express();

        app.use(requestLogger);

        app.get("/success", (req, res) => {
            expect(req.id).toBeDefined();
            res.status(200).json({
                requestId: req.id,
            });
        });

        app.get("/bad-request", (req, res) => {
            res.status(400).json({
                error: "bad request",
            });
        });

        app.get("/server-error", (req, res) => {
            res.status(500).json({
                error: "server error",
            });
        });

        return app;
    };

    test("generates a request ID and returns it in the response header", async () => {
        const response = await request(createApp())
            .get("/success");

        expect(response.statusCode).toBe(200);

        expect(response.headers["x-request-id"]).toBeDefined();

        expect(response.headers["x-request-id"]).toBe(
            response.body.requestId
        );
    });

    test("generates unique request IDs", async () => {
        const app = createApp();

        const first = await request(app).get("/success");
        const second = await request(app).get("/success");

        expect(first.headers["x-request-id"]).toBeDefined();
        expect(second.headers["x-request-id"]).toBeDefined();

        expect(first.headers["x-request-id"])
            .not
            .toBe(second.headers["x-request-id"]);
    });

    test("handles 400 responses", async () => {
        const response = await request(createApp())
            .get("/bad-request");

        expect(response.statusCode).toBe(400);
        expect(response.headers["x-request-id"]).toBeDefined();
    });

    test("handles 500 responses", async () => {
        const response = await request(createApp())
            .get("/server-error");

        expect(response.statusCode).toBe(500);
        expect(response.headers["x-request-id"]).toBeDefined();
    });
});