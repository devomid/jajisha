describe("logger", () => {
    let logger;
    let logSpy;

    beforeEach(() => {
        jest.resetModules();

        process.env.NODE_ENV = "development";

        logSpy = jest
            .spyOn(console, "log")
            .mockImplementation(() => { });

        logger = require("../../src/utils/logger").default;
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("logs all levels in development", () => {
        logger.debug("debug message");
        logger.info("info message");
        logger.warn("warn message");
        logger.error("error message");

        expect(logSpy).toHaveBeenCalledTimes(4);
    });

    test("uses the correct log prefixes", () => {
        logger.debug("debug");
        logger.info("info");
        logger.warn("warn");
        logger.error("error");

        expect(logSpy.mock.calls[0][0]).toEqual(
            expect.stringContaining("[DEBUG]")
        );
        expect(logSpy.mock.calls[0][1]).toBe("debug");

        expect(logSpy.mock.calls[1][0]).toEqual(
            expect.stringContaining("[INFO]")
        );
        expect(logSpy.mock.calls[1][1]).toBe("info");

        expect(logSpy.mock.calls[2][0]).toEqual(
            expect.stringContaining("[WARN]")
        );
        expect(logSpy.mock.calls[2][1]).toBe("warn");

        expect(logSpy.mock.calls[3][0]).toEqual(
            expect.stringContaining("[ERROR]")
        );
        expect(logSpy.mock.calls[3][1]).toBe("error");
    });

    test("passes additional arguments to the console logger", () => {
        const data = {
            status: 500,
            error: "test",
        };

        logger.error("request failed", data);

        expect(logSpy).toHaveBeenCalledWith(
            expect.stringContaining("[ERROR]"),
            "request failed",
            data
        );
    });
});