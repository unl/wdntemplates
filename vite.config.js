import { resolve } from 'path'
import { rm } from 'node:fs/promises'
import { defineConfig } from 'vite';
import sassGlobImports from 'vite-plugin-sass-glob-import';

export default defineConfig({
    build: {
        // outDir needs to be `.` or else built url paths will be missing wdn/templates_6.0
        outDir: '.',
        rollupOptions: {
            // input contains all the input files
            // This would include main.js, component js and css, and general css files
            input: {
                'js/main': 'wdn/templates_6.0/js-src/main.js',

                'js/components/wdn-button-toggle': 'wdn/templates_6.0/js-src/components/wdn-button-toggle.js',

                'js/components/wdn-tab': 'wdn/templates_6.0/js-src/components/wdn-tab.js',
                // 'css/components/tabs': 'wdn/templates_6.0/scss/components/_components.tabs.scss',

                // 'css/affiliate': 'wdn/templates_6.0/scss/affiliate.scss',
                // 'css/critical': 'wdn/templates_6.0/scss/critical.scss',
                // 'css/deprecated': 'wdn/templates_6.0/scss/deprecated.scss',
                // 'css/legacy': 'wdn/templates_6.0/scss/legacy.scss',
                // 'css/main': 'wdn/templates_6.0/scss/main.scss',
                // 'css/pre': 'wdn/templates_6.0/scss/pre.scss',
                // 'css/print': 'wdn/templates_6.0/scss/print.scss',
            },
            output: {
                //TODO: Make this better and not do duplicate `/css/css` stuff
                assetFileNames: (assetInfo) => {
                    let extType = assetInfo.names[0] ?? 'undefined';
                    if (/png|jpe?g|svg|gif|tiff|bmp|ico|avif|webp/i.test(extType)) {
                        extType = 'img';
                    }
                    if (/mp4|mov/i.test(extType)) {
                        extType = 'video';
                    }
                    if (/mp3/i.test(extType)) {
                        extType = 'audio';
                    }
                    if (/css/i.test(extType) || /scss/i.test(extType)) {
                        return 'wdn/templates_6.0/css/[name].css';
                    }
                    if (/js/i.test(extType)) {
                        return 'wdn/templates_6.0/js/[name].js';
                    }
                    return `wdn/templates_6.0/assets/${extType}/[name][extname]`;
                },
                // chunkFileNames is for the shared files it finds
                chunkFileNames: 'wdn/templates_6.0/js/[name].js',
                entryFileNames: 'wdn/templates_6.0/[name].js',
            },
        },
        // If emptyOutDir is set to true it deletes everything
        emptyOutDir: false,
        // We want js source maps but inline ones are slow for production
        sourcemap: true,
    },
    plugins: [
        {
            name: "Cleaning js and css folder",
            async buildStart() {
                // Delete js folder to remove old built files
                await rm(resolve(__dirname, './wdn/templates_6.0/js'), { recursive: true, force: true });
                // Delete css folder to remove old built files
                await rm(resolve(__dirname, './wdn/templates_6.0/css'), { recursive: true, force: true });
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
            "@dcf": "/node_modules/dcf",
        },
    },
});