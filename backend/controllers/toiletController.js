const Toilet = require("../models/toiletModel")
const Rating = require("../models/ratingModel");
const User = require("../models/userModel");

const createToilet = async (req, res) => {
    try {
        const { userId } = req.params;
        const { wcData } = req.body;

        console.log(userId);

        const user = await User.exists({ _id: userId });
        if (!user) {
            res.status(404).json({ message: "User not found", });
            return false;
        }

        const price = wcData.isFree
            ? 0
            : Number(String(wcData.price).replace(/[,\s]/g, ""));

        const ratings = wcData.ratings;

        const overall =
            (
                ratings.cleanliness +
                ratings.odor +
                ratings.amenitiesHealth +
                ratings.light +
                ratings.privacy +
                ratings.crowd
            ) / 6;

        // 1. Create Toilet
        const toilet = await Toilet.create({
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

            amenities: wcData.amenities,

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
        });

        // 2. Create creator's Rating
        await Rating.create({
            toilet: toilet._id,
            user: toilet.createdBy,

            cleanliness: ratings.cleanliness,
            odor: ratings.odor,
            amenitiesHealth: ratings.amenitiesHealth,
            light: ratings.light,
            privacy: ratings.privacy,
            crowd: ratings.crowd,

            overall,
        });

        res.status(201).json(toilet);

    } catch (err) {
        console.error(err);

        res.status(500).json({
            message: err.message,
        });
    }
};

const getToilets = async (req, res) => {
    try {

        const toilets = await Toilet.find().populate("reviews");
        res.status(200).json({ toilets })

    } catch (error) {

        console.log(error);
        res.status(500).json({
            message: "Failed to load toilets",
        })
    }
};

module.exports = {
    createToilet,
    getToilets,
}