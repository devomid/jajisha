const User = require("../models/userModel");
const Toilet = require("../models/toiletModel");
const Review = require("../models/reviewModel");

const mongoose = require("mongoose");

const saveToilet = async (req, res) => {
    const { toiletId, userId } = req.params;
    try {
        const user = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { favoriteToilets: toiletId } },
            { new: true })
        !user ?
            (
                res.status(404).json({ message: "User not found" })
            ) : (
                res.status(200).json({ message: "Toilet saved successfully" })
            )

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const unsaveToilet = async (req, res) => {
    const { toiletId, userId } = req.params;
    try {
        const user = await User.findByIdAndUpdate(
            userId,
            { $pull: { favoriteToilets: toiletId } },
            { new: true })
        !user ?
            (
                res.status(404).json({ message: "User not found" })
            ) : (
                res.status(200).json({ message: "Toilet removed successfully" })
            )

    } catch (error) {
        res.status(400).json({ error: error.message })

    }
}

const createReview = async (req, res) => {
    const { userId, toiletId } = req.params;
    const { reviewText } = req.body;
    const session = await mongoose.startSession();

    if (!reviewText || !reviewText.trim()) {
        return res.status(400).json({ message: "Review text is required", });
    }

    try {
        session.startTransaction();

        const user = await User.findById(userId)
            .session(session);

        if (!user) {
            await session.abortTransaction();
            return res.status(404).json({ message: "User not found", });
        }

        const toilet = await Toilet.findById(toiletId).session(session);

        if (!toilet) {
            await session.abortTransaction();
            return res.status(404).json({ message: "Toilet not found", });
        }

        const [review] = await Review.create([{
            toilet: toiletId,
            user: userId,
            text: reviewText.trim(),
        }],
            { session }
        );

        user.reviews.push(review._id);
        await user.save({ session });

        toilet.reviews.push(review._id);
        await toilet.save({ session });

        await session.commitTransaction();

        res.status(201).json({ message: "Review created successfully", review });


    } catch (error) {
        // await session.abortTransaction();

        console.error("Create review error:", error);

        // Duplicate review
        if (error.code === 11000) {
            return res.status(409).json({
                message: "You have already reviewed this toilet",
            });
        }

        return res.status(500).json({
            message: "Failed to create review",
        });

    } finally {
        // await session.endSession();
    }
};


module.exports = {
    saveToilet,
    unsaveToilet,
    createReview,
}