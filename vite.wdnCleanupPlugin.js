import { rm, access } from 'node:fs/promises';
import { cpSync, existsSync } from 'node:fs';
import { resolve } from 'path';

const exists = (path) => access(path).then(() => true).catch(() => false);

const wdnCleanupPlugin = {
    name: 'WDN: Cleanup Files',
    enforce: 'pre',
    async buildStart() {
        const jsDir     = resolve(import.meta.dirname, './wdn/templates_6.1/js');
        const cssDir    = resolve(import.meta.dirname, './wdn/templates_6.1/css');
        const assetsDir = resolve(import.meta.dirname, './wdn/templates_6.1/assets');

        // Delete js folder to remove old built files
        if (await exists(jsDir)) {
            await rm(jsDir, { recursive: true, force: true });
        }

        // Delete css folder to remove old built files
        if (await exists(cssDir)) {
            await rm(cssDir, { recursive: true, force: true });
        }

        // Delete asset folder to remove old built files
        if (await exists(assetsDir)) {
            await rm(assetsDir, { recursive: true, force: true });
        }

        // Delete zipped files if they are there
        await rm(resolve(import.meta.dirname, './downloads/UNLTemplates_6.1.tar.gz'), { force: true });
        await rm(resolve(import.meta.dirname, './downloads/UNLTemplates_6.1.zip'),    { force: true });
        await rm(resolve(import.meta.dirname, './downloads/wdn_6.1.tar.gz'),          { force: true });
        await rm(resolve(import.meta.dirname, './downloads/wdn_6.1.zip'),             { force: true });
        await rm(resolve(import.meta.dirname, './downloads/wdn_includes_6.1.tar.gz'), { force: true });
        await rm(resolve(import.meta.dirname, './downloads/wdn_includes_6.1.zip'),    { force: true });
    },
    closeBundle() {
        const srcJs     = resolve(import.meta.dirname, './dist/wdn/templates_6.1/js');
        const srcCss    = resolve(import.meta.dirname, './dist/wdn/templates_6.1/css');
        const srcAssets = resolve(import.meta.dirname, './dist/wdn/templates_6.1/assets');

        // Copy files from dist to correct places in template_6.1
        if (existsSync(srcJs)) {
            cpSync(srcJs, resolve(import.meta.dirname, './wdn/templates_6.1/js'), { recursive: true, force: true });
        }
        if (existsSync(srcCss)) {
            cpSync(srcCss, resolve(import.meta.dirname, './wdn/templates_6.1/css'), { recursive: true, force: true });
        }
        if (existsSync(srcAssets)) {
            cpSync(srcAssets, resolve(import.meta.dirname, './wdn/templates_6.1/assets'), { recursive: true, force: true });
        }
    },
};

export default wdnCleanupPlugin;
