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
                requestId: req.id,
                toiletId,
            }, "Toilet lookup rejected: invalid ID");

            return res.status(400).json({
                message: "Invalid toilet ID",
            });
        }

        const toilet = await Toilet.exists({ _id: toiletId });

        if (!toilet) {
            logger.warn({
                toiletId,
                requestId: req.id
            }, "Toilet not found on DB");
            return res.status(404).json({ message: "Toilet not found" });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { favoriteToilets: toiletId } },
            { new: true }
        );

        if (!user) {
            logger.warn({
                userId,
                toiletId,
                requestId: req.id
            }, "Save toilet rejected: user not found");
            return res.status(404).json({ message: "User not found" });
        }

        logger.info({
            requestId: req.id,
            userId: userId.toString(),
            toiletId: toiletId.toString(),
        }, "Toilet saved successfully");
        return res.status(200).json({
            message: "Toilet saved successfully"
        });

    } catch (error) {
        logger.error({
            err: error,
            requestId: req.id,
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
                toiletId,
                requestId: req.id
            }, "Toilet lookup rejected: invalid ID");
            return res.status(400).json({
                message: "Invalid toilet ID",
            });
        }

        const toilet = await Toilet.exists({ _id: toiletId });

        if (!toilet) {
            logger.warn({
                toiletId,
                requestId: req.id
            }, "Toilet not found on DB");
            return res.status(404).json({ message: "Toilet not found" });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { $pull: { favoriteToilets: toiletId } },
            { new: true }
        );

        if (!user) {
            logger.warn({
                userId,
                toiletId,
                requestId: req.id
            }, "Unsave toilet rejected: user not found");
            return res.status(404).json({ message: "User not found" });
        }
        logger.info({
            userId,
            toiletId,
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

    if (!mongoose.isValidObjectId(toiletId)) {
        logger.warn({
            toiletId,
            requestId: req.id
        }, "Toilet lookup rejected: invalid ID");
        return res.status(400).json({
            message: "Invalid toilet ID",
        });
    }

    if (typeof reviewText !== "string" || !reviewText.trim()) {
        logger.warn({
            requestId: req.id,
            toiletId,
            userId,
            isReviewString: typeof reviewText === "string",
            hasReviewText: typeof reviewText === "string" && Boolean(reviewText.trim()),
        }, "Review text is not valid");
        return res.status(400).json({
            message: "Review text is not valid",
        });
    }

    const trimmedReviewText = reviewText.trim();

    if (
        trimmedReviewText.length < 10 ||
        trimmedReviewText.length > 200
    ) {
        logger.warn({
            requestId: req.id,
            reviewLength: trimmedReviewText.length,
        }, "Review text length is outside the allowed range");
        return res.status(400).json({
            message: "Review text must be between 10 and 200 characters",
        });
    }

    if (
        !ratings ||
        typeof ratings !== "object" ||
        Array.isArray(ratings)
    ) {
        logger.warn({
            requestId: req.id,
            isPresent: Boolean(ratings),
            isObject: typeof ratings === "object",
            isArray: Array.isArray(ratings),
        }, "Ratings validation failed");

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
                value: ratings[field],
                valueType: typeof ratings[field],
            }, "Invalid rating value");

            return res.status(400).json({
                message: `Invalid rating: ${field}`,
            });
        }
    }

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const user = await User.findById(userId).session(session);

        if (!user) {
            logger.warn({
                requestId: req.id,
                userId: userId?.toString(),
            }, "User not found");

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

        const [review] = await Review.create(
            [{
                toilet: toiletId,
                user: userId,
                text: trimmedReviewText,
                ratings,
            }],
            { session }
        );

        user.reviews.push(review._id);

        await user.save({ session });
        toilet.reviews.push(review._id);

        const oldCount = toilet.ratingSummary.count;
        const newCount = oldCount + 1;

        for (const field of ratingFields) {
            const oldAverage = toilet.ratingSummary[field];

            toilet.ratingSummary[field] =
                ((oldAverage * oldCount) + ratings[field]) / newCount;
        }

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
        await session.commitTransaction();

        logger.info({
            reviewId: review._id,
            requestId: req.id,
            toiletId,
            userId
        }, "Review created successfully");

        return res.status(201).json({
            message: "Review created successfully",
            review,
        });

    } catch (error) {
        if (session.inTransaction()) {
            await session.abortTransaction();
        }

        if (error.message === "USER_NOT_FOUND") {
            logger.warn({
                requestId: req.id,
                userId,
            }, "Create review rejected: user not found");

            return res.status(404).json({
                message: "User not found",
            });
        }

        if (error.message === "TOILET_NOT_FOUND") {
            logger.warn({
                requestId: req.id,
                toiletId,
                userId,
            }, "Create review rejected: toilet not found");

            return res.status(404).json({
                message: "Toilet not found",
            });
        }

        if (error.code === 11000) {
            logger.warn({
                requestId: req.id,
                toiletId,
                userId,
            }, "Create review rejected: duplicate review");

            return res.status(409).json({
                message: "You have already reviewed this toilet",
            });
        }

        logger.error({
            requestId: req.id,
            userId,
            toiletId,
            err: error,
        }, "Failed to create review");

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