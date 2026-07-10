import { uuidv4, escapeHTML, dedent } from '../lib/unl-utility.js';

export default class UNLCodeSnippet {
    uuid = uuidv4();

    /**
     * @type { HTMLElement }
     */
    codeBlock = null;

    /**
     * @param { HTMLElement } codeBlock
     */
    constructor(codeBlock) {
        this.codeBlock = codeBlock;
        if (this.codeBlock.getAttribute('id') === '' || this.codeBlock.getAttribute('id') === null) {
            this.codeBlock.setAttribute('id', this.uuid.concat('-code-snippet'));
        }

        this.codeSnippetElement = document.createElement('div');
        this.codeSnippetElement.classList.add('dcf-grid-full', 'dcf-overflow-hidden', 'dcf-mb-5');
        this.codeSnippetElement.innerHTML = `
            <div class="dcf-ai-center unl-bg-scarlet unl-cream" style="display: grid; grid-template-columns: 1fr auto;">
                <span class="dcf-bold dcf-pl-3">${codeBlock.dataset.type}</span>
                <button id="${this.uuid.concat('-code-snippet-copy')}" class="dcf-btn dcf-btn-primary dcf-m-1 dcf-d-flex dcf-ai-center" type="button">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="dcf-h-5 dcf-w-5 dcf-fill-current"
                        focusable="false"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        aria-labelledby="filled-copy-1-basic-title"
                    >
                        <title id="filled-copy-1-basic-title">Copy Code Snippet</title>
                        <path
                            d="M5.5,22C5.224,22,5,21.776,5,21.5V3H3.5C3.224,3,3,3.224,3,3.5v20C3,23.776,
                            3.224,24,3.5,24h14c0.276,0,0.5-0.224,0.5-0.5 V22H5.5z"
                        ></path>
                        <path
                            d="M21,6.5c0-0.133-0.053-0.26-0.146-0.353l-6-6C14.76,0.053,14.632,0,14.5,
                            0h-8C6.224,0,6,0.224,6,0.5v20 C6,20.776,6.224,21,6.5,21h14c0.276,0,
                            0.5-0.224,0.5-0.5V6.5z M14,7V1l6,6H14z"
                        ></path>
                        <g>
                            <path fill="none" d="M0 0H24V24H0z"></path>
                        </g>
                    </svg>
                </button>
            </div>
            <pre class="dcf-m-0 dcf-sharp dcf-p-3 dcf-overflow-x-auto dcf-txt-sm" style="white-space: pre;background-color: var(--bg-code);">${dedent(escapeHTML(codeBlock.innerText))}</pre>
        `;

        this.codeBlock.after(this.codeSnippetElement);

        this.codeBlock.classList.add('dcf-d-none!', 'unl-code-snippet-initialized');

        document.getElementById(this.uuid.concat('-code-snippet-copy')).addEventListener('click', async() => {
            await navigator.clipboard.writeText(dedent(codeBlock.innerText));
        });

        window.UNL = window.UNL || {};
        window.UNL.classes = window.UNL.classes || {};
        window.UNL.classes[this.codeBlock.getAttribute('id')] = this;
        this.codeBlock.dispatchEvent(new Event('UNLClassReady'));
    }
}
