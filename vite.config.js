import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        outDir: 'wdn/templates_6.0',
        rollupOptions: {
            // rest of build configuration
            input: {
                'js-src/main': 'wdn/templates_6.0/js-src/main.js',
                'js-src/components/wdn-button-toggle.js': 'wdn/templates_6.0/js-src/components/wdn-button-toggle.js',
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
            }
        },
    }
});