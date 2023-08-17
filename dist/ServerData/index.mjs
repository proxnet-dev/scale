import events from "node:events";
import * as fs from "node:fs"

import { falsePaths } from "./fatal.mjs";

import Logging from "./log.mjs";
let moduleName = 'Main'
let log = new Logging(moduleName, true);

let event = new events.EventEmitter();

// Validate config path
let configPath = process.argv[2];
if (configPath == undefined) {
    log.error('Cannot start up: Path to configuration was not specified. Exiting.');
    process.exit(1);
}
if (!fs.existsSync(configPath)) {
    log.error(`Cannot start up: Specified configuration at ${configPath} does not exist. Exiting.`);
    process.exit(1);
}
// Try to import the config
let config;
try {
    config = JSON.parse(fs.readFileSync(configPath)); // we can synchronous during startup
} catch (err) { // JSON is not valid, file could not be read, etc
    log.error(`Cannot start up: The specified configuration at ${configPath} could not be read.\n ${err.stack}`);
    process.exit(1);
}

if (!falsePaths.length == 0) {
    log.error(`Cannot start up: Required directories do not exist. Expected directories: ${JSON.stringify(falsePaths)}`);
    process.exit(1);
}
// there *shouldn't* be anything in the event loop.

if (config.clearConsoleOnStartup === true) {
    console.clear();
}

let versionString;
try {
    versionString = JSON.parse(fs.readFileSync('./../../package.json')).version;
} catch (err) {
    log.error(`Could not get package version:\n${err.stack}`);
    versionString = '(could not get version string)';
}
let packageName;
try {
    packageName = JSON.parse(fs.readFileSync('./../../package.json')).name;
} catch (err) {
    log.error(`Could not get package name:\n${err.stack}`);
    packageName = '(unknown package)';
}

log.info(`Starting ${packageName} v${versionString}`);
log.info(`CWD: ${process.cwd()}`);

// Import modules and execute the thangs
let path = './modules/';
fs.readdir(path, (err, files) => {

    if (err) {
        log.error(`Cannot start up: Could not list files in '${path}'.\n ${err.stack}`);
        return;
    }
    if (files.length == 0) {
        log.warn(`No files were found in '${path}'. Nothing to do.`);
        return;
    }

    let validFiles = [];
    files.forEach((value, i, array) => {
        if (value.endsWith('.mjs')) validFiles.push(value); // If it's a valid module, push it to the array
    });
    log.info(`Importing files ${JSON.stringify(validFiles)} from '${path}'`);

    validFiles.forEach(async (value, i, array) => {

        let modTempObject = await import(path + value);

        // Invalid module checks
        if (typeof modTempObject.default == 'undefined') {
            log.warn(`Module ${value} does not contain a default export, skipping.`);
            return;
        }
        if (typeof modTempObject.default.moduleName == 'undefined') {
            log.warn(`Module ${value} does not export the default property 'moduleName', skipping.`);
            return;
        }
        const tempModuleName = modTempObject.default.moduleName;

        if (typeof modTempObject !== 'object') {
            log.warn(`Default export for module ${tempModuleName} (${value}) has a non-standard type.`);
        } else {
            if (typeof modTempObject.default.exec == 'undefined') {
                log.warn(`Module ${tempModuleName} (${value}) does not export the default function 'exec'.`);
            } else {
                try {
                    modTempObject.default.exec(); // Call the module default execution function. Can be either asynchronous or synchronous.
                } catch (err) {
                    log.error(`Module ${tempModuleName} (${value}) crashed. Stack:\n${err.stack}`); // This is called only for synchronous execution functions. Async functions will kill the process.
                }
                
                if (i + 1 == array.length) {event.emit('post');} // After all modules have been executed
            }
        }
    
    });
});

export { config, event, versionString };