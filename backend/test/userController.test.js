const mongoose = require("mongoose");
const {
    signUpUser,
    signInUser,
} = require("../controllers/userController");

const bcrypt = require("bcryptjs");

const User = require("../models/userModel");

const {
    getUser,
    removeUser,
} = require("../controllers/userController");

const createRes = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
});

describe("userController", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });
    describe("signUpUser", () => {
        afterEach(() => {
            jest.restoreAllMocks();
        });

        test("returns 409 for a duplicate-key database error", async () => {
            jest.spyOn(User, "exists")
                .mockResolvedValue(false);

            jest.spyOn(User, "create")
                .mockRejectedValue({
                    code: 11000,
                });

            const req = {
                id: "test-request-id",
                body: {
                    username: "testuser",
                    firstName: "Test",
                    lastName: "User",
                    email: "test@example.com",
                    password: "password123",
                },
            };

            const res = createRes();

            await signUpUser(req, res);

            expect(res.status).toHaveBeenCalledWith(409);

            expect(res.json).toHaveBeenCalledWith({
                error: "Username or email is already in use.",
            });
        });

        test("returns 500 for an unexpected database error", async () => {
            jest.spyOn(User, "exists")
                .mockResolvedValue(false);

            jest.spyOn(User, "create")
                .mockRejectedValue(
                    new Error("database failure")
                );

            const req = {
                id: "test-request-id",
                body: {
                    username: "testuser",
                    firstName: "Test",
                    lastName: "User",
                    email: "test@example.com",
                    password: "password123",
                },
            };

            const res = createRes();

            await signUpUser(req, res);

            expect(res.status).toHaveBeenCalledWith(500);

            expect(res.json).toHaveBeenCalledWith({
                error: "Failed to create account.",
            });
        });
    });

    describe("signInUser", () => {
        afterEach(() => {
            jest.restoreAllMocks();
        });

        test("returns 500 when user lookup fails", async () => {
            jest.spyOn(User, "findOne")
                .mockImplementation(() => {
                    throw new Error("database failure");
                });

            const req = {
                id: "test-request-id",
                body: {
                    email: "test@example.com",
                    password: "password123",
                },
            };

            const res = createRes();

            await signInUser(req, res);

            expect(res.status).toHaveBeenCalledWith(500);

            expect(res.json).toHaveBeenCalledWith({
                error: "Failed to sign-in.",
            });
        });
    });

    describe("getUser", () => {
        test("returns 400 for invalid user ID", async () => {
            const req = {
                user: {
                    _id: "invalid-id",
                },
            };

            const res = createRes();

            await getUser(req, res);

            expect(res.status).toHaveBeenCalledWith(400);

            expect(res.json).toHaveBeenCalledWith({
                message: "Invalid user ID",
            });
        });

        test("returns 404 when user does not exist", async () => {
            const userId = new mongoose.Types.ObjectId();

            jest.spyOn(User, "findById")
                .mockReturnValue({
                    select: jest.fn().mockReturnThis(),
                    populate: jest.fn().mockReturnThis(),
                });

            User.findById().populate = jest.fn()
                .mockReturnValue({
                    populate: jest.fn().mockResolvedValue(null),
                });

            const req = {
                user: {
                    _id: userId,
                },
            };

            const res = createRes();

            await getUser(req, res);

            expect(res.status).toHaveBeenCalledWith(404);

            expect(res.json).toHaveBeenCalledWith({
                message: "User not found!",
            });
        });

        test("returns 500 when loading user fails", async () => {
            jest.spyOn(User, "findById")
                .mockImplementation(() => {
                    throw new Error("database failure");
                });

            const req = {
                user: {
                    _id: new mongoose.Types.ObjectId(),
                },
            };

            const res = createRes();

            await getUser(req, res);

            expect(res.status).toHaveBeenCalledWith(500);

            expect(res.json).toHaveBeenCalledWith({
                message: "Failed to load user",
            });
        });
    });

    describe("removeUser", () => {
        test("returns 400 for invalid user ID", async () => {
            const req = {
                user: {
                    _id: "invalid-id",
                },
            };

            const res = createRes();

            await removeUser(req, res);

            expect(res.status).toHaveBeenCalledWith(400);

            expect(res.json).toHaveBeenCalledWith({
                message: "User not found!",
            });
        });

        test("returns 404 when user does not exist", async () => {
            jest.spyOn(User, "findByIdAndDelete")
                .mockResolvedValue(null);

            const req = {
                user: {
                    _id: new mongoose.Types.ObjectId(),
                },
            };

            const res = createRes();

            await removeUser(req, res);

            expect(res.status).toHaveBeenCalledWith(404);

            expect(res.json).toHaveBeenCalledWith({
                error: "User not found.",
            });
        });

        test("returns 500 when deletion fails", async () => {
            jest.spyOn(User, "findByIdAndDelete")
                .mockRejectedValue(
                    new Error("database failure")
                );

            const req = {
                user: {
                    _id: new mongoose.Types.ObjectId(),
                },
            };

            const res = createRes();

            await removeUser(req, res);

            expect(res.status).toHaveBeenCalledWith(500);

            expect(res.json).toHaveBeenCalledWith({
                error: "Failed to delete user.",
            });
        });
    });
});