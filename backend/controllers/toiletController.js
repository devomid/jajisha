const toiletModel = require("../models/toiletModel")

exports.createToilet = async (req, res) => {

    try {
        const { wcData } = req.body;
        const price =
            wcData.isFree
                ? 0
                : Number(
                    String(wcData.price).replace(/[,\s]/g, "")
                );

        const newToilet = new toiletModel({
            name: wcData.name,
            description: wcData.description,

            location: {
                type: "Point",
                coordinates: [
                    req.body.wcData.location.longitude,
                    req.body.wcData.location.latitude,
                ],
            },

            address: wcData.address,

            isFree: wcData.isFree,

            price: price,

            amenities: wcData.amenities,

            ratings: wcData.ratings,

            averageRating: wcData.averageRating,

            // Temporary until authentication is implemented
            createdBy: "687d2f5f5a3e6c5f8d123456",
        });

        await newToilet.save();

        res.status(201).json(newToilet);

    } catch (err) {
        console.error(err);

        res.status(500).json({
            message: err.message,
        });
    }
};

exports.getToilets = async (req, res) => {
    try {

        const toilets = await toiletModel.find();
        res.status(200).json({ toilets })

    } catch (error) {

        console.log(error);
        res.status(500).json({
            message: "Failed to load toilets",
        })
    }
}