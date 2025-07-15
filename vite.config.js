import { resolve } from 'path';
import { defineConfig, loadEnv } from 'vite';
import eslintPlugin from 'vite-plugin-eslint';
import autoprefixer from 'autoprefixer';
import postcssNested from 'postcss-nested';

import wdnCleanupPlugin from './vite.wdnCleanupPlugin.js';
import wdnFinalJsUrlPlugin from './vite.wdnFinalJsUrlPlugin.js';
import wdnSmudge from './vite.wdnSmudgePlugin.js';
import wdnZipPlugin from './vite.wdnZipPlugin.js';
import wdnCriticalCSSInjector from './vite.wdnCriticalCSSInjector.js';
import wdnLayerPolyfill from './vite.wdnLayerPolyfill.js';

export default ({ mode }) => {
    process.env = {...process.env, ...loadEnv(mode, process.cwd(), '')};

    // Default plugins which are loaded every time
    const plugins = [
        wdnCleanupPlugin,
        wdnFinalJsUrlPlugin,
        wdnLayerPolyfill(),
        wdnCriticalCSSInjector({
            cssFile: './wdn/templates_6.0/css/critical.css',
            targets: [
                './wdn/templates_6.0/includes/global/head-2-local.html',
                './wdn/templates_6.0/includes/global/head-2.html',
            ],
        }),
    ];

    // If we are in a development environment
    if (process.env.DEVELOPMENT === 'true') {
        // We don't want this to run by default
        //   since if we have a linting error it won't build
        plugins.push(
            eslintPlugin(),
        );
    }

    // If we are building for the production environment
    if (process.argv.includes('--smudge')) {
        // We need to smudge the files in specific directories
        //  this will replace specific values (i.e. $DEP_VERSION$, $Id$) in the markup with actual values
        plugins.push(
            wdnSmudge({
                dirs: [
                    'wdn/templates_6.0/includes',
                    'Templates',
                ],
            }),
            wdnZipPlugin([
                {
                    name: 'wdn_6.0',
                    dir: './wdn',
                },
                {
                    name: 'wdn_includes_6.0',
                    dir: './wdn/templates_6.0/includes',
                },
                {
                    name: 'UNLTemplates_6.0',
                    dir: './Templates',
                },
            ]),
        );
    }

    return defineConfig({
        esbuild: {
            // These options will allow us to keep the class names and other variables in the code
            //   This is super helpful for debugging and console logging
            minifyIdentifiers: false,
            keepNames: true,
        },
        build: {
            minify: 'esbuild',

            // Tells the bundler to target modern browsers
            //   Specifically allows us to do top level await
            target: 'esnext',

            // outDir is where the files will be built to
            // wdnCleanupPlugin will copy them to the correct locations after the fact
            outDir: './dist',

            // We are using library mode to keep the ES module exports in the final built code
            lib: {

                // entry contains all the input files
                // This would include plugin auto loader, plugins, components, and SCSS files
                // Key is built file path, Value is path to file
                entry: {
                    'auto-loader'     : 'wdn/templates_6.0/js-src/plugin-auto-loader.js',
                    'header-global-1' : 'wdn/templates_6.0/js-src/header-global-1.js',
                    'head-2'          : 'wdn/templates_6.0/js-src/head-2.js',
                    'nav-container-2' : 'wdn/templates_6.0/js-src/nav-container-2.js',

                    'plugins/plugin.tab'                  : 'wdn/templates_6.0/js-src/plugins/multi/tab.js',
                    'plugins/plugin.toggle-button'        : 'wdn/templates_6.0/js-src/plugins/multi/toggle-button.js',
                    'plugins/plugin.collapsible-fieldset' : 'wdn/templates_6.0/js-src/plugins/multi/collapsible-fieldset.js',
                    'plugins/plugin.figcaption-toggle'    : 'wdn/templates_6.0/js-src/plugins/multi/figcaption-toggle.js',
                    'plugins/plugin.notice'               : 'wdn/templates_6.0/js-src/plugins/multi/notice.js',
                    'plugins/plugin.datepicker'           : 'wdn/templates_6.0/js-src/plugins/multi/datepicker.js',
                    'plugins/plugin.autoplay-video'       : 'wdn/templates_6.0/js-src/plugins/multi/autoplay-video.js',
                    'plugins/plugin.pagination'           : 'wdn/templates_6.0/js-src/plugins/multi/pagination.js',
                    'plugins/plugin.slideshow'            : 'wdn/templates_6.0/js-src/plugins/multi/slideshow.js',
                    'plugins/plugin.search-select'        : 'wdn/templates_6.0/js-src/plugins/multi/search-select.js',
                    'plugins/plugin.popup'                : 'wdn/templates_6.0/js-src/plugins/multi/popup.js',
                    'plugins/plugin.dialog'               : 'wdn/templates_6.0/js-src/plugins/multi/dialog.js',
                    'plugins/plugin.gallery'              : 'wdn/templates_6.0/js-src/plugins/multi/gallery.js',
                    'plugins/plugin.event-list'           : 'wdn/templates_6.0/js-src/plugins/multi/event-list.js',
                    'plugins/plugin.card-as-link'         : 'wdn/templates_6.0/js-src/plugins/multi/card-as-link.js',

                    'plugins/plugin.idm'                  : 'wdn/templates_6.0/js-src/plugins/single/idm.js',
                    'plugins/plugin.search'               : 'wdn/templates_6.0/js-src/plugins/single/search.js',
                    'plugins/plugin.qa'                   : 'wdn/templates_6.0/js-src/plugins/single/qa.js',
                    'plugins/plugin.font-serif'           : 'wdn/templates_6.0/js-src/plugins/single/font-serif.js',

                    'plugins/plugin.jquery-ui'            : 'wdn/templates_6.0/js-src/plugins/other/jquery-ui.js',
                    'plugins/plugin.form-validator'       : 'wdn/templates_6.0/js-src/plugins/other/form-validator.js',
                    'plugins/plugin.colorbox'       : 'wdn/templates_6.0/js-src/plugins/other/colorbox.js',

                    'components/component.tab'                  : 'wdn/templates_6.0/js-src/components/unl-tab.js',
                    'components/component.toggle-button'        : 'wdn/templates_6.0/js-src/components/unl-toggle-button.js',
                    'components/component.collapsible-fieldset' : 'wdn/templates_6.0/js-src/components/unl-collapsible-fieldset.js',
                    'components/component.figcaption-toggle'    : 'wdn/templates_6.0/js-src/components/unl-figcaption-toggle.js',
                    'components/component.notice'               : 'wdn/templates_6.0/js-src/components/unl-notice.js',
                    'components/component.datepicker'           : 'wdn/templates_6.0/js-src/components/unl-datepicker.js',
                    'components/component.autoplay-video'       : 'wdn/templates_6.0/js-src/components/unl-autoplay-video.js',
                    'components/component.pagination'           : 'wdn/templates_6.0/js-src/components/unl-pagination.js',
                    'components/component.slideshow'            : 'wdn/templates_6.0/js-src/components/unl-slideshow.js',
                    'components/component.search-select'        : 'wdn/templates_6.0/js-src/components/unl-search-select.js',
                    'components/component.popup'                : 'wdn/templates_6.0/js-src/components/unl-popup.js',
                    'components/component.dialog'               : 'wdn/templates_6.0/js-src/components/unl-dialog.js',
                    'components/component.gallery'              : 'wdn/templates_6.0/js-src/components/unl-gallery.js',
                    'components/component.banner'               : 'wdn/templates_6.0/js-src/components/unl-banner.js',
                    'components/component.alert'                : 'wdn/templates_6.0/js-src/components/unl-alert.js',

                    'components/component.idm'                  : 'wdn/templates_6.0/js-src/components/unl-idm.js',
                    'components/component.search'               : 'wdn/templates_6.0/js-src/components/unl-search.js',
                    'components/component.qa'                   : 'wdn/templates_6.0/js-src/components/unl-qa.js',
                    'components/component.event-list'           : 'wdn/templates_6.0/js-src/components/unl-event-list.js',
                    'components/component.card-as-link'         : 'wdn/templates_6.0/js-src/components/unl-card-as-link.js',
                    'components/component.analytics'            : 'wdn/templates_6.0/js-src/components/unl-analytics.js',

                    'lib/unl-utility'      : 'wdn/templates_6.0/js-src/lib/unl-utility.js',
                    'lib/moment'           : 'wdn/templates_6.0/js-src/lib/moment.js',
                    'lib/moment-timezone'  : 'wdn/templates_6.0/js-src/lib/moment-timezone.js',
                    'lib/jquery'           : 'wdn/templates_6.0/js-src/lib/jquery.js',
                    'lib/jquery-ui'        : 'wdn/templates_6.0/js-src/lib/jquery-ui.js',
                    'lib/jquery-validator' : 'wdn/templates_6.0/js-src/lib/jquery-validator.js',
                    'lib/jquery-colorbox' : 'wdn/templates_6.0/js-src/lib/jquery-colorbox.js',
                    'lib/modal'            : 'wdn/templates_6.0/js-src/lib/modal.js', // Deprecated

                    // We don't need 'css/' to prefix the keys since the assetFileNames will add the css directory for us
                    'affiliate'     : 'wdn/templates_6.0/scss/affiliate.scss',
                    'critical'      : 'wdn/templates_6.0/scss/critical.scss',
                    'deprecated-4x' : 'wdn/templates_6.0/scss/deprecated-4x.scss',
                    'deprecated-5x' : 'wdn/templates_6.0/scss/deprecated-5x.scss',
                    'main'          : 'wdn/templates_6.0/scss/main.scss',
                    'print'         : 'wdn/templates_6.0/scss/print.scss',
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
                    chunkFileNames: 'wdn/templates_6.0/js/chunks/chunk.[name].js',

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
