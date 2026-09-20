const mongoose = require("mongoose");
const Toilet = require("../models/toiletModel")
const Rating = require("../models/ratingModel");
const User = require("../models/userModel");
const Review = require("../models/reviewModel");
const logger = require("../logger/logger");

const createToilet = async (req, res) => {

    const userId = req.user._id;
    let session;

    try {
        const { wcData } = req.body;

        if (!wcData || typeof wcData !== "object" || Array.isArray(wcData)) {
            logger.warn({
                isPresent: Boolean(wcData),
                isObject: typeof wcData === "object",
                requestId: req.id,
                userId,
            }, "Invalid toilet data");
            return res.status(400).json({ message: "Invalid toilet data" });
        };

        if (typeof wcData.name !== "string" || !wcData.name.trim()) {
            logger.warn({
                requestId: req.id,
                userId
            }, "Toilet name is invalid or missing");
            return res.status(400).json({ message: "Toilet name is required" });
        };

        const { latitude, longitude } = wcData.location ?? {};
        if (
            typeof latitude !== "number" ||
            typeof longitude !== "number" ||
            !Number.isFinite(latitude) ||
            !Number.isFinite(longitude) ||
            latitude < -90 ||
            latitude > 90 ||
            longitude < -180 ||
            longitude > 180
        ) {
            logger.warn({
                requestId: req.id,
                userId
            }, "Invalid toilet location");
            return res.status(400).json({ message: "Invalid location" });
        };

        const ratings = wcData.ratings;

        if (!ratings ||
            typeof ratings !== "object" ||
            Array.isArray(ratings)) {
            logger.warn({
                requestId: req.id,
                userId,
            }, "Invalid ratings object or missing ratings");

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
                    userId,
                    field,
                }, "Invalid rating");
                return res.status(400).json({
                    message: `Invalid rating: ${field}`,
                });
            }
        };

        const amenities = wcData.amenities;

        if (!amenities || typeof amenities !== "object" || Array.isArray(amenities)) {
            logger.warn({
                requestId: req.id,
                userId
            }, "Invalid amenities object or no amenities");
            return res.status(400).json({ message: "Amenities are required" });
        }

        const amenityFields = [
            "western",
            "iranian",
            "wheelchairAccessible",
            "babyChanging",
            "soap",
            "toiletPaper",
            "warmWater",
            "handDryer",
        ];

        for (const field of amenityFields) {
            if (typeof amenities[field] !== "boolean") {
                logger.warn({
                    field,
                    requestId: req.id,
                    userId
                }, "Invalid amenities");
                return res.status(400).json({
                    message: `Invalid amenity: ${field}`,
                });
            }
        }

        if (typeof wcData.isFree !== "boolean") {
            logger.warn({
                requestId: req.id,
                userId,
            }, "Invalid isFree value");
            return res.status(400).json({ message: "Invalid isFree value" });
        };

        const price = wcData.isFree
            ? 0
            : Number(String(wcData.price ?? "").replace(/[,\s]/g, ""));

        if (!Number.isFinite(price) || price < 0) {
            logger.warn({
                requestId: req.id,
                userId,
            }, "Invalid toilet price");
            return res.status(400).json({ message: "Invalid price" });
        };

        const user = await User.exists({ _id: userId });
        if (!user) {
            logger.warn({
                userId,
                requestId: req.id
            }, "User not found");
            return res.status(404).json({ message: "User not found" });
        };

        const overall =
            (
                ratings.cleanliness +
                ratings.odor +
                ratings.amenitiesHealth +
                ratings.light +
                ratings.privacy +
                ratings.crowd
            ) / 6;

        session = await mongoose.startSession();
        session.startTransaction();

        // 1. Create Toilet
        const [toilet] = await Toilet.create([{
            name: wcData.name,
            description: wcData.description,

            location: {
                type: "Point",
                coordinates: [
                    wcData.location.longitude,
                    wcData.location.latitude,
                ],
            },

            address: wcData.address,

            isFree: wcData.isFree,

            price,

            amenities,

            ratingSummary: {
                count: 1,
                average: overall,
                cleanliness: ratings.cleanliness,
                odor: ratings.odor,
                amenitiesHealth: ratings.amenitiesHealth,
                light: ratings.light,
                privacy: ratings.privacy,
                crowd: ratings.crowd,
            },

            createdBy: userId,
        }], { session });

        // 2. Create creator's Rating
        await Rating.create([{
            toilet: toilet._id,
            user: toilet.createdBy,
            cleanliness: ratings.cleanliness,
            odor: ratings.odor,
            amenitiesHealth: ratings.amenitiesHealth,
            light: ratings.light,
            privacy: ratings.privacy,
            crowd: ratings.crowd,

            overall,
        }], { session });

        await session.commitTransaction();
        logger.info({
            requestId: req.id,
            toiletId: toilet._id,
            userId,
        }, "Toilet created successfully");

        res.status(201).json(toilet);

    } catch (error) {
        if (session?.inTransaction()) {
            await session.abortTransaction();
        }

        if (error.name === "ValidationError") {
            logger.warn({
                requestId: req.id,
                userId,
            }, "Toilet creation rejected: invalid data");

            return res.status(400).json({
                message: "Invalid toilet data",
            });
        }

        if (error.code === 11000) {
            logger.warn({
                requestId: req.id,
                userId,
            }, "Toilet creation rejected: duplicate toilet");

            return res.status(409).json({
                message: "Toilet already exists",
            });
        }

        logger.error({
            requestId: req.id,
            userId,
            err: error,
        }, "Failed to create toilet");

        return res.status(500).json({
            message: "Failed to create toilet.",
        });
    } finally {
        if (session) {
            await session.endSession();
        }
    }
};

const getToilets = async (req, res) => {
    try {
        const toilets = await Toilet.find()
            .select("-reviews -createdBy")
            .limit(1000)
            .lean();

        logger.info({
            requestId: req.id
        }, "Get toilets successful");
        res.status(200).json({ toilets });

    } catch (error) {

        logger.error({
            err: error,
            requestId: req.id
        }, "Failed to load toilets");
        res.status(500).json({
            message: "Failed to load toilets",
        })
    }
};

const getToiletReviews = async (req, res) => {
    const { toiletId } = req.params;

    if (!mongoose.isValidObjectId(toiletId)) {
        logger.warn({
            requestId: req.id,
            toiletId,
        }, "Get reviews rejected: invalid toilet ID");
        return res.status(400).json({ message: "Invalid toilet ID" });
    };

    try {
        const toilet = await Toilet.exists({ _id: toiletId });

        if (!toilet) {
            logger.warn({
                requestId: req.id,
                toiletId,
            }, "Get reviews rejected: toilet not found");

            return res.status(404).json({
                message: "Toilet not found",
            });
        }
        const reviews = await Review.find({ toilet: toiletId })
            .populate("user", "username firstName lastName avatar")
            .sort({ createdAt: -1 })
            .limit(50)
            .lean();
        logger.info({
            toiletId,
            requestId: req.id
        }, "Get reviews successful");
        res.status(200).json({ reviews });

    } catch (error) {
        logger.error({
            err: error,
            requestId: req.id
        }, "Failed to load toilet reviews");
        res.status(500).json({
            message: "Failed to load toilet reviews",
        });
    }
};

module.exports = {
    createToilet,
    getToilets,
    getToiletReviews
}