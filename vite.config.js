import { resolve } from 'path'
import { rm } from 'node:fs/promises'
import { defineConfig } from 'vite';
import sassGlobImports from 'vite-plugin-sass-glob-import';

export default defineConfig({
    build: {
        // outDir needs to be `.` or else built url paths will be missing wdn/templates_6.0
        outDir: '.',

        // We are using library mode to keep the ES module exports in the final built code
        lib: {
            // entry contains all the input files
            // This would include plugin auto loader, plugins, components, and SCSS files
            // Key is built file path, Value is path to file
            entry: {
                'auto_loader' : 'wdn/templates_6.0/js-src/plugin_auto_loader.js',

                'plugins/tabs' : 'wdn/templates_6.0/js-src/plugins/tabs.js',
                'plugins/toggle_buttons' : 'wdn/templates_6.0/js-src/plugins/toggle_buttons.js',

                'components/tabs' : 'wdn/templates_6.0/js-src/components/wdn_tab.js',
                'components/toggle_buttons' : 'wdn/templates_6.0/js-src/components/wdn_toggle_button.js',

                // We don't need css/main since the assetFileNames will add the css directory
                'critical' : 'wdn/templates_6.0/scss/critical.scss',
                'main' : 'wdn/templates_6.0/scss/main.scss',
            },

            // We are building for ES modules
            formats: ['es'],
        },

        // These are additional options defined to adjust the final built code
        // Do not include leading slash on file paths
        rollupOptions: {
            output: {
                // These are definitions for folder/file paths for all the other files found during build
                assetFileNames: (assetInfo) => {
                    let extType = assetInfo.names[0] ?? 'undefined';
                    if (/png|jpe?g|svg|gif|tiff|bmp|ico|avif|webp/i.test(extType)) {
                        return 'wdn/templates_6.0/assets/images/[name][extname]';
                    }
                    if (/mp4|mov/i.test(extType)) {
                        return 'wdn/templates_6.0/assets/videos/[name][extname]';
                    }
                    if (/mp3/i.test(extType)) {
                        return 'wdn/templates_6.0/assets/audio/[name][extname]';
                    }
                    if (/woff/i.test(extType) || /woff2/i.test(extType)) {
                        return 'wdn/templates_6.0/assets/fonts/[name][extname]';
                    }
                    if (/css/i.test(extType) || /scss/i.test(extType)) {
                        //TODO: might be able to look at originalFileNames to determine folder structure
                        return 'wdn/templates_6.0/css/[name].css';
                    }
                    if (/js/i.test(extType)) {
                        return 'wdn/templates_6.0/js/[name].js';
                    }
                    return `wdn/templates_6.0/assets/${extType}/[name][extname]`;
                },

                // chunkFileNames is for the shared files it finds which are not defined in the entry point
                chunkFileNames: 'wdn/templates_6.0/js/chunk/[name].js',

                // entryFileNames are the files defined in the lib.entry above
                entryFileNames: 'wdn/templates_6.0/js/[name].js',
            }
        },
        // If emptyOutDir is set to true it deletes everything
        emptyOutDir: false,
        // We want js source maps but inline ones are slow for production
        sourcemap: true,
        // This will preserve css file names and build them as individual files
        cssCodeSplit: true,
    },
    plugins: [
        {
            name: "Cleaning js and css folder",
            async buildStart() {
                // Delete js folder to remove old built files
                await rm(resolve(__dirname, './wdn/templates_6.0/js'), { recursive: true, force: true });
                // Delete css folder to remove old built files
                await rm(resolve(__dirname, './wdn/templates_6.0/css'), { recursive: true, force: true });
                // Delete asset folder to remove old built files
                await rm(resolve(__dirname, './wdn/templates_6.0/assets'), { recursive: true, force: true });
            }
        },
        // SCSS glob imports like `**/*` in scss files
        sassGlobImports()
    ],
    // resolve.alias will replace the `@js-src` with the path before building
    resolve: {
        alias: {
            "@js-src": "/wdn/templates_6.0/js-src",
            "@scss": "/wdn/templates_6.0/scss",
            "@fonts": "/wdn/templates_6.0/fonts",
            "@images": "/wdn/templates_6.0/fonts",
            "@dcf": "/node_modules/dcf",
        },
    },
});