const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/userModel');
const logger = require("../logger/logger");

dotenv.config();

const secretKey = process.env.SECRET_KEY;

if (!secretKey) {
    logger.error({}, "SECRET_KEY is not configured");
    throw new Error("SECRET_KEY is not configured");
};

const authorize = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        logger.warn({
            requestId: req.id,
        }, "Authorization rejected: header is missing");

        return res.status(401).json({ error: 'Authorization token requires!' })
    };

    const [scheme, token, extra] = authorization.split(' ');

    if (scheme !== 'Bearer' || !token || extra) {
        logger.warn({
            requestId: req.id,
        }, "Authorization rejected: invalid JWT format");

        return res.status(401).json({ error: 'Invalid authorization format' });
    }

    let decodedToken;

    try {
        decodedToken = jwt.verify(token, secretKey);
    } catch (error) {
        logger.warn({
            requestId: req.id,
        }, "Authorization rejected: invalid or expired token");

        return res.status(401).json({
            error: "Invalid or expired token",
        });
    }

    const { _id } = decodedToken;

    if (!mongoose.isValidObjectId(_id)) {
        logger.warn({
            requestId: req.id,
        }, "Authorization rejected: invalid user ID in token");

        return res.status(401).json({
            error: "Invalid or expired token",
        });
    }

    try {
        req.user = await User.findOne({ _id }).select("_id");
    } catch (error) {
        logger.error({
            requestId: req.id,
            userId: _id.toString(),
            err: error,
        }, "Authorization failed: user lookup error");

        return res.status(500).json({
            error: "Authorization failed",
        });
    }

    if (!req.user) {
        logger.warn({
            userId: _id.toString(),
            requestId: req.id,
        }, "Authorization rejected: user no longer exists");

        return res.status(401).json({
            error: "User no longer exists",
        });
    }

    logger.info({
        userId: _id.toString(),
        requestId: req.id,
    }, "User authorized successfully");

    next();
};

module.exports = authorize;