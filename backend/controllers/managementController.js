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
    const userId = req.user._id;
    const { reviewText, ratings } = req.body;

    console.log('review: ', reviewText);
    console.log('rates: ', ratings);

    // -------------------------
    // Validate toilet ID
    // -------------------------

    if (!mongoose.isValidObjectId(toiletId)) {
        return res.status(404).json({
            message: "Toilet not found",
        });
    }

    // -------------------------
    // Validate review text
    // -------------------------

    if (typeof reviewText !== "string" || !reviewText.trim()) {
        return res.status(400).json({
            message: "Review text is required",
        });
    }

    const trimmedReviewText = reviewText.trim();

    if (
        trimmedReviewText.length < 10 ||
        trimmedReviewText.length > 200
    ) {
        return res.status(400).json({
            message: "Review text must be between 10 and 200 characters",
        });
    }

    // -------------------------
    // Validate ratings
    // -------------------------

    if (
        !ratings ||
        typeof ratings !== "object" ||
        Array.isArray(ratings)
    ) {
        return res.status(400).json({
            message: "Ratings are required",
        });
    }

    const ratingFields = [
        "cleanliness",
        "odor",
        "amenitiesHealth",
        "light",
        "privacy",
        "crowd",
    ];

    for (const field of ratingFields) {
        if (
            typeof ratings[field] !== "number" ||
            !Number.isFinite(ratings[field]) ||
            ratings[field] < 0 ||
            ratings[field] > 5
        ) {
            return res.status(400).json({
                message: `Invalid rating: ${field}`,
            });
        }
    }

    // -------------------------
    // Database transaction
    // -------------------------

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const user = await User.findById(userId).session(session);

        if (!user) {
            throw new Error("USER_NOT_FOUND");
        }

        const toilet = await Toilet.findById(toiletId).session(session);

        if (!toilet) {
            throw new Error("TOILET_NOT_FOUND");
        }

        // -------------------------
        // Create review
        // -------------------------

        const [review] = await Review.create(
            [{
                toilet: toiletId,
                user: userId,
                text: trimmedReviewText,
                ratings,
            }],
            { session }
        );

        // -------------------------
        // Update user
        // -------------------------

        user.reviews.push(review._id);

        await user.save({ session });

        // -------------------------
        // Update toilet
        // -------------------------

        toilet.reviews.push(review._id);

        const oldCount = toilet.ratingSummary.count;
        const newCount = oldCount + 1;

        for (const field of ratingFields) {
            const oldAverage = toilet.ratingSummary[field];

            toilet.ratingSummary[field] =
                ((oldAverage * oldCount) + ratings[field]) / newCount;
        }

        // Overall average

        const total =
            toilet.ratingSummary.cleanliness +
            toilet.ratingSummary.odor +
            toilet.ratingSummary.amenitiesHealth +
            toilet.ratingSummary.light +
            toilet.ratingSummary.privacy +
            toilet.ratingSummary.crowd;

        toilet.ratingSummary.average =
            total / ratingFields.length;

        toilet.ratingSummary.count = newCount;

        await toilet.save({ session });

        // -------------------------
        // Commit
        // -------------------------

        await session.commitTransaction();

        return res.status(201).json({
            message: "Review created successfully",
            review,
        });

    } catch (error) {
        console.error("Create review error:", error);

        if (session.inTransaction()) {
            await session.abortTransaction();
        }

        if (error.message === "USER_NOT_FOUND") {
            return res.status(404).json({
                message: "User not found",
            });
        }

        if (error.message === "TOILET_NOT_FOUND") {
            return res.status(404).json({
                message: "Toilet not found",
            });
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