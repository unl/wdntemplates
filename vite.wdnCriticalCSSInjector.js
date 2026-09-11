import { existsSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';

export default function wdnCriticalCSSInjector({ cssFile, targets }) {
    return {
        name: 'WDN: Critical CSS Injector',
        apply: 'build',
        enforce: 'post',
        async closeBundle() {
            const cssPath = path.resolve(cssFile);
            if (!existsSync(cssPath)) {
                console.warn(`CSS file not found: ${cssPath}`);
                return;
            }

            const css = readFileSync(cssPath, 'utf-8');
            const wrappedCss = `<style id="unl-critical-css">${css}</style>`;

            targets.forEach(targetFile => {
                const targetPath = path.resolve(targetFile);
                if (!existsSync(targetPath)) {
                    console.warn(`Target file not found: ${targetPath}`);
                    return;
                }

                const criticalCssRegex = new RegExp('<style id="unl-critical-css">[^<]*</style>');
                const content = readFileSync(targetPath, 'utf-8');
                const updated = content.replace(criticalCssRegex, wrappedCss);
                writeFileSync(targetPath, updated, 'utf-8');
            });
        },
    };
}
