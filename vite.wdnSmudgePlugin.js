// vitePluginFilterSmudge.js
import fs from 'fs';
import path from 'path';
import { smudge, _startSmudge } from './.git_filters/lib/git-filters.js'; // adjust path as needed

const VALID_EXTENSIONS = ['.html', '.twig', '.php', '.jsp', '.dwt'];

function getAllFiles(dirPath) {
    let files = [];
    for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
        const fullPath = path.join(dirPath, entry.name);
        if (entry.isDirectory()) {
            files = files.concat(getAllFiles(fullPath));
        } else if (
            entry.isFile() &&
            VALID_EXTENSIONS.includes(path.extname(entry.name))
        ) {
            files.push(fullPath);
        }
    }
    return files;
}

export default function wdnSmudgePlugin({ dirs = [] } = {}) {
    return {
        name: 'WDN: Smudge',
        apply: 'build',
        buildStart() {
            const root = process.cwd();
            dirs.forEach(dir => {
                const fullDir = path.resolve(root, dir);
                const files = getAllFiles(fullDir);
                for (const file of files) {
                    _startSmudge(file);
                    const content = fs.readFileSync(file, 'utf8');
                    const result = smudge(content, true);
                    fs.writeFileSync(file, result, 'utf8');
                }
            });
        },
    };
}
