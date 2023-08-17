import Module from "../module.mjs";
import Logging from "../log.mjs";

// Immediate module setup
let moduleName = 'IAmAModule';
let module = new Module(moduleName, exec);
let log = new Logging(moduleName);

// Ran when the module has been parsed and imported
async function exec() {
    log.info(`Hello from ${moduleName}!`);
};

export default module;
