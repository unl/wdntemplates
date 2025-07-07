import { rm } from 'node:fs/promises';
import { cpSync } from 'node:fs';
import { resolve } from 'path';

const wdnCleanupPlugin = {
    name: 'WDN: Cleanup Files',
    enforce: 'pre',
    async buildStart() {
        // Delete js folder to remove old built files
        await rm(resolve(__dirname, './wdn/templates_6.0/js'), { recursive: true, force: true });

        // Delete css folder to remove old built files
        await rm(resolve(__dirname, './wdn/templates_6.0/css'), { recursive: true, force: true });

        // Delete asset folder to remove old built files
        await rm(resolve(__dirname, './wdn/templates_6.0/assets'), { recursive: true, force: true });

        // Delete zipped files if they are there
        await rm(resolve(__dirname, './downloads/UNLTemplates.tar.gz'), { force: true });
        await rm(resolve(__dirname, './downloads/UNLTemplates.zip'), { force: true });
        await rm(resolve(__dirname, './downloads/wdn.tar.gz'), { force: true });
        await rm(resolve(__dirname, './downloads/wdn.zip'), { force: true });
        await rm(resolve(__dirname, './downloads/wdn_includes.tar.gz'), { force: true });
        await rm(resolve(__dirname, './downloads/wdn_includes.zip'), { force: true });
    },
    closeBundle() {
        // Copy files from dist to correct places in template_6.0
        cpSync(resolve(__dirname, './dist/wdn/templates_6.0/js'), resolve(__dirname, './wdn/templates_6.0/js'), {recursive: true, force: true});
        cpSync(resolve(__dirname, './dist/wdn/templates_6.0/css'), resolve(__dirname, './wdn/templates_6.0/css'), {recursive: true, force: true});
        cpSync(resolve(__dirname, './dist/wdn/templates_6.0/assets'), resolve(__dirname, './wdn/templates_6.0/assets'), {recursive: true, force: true});
    },
};

export default wdnCleanupPlugin;
