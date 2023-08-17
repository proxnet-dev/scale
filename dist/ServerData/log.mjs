import chalk from "chalk";

class Logging {

    constructor(mod, silentInst) {
        if (!mod) {
            this.moduleNameRaw = 'Unknown';
            this.moduleNamePadded = '';
            this.warn(`Logging instantiated without a module identifier`);
        } else {
            this.moduleNameRaw = mod;
            this.moduleNamePadded = mod + ' ';
            if (silentInst) this.info(`Instantiated module logging for ${this.moduleNameRaw}`);
        }
    }

    async info(msg) {
        let msgFormat = chalk.gray(getFormattedDate()) + chalk.bgWhite.black(`${this.moduleNamePadded}[INFO]`) + chalk.whiteBright(' ' + msg);
        console.log(msgFormat);
    }

    async warn(msg) {
        console.warn(chalk.gray(getFormattedDate()) + chalk.bgYellow.black(`${this.moduleNamePadded}[WARN]`) + chalk.yellowBright(' ' + msg));
    }
    
    async error(msg) {
        console.error(chalk.gray(getFormattedDate()) + chalk.bgRed.black(`${this.moduleNamePadded}[ERROR]`) + chalk.redBright(' ' + msg));
    }

    async debug(msg) {
        if (arguments.length !== 1) console.error(chalk.gray(getFormattedDate()) + chalk.bgGreen.black(`${this.moduleNamePadded}[DEBUG]`) + chalk.greenBright(' ' + coerce(arguments)));
        else console.error(chalk.gray(getFormattedDate()) + chalk.bgGreen.black(`${this.moduleNamePadded}[DEBUG]`) + chalk.greenBright(' ' + msg));
    }

    async network(msg) {
        console.error(chalk.gray(getFormattedDate()) + chalk.bgCyan.black(`${this.moduleNamePadded}[NETWORK]`) + chalk.cyanBright(' ' + msg));
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
        timeZone: 'America/New_York',
        timeZoneName: 'short'
    };

    return date.toLocaleString('en-US', options).replace(',', '') + ' ';
}

function coerce(inArgs) {
    let constructedMsg = new String;
    let args = Array.from(inArgs);
    args.forEach((value, i, array) => {
        if (typeof value == 'function' || typeof value == 'object') return;
        else constructedMsg = constructedMsg + `${value} `;
    });
    return constructedMsg;
}

export default Logging;