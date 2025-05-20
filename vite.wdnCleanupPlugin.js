import { rm } from 'node:fs/promises';
import { resolve } from 'path';

const wdnCleanupPlugin = {
    name: 'Cleaning js and css folder',
    async buildStart() {
        // Delete js folder to remove old built files
        await rm(resolve(__dirname, './wdn/templates_6.0/js'), { recursive: true, force: true });

        // Delete css folder to remove old built files
        await rm(resolve(__dirname, './wdn/templates_6.0/css'), { recursive: true, force: true });

        // Delete asset folder to remove old built files
        await rm(resolve(__dirname, './wdn/templates_6.0/assets'), { recursive: true, force: true });
    },
};

export default wdnCleanupPlugin;
