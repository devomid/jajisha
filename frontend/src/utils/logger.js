const isDevelopment = __DEV__;

const colors = {
    reset: "\x1b[0m",

    debug: "\x1b[38;2;167;139;250m", // #A78BFA - soft purple
    info: "\x1b[38;2;0;87;250m",     // #0057FA - Jajisha nav blue
    warn: "\x1b[38;2;244;180;0m",    // #F4B400 - Jajisha gold
    error: "\x1b[38;2;248;113;113m", // #F87171 - soft coral red
};

const logger = {
    debug: (...args) => {
        if (isDevelopment) {
            console.debug(
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
        console.warn(
            `${colors.warn}[WARN]${colors.reset}`,
            ...args
        );
    },

    error: (...args) => {
        console.error(
            `${colors.error}[ERROR]${colors.reset}`,
            ...args
        );
    },
};

export default logger;