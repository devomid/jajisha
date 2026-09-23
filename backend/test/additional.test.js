const request = require('supertest');
const User = require('../models/userModel');
const Toilet = require('../models/toiletModel');
const app = require('../app');

describe('Additional API coverage', () => {
    const user = {
        username: 'additionaluser',
        firstName: 'Additional',
        lastName: 'User',
        email: 'additional@example.com',
        password: 'password123'
    };

    const validToilet = {
        wcData: {
            name: 'Additional Test Toilet',
            description: 'A toilet used for additional tests.',
            location: {
                latitude: 35.6892,
                longitude: 51.3890
            },
            address: 'Additional Test Street',
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
    let userId;
    let toiletId;

    beforeEach(async () => {
        const signupResponse = await request(app)
            .post('/api/user/su')
            .send(user);

        expect(signupResponse.statusCode).toBe(201);

        token = signupResponse.body.token;
        userId = signupResponse.body.user._id;

        const toiletResponse = await request(app)
            .post('/api/toilets')
            .set('Authorization', `Bearer ${token}`)
            .send(validToilet);

        expect(toiletResponse.statusCode).toBe(201);

        toiletId = toiletResponse.body._id;
    });

    describe('DELETE /api/user/rm', () => {
        it('should delete the authenticated user successfully', async () => {
            const response = await request(app)
                .delete('/api/user/rm')
                .set('Authorization', `Bearer ${token}`);

            expect(response.statusCode).toBe(204);
            expect(response.body).toEqual({});

            const deletedUser = await User.findById(userId);

            expect(deletedUser).toBeNull();
        });

        it('should return 401 without authorization', async () => {
            const response = await request(app)
                .delete('/api/user/rm');

            expect(response.statusCode).toBe(401);
            expect(response.body).toEqual({
                error: 'Authorization token requires!'
            });
        });

        it('should reject the token after the user has been deleted', async () => {
            const deleteResponse = await request(app)
                .delete('/api/user/rm')
                .set('Authorization', `Bearer ${token}`);

            expect(deleteResponse.statusCode).toBe(204);

            const response = await request(app)
                .get('/api/user/returnMe')
                .set('Authorization', `Bearer ${token}`);

            expect(response.statusCode).toBe(401);
            expect(response.body).toEqual({
                error: 'User no longer exists'
            });
        });
    });

    describe('Saved toilet state', () => {
        it('should add the toilet to the user favorites', async () => {
            const response = await request(app)
                .patch(`/api/managment/saveToilets/${toiletId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.statusCode).toBe(200);

            const userAfterSave = await User.findById(userId);

            expect(userAfterSave.favoriteToilets).toHaveLength(1);
            expect(userAfterSave.favoriteToilets[0].toString()).toBe(toiletId);
        });

        it('should remove the toilet from the user favorites', async () => {
            await request(app)
                .patch(`/api/managment/saveToilets/${toiletId}`)
                .set('Authorization', `Bearer ${token}`);

            const response = await request(app)
                .delete(`/api/managment/unSavedToilets/${toiletId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.statusCode).toBe(200);

            const userAfterUnsave = await User.findById(userId);

            expect(userAfterUnsave.favoriteToilets).toHaveLength(0);
        });
    });

    describe('POST /api/toilets price validation', () => {
        it('should create a paid toilet with a valid price', async () => {
            const response = await request(app)
                .post('/api/toilets')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    wcData: {
                        ...validToilet.wcData,
                        name: 'Paid Test Toilet',
                        isFree: false,
                        price: 25000
                    }
                });

            expect(response.statusCode).toBe(201);
            expect(response.body.price).toBe(25000);
            expect(response.body.isFree).toBe(false);
        });

        it('should return 400 when the price is negative', async () => {
            const response = await request(app)
                .post('/api/toilets')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    wcData: {
                        ...validToilet.wcData,
                        name: 'Negative Price Toilet',
                        isFree: false,
                        price: -100
                    }
                });

            expect(response.statusCode).toBe(400);
            expect(response.body).toEqual({
                message: 'Invalid price'
            });
        });

        it('should return 400 when the price is not a valid number', async () => {
            const response = await request(app)
                .post('/api/toilets')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    wcData: {
                        ...validToilet.wcData,
                        name: 'Invalid Price Toilet',
                        isFree: false,
                        price: 'not-a-price'
                    }
                });

            expect(response.statusCode).toBe(400);
            expect(response.body).toEqual({
                message: 'Invalid price'
            });
        });

        it('should force the price to zero for a free toilet', async () => {
            const response = await request(app)
                .post('/api/toilets')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    wcData: {
                        ...validToilet.wcData,
                        name: 'Free Toilet With Price',
                        isFree: true,
                        price: 50000
                    }
                });

            expect(response.statusCode).toBe(201);
            expect(response.body.isFree).toBe(true);
            expect(response.body.price).toBe(0);
        });
    });

    describe('Review state and retrieval', () => {
        const ratings = {
            cleanliness: 4,
            odor: 5,
            amenitiesHealth: 3,
            light: 4,
            privacy: 5,
            crowd: 2
        };

        const reviewText = 'This is a clean and useful public toilet.';

        it('should update the toilet rating summary after creating a review', async () => {
            const response = await request(app)
                .post(`/api/managment/toiletManagement/${toiletId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    reviewText,
                    ratings
                });

            expect(response.statusCode).toBe(201);

            const toilet = await Toilet.findById(toiletId);

            expect(toilet.ratingSummary.count).toBe(2);
            expect(toilet.ratingSummary.cleanliness).toBe(4);
            expect(toilet.ratingSummary.odor).toBe(5);
            expect(toilet.ratingSummary.amenitiesHealth).toBe(3.5);
            expect(toilet.ratingSummary.light).toBe(4.5);
            expect(toilet.ratingSummary.privacy).toBe(4.5);
            expect(toilet.ratingSummary.crowd).toBe(3.5);

            expect(toilet.ratingSummary.average).toBe(
                (4 + 5 + 3.5 + 4.5 + 4.5 + 3.5) / 6
            );
        });

        it('should return the created review from the reviews endpoint', async () => {
            const createResponse = await request(app)
                .post(`/api/managment/toiletManagement/${toiletId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    reviewText,
                    ratings
                });

            expect(createResponse.statusCode).toBe(201);

            const response = await request(app)
                .get(`/api/toilets/reviews/${toiletId}`);

            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('reviews');
            expect(response.body.reviews).toHaveLength(1);

            const review = response.body.reviews[0];

            expect(review.text).toBe(reviewText);
            expect(review.ratings).toEqual(ratings);
            expect(review.user).toBeDefined();
            expect(review.user.username).toBe(user.username);
        });

        it("should return the authenticated user's review as userReview", async () => {
            const ratings = {
                cleanliness: 4,
                odor: 5,
                amenitiesHealth: 3,
                light: 4,
                privacy: 5,
                crowd: 2,
            };

            const reviewText =
                "This is a clean and useful public toilet.";

            const createResponse = await request(app)
                .post(`/api/managment/toiletManagement/${toiletId}`)
                .set("Authorization", `Bearer ${token}`)
                .send({
                    reviewText,
                    ratings,
                });

            expect(createResponse.statusCode).toBe(201);

            const response = await request(app)
                .get(`/api/toilets/reviews/${toiletId}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.statusCode).toBe(200);

            expect(response.body.userReview).toBeDefined();
            expect(response.body.userReview.text).toBe(reviewText);
            expect(response.body.userReview.ratings).toEqual(ratings);
        });
    });
});