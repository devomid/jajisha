const mongoose = require("mongoose");
const User = require("../models/userModel");
const Toilet = require("../models/toiletModel");
const Review = require("../models/reviewModel");
const logger = require("../logger/logger");

const saveToilet = async (req, res) => {
    const { toiletId } = req.params;
    const userId = req.user._id;

    try {
        if (!mongoose.isValidObjectId(toiletId)) {
            logger.warn({
                toiletId: toiletId.toString(),
                requestId: req.id
            }, "toilet Id is not valid");
            return res.status(404).json({ message: "Toilet not found" });
        }

        const toilet = await Toilet.exists({ _id: toiletId });

        if (!toilet) {
            logger.warn({
                toiletId: toiletId.toString(),
                requestId: req.id
            }, "toilet not found on DB");
            return res.status(404).json({ message: "Toilet not found" });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { favoriteToilets: toiletId } },
            { new: true }
        );

        if (!user) {
            logger.warn({
                userId: userId.toString(),
                toiletId: toiletId.toString(),
                requestId: req.id
            }, "Faild updating user favorite toilets");
            return res.status(404).json({ message: "User not found" });
        }

        logger.info({
            userId: userId.toString(),
            toiletId: toiletId.toString(),
        }, "Toilet saved successfully");
        return res.status(200).json({
            message: "Toilet saved successfully"
        });

    } catch (error) {
        logger.error({
            err: error,
        }, "Failed to save toilet");

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
            logger.warn({
                toiletId: toiletId.toString(),
                requestId: req.id
            }, "toilet Id is not valid");
            return res.status(404).json({ message: "Toilet not found" });
        }

        const toilet = await Toilet.exists({ _id: toiletId });

        if (!toilet) {
            logger.warn({
                toiletId: toiletId.toString(),
                requestId: req.id
            }, "toilet not found on DB");
            return res.status(404).json({ message: "Toilet not found" });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { $pull: { favoriteToilets: toiletId } },
            { new: true }
        );

        if (!user) {
            logger.warn({
                userId: userId.toString(),
                toiletId: toiletId.toString(),
                requestId: req.id
            }, "Faild updating user favorite toilets");
            return res.status(404).json({ message: "User not found" });
        }
        logger.info({
            userId: userId.toString(),
            toiletId: toiletId.toString(),
            requestId: req.id
        }, "Toilet unsaved successfully");
        return res.status(200).json({
            message: "Toilet removed successfully"
        });

    } catch (error) {
        logger.error({
            err: error,
            requestId: req.id
        }, "Failed to unsave toilet");

        return res.status(500).json({
            message: "Failed to remove toilet"
        });
    }
};

const createReview = async (req, res) => {
    const { toiletId } = req.params;
    const userId = req.user._id;
    const { reviewText, ratings } = req.body;

    // -------------------------
    // Validate toilet ID
    // -------------------------

    if (!mongoose.isValidObjectId(toiletId)) {
        logger.warn({
            toiletId: toiletId.toString(),
            requestId: req.id
        }, "toilet Id is not valid");
        return res.status(404).json({
            message: "Toilet not found",
        });
    }

    // -------------------------
    // Validate review text
    // -------------------------

    if (typeof reviewText !== "string" || !reviewText.trim()) {
        logger.warn({
            requestId: req.id,
            toiletId: toiletId,
            userId: userId
        }, "review text is not valid");
        return res.status(400).json({
            message: "Review text is required",
        });
    }

    const trimmedReviewText = reviewText.trim();

    if (
        trimmedReviewText.length < 10 ||
        trimmedReviewText.length > 200
    ) {
        logger.warn({
            requestId: req.id,
            length: trimmedReviewText.length,
        }, "review text is shorter or longer than valid lenght");
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
        logger.warn({
            requestId: req.id
        }, "ratings type is not object type or is absent");
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
            logger.warn({
                requestId: req.id,
                field,
            }, "invalid ratings");
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
            logger.warn({
                userId: userId.toString(),
                requestId: req.id
            }, "user not found");
            throw new Error("USER_NOT_FOUND");
        }

        const toilet = await Toilet.findById(toiletId).session(session);

        if (!toilet) {
            logger.warn({
                toiletId: toiletId.toString(),
                requestId: req.id
            }, "toilet not found");
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

        logger.info({
            reviewId: review._id,
            requestId: req.id,
            toiletId,
            userId
        }, "toilet reviews created successfully");

        return res.status(201).json({
            message: "Review created successfully",
            review,
        });

    } catch (error) {
        logger.error({
            err: error,
            requestId: req.id
        }, "Create review failed");

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