const request = require('supertest');
const app = require('../app');

describe('GET /api/user/returnMe', () => {
    const user = {
        username: 'returnmeuser',
        firstName: 'Return',
        lastName: 'Me',
        email: 'returnme@example.com',
        password: 'password123'
    };

    let token;

    beforeEach(async () => {
        const signupResponse = await request(app)
            .post('/api/user/su')
            .send(user);

        token = signupResponse.body.token;
    });

    it('should return the authenticated user', async () => {
        const response = await request(app)
            .get('/api/user/returnMe')
            .set('Authorization', `Bearer ${ token } `);

        expect(response.statusCode).toBe(200);

        expect(response.body).toBeDefined();
        expect(response.body.username).toBe(user.username);
        expect(response.body.firstName).toBe(user.firstName);
        expect(response.body.lastName).toBe(user.lastName);
        expect(response.body.email).toBe(user.email);
    });

    it('should not return the user password', async () => {
        const response = await request(app)
            .get('/api/user/returnMe')
            .set('Authorization', `Bearer ${ token } `);

        expect(response.statusCode).toBe(200);
        expect(response.body.password).toBeUndefined();
    });

    it('should return 401 without an authorization token', async () => {
        const response = await request(app)
            .get('/api/user/returnMe');

        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({
            error: 'Authorization token requires!'
        });
    });

    it('should return 401 with an invalid token', async () => {
        const response = await request(app)
            .get('/api/user/returnMe')
            .set('Authorization', 'Bearer invalid-token');

        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({
            error: 'Invalid or expired token'
        });
    });

    it('should return 401 when the token belongs to a nonexistent user', async () => {
        const jwt = require('jsonwebtoken');

        const fakeUserId = new (require('mongoose').Types.ObjectId)();

        const fakeToken = jwt.sign(
            { _id: fakeUserId },
            process.env.SECRET_KEY,
            { expiresIn: '3d' }
        );

        const response = await request(app)
            .get('/api/user/returnMe')
            .set('Authorization', `Bearer ${ fakeToken } `);

        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({
            error: 'User no longer exists'
        });
    });
});
