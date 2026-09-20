const isDevelopment = __DEV__;

const logger = {
    debug: (...args) => {
        if (isDevelopment) {
            console.debug("[DEBUG]", ...args);
        }
    },

    info: (...args) => {
        if (isDevelopment) {
            console.log("[INFO]", ...args);
        }
    },

    warn: (...args) => {
        console.warn("[WARN]", ...args);
    },

    error: (...args) => {
        console.error("[ERROR]", ...args);
    },
};

export default logger;