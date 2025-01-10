import { resolve } from 'path'
import { rm } from 'node:fs/promises'
import { defineConfig } from 'vite';
import sassGlobImports from 'vite-plugin-sass-glob-import';

export default defineConfig({
    build: {
        outDir: 'wdn/templates_6.0',
        rollupOptions: {
            input: {
                'js/main': 'wdn/templates_6.0/js-src/main.js',
                'js/components/wdn-button-toggle': 'wdn/templates_6.0/js-src/components/wdn-button-toggle.js',
                // 'css/affiliate': 'wdn/templates_6.0/scss/affiliate.scss',
                // 'css/critical': 'wdn/templates_6.0/scss/critical.scss',
                // 'css/deprecated': 'wdn/templates_6.0/scss/deprecated.scss',
                // 'css/legacy': 'wdn/templates_6.0/scss/legacy.scss',
                // 'css/main': 'wdn/templates_6.0/scss/main.scss',
                // 'css/pre': 'wdn/templates_6.0/scss/pre.scss',
                // 'css/print': 'wdn/templates_6.0/scss/print.scss',
            },
            output: {
                assetFileNames: (assetInfo) => {
                    let extType = assetInfo.name?.split('.')[1] ?? "undefined";
                    if (/png|jpe?g|svg|gif|tiff|bmp|ico|avif|webp/i.test(extType)) {
                        extType = 'img';
                    }
                    if (/mp4|mov/i.test(extType)) {
                        extType = 'video';
                    }
                    if (/mp3/i.test(extType)) {
                        extType = 'audio';
                    }
                    if (/css/i.test(extType)) {
                        return '[name].css';
                    }
                    return `assets/${extType}/[name][extname]`;
                },
                chunkFileNames: '[name].js',
                entryFileNames: '[name].js',
            },
        },
        emptyOutDir: false,
        sourcemap: true,
    },
    plugins: [
        {
            name: "Cleaning js and css folder",
            async buildStart() {
                await rm(resolve(__dirname, './wdn/templates_6.0/js'), { recursive: true, force: true });
                await rm(resolve(__dirname, './wdn/templates_6.0/css'), { recursive: true, force: true });
            }
        },
        sassGlobImports()
    ]
});