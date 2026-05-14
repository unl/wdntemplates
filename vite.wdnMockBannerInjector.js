import { readFileSync, existsSync } from 'fs';

// This is the virtual module being imported in the banner component
const VIRTUAL_ID = 'virtual:mock-banner-html';
const RESOLVED_ID = `\0${VIRTUAL_ID}`;

/**
 * Creates a virtual module for vite to load the data from
 * 
 * @param { String } mockBannerFile 
 * @returns { Object } vite plugin
 */
export default function wdnMockBannerInjector(mockBannerFile) {
    return {
        name: 'WDN: Mock Banner Injector',

        resolveId(id) {
            if (id === VIRTUAL_ID) {
                return RESOLVED_ID;
            }
        },

        // Load is called fresh on every rebuild
        load(id) {
            if (id !== RESOLVED_ID) {
                return;
            }

            // If there is no mock banner file give generic error
            // Virtual module is loaded every time in the file so we need to return something
            // Banner component conditionally shows this string based on if there is any data in the `VITE_MOCK_BANNER_FILE`
            if (!process.env.VITE_MOCK_BANNER_FILE || !existsSync(process.env.VITE_MOCK_BANNER_FILE)) {
                return 'export default "No Banner File Found";';
            }

            // Sets up vite to watch the mock banner file for changes
            this.addWatchFile(mockBannerFile);

            // Gets the contents of the mock banner file and exports it to the virtual module
            const htmlContent = readFileSync(mockBannerFile, 'utf-8');
            return `export default ${JSON.stringify(htmlContent)};`;
        },
    };
}
