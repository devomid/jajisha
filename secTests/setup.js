const mongoose = require("../backend/node_modules/mongoose");
const dotenv = require("../backend/node_modules/dotenv");

dotenv.config({
    path: "../backend/.env.test",
    quiet: true,
});

jest.setTimeout(30000);

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