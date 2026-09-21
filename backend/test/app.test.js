const request = require('supertest');
const app = require('../app');

describe('GET /health', () => {
    it('should return 200 and status ok', async () => {
        const response = await request(app).get('/health');

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            status: 'ok'
        });
    });
});

describe('Unknown routes', () => {
    it('should return 404', async () => {
        const response = await request(app)
            .get('/this-route-does-not-exist');

        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({
            error: 'Route not found'
        });
    });
});

describe('Authorization', () => {
    it('should return 401 when authorization token is missing', async () => {
        const response = await request(app)
            .get('/api/user/returnMe');

        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({
            error: 'Authorization token requires!'
        });
    });

    it('should return 401 when authorization token is invalid', async () => {
        const response = await request(app)
            .get('/api/user/returnMe')
            .set('Authorization', 'Bearer invalid-token');

        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({
            error: 'Invalid or expired token'
        });
    });

    it('should return 401 for non-Bearer authorization', async () => {
        const response = await request(app)
            .get('/api/user/returnMe')
            .set('Authorization', 'Basic abc123');

        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({
            error: 'Invalid authorization format'
        });
    });

    it('should return 401 for malformed Bearer authorization', async () => {
        const response = await request(app)
            .get('/api/user/returnMe')
            .set('Authorization', 'Bearer');

        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({
            error: 'Invalid authorization format'
        });
    });

    it('should return 401 for a Bearer token with extra segments', async () => {
        const response = await request(app)
            .get('/api/user/returnMe')
            .set('Authorization', 'Bearer token extra');

        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({
            error: 'Invalid authorization format'
        });
    });

    it('should return 401 for an expired JWT', async () => {
        const jwt = require('jsonwebtoken');
        const mongoose = require('mongoose');

        const expiredToken = jwt.sign(
            { _id: new mongoose.Types.ObjectId() },
            process.env.SECRET_KEY,
            { expiresIn: -1 }
        );

        const response = await request(app)
            .get('/api/user/returnMe')
            .set('Authorization', `Bearer ${expiredToken} `);

        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({
            error: 'Invalid or expired token'
        });
    });
});

describe('POST /api/user/su', () => {
    const validUser = {
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'password123'
    };

    it('should create a new user successfully', async () => {
        const response = await request(app)
            .post('/api/user/su')
            .send(validUser);

        expect(response.statusCode).toBe(201);

        expect(response.body.user).toBeDefined();
        expect(response.body.token).toBeDefined();

        expect(response.body.user.username).toBe(validUser.username);
        expect(response.body.user.firstName).toBe(validUser.firstName);
        expect(response.body.user.lastName).toBe(validUser.lastName);
        expect(response.body.user.email).toBe(validUser.email);

        expect(response.body.user.password).toBeUndefined();
        expect(response.body.password).toBeUndefined();

        expect(typeof response.body.token).toBe('string');
        expect(response.body.token.length).toBeGreaterThan(0);
    });

    it('should return 400 when required signup fields are missing', async () => {
        const response = await request(app)
            .post('/api/user/su')
            .send({
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            });

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
            error: 'Invalid sign-up data.'
        });
    });

    it('should return 400 when signup fields are empty', async () => {
        const response = await request(app)
            .post('/api/user/su')
            .send({
                username: '',
                firstName: '',
                lastName: '',
                email: '',
                password: ''
            });

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
            error: 'All signup fields are required.'
        });
    });

    it('should return 400 when signup fields contain only whitespace', async () => {
        const response = await request(app)
            .post('/api/user/su')
            .send({
                username: '   ',
                firstName: '   ',
                lastName: '   ',
                email: '   ',
                password: '   '
            });

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
            error: 'All signup fields are required.'
        });
    });

    it('should return 400 when password is shorter than 8 characters', async () => {
        const response = await request(app)
            .post('/api/user/su')
            .send({
                ...validUser,
                password: '1234567'
            });

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
            error: 'Password is not strong enough.'
        });
    });

    it('should return 409 when username already exists', async () => {
        await request(app)
            .post('/api/user/su')
            .send(validUser);

        const response = await request(app)
            .post('/api/user/su')
            .send({
                ...validUser,
                email: 'different@example.com'
            });

        expect(response.statusCode).toBe(409);
        expect(response.body).toEqual({
            error: 'Username is already in use.'
        });
    });

    it('should return 409 when email already exists', async () => {
        await request(app)
            .post('/api/user/su')
            .send(validUser);

        const response = await request(app)
            .post('/api/user/su')
            .send({
                ...validUser,
                username: 'differentuser'
            });

        expect(response.statusCode).toBe(409);
        expect(response.body).toEqual({
            error: 'Email is already in use.'
        });
    });

    it('should normalize username, names, and email', async () => {
        const response = await request(app)
            .post('/api/user/su')
            .send({
                username: '  testuser  ',
                firstName: '  Test  ',
                lastName: '  User  ',
                email: '  TEST@EXAMPLE.COM  ',
                password: 'password123'
            });

        expect(response.statusCode).toBe(201);

        expect(response.body.user.username).toBe('testuser');
        expect(response.body.user.firstName).toBe('Test');
        expect(response.body.user.lastName).toBe('User');
        expect(response.body.user.email).toBe('test@example.com');
    });
});