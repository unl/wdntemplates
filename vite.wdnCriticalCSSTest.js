import { existsSync, writeFileSync } from 'fs';
import path from 'path';

export default function wdnCriticalCSSTest({ targets }) {
    return {
        name: 'WDN: Critical CSS Testing',
        apply: 'build',
        enforce: 'post',
        async closeBundle() {
            targets.forEach(targetFile => {
                const targetPath = path.resolve(targetFile);
                if (!existsSync(targetPath)) {
                    console.warn(`Target file not found: ${targetPath}`);
                    return;
                }

                writeFileSync(targetPath, '', 'utf-8');
            });
        },
    };
}
