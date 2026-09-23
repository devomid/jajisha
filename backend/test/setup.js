const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authLimiter = require('../middlewares/signLimiter');

dotenv.config({
    path: '.env.test',
    quiet: true,
});

beforeAll(async () => {
    await mongoose.connect(process.env.MONGOURI);
});

afterEach(async () => {
    const collections = mongoose.connection.collections;

    for (const key of Object.keys(collections)) {
        await collections[key].deleteMany({});
    }

    authLimiter.resetKey('::ffff:127.0.0.1');
});

afterAll(async () => {
    await mongoose.connection.close();
});