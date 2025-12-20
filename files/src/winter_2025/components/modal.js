// @ts-check

import { createElementWithSettings, getElementSafely } from '../utils/dom.js';

/**
 * @typedef {Object} CreateModalParams
 * @property {Element|HTMLElement} [contentHTML]
 * @property {string} [contentString]
 * @property  {(modalContainer: Element|HTMLElement) => void} [onOpenHandler]
 * @property  {(modalContainer: Element|HTMLElement) => void} [onCloseHandler]
 */

// 使用には別途 ../components/_modal.scssが必要。
/**
 * Modal表示用クラスの使い方
 *
 * ```js
 * new Modal({
 *   onOpenHandler: (modalEl) => {
 *     console.log('モーダルを開きました', modalEl);
 *   },
 *   onCloseHandler: (modalEl) => {
 *     console.log('モーダルを閉じました', modalEl);
 *   },
 *   // HTML文字列で中身を指定
 *   contentString: `
 *     <div style="width:100%;height:100%;background:red;display:flex;align-items:center;justify-content:center;">
 *       <p style="color:white;">Hello!</p>
 *     </div>
 *   `,
 *
 *   // または既存のDOM要素を挿入
 *   // contentHTML: getElementSafely(() => document.querySelector('#event-features')),
 * });
 * ```
 *
 * 概略：
 * - モーダルは `<dialog id="_modal_container">` として `document.body` に追加される。
 * - `onOpenHandler` と `onCloseHandler` はそれぞれ開閉時に呼ばれる。
 * - 閉じるボタン（×）を押すと自動的にモーダルが閉じる。
 * - モーダル内部に`<button type="submit">`を配置することで、モーダルを閉じることができる。
 */
export class Modal {
    /**@type {Element|HTMLElement|undefined} #modalContainer*/
    #modalContainer;
    /**
     *
     * @param {CreateModalParams} params
     * @returns
     */
    constructor(params) {
        const target = document.body;
        this.#open(params, target);
    }

    /**
     *
     * @param {CreateModalParams} params
     * @param {HTMLElement|Element} target
     * @returns
     */
    #open(
        { contentHTML, contentString, onOpenHandler, onCloseHandler },
        target
    ) {
        const prevContainer = document.getElementById('_modal_container');

        if (prevContainer) {
            this.#modalContainer = prevContainer;
        } else {
            this.#modalContainer = createElementWithSettings('dialog', {
                id: '_modal_container',
            });
            this.#modalContainer.setAttribute('closedby', 'any');
            target.prepend(this.#modalContainer);
        }

        this.#createContainerHTML({ contentHTML, contentString });

        // @ts-ignore
        this.#modalContainer.showModal();

        if (onOpenHandler) {
            // @ts-ignore
            onOpenHandler(this.#modalContainer);
        }
        if (onCloseHandler) {
            this.#modalContainer.addEventListener(
                'close',
                () => {
                    // @ts-ignore
                    onCloseHandler(this.#modalContainer);
                    this.#close();
                },
                { once: true }
            );
        }
    }

    #close() {
        if (this.#modalContainer) {
            this.#modalContainer.innerHTML = '';
        }
    }

    /**
     * @returns {Element|HTMLElement}
     */
    get container() {
        if (this.#modalContainer === undefined) {
            throw new Error('modalContainerの初期化が完了していません。');
        }
        return this.#modalContainer;
    }
    /**
     * @param {object} params
     * @param {Element|HTMLElement} [params.contentHTML]
     * @param {string} [params.contentString]
     */
    #createContainerHTML({ contentHTML, contentString }) {
        if (contentHTML === undefined && contentString === undefined) {
            throw new Error(
                'contentHTMLとcontentStringが両方とも指定されていません。'
            );
        }
        const template = `
                            <form class="_modal__content" method="dialog">
                                <div class="_modal__content--header">
                                    <button type="submit">
                                        <span class="material-symbols-outlined"> close </span>
                                    </button>
                                </div>
                                <div class="_modal__content--body"></div>
                            </form>`;
        // @ts-ignore
        this.#modalContainer.innerHTML = template;

        if (contentString !== undefined) {
            getElementSafely(() =>
                //@ts-ignore
                document.querySelector('._modal__content--body')
            ).innerHTML = contentString;
        } else if (contentHTML !== undefined) {
            getElementSafely(() =>
                //@ts-ignore
                document.querySelector('._modal__content--body')
            )?.appendChild(contentHTML.cloneNode(true));
        }
    }
}
