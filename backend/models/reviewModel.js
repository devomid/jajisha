const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
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

        text: {
            type: String,
            trim: true,
            required: true,
            minlength: 10,
            maxlength: 200,
        },

        ratings: {
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
        },

        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],

        dislikes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    {
        timestamps: true,
    }
);

reviewSchema.index(
    { toilet: 1, user: 1 },
    { unique: true }
);

reviewSchema.index({
    toilet: 1,
    createdAt: -1,
});

reviewSchema.index({
    user: 1,
    createdAt: -1,
});

module.exports = mongoose.model("Review", reviewSchema);