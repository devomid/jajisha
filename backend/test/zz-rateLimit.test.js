const request = require('supertest');
const app = require('../app');

describe('Authentication rate limiting', () => {
    it('should return 429 after too many authentication attempts', async () => {
        let response;

        for (let i = 0; i < 21; i++) {
            response = await request(app)
                .post('/api/user/si')
                .send({
                    email: 'ratelimit@example.com',
                    password: 'wrongpassword'
                });
        }

        expect(response.statusCode).toBe(429);
        expect(response.body).toEqual({
            error: 'Too many authentication attempts. Please try again later.'
        });
    }, 15000);
});