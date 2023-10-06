import * as fs from "node:fs"

import Logging from "scale-logging";
import { DynamicImport } from "scale-modules";

// Validate config path
let configPath = process.argv[2];
if (configPath == undefined) {
    console.error('Cannot start up: Path to configuration was not specified. Exiting.');
    process.exit(1);
}
if (!fs.existsSync(configPath)) {
    console.error(`Cannot start up: Specified configuration at ${configPath} does not exist. Exiting.`);
    process.exit(1);
}
// Try to import the config
let config;
try {
    config = JSON.parse(fs.readFileSync(configPath)); // we can synchronous during startup
} catch (err) { // JSON is not valid, file could not be read, etc
    console.error(`Cannot start up: The specified configuration at ${configPath} could not be read.\n ${err.stack}`);
    process.exit(1);
} // there *shouldn't* be anything in the event loop.

let moduleName = 'Main';

process.env.TZ = config.timezone;
let log = new Logging(moduleName, true);

// Create default module directories
config.requiredDirectories.forEach((val, i) => {
    if (!fs.existsSync(config.requiredDirectories[i])) fs.mkdirSync(config.requiredDirectories[i]);
});

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

log.i(`CWD: ${process.cwd()}`);
log.i(`Starting ${packageName} v${versionString}`);

// Import modules and start up
new DynamicImport('./modules/');

export { config, versionString };