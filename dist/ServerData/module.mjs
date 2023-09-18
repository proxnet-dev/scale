import Logging from "./log.mjs";
import * as fs from "node:fs";

let log = new Logging('Modules');

// Create new modules
class Module {
    /**
     * Create a module.
     * @param {string} modName Module name. Must be filesystem-friendly.
     * @param {function} exec Runs in the module scope after the module has been imported.
     * @returns type `Module`: Export this as the default.
     */
    constructor(modName, exec) {

        if (typeof modName !== 'string' && typeof modName !== 'number' && typeof modName !== 'boolean') {
            log.error('Cannot parse input for modName: is not a string, number, nor boolean');
            return;
        }
        this.moduleName = modName;

        if (typeof exec !== 'function') this.exec = () => {return null;}
        this.exec = exec;

        this.config = getModuleConfig(modName);
    }
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

function getModuleConfig(modname) {
    if (typeof modname !== 'string') return null;
    let data = {};
    let dataPath = `./moduleconfigs/${modname.toLowerCase()}.json`;
    try {
        if (fs.existsSync(dataPath)) data = JSON.parse(fs.readFileSync(dataPath));
        return data;
    } catch (err) {
        log.warn(`Could not import module data from '${dataPath}': ${err.stack}`);
        return data;
    }
}

export { generateRandomString };
export default Module;