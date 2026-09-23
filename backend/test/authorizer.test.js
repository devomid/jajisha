const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const authorize = require("../middlewares/authorizer");
const User = require("../models/userModel");

describe("authorize middleware", () => {
    const secretKey = process.env.SECRET_KEY;

    const createReq = (authorization) => ({
        headers: authorization
            ? { authorization }
            : {},
        id: "test-request-id",
    });

    const createRes = () => ({
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
    });

    test("rejects a valid JWT containing an invalid user ID", async () => {
        const token = jwt.sign(
            { _id: "not-an-object-id" },
            secretKey
        );

        const req = createReq(`Bearer ${token}`);
        const res = createRes();
        const next = jest.fn();

        await authorize(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);

        expect(res.json).toHaveBeenCalledWith({
            error: "Invalid or expired token",
        });

        expect(next).not.toHaveBeenCalled();
    });

    test("returns 500 when user lookup fails", async () => {
        const userId = new mongoose.Types.ObjectId();

        const token = jwt.sign(
            { _id: userId },
            secretKey
        );

        const findOne = jest
            .spyOn(User, "findOne")
            .mockImplementation(() => {
                throw new Error("database failure");
            });

        const req = createReq(`Bearer ${token}`);
        const res = createRes();
        const next = jest.fn();

        await authorize(req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);

        expect(res.json).toHaveBeenCalledWith({
            error: "Authorization failed",
        });

        expect(next).not.toHaveBeenCalled();

        findOne.mockRestore();
    });
});