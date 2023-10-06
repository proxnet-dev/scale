import Module from "scale-modules";
import Logging from "scale-logging";

// Immediate module setup
let moduleName = 'Example';
let module = new Module(moduleName, exec);
let log = new Logging(moduleName);

// Ran when the module has been parsed and imported
function exec() {
    
    log.i(`Hello from ${moduleName}!`);

};

export default module;