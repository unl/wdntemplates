import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises';

const run = promisify(exec);

// Filenames/dirnames to strip out before packaging.
const UNWANTED_NAMES = [
    '.DS_Store',
];

async function cleanUnwantedFiles(dir) {
    let entries;
    try {
        entries = await fs.readdir(dir, { withFileTypes: true });
    } catch (err) {
        if (err.code === 'ENOENT') {
            return;
        }
        throw err;
    }

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (UNWANTED_NAMES.includes(entry.name)) {
            await fs.rm(fullPath, { recursive: true, force: true });
            console.log(`Removed ${fullPath}`);
            continue;
        }

        if (entry.isDirectory()) {
            await cleanUnwantedFiles(fullPath);
        }
    }
}

export default function wdnZipPlugin(tasks = []) {
    return {
        name: 'WDN: Zip',
        closeBundle: async() => {
            for (const { name, dir, outDir = 'downloads' } of tasks) {
                const zipPath = path.resolve(outDir, `${name}.zip`);
                const tarPath = path.resolve(outDir, `${name}.tar.gz`);
                const dirPath = path.relative(process.cwd(), dir);

                await run(`mkdir -p ${outDir}`);

                // Strip out junk files before packaging
                await cleanUnwantedFiles(dirPath);

                // Create .zip
                await run(`zip -r ${zipPath} ${dirPath}`);
                console.log(`Created ${zipPath}`);

                // Create .tar.gz
                await run(`tar -czf ${tarPath} ${dirPath}`);
                console.log(`Created ${tarPath}`);
            }
        },
    };
}
