import { Modal } from './modal.js';
import { createElementWithSettings } from '../utils/dom.js';

export const initProgrammingModal = () => {
    const pcBtn = document.getElementById('modal__programming__root');
    const spBtn = document.getElementById('modal__programming__sp__root');
    const contentHTML = document
        .getElementById('modal__programming')
        .content.cloneNode(true);

    function openModal(e) {
        e.preventDefault();
        return new Modal({ contentHTML: contentHTML });
    }

    function openSpModal(e) {
        const modal = openModal(e);
        const btn = createElementWithSettings(
            'div',
            {},
            {
                position: 'sticky',
                bottom: '24px',
                textAlign: 'center',
                color: '#00BEE8',
                backgroundColor: '#f1faff',
                padding: '6px 0',
                border: '#00BEE8 1px solid',
                margin: '0 16px',
            }
        );
        btn.innerHTML = `<button type="submit" style="width: 100%;">閉じる</button>`;
        modal.container.querySelector('form').appendChild(btn);
    }

    pcBtn.addEventListener('click', (e) => openModal(e));
    spBtn.addEventListener('click', (e) => openSpModal(e));
};
