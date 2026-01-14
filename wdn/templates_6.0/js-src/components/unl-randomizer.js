export default class UNLRandomizer {

    randomizerContainer = null;

    constructor(randomizerContainer) {

        this.randomizerContainer = randomizerContainer;

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
