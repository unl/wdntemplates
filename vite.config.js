import { resolve } from 'path'
import { rm } from 'node:fs/promises'
import { defineConfig } from 'vite';

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

                'plugins/tab' : 'wdn/templates_6.0/js-src/plugins/tab.js',
                'plugins/toggle_button' : 'wdn/templates_6.0/js-src/plugins/toggle_button.js',
                'plugins/collapsible_fieldset' : 'wdn/templates_6.0/js-src/plugins/collapsible_fieldset.js',
                'plugins/figcaption_toggle' : 'wdn/templates_6.0/js-src/plugins/figcaption_toggle.js',
                'plugins/notice' : 'wdn/templates_6.0/js-src/plugins/notice.js',
                'plugins/datepicker' : 'wdn/templates_6.0/js-src/plugins/datepicker.js',
                'plugins/autoplay_video' : 'wdn/templates_6.0/js-src/plugins/autoplay_video.js',
                'plugins/pagination' : 'wdn/templates_6.0/js-src/plugins/pagination.js',
                'plugins/slideshow' : 'wdn/templates_6.0/js-src/plugins/slideshow.js',

                'components/tab' : 'wdn/templates_6.0/js-src/components/wdn_tab.js',
                'components/toggle_button' : 'wdn/templates_6.0/js-src/components/wdn_toggle_button.js',
                'components/collapsible_fieldset' : 'wdn/templates_6.0/js-src/components/wdn_collapsible_fieldset.js',
                'components/figcaption_toggle' : 'wdn/templates_6.0/js-src/components/wdn_figcaption_toggle.js',
                'components/notice' : 'wdn/templates_6.0/js-src/components/wdn_notice.js',
                'components/datepicker' : 'wdn/templates_6.0/js-src/components/wdn_datepicker.js',
                'components/autoplay_video' : 'wdn/templates_6.0/js-src/components/wdn_autoplay_video.js',
                'components/pagination' : 'wdn/templates_6.0/js-src/components/wdn_pagination.js',
                'components/slideshow' : 'wdn/templates_6.0/js-src/components/wdn_slideshow.js',

                // We don't need 'css/main' as key since the assetFileNames will add the css directory
                'affiliate' : 'wdn/templates_6.0/scss/affiliate.scss',
                'critical' : 'wdn/templates_6.0/scss/critical.scss',
                'deprecated-4x' : 'wdn/templates_6.0/scss/deprecated-4x.scss',
                'deprecated-5x' : 'wdn/templates_6.0/scss/deprecated-5x.scss',
                'main' : 'wdn/templates_6.0/scss/main.scss',
                'print' : 'wdn/templates_6.0/scss/print.scss',
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
                    if (/png|jpe?g|svg|gif|avif|webp/i.test(extType)) {
                        if (assetInfo.originalFileNames.length > 0) {
                            // This will extract the directory the file is in
                            // If it finds a file it will include it in the returned built file path
                            const folder_regex = /wdn\/templates_6\.0\/images\/([^\/]+)\/[^\/]+/i;
                            const path = folder_regex.exec(assetInfo.originalFileNames[0]);
                            if (path !== null && path.length == 2) {
                                return `wdn/templates_6.0/assets/images/${path[1]}/[name][extname]`;
                            }
                        }
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
                        if (assetInfo.originalFileNames.length > 0) {
                            // This will extract the directory the file is in
                            // If it finds a file it will include it in the returned built file path
                            const folder_regex = /wdn\/templates_6\.0\/scss\/([^\/]+)\/[^\/]+\.scss/i;
                            const path = folder_regex.exec(assetInfo.originalFileNames[0]);
                            if (path !== null && path.length == 2) {
                                return `wdn/templates_6.0/css/${path[1]}/[name].css`;
                            }
                        }
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
    ],
    // resolve.alias will replace the `@js-src` with the path before building
    resolve: {
        alias: {
            "@js-src": "/wdn/templates_6.0/js-src",
            "@scss": "/wdn/templates_6.0/scss",
            "@fonts": "/wdn/templates_6.0/fonts",
            "@images": "/wdn/templates_6.0/images",
            "@dcf": "/node_modules/dcf",
        },
    },
});
