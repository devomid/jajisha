const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');

describe('Toilet management', () => {
    const user = {
        username: 'managementuser',
        firstName: 'Management',
        lastName: 'User',
        email: 'management@example.com',
        password: 'password123'
    };

    const validToilet = {
        wcData: {
            name: 'Management Test Toilet',
            description: 'A toilet used for management tests.',
            location: {
                latitude: 35.6892,
                longitude: 51.3890
            },
            address: 'Management Test Street',
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
    let toiletId;

    beforeEach(async () => {
        const signupResponse = await request(app)
            .post('/api/user/su')
            .send(user);

        expect(signupResponse.statusCode).toBe(201);

        token = signupResponse.body.token;

        const toiletResponse = await request(app)
            .post('/api/toilets')
            .set('Authorization', `Bearer ${token}`)
            .send(validToilet);

        expect(toiletResponse.statusCode).toBe(201);

        toiletId = toiletResponse.body._id;
    });

    describe('PATCH /api/managment/saveToilets/:toiletId', () => {
        it('should save a toilet successfully', async () => {
            const response = await request(app)
                .patch(`/api/managment/saveToilets/${toiletId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({
                message: 'Toilet saved successfully'
            });
        });

        it('should not duplicate a saved toilet', async () => {
            const firstResponse = await request(app)
                .patch(`/api/managment/saveToilets/${toiletId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(firstResponse.statusCode).toBe(200);

            const secondResponse = await request(app)
                .patch(`/api/managment/saveToilets/${toiletId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(secondResponse.statusCode).toBe(200);
            expect(secondResponse.body).toEqual({
                message: 'Toilet saved successfully'
            });
        });

        it('should return 401 without authorization', async () => {
            const response = await request(app)
                .patch(`/api/managment/saveToilets/${toiletId}`);

            expect(response.statusCode).toBe(401);
            expect(response.body).toEqual({
                error: 'Authorization token requires!'
            });
        });

        it('should return 400 for an invalid toilet ID', async () => {
            const response = await request(app)
                .patch('/api/managment/saveToilets/not-a-valid-id')
                .set('Authorization', `Bearer ${token}`);

            expect(response.statusCode).toBe(400);
            expect(response.body).toEqual({
                message: 'Invalid toilet ID'
            });
        });

        it('should return 404 when the toilet does not exist', async () => {
            const fakeToiletId = new mongoose.Types.ObjectId();

            const response = await request(app)
                .patch(`/api/managment/saveToilets/${fakeToiletId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.statusCode).toBe(404);
            expect(response.body).toEqual({
                message: 'Toilet not found'
            });
        });
    });

    describe('DELETE /api/managment/unSavedToilets/:toiletId', () => {
        it('should unsave a toilet successfully', async () => {
            await request(app)
                .patch(`/api/managment/saveToilets/${toiletId}`)
                .set('Authorization', `Bearer ${token}`);

            const response = await request(app)
                .delete(`/api/managment/unSavedToilets/${toiletId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({
                message: 'Toilet removed successfully'
            });
        });

        it('should return 401 without authorization', async () => {
            const response = await request(app)
                .delete(`/api/managment/unSavedToilets/${toiletId}`);

            expect(response.statusCode).toBe(401);
            expect(response.body).toEqual({
                error: 'Authorization token requires!'
            });
        });

        it('should return 400 for an invalid toilet ID', async () => {
            const response = await request(app)
                .delete('/api/managment/unSavedToilets/not-a-valid-id')
                .set('Authorization', `Bearer ${token}`);

            expect(response.statusCode).toBe(400);
            expect(response.body).toEqual({
                message: 'Invalid toilet ID'
            });
        });

        it('should return 404 when the toilet does not exist', async () => {
            const fakeToiletId = new mongoose.Types.ObjectId();

            const response = await request(app)
                .delete(`/api/managment/unSavedToilets/${fakeToiletId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.statusCode).toBe(404);
            expect(response.body).toEqual({
                message: 'Toilet not found'
            });
        });
    });
});

describe('POST /api/managment/toiletManagement/:toiletId', () => {
    const user = {
        username: 'reviewuser',
        firstName: 'Review',
        lastName: 'User',
        email: 'review@example.com',
        password: 'password123'
    };

    const validToilet = {
        wcData: {
            name: 'Review Test Toilet',
            description: 'A toilet used for review tests.',
            location: {
                latitude: 35.6892,
                longitude: 51.3890
            },
            address: 'Review Test Street',
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

    const validRatings = {
        cleanliness: 4,
        odor: 5,
        amenitiesHealth: 4,
        light: 5,
        privacy: 4,
        crowd: 5
    };

    let token;
    let toiletId;

    beforeEach(async () => {
        const signupResponse = await request(app)
            .post('/api/user/su')
            .send(user);

        expect(signupResponse.statusCode).toBe(201);

        token = signupResponse.body.token;

        const toiletResponse = await request(app)
            .post('/api/toilets')
            .set('Authorization', `Bearer ${token}`)
            .send(validToilet);

        expect(toiletResponse.statusCode).toBe(201);

        toiletId = toiletResponse.body._id;
    });

    it('should create a review successfully', async () => {
        const response = await request(app)
            .post(`/api/managment/toiletManagement/${toiletId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                reviewText: 'This is a clean and useful public toilet.',
                ratings: validRatings
            });

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty(
            'message',
            'Review created successfully'
        );
        expect(response.body.review).toBeDefined();
    });

    it('should return 401 without authorization', async () => {
        const response = await request(app)
            .post(`/api/managment/toiletManagement/${toiletId}`)
            .send({
                reviewText: 'This is a clean and useful public toilet.',
                ratings: validRatings
            });

        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({
            error: 'Authorization token requires!'
        });
    });

    it('should return 400 for an invalid toilet ID', async () => {
        const response = await request(app)
            .post('/api/managment/toiletManagement/not-a-valid-id')
            .set('Authorization', `Bearer ${token}`)
            .send({
                reviewText: 'This is a clean and useful public toilet.',
                ratings: validRatings
            });

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
            message: 'Invalid toilet ID'
        });
    });

    it('should return 404 when the toilet does not exist', async () => {
        const fakeToiletId = new mongoose.Types.ObjectId();

        const response = await request(app)
            .post(`/api/managment/toiletManagement/${fakeToiletId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                reviewText: 'This is a clean and useful public toilet.',
                ratings: validRatings
            });

        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({
            message: 'Toilet not found'
        });
    });

    it('should return 400 when ratings are missing', async () => {
        const response = await request(app)
            .post(`/api/managment/toiletManagement/${toiletId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                reviewText: 'This is a clean and useful public toilet.'
            });

        expect(response.statusCode).toBe(400);

        expect(response.body).toEqual({
            message: 'Ratings are required'
        });
    });

    it('should return 400 when ratings are an array', async () => {
        const response = await request(app)
            .post(`/api/managment/toiletManagement/${toiletId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                reviewText: 'This is a clean and useful public toilet.',
                ratings: []
            });

        expect(response.statusCode).toBe(400);

        expect(response.body).toEqual({
            message: 'Ratings are required'
        });
    });

    it('should return 400 when a rating field is missing', async () => {
        const ratings = {
            ...validRatings
        };

        delete ratings.odor;

        const response = await request(app)
            .post(`/api/managment/toiletManagement/${toiletId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                reviewText: 'This is a clean and useful public toilet.',
                ratings
            });

        expect(response.statusCode).toBe(400);

        expect(response.body).toEqual({
            message: 'Invalid rating: odor'
        });
    });

    it('should return 400 when a rating is not a number', async () => {
        const response = await request(app)
            .post(`/api/managment/toiletManagement/${toiletId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                reviewText: 'This is a clean and useful public toilet.',
                ratings: {
                    ...validRatings,
                    cleanliness: '4'
                }
            });

        expect(response.statusCode).toBe(400);

        expect(response.body).toEqual({
            message: 'Invalid rating: cleanliness'
        });
    });

    it('should return 400 when a rating is below zero', async () => {
        const response = await request(app)
            .post(`/api/managment/toiletManagement/${toiletId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                reviewText: 'This is a clean and useful public toilet.',
                ratings: {
                    ...validRatings,
                    cleanliness: -1
                }
            });

        expect(response.statusCode).toBe(400);

        expect(response.body).toEqual({
            message: 'Invalid rating: cleanliness'
        });
    });

    it('should return 400 when a rating is above five', async () => {
        const response = await request(app)
            .post(`/api/managment/toiletManagement/${toiletId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                reviewText: 'This is a clean and useful public toilet.',
                ratings: {
                    ...validRatings,
                    cleanliness: 6
                }
            });

        expect(response.statusCode).toBe(400);

        expect(response.body).toEqual({
            message: 'Invalid rating: cleanliness'
        });
    });

    it('should return 400 when the review is shorter than 10 characters', async () => {
        const response = await request(app)
            .post(`/api/managment/toiletManagement/${toiletId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                reviewText: 'Too short'
            });

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
            message: 'Review text must be between 10 and 200 characters'
        });
    });

    it('should return 400 when the review is longer than 200 characters', async () => {
        const response = await request(app)
            .post(`/api/managment/toiletManagement/${toiletId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                reviewText: 'a'.repeat(201)
            });

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
            message: 'Review text must be between 10 and 200 characters'
        });
    });

    it('should return 400 when reviewText is missing', async () => {
        const response = await request(app)
            .post(`/api/managment/toiletManagement/${toiletId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({});

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
            message: 'Review text is not valid'
        });
    });

    it('should return 409 when the same user reviews the same toilet twice', async () => {
        const review = {
            reviewText: 'This is a clean and useful public toilet.',
            ratings: validRatings
        };

        const firstResponse = await request(app)
            .post(`/api/managment/toiletManagement/${toiletId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(review);

        expect(firstResponse.statusCode).toBe(201);

        const secondResponse = await request(app)
            .post(`/api/managment/toiletManagement/${toiletId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(review);

        expect(secondResponse.statusCode).toBe(409);
        expect(secondResponse.body).toEqual({
            message: 'You have already reviewed this toilet'
        });
    });
});