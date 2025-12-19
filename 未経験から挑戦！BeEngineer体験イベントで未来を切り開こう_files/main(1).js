import ENV from '../../env.js';
/**
 * 最新のLPへのリダイレクトモーダルコンポーネント
 */
class LatestLpModal extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        if (ENV.STAGE === 'local') return;
        const htmlPath =
            this.getAttribute('data-src') ||
            '../../common/latest-lp-modal/template.html';
        try {
            const [lpInfo, content] = await Promise.all([
                getLatestLpInfo(),
                getTemplateContent(htmlPath),
            ]);
            if (!lpInfo) return;

            // 要素の取得
            const button = content.querySelector('#button');
            const mask = content.querySelector('#mask');
            const box = content.querySelector('#box');
            const title = content.querySelector('#title');
            const closeBtn = content.querySelector('#close-btn');

            // イベントの登録
            if (button && mask && box) {
                closeBtn.addEventListener('click', () => {
                    console.log('clicked');
                    mask.style.display = 'none';
                    box.style.display = 'none';
                    this.remove();
                });
                mask.addEventListener('click', () => {
                    mask.style.display = 'none';
                    box.style.display = 'none';
                    this.remove();
                });
            }

            // 要素の内容を決定
            if (title) title.innerHTML = lpInfo.message;
            if (button)
                button.href = `${lpInfo.url}?utm_source=past_lp&utm_medium=referral`;
            // レンダリング
            this.shadowRoot.appendChild(content);
        } catch (error) {
            console.error(error);
        }
    }
}

customElements.define('latest-lp-modal', LatestLpModal);

/**
 *  テンプレートを取得する
 * @param {string} htmlPath
 * @returns {Promise<Node>}
 */
async function getTemplateContent(htmlPath) {
    const response = await fetch(htmlPath);
    if (!response.ok) throw new Error(`Failed to load ${htmlPath}`);
    const htmlText = await response.text();
    const template = document.createElement('template');
    template.innerHTML = htmlText;
    const content = template.content.cloneNode(true);
    return content;
}

/**
 * @typedef {Object} LpInfo
 * @property {string} [url]
 * @property {string} [message]
 */
/**
 *  lpモーダルに関するデータをweb本体から取得する
 * @returns {Promise<LpInfo | null>}
 */
async function getLatestLpInfo() {
    const response = await fetch(ENV.API_URL + '/lp/redirect-modal');
    if (!response.ok) throw new Error(`Failed to load ${ENV.API_URL}`);
    const data = await response.json();
    const rowUrl = `${window.location.origin}${window.location.pathname}`;
    if (rowUrl === data.url) {
        return null;
    }
    return data;
}
