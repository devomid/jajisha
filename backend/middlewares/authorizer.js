const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/userModel');

dotenv.config();
const secretKey = process.env.SECRET_KEY;

if (!secretKey) {
    throw new Error("SECRET_KEY is not configured");
};

const authorize = async (req, res, next) => {
    // verify authorization
    const { authorization } = req.headers;
    // console.log(authorization);
    if (!authorization) {
        return res.status(401).json({ error: 'Authorization token requires!' })
    };

    const [scheme, token] = authorization.split(' ');

    if (scheme !== 'Bearer' || !token) {
        return res.status(401).json({ error: 'Invalid authorization format' });
    };

    try {
        const { _id } = jwt.verify(token, secretKey);
        // console.log('id from verification:', _id);

        req.user = await User.findOne({ _id }).select('_id');

        if (!req.user) {
            return res.status(401).json({ error: 'User no longer exists' });
        };

        next();

    } catch (error) {
        // console.log(error);
        return res.status(401).json({ error: 'Invalid or expired token' });
    };
};


module.exports = authorize;