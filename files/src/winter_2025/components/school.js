// @ts-check

import { Modal } from './modal.js';

export const initSchoolModal = async () => {
    const schoolBtnList = document.querySelectorAll('.school__btn');

    // JSONデータの取得
    const filePath = '../src/winter_2025/data/school.json';
    const response = await fetch(filePath);
    const dataList = await response.json();

    // ボタンのidからcontentHTMLを作成する
    /**
     * @param {HTMLElement} btn
     */
    function createHTMLContent(btn) {
        const template = document.getElementById('school-modal-template');
        // @ts-ignore
        const baseContentHTML = template.content.cloneNode(true);

        // HTML要素のIDの地名部分によって表示するデータを決定
        const placeId = btn.id.split('-').pop();
        const schoolData = dataList.find((data) => data.id === placeId);

        // JSONデータからHTML要素を構成
        baseContentHTML.getElementById('school-modal-title').innerText =
            schoolData.name;
        baseContentHTML.getElementById('school-modal-map').src =
            schoolData.mapURL;
        baseContentHTML.getElementById('school-modal-address').innerText =
            schoolData.address;
        baseContentHTML.getElementById('school-modal-access').innerText =
            schoolData.access;

        return baseContentHTML;
    }

    /**
     * @param {Event} e
     */
    function openModal(e) {
        e.preventDefault();
        const contentHTML = createHTMLContent(e.target);
        return new Modal({
            contentHTML,
        });
    }

    schoolBtnList.forEach((schoolBtn) => {
        schoolBtn.addEventListener('click', (e) => openModal(e));
    });
};
