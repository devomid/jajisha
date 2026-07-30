const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
    {
        toilet: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Toilet",
            required: true,
            index: true,
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

// One review per user per toilet
reviewSchema.index(
    { toilet: 1, user: 1 },
    { unique: true }
);

// Fast loading of reviews
reviewSchema.index({ toilet: 1, createdAt: -1 });

module.exports = mongoose.model("Review", reviewSchema);