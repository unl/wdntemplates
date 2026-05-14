import { rm, access } from 'node:fs/promises';
import { cpSync, existsSync } from 'node:fs';
import { resolve } from 'path';

const exists = (path) => access(path).then(() => true).catch(() => false);

const wdnCleanupPlugin = {
    name: 'WDN: Cleanup Files',
    enforce: 'pre',
    async buildStart() {
        const jsDir     = resolve(__dirname, './wdn/templates_6.1/js');
        const cssDir    = resolve(__dirname, './wdn/templates_6.1/css');
        const assetsDir = resolve(__dirname, './wdn/templates_6.1/assets');

        // Delete js folder to remove old built files
        if (await exists(jsDir)) {
            await rm(jsDir, { recursive: true });
        }

        // Delete css folder to remove old built files
        if (await exists(cssDir)) {
            await rm(cssDir, { recursive: true });
        }

        // Delete asset folder to remove old built files
        if (await exists(assetsDir)) {
            await rm(assetsDir, { recursive: true });
        }

        // Delete zipped files if they are there
        await rm(resolve(__dirname, './downloads/UNLTemplates_6.1.tar.gz'), { force: true });
        await rm(resolve(__dirname, './downloads/UNLTemplates_6.1.zip'),    { force: true });
        await rm(resolve(__dirname, './downloads/wdn_6.1.tar.gz'),          { force: true });
        await rm(resolve(__dirname, './downloads/wdn_6.1.zip'),             { force: true });
        await rm(resolve(__dirname, './downloads/wdn_includes_6.1.tar.gz'), { force: true });
        await rm(resolve(__dirname, './downloads/wdn_includes_6.1.zip'),    { force: true });
    },
    closeBundle() {
        const srcJs     = resolve(__dirname, './dist/wdn/templates_6.1/js');
        const srcCss    = resolve(__dirname, './dist/wdn/templates_6.1/css');
        const srcAssets = resolve(__dirname, './dist/wdn/templates_6.1/assets');

        // Copy files from dist to correct places in template_6.1
        if (existsSync(srcJs)) {
            cpSync(srcJs, resolve(__dirname, './wdn/templates_6.1/js'), { recursive: true, force: true });
        }
        if (existsSync(srcCss)) {
            cpSync(srcCss, resolve(__dirname, './wdn/templates_6.1/css'), { recursive: true, force: true });
        }
        if (existsSync(srcAssets)) {
            cpSync(srcAssets, resolve(__dirname, './wdn/templates_6.1/assets'), { recursive: true, force: true });
        }
    },
};

export default wdnCleanupPlugin;
