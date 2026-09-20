const mongoose = require("mongoose");
const User = require("../models/userModel");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const logger = require("../logger/logger");

dotenv.config();

const secretKey = process.env.SECRET_KEY;
const createToken = function (_id) {
    return jwt.sign({ _id }, secretKey, { expiresIn: '3d' })
};

const signUpUser = async (req, res) => {
    const {
        username,
        firstName,
        lastName,
        email,
        password
    } = req.body;

    if (
        typeof username !== "string" ||
        typeof firstName !== "string" ||
        typeof lastName !== "string" ||
        typeof email !== "string" ||
        typeof password !== "string"
    ) {
        logger.warn({
            requestId: req.id,
        }, "Signup rejected: invalid field types"
        );

        return res.status(400).json({
            error: "Invalid signup data.",
        });
    }

    if (
        !username.trim() ||
        !firstName.trim() ||
        !lastName.trim() ||
        !email.trim() ||
        !password.trim()
    ) {
        logger.warn({
            requestId: req.id,
        }, "Signup rejected: required field is empty"
        );

        return res.status(400).json({
            error: "All signup fields are required.",
        });
    }

    const normalizedUsername = username.trim();
    const normalizedFirstName = firstName.trim();
    const normalizedLastName = lastName.trim();
    const normalizedEmail = email.trim().toLowerCase();

    try {
        const [usernameExists, emailExists] = await Promise.all([
            User.exists({ username: normalizedUsername }),
            User.exists({ email: normalizedEmail }),
        ]);

        if (usernameExists) {
            logger.warn({
                requestId: req.id,
            }, "Signup rejected: username already in use");

            return res.status(400).json({
                error: "Username is already in use.",
            });
        }

        if (emailExists) {
            logger.warn({
                requestId: req.id,
            }, "Signup rejected: email already in use");

            return res.status(400).json({
                error: "Email is already in use.",
            });
        }

        if (password.length < 8) {
            logger.warn({
                requestId: req.id,
            },"Signup rejected: password too short");

            return res.status(400).json({
                error: "Password is not strong enough.",
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);

        const user = await User.create({
            username: normalizedUsername,
            firstName: normalizedFirstName,
            lastName: normalizedLastName,
            email: normalizedEmail,
            password: hashedPass
        });
        const token = createToken(user._id);

        logger.info({
            requestId: req.id,
            userId: user._id,
        }, "Signup successful");

        res.status(201).json({
            user: {
                _id: user._id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                avatar: user.avatar,
                favoriteToilets: user.favoriteToilets,
                reviews: user.reviews,
                role: user.role
            },
            token
        });

    } catch (error) {
        if (error.code === 11000) {
            logger.warn("Signup rejected: duplicate account data");
            return res.status(409).json({
                error: "Username or email is already in use.",
            });
        }

        logger.error({
            requestId: req.id,
            err: error,
        }, "Signup failed");

        return res.status(500).json({
            error: "Failed to create account.",
        });
    }
}

const signInUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            !email.trim() ||
            !password
        ) {
            logger.warn({
                requestId: req.id,
            }," email or password no provided");
            return res.status(400).json({
                error: "Email and password are required.",
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            logger.warn({
                requestId: req.id,
            }, " Sign-in rejected: Invalid credentials");
            return res.status(401).json({
                error: "Invalid credentials.",
            });
        }

        const isPassCorrect = await bcrypt.compare(password, user.password);

        if (!isPassCorrect) {
            logger.warn({
                requestId: req.id,
            }, "Sign-in rejected: invalid credentials");

            return res.status(401).json({
                error: "Invalid credentials.",
            });
        }

        const token = createToken(user._id);
        logger.info({
            requestId: req.id,
            userId: user._id,
        }, "Signin successful");

        res.status(200).json({
            user: {
                _id: user._id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                avatar: user.avatar,
                favoriteToilets: user.favoriteToilets,
                reviews: user.reviews,
                role: user.role
            },
            token
        });

    } catch (error) {
        logger.error({
            requestId: req.id,
            err: error,
        }, "Signin failed");
        return res.status(500).json({
            error: "Failed to sign in.",
        });
    }
};

const getUser = async (req, res) => {

    try {
        const id = req.user._id;
        if (id && !mongoose.isValidObjectId(id)) {
            logger.warn({
                requestId: req.id,
                userId: id,
            }, "Get user rejected: user not found");
            return res.status(404).json({ message: "User not found!" });
        };
        const user = await User.findById(id).select("-password").populate("favoriteToilets").populate("reviews");
        if (!user) {
            logger.warn({
                requestId: req.id,
                userId: id,
            }, "id is not a valid object");
            return res.status(404).json({ message: "User not found!" })
        };
        logger.info({
            requestId: req.id,
            userId: user._id,
        }, "Get user successful");
        return res.status(200).json(user)

    } catch (error) {
        logger.error({
            requestId: req.id,
            err: error,
        }, "Get user failed");
        return res.status(500).json({ message: "Failed to load user", });
    }
};

const removeUser = async (req, res) => {
    try {
        const userId = req.user._id;

        if (!mongoose.isValidObjectId(userId)) {
            logger.warn({
                requestId: req.id,
                userId,
            }, "Delete user rejected: invalid user ID");

            return res.status(404).json({
                message: "User not found!",
            });
        }

        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            logger.warn({
                requestId: req.id,
                userId,
            }, "Delete user rejected: user not found");

            return res.status(404).json({
                error: "User not found.",
            });
        }

        logger.info({
            requestId: req.id,
            userId,
        }, "User deleted successfully");

        return res.status(204).send();

    } catch (error) {
        logger.error({
            requestId: req.id,
            err: error,
        }, "Failed to delete user");

        return res.status(500).json({
            error: "Failed to delete user.",
        });
    }
};


module.exports = {
    signUpUser,
    signInUser,
    getUser,
    removeUser
}