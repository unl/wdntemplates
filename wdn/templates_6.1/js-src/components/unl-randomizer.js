import { uuidv4 } from '@js-src/lib/unl-utility.js';

export default class UNLRandomizer {

    uuid = uuidv4();

    randomizerContainer = null;

    constructor(randomizerContainer) {

        this.randomizerContainer = randomizerContainer;
        if (this.randomizerContainer.getAttribute('id') === '' || this.randomizerContainer.getAttribute('id') === null) {
            this.randomizerContainer.setAttribute('id', this.uuid.concat('-randomizer'));
        }

        const randomChild = Math.floor(Math.random() * this.randomizerContainer.children.length);

        Array.from(this.randomizerContainer.children).forEach((singleChild, index) => {
            singleChild.classList.add('dcf-d-none!');
            if (index === randomChild) {
                singleChild.classList.remove('dcf-d-none!');
            }
        });

        this.randomizerContainer.classList.add('unl-randomizer-initialized');
        this.randomizerContainer.removeAttribute('hidden');

        this.randomizerContainer.dispatchEvent(new CustomEvent(UNLRandomizer.events('randomizerReady'), {
            detail: {
                classInstance: this,
            },
        }));

        window.UNL = window.UNL || {};
        window.UNL.classes = window.UNL.classes || {};
        window.UNL.classes[this.randomizerContainer.getAttribute('id')] = this;
        this.randomizerContainer.dispatchEvent(new Event('UNLClassReady'));
    }

    // The names of the events to be used easily
    static events(name) {
        const events = {
            dialogReady: 'randomizerReady',
        };
        Object.freeze(events);

        return name in events ? events[name] : undefined;
    }
}
