const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/userModel');
const logger = require("../logger/logger");

dotenv.config();
logger.info("dotEnv configured in authirizer");

const secretKey = process.env.SECRET_KEY;


if (!secretKey) {
    logger.error({
    }, "no secret key");
    throw new Error("SECRET_KEY is not configured");
};

const authorize = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        logger.warn({
            requestId: req.id,
        }, "Authorization header is missing");
        return res.status(401).json({ error: 'Authorization token requires!' })
    };

    const [scheme, token, extra] = authorization.split(' ');

    if (scheme !== 'Bearer' || !token || extra) {
        logger.warn({
            requestId: req.id,
            authScheme: req.headers.authorization?.split(" ")[0],
            authenticated: Boolean(req.user),
        }, "JWT scheme or token is invalid");
        return res.status(401).json({ error: 'Invalid authorization format' });
    }

    try {
        const { _id } = jwt.verify(token, secretKey);

        req.user = await User.findOne({ _id }).select('_id');

        if (!req.user) {
            logger.warn({
                userId: _id.toString(),
                requestId: req.id,
            }, "no such user");
            return res.status(401).json({ error: 'User no longer exists' });
        };
        logger.info({
            userId: _id.toString(),
            requestId: req.id,
        }, "authorize user successful");
        next();

    } catch (error) {
        logger.warn({
            err: error,
            requestId: req.id,
        }, "Authorization failed");
        return res.status(401).json({ error: 'Invalid or expired token' });
    };
};


module.exports = authorize;