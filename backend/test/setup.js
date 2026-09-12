const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.test' });

beforeAll(async () => {
    await mongoose.connect(process.env.MONGOURI);
});

afterEach(async () => {
    const collections = mongoose.connection.collections;

    for (const key of Object.keys(collections)) {
        await collections[key].deleteMany({});
    }
});

afterAll(async () => {
    await mongoose.connection.close();
});