let base = '';
const placeholders = new Map();

const wdnFinalJsUrlPlugin = {
    name: 'WDN: Final Url',
    enforce: 'pre',

    configResolved(config) {
        // Vite’s `base` (public path) e.g. '/assets/'
        base = config.base || '/';
    },

    async resolveId(source, importer) {
        if (source.endsWith('?finalUrl')) {
            const [id] = source.split('?');
            const resolved = await this.resolve(id, importer, { skipSelf: true });
            if (resolved) {
                return `${resolved.id}?finalUrl`;
            }
        }
        return null;
    },

    load(id) {
        if (id.endsWith('?finalUrl')) {
            const [realId] = id.split('?');
            // register chunk; get a numeric ref
            const ref = this.emitFile({ type: 'chunk', id: realId });
            // stash it for later
            placeholders.set(realId, ref);
            // return a simple string placeholder
            return `export default "__FINAL_URL__${ref}__";`;
        }
        return null;
    },

    // eslint-disable-next-line
    async generateBundle(_, bundle) {
        // for each emitted placeholder…
        // eslint-disable-next-line
        for (const [realId, ref] of placeholders) {
            // lookup the actual filename for this chunk
            const fileName = this.getFileName(ref);
            // build the final URL string
            const url = base + fileName;
            const pattern = `__FINAL_URL__${ref}__`;

            // replace in every JS chunk
            for (const chunk of Object.values(bundle)) {
                if (chunk.type === 'chunk') {
                    chunk.code = chunk.code.split(pattern).join(url);
                }
            }
        }
    },
};

export default wdnFinalJsUrlPlugin;
