import { resolve } from 'path';
import { rm } from 'node:fs/promises';
import { defineConfig, loadEnv } from 'vite';
import eslintPlugin from 'vite-plugin-eslint';
import autoprefixer from 'autoprefixer';
import postcssNested from 'postcss-nested';

export default ({ mode }) => {
    process.env = {...process.env, ...loadEnv(mode, process.cwd(), '')};

    // Default plugins which are loaded every time
    const plugins = [
        {
            name: 'Cleaning js and css folder',
            async buildStart() {
                // Delete js folder to remove old built files
                await rm(resolve(__dirname, './wdn/templates_6.0/js'), { recursive: true, force: true });

                // Delete css folder to remove old built files
                await rm(resolve(__dirname, './wdn/templates_6.0/css'), { recursive: true, force: true });

                // Delete asset folder to remove old built files
                await rm(resolve(__dirname, './wdn/templates_6.0/assets'), { recursive: true, force: true });
            },
        },
    ];

    // If we are in a development environment
    if (process.env.DEVELOPMENT === 'true') {
        // We don't want this to run by default
        //   since if we have a linting error it won't build
        plugins.push(
            eslintPlugin(),
        );
    }

    return defineConfig({
        build: {

            // outDir needs to be `.` or else built url paths will be missing wdn/templates_6.0
            outDir: '.',

            // We are using library mode to keep the ES module exports in the final built code
            lib: {

                // entry contains all the input files
                // This would include plugin auto loader, plugins, components, and SCSS files
                // Key is built file path, Value is path to file
                entry: {
                    'auto-loader' : 'wdn/templates_6.0/js-src/plugin-auto-loader.js',
                    'header-global-1' : 'wdn/templates_6.0/js-src/header-global-1.js',

                    'plugins/tab' : 'wdn/templates_6.0/js-src/plugins/tab.js',
                    'plugins/toggle-button' : 'wdn/templates_6.0/js-src/plugins/toggle-button.js',
                    'plugins/collapsible-fieldset' : 'wdn/templates_6.0/js-src/plugins/collapsible-fieldset.js',
                    'plugins/figcaption-toggle' : 'wdn/templates_6.0/js-src/plugins/figcaption-toggle.js',
                    'plugins/notice' : 'wdn/templates_6.0/js-src/plugins/notice.js',
                    'plugins/datepicker' : 'wdn/templates_6.0/js-src/plugins/datepicker.js',
                    'plugins/autoplay-video' : 'wdn/templates_6.0/js-src/plugins/autoplay-video.js',
                    'plugins/pagination' : 'wdn/templates_6.0/js-src/plugins/pagination.js',
                    'plugins/slideshow' : 'wdn/templates_6.0/js-src/plugins/slideshow.js',
                    'plugins/search-select' : 'wdn/templates_6.0/js-src/plugins/search-select.js',
                    'plugins/popup' : 'wdn/templates_6.0/js-src/plugins/popup.js',
                    'plugins/dialog' : 'wdn/templates_6.0/js-src/plugins/dialog.js',
                    'plugins/gallery' : 'wdn/templates_6.0/js-src/plugins/gallery.js',
                    'plugins/idm' : 'wdn/templates_6.0/js-src/plugins/idm.js',
                    'plugins/modal' : 'wdn/templates_6.0/js-src/plugins/modal.js', // Deprecated
                    'plugins/jquery-ui' : 'wdn/templates_6.0/js-src/plugins/jquery-ui.js',
                    'plugins/search' : 'wdn/templates_6.0/js-src/plugins/search.js',
                    'plugins/form-validator' : 'wdn/templates_6.0/js-src/plugins/form-validator.js',

                    'components/tab' : 'wdn/templates_6.0/js-src/components/wdn-tab.js',
                    'components/toggle-button' : 'wdn/templates_6.0/js-src/components/wdn-toggle-button.js',
                    'components/collapsible-fieldset' : 'wdn/templates_6.0/js-src/components/wdn-collapsible-fieldset.js',
                    'components/figcaption-toggle' : 'wdn/templates_6.0/js-src/components/wdn-figcaption-toggle.js',
                    'components/notice' : 'wdn/templates_6.0/js-src/components/wdn-notice.js',
                    'components/datepicker' : 'wdn/templates_6.0/js-src/components/wdn-datepicker.js',
                    'components/autoplay-video' : 'wdn/templates_6.0/js-src/components/wdn-autoplay-video.js',
                    'components/pagination' : 'wdn/templates_6.0/js-src/components/wdn-pagination.js',
                    'components/slideshow' : 'wdn/templates_6.0/js-src/components/wdn-slideshow.js',
                    'components/search-select' : 'wdn/templates_6.0/js-src/components/wdn-search-select.js',
                    'components/popup' : 'wdn/templates_6.0/js-src/components/wdn-popup.js',
                    'components/dialog' : 'wdn/templates_6.0/js-src/components/wdn-dialog.js',
                    'components/gallery' : 'wdn/templates_6.0/js-src/components/wdn-gallery.js',
                    'components/banner' : 'wdn/templates_6.0/js-src/components/wdn-banner.js',
                    'components/idm' : 'wdn/templates_6.0/js-src/components/wdn-idm.js',
                    'components/search' : 'wdn/templates_6.0/js-src/components/wdn-search.js',

                    'lib/wdn-utility' : 'wdn/templates_6.0/js-src/lib/wdn-utility.js',
                    'lib/jquery' : 'wdn/templates_6.0/js-src/lib/jquery.js',
                    'lib/jquery-ui' : 'wdn/templates_6.0/js-src/lib/jquery-ui.js',
                    'lib/jquery-validator' : 'wdn/templates_6.0/js-src/lib/jquery-validator.js',

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
                        const extType = assetInfo.names[0] ?? 'undefined';
                        if (/png|jpe?g|svg|gif|avif|webp/i.test(extType)) {
                            if (assetInfo.originalFileNames.length > 0) {
                                // This will extract the directory the file is in
                                // If it finds a file it will include it in the returned built file path
                                const folderRegex = /wdn\/templates_6\.0\/images\/([^/]+)\/[^/]+/i;
                                const path = folderRegex.exec(assetInfo.originalFileNames[0]);
                                if (path !== null && path.length === 2) {
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
                                const folderRegex = /wdn\/templates_6\.0\/scss\/([^/]+)\/[^/]+\.scss/i;
                                const path = folderRegex.exec(assetInfo.originalFileNames[0]);
                                if (path !== null && path.length === 2) {
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
                },
            },

            // If emptyOutDir is set to true it deletes everything
            emptyOutDir: false,

            // We want js source maps but inline ones are slow for production
            sourcemap: true,

            // This will preserve css file names and build them as individual files
            cssCodeSplit: true,
        },

        // Plugins are defined above, this lets us load specific ones depending on environment variables
        plugins: plugins,

        // Adds in browser specific prefixes and work around for styles for better browser compatibility
        css: {
            postcss: {
                plugins: [
                    autoprefixer,
                    postcssNested,
                ],
            },
        },

        // resolve.alias will replace the `@js-src` with the path before building
        resolve: {
            alias: {
                '@js-src': resolve(__dirname, './wdn/templates_6.0/js-src'),
                '@scss': resolve(__dirname, './wdn/templates_6.0/scss'),
                '@fonts': resolve(__dirname, './wdn/templates_6.0/fonts'),
                '@images': resolve(__dirname, './wdn/templates_6.0/images'),
                '@dcf': process.env.DCF_DIR ?? resolve(__dirname, './node_modules/dcf'),
            },
        },
    });
};
