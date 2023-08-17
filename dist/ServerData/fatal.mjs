import * as fs from 'node:fs';

const pathsToCheck = ['./modules', './moduledata'];
let falsePaths = [];

for (let i = 0; i < pathsToCheck.length; i++) {
    if (!fs.existsSync(pathsToCheck[i])) {falsePaths.push(pathsToCheck[i]);}
}

export { falsePaths };