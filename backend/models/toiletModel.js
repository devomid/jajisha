const mongoose = require("mongoose");

const toiletSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            default: "",
        },

        location: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point",
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
                required: true,
            },
        },

        address: {
            type: String,
            default: "",
        },

        city: {
            type: String,
            default: "",
        },

        country: {
            type: String,
            default: "",
        },

        isFree: {
            type: Boolean,
            default: true,
        },

        price: {
            type: Number,
            default: 0,
        },

        gender: {
            type: String,
            enum: ["male", "female", "unisex"],
            default: "unisex",
        },

        wheelchairAccessible: {
            type: Boolean,
            default: false,
        },

        babyChanging: {
            type: Boolean,
            default: false,
        },

        bidet: {
            type: Boolean,
            default: false,
        },

        soap: {
            type: Boolean,
            default: false,
        },

        toiletPaper: {
            type: Boolean,
            default: true,
        },

        water: {
            type: Boolean,
            default: false,
        },

        handDryer: {
            type: Boolean,
            default: false,
        },

        averageRating: {
            type: Number,
            default: 0,
        },

        totalRatings: {
            type: Number,
            default: 0,
        },

        photos: [
            {
                type: String,
            },
        ],

        verified: {
            type: Boolean,
            default: false,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

toiletSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Toilet", toiletSchema);