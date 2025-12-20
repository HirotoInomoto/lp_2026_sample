import ENV from '../../../env.js';
import CustomLinkHandler from './src/common/custom_link.js';

// 2026 LPは、まず2025の実装をベースに動く状態を作る（UI/DOMは2025と同一構造を前提）
import { CalendarController } from './src/new_year_2025/components/calendar.js';
import {
    addSliderNextPrevBtn,
    initializeSwiperFlow,
} from './src/new_year_2025/components/flow.js';
import { FormController } from './src/new_year_2025/components/form.js';
import {
    addSliderNextPrevBtnGraduate,
    initializeSwiperFuture,
    initializeSwiperGraduate,
} from './src/new_year_2025/components/future.js';
import { initializeSwiperAchieve } from './src/new_year_2025/components/intro-2.js';
import { voiceTabChange } from './src/new_year_2025/components/voice.js';
import { initializePastEventGallery } from './src/new_year_2026/components/past_event_gallery.js';
import { initializeQanda } from './src/new_year_2026/components/qanda.js';

function initializeScheduleTabs() {
    const root = document.querySelector('.schedule');
    if (!root) return;

    const tabs = Array.from(root.querySelectorAll('.schedule__tab'));
    const panels = Array.from(root.querySelectorAll('.schedule__panel'));
    if (tabs.length === 0 || panels.length === 0) return;

    const activate = (key) => {
        tabs.forEach((btn) => {
            const isActive = btn.dataset.scheduleTab === key;
            btn.classList.toggle('is-active', isActive);
            btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
            btn.tabIndex = isActive ? 0 : -1;
        });

        panels.forEach((panel) => {
            const isActive = panel.dataset.schedulePanel === key;
            panel.classList.toggle('is-active', isActive);
        });
    };

    tabs.forEach((btn) => {
        btn.addEventListener('click', () => {
            const key = btn.dataset.scheduleTab;
            if (!key) return;
            activate(key);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // カスタムリンク（data-custom-link）対応
    new CustomLinkHandler().applyLinks();

    // 開催日程タブ（2026用）: 他の初期化が失敗しても動くよう先に実行
    initializeScheduleTabs();

    // 2025の挙動を踏襲（必要になったら順次2026側に移植して差分を作る）
    // flowのDOMが2026用に差し替わる可能性があるため、存在する場合のみ実行
    if (document.getElementById('flow__past_event_photo')) {
        initializeSwiperFlow();
        addSliderNextPrevBtn();
    }

    // voice: DOMがある場合のみ実行
    if (
        document.querySelector('.voice__header--parent') &&
        document.querySelector('.voice__header--student') &&
        document.querySelector('.voice__content__box--parent') &&
        document.querySelector('.voice__content__box--student')
    ) {
        let voiceTabNum = 0;
        voiceTabNum = voiceTabChange(voiceTabNum);
    }

    // future: DOMがある場合のみ実行
    if (document.querySelector('.future__slide__wrapper')) {
        initializeSwiperFuture();
    }
    if (document.querySelector('.future__graduate__slide__wrapper')) {
        initializeSwiperGraduate();
    }
    if (
        document.querySelector('.graduate_swiper-button-next') &&
        document.querySelector('.graduate_swiper-button-prev')
    ) {
        addSliderNextPrevBtnGraduate();
    }
    // intro-2 のDOMが2026用に差し替わるため、存在する場合のみ実行
    if (document.querySelector('.intro-2__content__achieve__image__list')) {
        initializeSwiperAchieve();
    }

    // past_event ギャラリー（2026用）
    initializePastEventGallery();
    // Q&A（2026用）
    initializeQanda();

    // form: DOMがある場合のみ実行（#form を削除する運用にも対応）
    if (document.getElementById('form')) {
        new FormController();
    }
    // calendarのDOMが2026用に差し替わる可能性があるため、存在する場合のみ実行
    if (document.getElementById('calendar')) {
        new CalendarController();
    }

    // デバッグ用（必要なら有効化）
    if (false) {
        console.log(ENV.STAGE);
        console.log(ENV.API_URL);
    }
});
