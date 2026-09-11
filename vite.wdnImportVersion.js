export default function wdnImportVersion(options = {}) {
    const {
        version = '',
    } = options;

    return {
        name: 'WDN: Import Version',
        enforce: 'post', // run after Vite transforms

        renderChunk(code, chunk) {
            // Modify only JS chunks
            if (!chunk.fileName.endsWith('.js')) {
                return null;
            }

            let updated = code;

            const jsFileRegex = new RegExp(/\.js('|"|`)/g);
            updated = updated.replace(jsFileRegex, `.js?v=${version}$1`);

            const cssFileRegex = new RegExp(/\.css('|"|`)/g);
            updated = updated.replace(cssFileRegex, `.css?v=${version}$1`);

            return { code: updated, map: null };
            // Returning null map here tells Rollup to regenerate
        },
    };
}
