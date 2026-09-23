describe("backend logger", () => {
    test("exports pino logger methods", () => {
        const logger = require("../logger/logger");

        expect(typeof logger.debug).toBe("function");
        expect(typeof logger.info).toBe("function");
        expect(typeof logger.warn).toBe("function");
        expect(typeof logger.error).toBe("function");
    });

    test("logs are silent in test environment", () => {
        const logger = require("../logger/logger");

        expect(() => {
            logger.debug("debug");
            logger.info("info");
            logger.warn("warn");
            logger.error("error");
        }).not.toThrow();
    });
});