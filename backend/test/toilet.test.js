const request = require('supertest');
const Toilet = require('../models/toiletModel');
const app = require('../app');
const User = require('../models/userModel');

describe('GET /api/toilets', () => {
    it('should return 200 and an object containing toilets', async () => {
        const response = await request(app)
            .get('/api/toilets');

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('toilets');
        expect(Array.isArray(response.body.toilets)).toBe(true);
    });

    it("should return 400 when ratings are missing", async () => {
        const { ratings, ...wcDataWithoutRatings } =
            validToilet.wcData;

        const response = await request(app)
            .post("/api/toilets")
            .set("Authorization", `Bearer ${token}`)
            .send({
                wcData: wcDataWithoutRatings,
            });

        expect(response.statusCode).toBe(400);

        expect(response.body).toEqual({
            message: "Ratings are required",
        });
    });

    it("should return 400 when ratings are an array", async () => {
        const response = await request(app)
            .post("/api/toilets")
            .set("Authorization", `Bearer ${token}`)
            .send({
                wcData: {
                    ...validToilet.wcData,
                    ratings: [],
                },
            });

        expect(response.statusCode).toBe(400);

        expect(response.body).toEqual({
            message: "Ratings are required",
        });
    });

    it("should return 400 when a rating field is missing", async () => {
        const ratings = {
            ...validToilet.wcData.ratings,
        };

        delete ratings.odor;

        const response = await request(app)
            .post("/api/toilets")
            .set("Authorization", `Bearer ${token}`)
            .send({
                wcData: {
                    ...validToilet.wcData,
                    ratings,
                },
            });

        expect(response.statusCode).toBe(400);

        expect(response.body).toEqual({
            message: "Invalid rating: odor",
        });
    });

    it("should return 400 when a rating is not a number", async () => {
        const response = await request(app)
            .post("/api/toilets")
            .set("Authorization", `Bearer ${token}`)
            .send({
                wcData: {
                    ...validToilet.wcData,
                    ratings: {
                        ...validToilet.wcData.ratings,
                        cleanliness: "4",
                    },
                },
            });

        expect(response.statusCode).toBe(400);

        expect(response.body).toEqual({
            message: "Invalid rating: cleanliness",
        });
    });

    it("should return 400 when a rating is below zero", async () => {
        const response = await request(app)
            .post("/api/toilets")
            .set("Authorization", `Bearer ${token}`)
            .send({
                wcData: {
                    ...validToilet.wcData,
                    ratings: {
                        ...validToilet.wcData.ratings,
                        cleanliness: -1,
                    },
                },
            });

        expect(response.statusCode).toBe(400);

        expect(response.body).toEqual({
            message: "Invalid rating: cleanliness",
        });
    });

    it("should return 400 when amenities are missing", async () => {
        const { amenities, ...wcDataWithoutAmenities } =
            validToilet.wcData;

        const response = await request(app)
            .post("/api/toilets")
            .set("Authorization", `Bearer ${token}`)
            .send({
                wcData: wcDataWithoutAmenities,
            });

        expect(response.statusCode).toBe(400);

        expect(response.body).toEqual({
            message: "Amenities are required",
        });
    });

    it("should return 400 when amenities are an array", async () => {
        const response = await request(app)
            .post("/api/toilets")
            .set("Authorization", `Bearer ${token}`)
            .send({
                wcData: {
                    ...validToilet.wcData,
                    amenities: [],
                },
            });

        expect(response.statusCode).toBe(400);

        expect(response.body).toEqual({
            message: "Amenities are required",
        });
    });

    it("should return 400 when an amenity field is missing", async () => {
        const amenities = {
            ...validToilet.wcData.amenities,
        };

        delete amenities.soap;

        const response = await request(app)
            .post("/api/toilets")
            .set("Authorization", `Bearer ${token}`)
            .send({
                wcData: {
                    ...validToilet.wcData,
                    amenities,
                },
            });

        expect(response.statusCode).toBe(400);

        expect(response.body).toEqual({
            message: "Invalid amenity: soap",
        });
    });
});

describe('GET /api/toilets/reviews/:toiletId', () => {
    it('should return 400 for an invalid toilet ID', async () => {
        const response = await request(app)
            .get('/api/toilets/reviews/not-a-valid-id');

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
            message: 'Invalid toilet ID'
        });
    });

    it("should return 404 when the toilet does not exist", async () => {
        const mongoose = require("mongoose");

        const fakeToiletId = new mongoose.Types.ObjectId();

        const response = await request(app)
            .get(`/api/toilets/reviews/${fakeToiletId}`);

        expect(response.statusCode).toBe(404);

        expect(response.body).toEqual({
            message: "Toilet not found",
        });
    });

    it('should return an empty reviews array for a valid toilet ID with no reviews', async () => {
        const user = await User.create({
            username: 'reviewtoiletuser',
            firstName: 'Review',
            lastName: 'User',
            email: 'reviewtoilet@example.com',
            password: 'password123'
        });
        const toilet = await Toilet.create({
            name: 'Test Review Toilet',
            description: 'A toilet for review testing.',
            location: {
                type: 'Point',
                coordinates: [51.3890, 35.6892]
            },
            address: 'Test Street',
            isFree: true,
            price: 0,
            amenities: {
                western: true,
                iranian: false,
                wheelchairAccessible: true,
                babyChanging: false,
                soap: true,
                toiletPaper: true,
                warmWater: true,
                handDryer: true
            },
            ratingSummary: {
                count: 0,
                average: 0,
                cleanliness: 0,
                odor: 0,
                amenitiesHealth: 0,
                light: 0,
                privacy: 0,
                crowd: 0
            },
            createdBy: user._id,
        });

        const response = await request(app)
            .get(`/api/toilets/reviews/${toilet._id}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('reviews');
        expect(Array.isArray(response.body.reviews)).toBe(true);
        expect(response.body.reviews).toHaveLength(0);
    });
});

describe('POST /api/toilets', () => {
    const user = {
        username: 'toiletcreator',
        firstName: 'Toilet',
        lastName: 'Creator',
        email: 'toiletcreator@example.com',
        password: 'password123'
    };

    const validToilet = {
        wcData: {
            name: 'Test Public Toilet',
            description: 'A clean public toilet for testing.',
            location: {
                latitude: 35.6892,
                longitude: 51.3890
            },
            address: 'Test Street',
            isFree: true,
            price: 0,
            amenities: {
                western: true,
                iranian: false,
                wheelchairAccessible: true,
                babyChanging: false,
                soap: true,
                toiletPaper: true,
                warmWater: true,
                handDryer: true
            },
            ratings: {
                cleanliness: 4,
                odor: 5,
                amenitiesHealth: 4,
                light: 5,
                privacy: 4,
                crowd: 5
            }
        }
    };

    let token;

    beforeEach(async () => {
        const response = await request(app)
            .post('/api/user/su')
            .send(user);

        expect(response.statusCode).toBe(201);

        token = response.body.token;
    });

    it('should create a toilet successfully', async () => {
        const response = await request(app)
            .post('/api/toilets')
            .set('Authorization', `Bearer ${token}`)
            .send(validToilet);

        expect(response.statusCode).toBe(201);
        expect(response.body).toBeDefined();
        expect(response.body.name).toBe(validToilet.wcData.name);
        expect(response.body.location.type).toBe('Point');
        expect(response.body.location.coordinates).toEqual([
            validToilet.wcData.location.longitude,
            validToilet.wcData.location.latitude
        ]);
    });

    it('should return 401 without authorization', async () => {
        const response = await request(app)
            .post('/api/toilets')
            .send(validToilet);

        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({
            error: 'Authorization token requires!'
        });
    });

    it('should return 400 when toilet data is missing', async () => {
        const response = await request(app)
            .post('/api/toilets')
            .set('Authorization', `Bearer ${token}`)
            .send({});

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
            message: 'Invalid toilet data'
        });
    });

    it('should return 400 when toilet name is missing', async () => {
        const response = await request(app)
            .post('/api/toilets')
            .set('Authorization', `Bearer ${token}`)
            .send({
                wcData: {
                    ...validToilet.wcData,
                    name: ''
                }
            });

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
            message: 'Toilet name is required'
        });
    });

    it('should return 400 when latitude is invalid', async () => {
        const response = await request(app)
            .post('/api/toilets')
            .set('Authorization', `Bearer ${token}`)
            .send({
                wcData: {
                    ...validToilet.wcData,
                    location: {
                        latitude: 100,
                        longitude: 51.3890
                    }
                }
            });

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
            message: 'Invalid location'
        });
    });

    it('should return 400 when longitude is invalid', async () => {
        const response = await request(app)
            .post('/api/toilets')
            .set('Authorization', `Bearer ${token}`)
            .send({
                wcData: {
                    ...validToilet.wcData,
                    location: {
                        latitude: 35.6892,
                        longitude: 200
                    }
                }
            });

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
            message: 'Invalid location'
        });
    });

    it('should return 400 when a rating is outside the 0-5 range', async () => {
        const response = await request(app)
            .post('/api/toilets')
            .set('Authorization', `Bearer ${token}`)
            .send({
                wcData: {
                    ...validToilet.wcData,
                    ratings: {
                        ...validToilet.wcData.ratings,
                        cleanliness: 6
                    }
                }
            });

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
            message: 'Invalid rating: cleanliness'
        });
    });

    it('should return 400 when an amenity is not a boolean', async () => {
        const response = await request(app)
            .post('/api/toilets')
            .set('Authorization', `Bearer ${token}`)
            .send({
                wcData: {
                    ...validToilet.wcData,
                    amenities: {
                        ...validToilet.wcData.amenities,
                        soap: 'yes'
                    }
                }
            });

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
            message: 'Invalid amenity: soap'
        });
    });

    it('should return 400 when isFree is not a boolean', async () => {
        const response = await request(app)
            .post('/api/toilets')
            .set('Authorization', `Bearer ${token}`)
            .send({
                wcData: {
                    ...validToilet.wcData,
                    isFree: 'yes'
                }
            });

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
            message: 'Invalid isFree value'
        });
    });
});