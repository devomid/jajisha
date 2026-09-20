const isDevelopment = __DEV__;

const colors = {
    reset: "\x1b[0m",

    debug: "\x1b[38;2;167;139;250m", // Soft purple
    info: "\x1b[38;2;0;87;250m",     // Jajisha blue
    warn: "\x1b[38;2;244;180;0m",    // Jajisha gold
    error: "\x1b[38;2;248;113;113m", // Soft coral
};

const logger = {
    debug: (...args) => {
        if (isDevelopment) {
            console.log(
                `${colors.debug}[DEBUG]${colors.reset}`,
                ...args
            );
        }
    },

    info: (...args) => {
        if (isDevelopment) {
            console.log(
                `${colors.info}[INFO]${colors.reset}`,
                ...args
            );
        }
    },

    warn: (...args) => {
        if (isDevelopment) {
            console.log(
                `${colors.warn}[WARN]${colors.reset}`,
                ...args
            );
        }
    },

    error: (...args) => {
        if (isDevelopment) {
            console.log(
                `${colors.error}[ERROR]${colors.reset}`,
                ...args
            );
        }
    },
};

export default logger;