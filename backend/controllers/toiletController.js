const mongoose = require("mongoose");
const Toilet = require("../models/toiletModel")
const Rating = require("../models/ratingModel");
const User = require("../models/userModel");
const Review = require("../models/reviewModel");

const createToilet = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        const userId = req.user._id;
        const { wcData } = req.body;

        if (!wcData || typeof wcData !== "object") {
            return res.status(400).json({ message: "Invalid toilet data" });
        };

        if (typeof wcData.name !== "string" || !wcData.name.trim()) {
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
            return res.status(400).json({ message: "Invalid location" });
        };

        const ratings = wcData.ratings;
        if (!ratings || typeof ratings !== "object") {
            return res.status(400).json({ message: "Ratings are required" });
        };

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
        };

        const amenities = wcData.amenities;

        if (!amenities || typeof amenities !== "object") {
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
                return res.status(400).json({
                    message: `Invalid amenity: ${field}`,
                });
            }
        }

        if (typeof wcData.isFree !== "boolean") {
            return res.status(400).json({ message: "Invalid isFree value" });
        };

        const price = wcData.isFree
            ? 0
            : Number(String(wcData.price ?? "").replace(/[,\s]/g, ""));

        if (!Number.isFinite(price) || price < 0) {
            return res.status(400).json({ message: "Invalid price" });
        };

        const user = await User.exists({ _id: userId });
        if (!user) {
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

        res.status(201).json(toilet);

    } catch (err) {
        if (session.inTransaction()) {
            await session.abortTransaction();
        }

        console.error(err);

        if (err.name === "ValidationError") {
            return res.status(400).json({
                message: "Invalid toilet data",
            });
        }

        if (err.code === 11000) {
            return res.status(409).json({
                message: "Toilet already exists",
            });
        }

        return res.status(500).json({
            message: "Failed to create toilet.",
        });
    } finally {
        await session.endSession();
    }
};

const getToilets = async (req, res) => {
    try {
        const toilets = await Toilet.find()
            .select("-reviews -createdBy")
            .limit(1000)
            .lean();
        res.status(200).json({ toilets });

    } catch (error) {

        console.log(error);
        res.status(500).json({
            message: "Failed to load toilets",
        })
    }
};

const getToiletReviews = async (req, res) => {
    const { toiletId } = req.params;

    if (!mongoose.isValidObjectId(toiletId)) {
        return res.status(400).json({ message: "Invalid toilet ID" });
    }

    try {
        const reviews = await Review.find({ toilet: toiletId })
            .populate("user", "username firstName lastName avatar")
            .sort({ createdAt: -1 })
            .limit(50)
            .lean();

        res.status(200).json({ reviews });

    } catch (error) {
        console.error("Get toilet reviews error:", error);

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