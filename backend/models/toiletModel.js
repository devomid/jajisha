const mongoose = require("mongoose");

const toiletSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
        },

        description: {
            type: String,
            default: "",
            trim: true,
            maxlength: 500,
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
            trim: true,
        },

        isFree: {
            type: Boolean,
            default: true,
        },

        price: {
            type: Number,
            default: 0,
            min: 0,
        },

        amenities: {
            western: {
                type: Boolean,
                default: false,
            },

            iranian: {
                type: Boolean,
                default: false,
            },

            wheelchairAccessible: {
                type: Boolean,
                default: false,
            },

            babyChanging: {
                type: Boolean,
                default: false,
            },

            soap: {
                type: Boolean,
                default: false,
            },

            toiletPaper: {
                type: Boolean,
                default: false,
            },

            warmWater: {
                type: Boolean,
                default: false,
            },

            handDryer: {
                type: Boolean,
                default: false,
            },
        },

        ratingSummary: {
            count: {
                type: Number,
                default: 0,
                min: 0,
            },

            average: {
                type: Number,
                default: 0,
                min: 0,
                max: 5,
            },

            cleanliness: {
                type: Number,
                default: 0,
                min: 0,
                max: 5,
            },

            odor: {
                type: Number,
                default: 0,
                min: 0,
                max: 5,
            },

            amenitiesHealth: {
                type: Number,
                default: 0,
                min: 0,
                max: 5,
            },

            light: {
                type: Number,
                default: 0,
                min: 0,
                max: 5,
            },

            privacy: {
                type: Number,
                default: 0,
                min: 0,
                max: 5,
            },

            crowd: {
                type: Number,
                default: 0,
                min: 0,
                max: 5,
            },
        },

        photos: [
            {
                type: String,
                trim: true,
            },
        ],

        reviews: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Review",
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

// Geospatial queries
toiletSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Toilet", toiletSchema);