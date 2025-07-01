import fs from 'fs';
import path from 'path';

export default function wdnCriticalCSSInjector({ cssFile, targets }) {
    return {
        name: 'WDN: Critical CSS Injector',
        apply: 'build',
        closeBundle() {
            const cssPath = path.resolve(cssFile);
            if (!fs.existsSync(cssPath)) {
                console.warn(`CSS file not found: ${cssPath}`);
                return;
            }

            const css = fs.readFileSync(cssPath, 'utf-8');
            const wrappedCss = `<style id="unl-critical-css">${css}</style>`;

            targets.forEach(targetFile => {
                const targetPath = path.resolve(targetFile);
                if (!fs.existsSync(targetPath)) {
                    console.warn(`Target file not found: ${targetPath}`);
                    return;
                }

                const criticalCssRegex = new RegExp('<style id="unl-critical-css">[^<]*</style>');
                const content = fs.readFileSync(targetPath, 'utf-8');
                const updated = content.replace(criticalCssRegex, wrappedCss);
                fs.writeFileSync(targetPath, updated, 'utf-8');
            });
        },
    };
}
