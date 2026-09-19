const pinoHttp = require("pino-http");
const { randomUUID } = require("node:crypto");
const logger = require("./logger");

const requestLogger = pinoHttp({
    logger,

    genReqId: (req, res) => {
        const existingId = req.headers["x-request-id"];

        if (existingId) {
            return existingId;
        }

        const requestId = randomUUID();

        res.setHeader("X-Request-Id", requestId);

        return requestId;
    },

    customLogLevel: (req, res, error) => {
        if (error || res.statusCode >= 500) {
            return "error";
        }

        if (res.statusCode >= 400) {
            return "warn";
        }

        return "info";
    },

    customSuccessMessage: (req, res) => {
        return `${req.method} ${req.originalUrl} → ${res.statusCode}`;
    },

    customErrorMessage: (req, res) => {
        return `${req.method} ${req.originalUrl} → ${res.statusCode}`;
    },

    serializers: {
        req: pinoHttp.stdSerializers.req,
        res: pinoHttp.stdSerializers.res,
        err: pinoHttp.stdSerializers.err,
    },
});

module.exports = requestLogger;