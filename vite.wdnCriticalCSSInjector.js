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

                const criticalCssRegex = /<style id="unl-critical-css">[\s\S]*?<\/style>/;

                const content = readFileSync(targetPath, 'utf-8');

                if (!criticalCssRegex.test(content)) {
                    console.warn(`Critical CSS marker not found: ${targetPath}`);
                    return;
                }

                const updated = content.replace(criticalCssRegex, wrappedCss);

                writeFileSync(targetPath, updated, 'utf-8');
            });
        },
    };
}
