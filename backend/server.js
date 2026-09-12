const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config();

const requiredEnv = ["MONGOURI", "PORT", "SECRET_KEY", "CLIENT_ORIGIN"];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);

if (missingEnv.length > 0) {
    console.error(`Missing required environment variables: ${missingEnv.join(", ")}`);
    process.exit(1);
}

const mongoUrl = process.env.MONGOURI;
const portNumber = Number(process.env.PORT);

if (!Number.isInteger(portNumber) || portNumber < 1 || portNumber > 65535) {
    console.error("PORT must be a valid number between 1 and 65535");
    process.exit(1);
}

// shutdown
const shutdown = async (signal) => {
    console.log(`${signal} received. Shutting down...`);

    await mongoose.connection.close();

    process.exit(0);
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

// Database
mongoose.connection.on("error", (error) => {
    console.error("MongoDB connection error:", error);
});

mongoose.connect(mongoUrl)
    .then(() => {
        app.listen(portNumber, () => {
            console.log(`server running on port: ${portNumber}`);
            console.log('DB connection success!');
        });
    })
    .catch((error) => {
        console.error("Database connection failed:", error);
        process.exit(1);
    });