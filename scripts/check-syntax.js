const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const sourceRoot = path.join(__dirname, '..', 'src');

function javascriptFiles(directory) {
    return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const entryPath = path.join(directory, entry.name);

        if (entry.isDirectory()) {
            if (entry.name === 'vendor') {
                return [];
            }
            return javascriptFiles(entryPath);
        }

        return entry.name.endsWith('.js') ? [entryPath] : [];
    });
}

for (const file of javascriptFiles(sourceRoot)) {
    execFileSync(process.execPath, ['--check', file], { stdio: 'inherit' });
}

console.log('JavaScript syntax check passed.');