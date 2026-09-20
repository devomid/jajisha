const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config();

const requiredEnv = ["MONGOURI", "PORT", "SECRET_KEY", "CLIENT_ORIGIN"];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);

if (missingEnv.length > 0) {
    logger.warn({
        missingEnv: missingEnv.join(", "),
    }, "some env variable are magically lost");
    process.exit(1);
}

const mongoUrl = process.env.MONGOURI;
const portNumber = Number(process.env.PORT);

if (!Number.isInteger(portNumber) || portNumber < 1 || portNumber > 65535) {
    logger.warn("port number is not valid");
    process.exit(1);
}

// shutdown
const shutdown = async (signal) => {
    logger.info({
        signal: signal.toString(),
    }, "recieved shut down signal. connection going to be closed");
    await mongoose.connection.close();
    process.exit(0);
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

// Database
mongoose.connection.on("error", (error) => {
    logger.error({
        err: error,
    }, "MongoDB connection error");

});

mongoose.connect(mongoUrl)
    .then(() => {
        app.listen(portNumber, () => {
            logger.info("DB connection success!");
            console.log(`server running on port: ${portNumber}`);
            console.log('DB connection success!');
        });
    })
    .catch((error) => {
        logger.error({
            err: error,
        }, "Databse connection failed");
        process.exit(1);
    });