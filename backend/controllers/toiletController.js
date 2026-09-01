const ToiletModel = require("../models/toiletModel")
const RatingModel = require("../models/ratingModel");
const UserModel = require("../models/userModel");

const createToilet = async (req, res) => {
    try {
        const { wcData } = req.body;

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
        const toilet = await ToiletModel.create({
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

            // Temporary until authentication
            createdBy: "687d2f5f5a3e6c5f8d123456",
        });

        // 2. Create creator's Rating
        await RatingModel.create({
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

        const toilets = await ToiletModel.find();
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