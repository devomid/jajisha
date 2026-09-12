const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const toiletRoutes = require('./routes/toiletRoutes');
const userRoutes = require('./routes/userRoutes');
const managmentRoutes = require('./routes/managmentRoutes');
const dotenv = require('dotenv');



dotenv.config()



// configs and middlwares
const app = express();
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

//health check
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" })
});

//routes
app.use("/api/toilets", toiletRoutes);
app.use("/api/user", userRoutes);
app.use("/api/managment", managmentRoutes);


// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: "Route not found", });
});


// error handler
app.use((err, req, res, next) => {
    console.error("Unhandled server error:", err);
    res.status(500).json({ error: "Internal server error", });
});


module.exports = app;