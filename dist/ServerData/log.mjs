import chalk from "chalk";
import { config } from "./index.mjs";

class Logging {

    /**
     * @param {string} mod Module idenfitier. Used in every line to identify the module that sent the message.
     * @param {boolean} silentInst Set to false to log a message when the logger instantiates. Useful for debugging.
     * @returns A source for logging messages to the console. Functions for info, warnings, errors, debug statements, and network events are provided and have shorthands.
     */
    constructor(mod, silentInst) {
        if (!mod) {
            this.moduleName = generateRandomString(12);
            this.warn(`Logging instantiated without a module identifier, using random string`);
        } else if (typeof mod !== 'string') {
            this.moduleName = generateRandomString(12);
            this.warn(`Logging instantiated with a non-string module identifier, using random string`);
        } else {
            this.moduleName = mod;
            if (silentInst == false) this.info(`Instantiated module logging for ${mod}`);
        }

        // logging type shorthand
        this.i = this.info;
        this.w = this.warn;
        this.e = this.error;
        this.d = this.debug;
        this.n = this.network;
        this.err = this.error;
        this.net = this.network;
    }

    async info(msg) {
        let msgFormat = chalk.gray(getFormattedDate()) + chalk.bgWhite.black(`${this.moduleName} [INFO]`) + chalk.whiteBright(' ' + msg);
        console.log(msgFormat);
    }

    async warn(msg) {
        console.warn(chalk.gray(getFormattedDate()) + chalk.bgYellow.black(`${this.moduleName} [WARN]`) + chalk.yellowBright(' ' + msg));
    }
    
    async error(msg) {
        console.error(chalk.gray(getFormattedDate()) + chalk.bgRed.black(`${this.moduleName} [ERROR]`) + chalk.redBright(' ' + msg));
    }

    async debug(msg) {
        if (arguments.length !== 1) console.error(chalk.gray(getFormattedDate()) + chalk.bgGreen.black(`${this.moduleName} [DEBUG]`) + chalk.greenBright(' ' + coerce(arguments)));
        else console.error(chalk.gray(getFormattedDate()) + chalk.bgGreen.black(`${this.moduleName} [DEBUG]`) + chalk.greenBright(' ' + msg));
    }

    async network(msg) {
        console.error(chalk.gray(getFormattedDate()) + chalk.bgCyan.black(`${this.moduleName} [NETWORK]`) + chalk.cyanBright(' ' + msg));
    }

}

function getFormattedDate() {
    const date = new Date();
  
    const options = {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZone: config.timezone,
        timeZoneName: 'short'
    };

    return date.toLocaleString('en-US', options).replace(',', '') + ' ';
}

function coerce(inArgs) {
    let constructedMsg = "";
    let args = Array.from(inArgs);
    args.forEach((val) => {
        if (typeof val == 'function' || typeof val == 'object') return;
        else constructedMsg = constructedMsg + `${val} `;
    });
    return constructedMsg;
}

function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
  
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters.charAt(randomIndex);
    }
  
    return randomString;
}

export { generateRandomString };
export default Logging;