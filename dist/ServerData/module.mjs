import Logging from "./log.mjs";
import * as fs from "node:fs";

// Create new modules

let log = new Logging('Modules');

class Module {
    constructor(name, func) {
        this.moduleName = name;
        if (typeof func !== 'function') {
            this.exec = () => {return null;}
        }
        this.exec = func;
        this.moduleData = getModuleData(this.moduleName);
    }
}

function getModuleData(modName) {
    if (typeof modName !== 'string') return null;
    let data = {};
    let dataPath = `./moduledata/${modName.toLowerCase()}.json`;
    try {
        if (fs.existsSync(dataPath)) data = JSON.parse(fs.readFileSync(dataPath));
        return data;
    } catch (err) {
        log.warn(`Could not import module data from '${dataPath}': ${err.stack}`);
        return data;
    }
}

export default Module;