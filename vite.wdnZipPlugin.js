import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const run = promisify(exec);

export default function wdnZipPlugin(tasks = []) {
    return {
        name: 'WDN: Zip',
        closeBundle: async() => {
            for (const { name, dir, outDir = 'downloads' } of tasks) {
                const zipPath = path.resolve(outDir, `${name}.zip`);
                const tarPath = path.resolve(outDir, `${name}.tar.gz`);
                const dirPath = path.relative(process.cwd(), dir);

                await run(`mkdir -p ${outDir}`);

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
