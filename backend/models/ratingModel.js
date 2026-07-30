const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
    {
        toilet: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Toilet",
            required: true,
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        cleanliness: {
            type: Number,
            required: true,
            min: 0,
            max: 5,
        },

        odor: {
            type: Number,
            required: true,
            min: 0,
            max: 5,
        },

        amenitiesHealth: {
            type: Number,
            required: true,
            min: 0,
            max: 5,
        },

        light: {
            type: Number,
            required: true,
            min: 0,
            max: 5,
        },

        privacy: {
            type: Number,
            required: true,
            min: 0,
            max: 5,
        },

        crowd: {
            type: Number,
            required: true,
            min: 0,
            max: 5,
        },

        overall: {
            type: Number,
            required: true,
            min: 0,
            max: 5,
        },
    },
    {
        timestamps: true,
    }
);

// One rating per user per toilet
ratingSchema.index(
    { toilet: 1, user: 1 },
    { unique: true }
);

// Fast queries
ratingSchema.index({ toilet: 1 });
ratingSchema.index({ user: 1 });

module.exports = mongoose.model("RatingModel", ratingSchema);