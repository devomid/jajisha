const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const requestLogger = require("./logger/requestLogger");
const toiletRoutes = require('./routes/toiletRoutes');
const userRoutes = require('./routes/userRoutes');
const managmentRoutes = require('./routes/managmentRoutes');
const dotenv = require('dotenv');
const logger = require("./logger/logger");

dotenv.config()

// configs and middlwares
const app = express();
app.use(requestLogger);
app.use(express.json({ limit: "1mb" }));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_ORIGIN,
    methods: ['GET', 'POST', 'DELETE', 'PATCH'],
}));
logger.info("Application middleware configured");

//health check
app.get("/health", (req, res) => {
    logger.info({
        requestId: req.id,
    }, "Health check called: returning OK");

    res.status(200).json({ status: "ok" });
});
//routes
app.use("/api/toilets", toiletRoutes);
app.use("/api/user", userRoutes);
app.use("/api/managment", managmentRoutes);
logger.info("Application routes configured");


// 404 handler
app.use((req, res) => {
    logger.warn({
        requestId: req.id,
        method: req.method,
        url: req.originalUrl,
        userId: req.user?._id?.toString(),
    },"Invalid route has been called.");
    res.status(404).json({ error: "Route not found", });
});


// error handler
app.use((err, req, res, next) => {
    logger.error({
        err,
        requestId: req.id,
        method: req.method,
        url: req.originalUrl,
        userId: req.user?._id?.toString(),
    }, "Unhandled server error.");
    res.status(500).json({ error: "Internal server error", });
});


module.exports = app;