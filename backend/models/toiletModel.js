const mongoose = require("mongoose");

const toiletSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            // required: true,
            trim: true,
        },

        description: {
            type: String,
            default: "",
            trim: true,
        },

        location: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point",
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
                // required: true,
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

        ratings: {
            cleanliness: {
                type: Number,
                min: 0,
                max: 5,
                default: 0,
            },

            odor: {
                type: Number,
                min: 0,
                max: 5,
                default: 0,
            },

            amenitiesHealth: {
                type: Number,
                min: 0,
                max: 5,
                default: 0,
            },

            light: {
                type: Number,
                min: 0,
                max: 5,
                default: 0,
            },

            privacy: {
                type: Number,
                min: 0,
                max: 5,
                default: 0,
            },

            crowd: {
                type: Number,
                min: 0,
                max: 5,
                default: 0,
            },
        },

        averageRating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },

        totalRatings: {
            type: Number,
            default: 0,
            min: 0,
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
            // required: true,
        },
    },
    {
        timestamps: true,
    }
);

toiletSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Toilet", toiletSchema);