const request = require('supertest');
const app = require('../app');

describe('POST /api/user/si', () => {
    const user = {
        username: 'signinuser',
        firstName: 'Sign',
        lastName: 'In',
        email: 'signin@example.com',
        password: 'password123'
    };

    beforeEach(async () => {
        await request(app)
            .post('/api/user/su')
            .send(user);
    });

    it('should sign in successfully with valid credentials', async () => {
        const response = await request(app)
            .post('/api/user/si')
            .send({
                email: user.email,
                password: user.password
            });

        expect(response.statusCode).toBe(200);

        expect(response.body.user).toBeDefined();
        expect(response.body.token).toBeDefined();

        expect(response.body.user.username).toBe(user.username);
        expect(response.body.user.firstName).toBe(user.firstName);
        expect(response.body.user.lastName).toBe(user.lastName);
        expect(response.body.user.email).toBe(user.email);

        expect(response.body.user.password).toBeUndefined();
        expect(response.body.password).toBeUndefined();

        expect(typeof response.body.token).toBe('string');
        expect(response.body.token.length).toBeGreaterThan(0);
    });

    it('should return 401 when the password is incorrect', async () => {
        const response = await request(app)
            .post('/api/user/si')
            .send({
                email: user.email,
                password: 'wrongpassword'
            });

        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({
            error: 'Invalid credentials.'
        });
    });

    it('should return 401 when the email does not exist', async () => {
        const response = await request(app)
            .post('/api/user/si')
            .send({
                email: 'unknown@example.com',
                password: user.password
            });

        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({
            error: 'Invalid credentials.'
        });
    });

    it('should return 400 when email is missing', async () => {
        const response = await request(app)
            .post('/api/user/si')
            .send({
                password: user.password
            });

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
            error: 'Email and password are required.'
        });
    });

    it('should return 400 when password is missing', async () => {
        const response = await request(app)
            .post('/api/user/si')
            .send({
                email: user.email
            });

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
            error: 'Email and password are required.'
        });
    });

    it('should return 400 when email is empty', async () => {
        const response = await request(app)
            .post('/api/user/si')
            .send({
                email: '',
                password: user.password
            });

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
            error: 'Email and password are required.'
        });
    });

    it('should return 400 when password is empty', async () => {
        const response = await request(app)
            .post('/api/user/si')
            .send({
                email: user.email,
                password: ''
            });

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
            error: 'Email and password are required.'
        });
    });

    it('should normalize the email when signing in', async () => {
        const response = await request(app)
            .post('/api/user/si')
            .send({
                email: '  SIGNIN@EXAMPLE.COM  ',
                password: user.password
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.user.email).toBe(user.email);
        expect(response.body.token).toBeDefined();
    });
});