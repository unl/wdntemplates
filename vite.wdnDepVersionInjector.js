// This is the virtual module being imported in the banner component
const VIRTUAL_ID = 'virtual:depVersion';
const RESOLVED_ID = `\0${VIRTUAL_ID}`;

/**
 * Creates a virtual module for vite to load the data from
 * 
 * @param { String } versionString 
 * @returns { Object } vite plugin
 */
export default function wdnDepVersionInjector(versionString) {
    return {
        name: 'WDN: Dep Version Injector',

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

            return `export default '${versionString}';`;
        },
    };
}
