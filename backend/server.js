const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const passport = require('passport');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const toiletRoutes = require('./routes/toiletRoutes');
const userRoutes = require('./routes/userRoutes');
const managmentRoutes = require('./routes/managmentRoutes');


dotenv.config()
const mongoUrl = process.env.MONGOURI;
const portNumber = process.env.PORT;

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


//shutdown
const shutdown = async (signal) => {
    console.log(`${signal} received. Shutting down...`);

    await mongoose.connection.close();

    process.exit(0);
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));



// DataBase
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