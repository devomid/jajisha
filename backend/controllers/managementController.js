const mongoose = require("mongoose");
const User = require("../models/userModel");
const Toilet = require("../models/toiletModel");
const Review = require("../models/reviewModel");


const saveToilet = async (req, res) => {
    const { toiletId } = req.params;
    const userId = req.user._id;

    try {
        if (!mongoose.isValidObjectId(toiletId)) {
            return res.status(404).json({ message: "Toilet not found" });
        }

        const toilet = await Toilet.exists({ _id: toiletId });

        if (!toilet) {
            return res.status(404).json({ message: "Toilet not found" });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { favoriteToilets: toiletId } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: "Toilet saved successfully"
        });

    } catch (error) {
        console.error("Save toilet error:", error);

        return res.status(500).json({
            message: "Failed to save toilet"
        });
    }
};

const unsaveToilet = async (req, res) => {
    const { toiletId } = req.params;
    const userId = req.user._id;

    try {
        if (!mongoose.isValidObjectId(toiletId)) {
            return res.status(404).json({ message: "Toilet not found" });
        }

        const toilet = await Toilet.exists({ _id: toiletId });

        if (!toilet) {
            return res.status(404).json({ message: "Toilet not found" });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { $pull: { favoriteToilets: toiletId } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: "Toilet removed successfully"
        });

    } catch (error) {
        console.error("Unsave toilet error:", error);

        return res.status(500).json({
            message: "Failed to remove toilet"
        });
    }
};


const createReview = async (req, res) => {
    const { toiletId } = req.params;
    const userId = req.user._id
    const { reviewText } = req.body;

    if (!mongoose.isValidObjectId(toiletId)) {
        return res.status(404).json({ message: "Toilet not found" });
    };

    
    if (typeof reviewText !== "string" || !reviewText.trim()) {
        return res.status(400).json({
            message: "Review text is required",
        });
    }
    
    const trimmedReviewText = reviewText.trim();

    if (trimmedReviewText.length < 10 || trimmedReviewText.length > 200) {
        return res.status(400).json({
            message: "Review text must be between 10 and 200 characters",
        });
    };
    
    const session = await mongoose.startSession();
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
            text: trimmedReviewText,
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
        console.error("Create review error:", error);

        if (session.inTransaction()) {
            await session.abortTransaction();
        }

        if (error.code === 11000) {
            return res.status(409).json({
                message: "You have already reviewed this toilet",
            });
        }

        return res.status(500).json({
            message: "Failed to create review",
        });
    } finally {
        await session.endSession();
    }
};


module.exports = {
    saveToilet,
    unsaveToilet,
    createReview,
}