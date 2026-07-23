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

        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },

        cleanliness: {
            type: Number,
            min: 1,
            max: 5,
        },

        comment: {
            type: String,
            trim: true,
            maxlength: 1000,
        },

        photos: [
            {
                type: String,
            },
        ],

        likes: {
            type: Number,
            default: 0,
        },

        dislikes: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// One review per user per toilet
reviewSchema.index({ toilet: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);