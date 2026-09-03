const User = require("../models/userModel");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();
const secretKey = process.env.SECRET_KEY;
const createToken = function (_id) {
    return jwt.sign({ _id }, secretKey, { expiresIn: '3d' })
};

const getUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id).select("-password").populate("favoriteToilets").populate("reviews");
        user ? (
            res.status(200).json(user)
        ) : (
            res.status(404).json({ message: "User not found!" })
        )
    } catch (error) {
        return (
            res.status(400).json({ error: error.message })
        );
    }
};

const signUpUser = async (req, res) => {
    const {
        username,
        firstName,
        lastName,
        email,
        password
    } = req.body;

    try {
        const [usernameExists, emailExists] = await Promise.all([
            User.exists({ username }),
            User.exists({ email }),
        ]);

        if (usernameExists) {
            return res.status(400).json({
                error: "Username is already in use.",
            });
        }

        if (emailExists) {
            return res.status(400).json({
                error: "Email is already in use.",
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                error: "Password is not strong enough.",
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);

        const user = await User.create({
            username,
            firstName,
            lastName,
            email,
            password: hashedPass
        });
        const token = createToken(user._id);
        res.status(201).json({ user, token });

    } catch (error) {
        return (
            res.status(400).json({ error: error.message })
        );
    }
}

const signInUser = async (req, res) => {

    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) return (res.status(400).json({ error: "User does not exist." }));
        
        const token = createToken(user._id);
        
        const isPassCorrect = await bcrypt.compare(password, user.password)
        if (!isPassCorrect) return (res.status(400).json({ error: "Invalid credentials." }));

        res.status(200).json({ user, token });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



module.exports = {
    getUser,
    signUpUser,
    signInUser,
}