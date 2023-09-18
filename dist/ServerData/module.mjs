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

function getModuleConfig(modName) {
    if (typeof modName !== 'string') return null;
    let data = {};
    let dataPath = `./moduleconfigs/${modName.toLowerCase()}.json`;
    try {
        if (fs.existsSync(dataPath)) data = JSON.parse(fs.readFileSync(dataPath));
        return data;
    } catch (err) {
        log.warn(`Could not import module data from '${dataPath}': ${err.stack}`);
        return data;
    }
}

export default Module;