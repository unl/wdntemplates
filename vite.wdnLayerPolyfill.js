import { Buffer } from 'node:buffer';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import postcssNested from 'postcss-nested';
import postcssCascadeLayers from '@csstools/postcss-cascade-layers';

export default function wdnLayerPolyfill() {
    return {
        name: 'WDN: Layers Polyfill',
        apply: 'build',
        async generateBundle(none, bundle) {
            for (const [fileName, file] of Object.entries(bundle)) {
                if (file.type === 'asset' && fileName.endsWith('main.css')) {
                    const css = typeof file.source === 'string'
                        ? file.source
                        : Buffer.from(file.source).toString();

                    const result = await postcss([
                        autoprefixer,
                        postcssNested,
                        postcssCascadeLayers,
                    ]).process(css, { from: undefined });

                    // Overwrite original CSS or emit new one
                    this.emitFile({
                        type: 'asset',
                        fileName: fileName.replace('.css', '.layerPolyFill.css'),
                        source: result.css,
                    });

                    console.log(`Processed: ${fileName}`);
                }
            }
        },
    };
}
