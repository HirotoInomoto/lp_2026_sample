// @ts-check
import { Schedule, SchedulesApi } from '../api/schedules.js';
import { getElementListSafely, getElementSafely } from '../utils/dom.js';

export class ScheduleRenderer {
    /**@type {Schedule[]} #allSchedules */
    #allSchedules = [];

    /**@type {Schedule[]} #filteredSchedules */
    #filteredSchedules = [];

    constructor() {
        this.schedulesApi = new SchedulesApi();
        this.scheduleSection = getElementSafely(() =>
            document.querySelector('#schedule')
        );
        this.scheduleListContainer = getElementSafely(() =>
            this.scheduleSection.querySelector('.schedule__container--list')
        );
        this.init();
    }

    async init() {
        this.#allSchedules = await this.schedulesApi.fetchAll();
        this.#filteredSchedules = this.#allSchedules;
        await this.render();
        this.subscribeButton();
    }

    async render() {
        if (this.#filteredSchedules.length === 0) {
            this.scheduleListContainer.innerHTML =
                '<p class="error-empty">現在、開催予定のイベントはありません。</p>';
            return;
        }
        this.scheduleListContainer.innerHTML =
            this.#filteredSchedules
                .map((schedule) => schedule.toHtml())
                .join('') + `<div style="height:60px;"></div>`; //一番下の要素が隠れないように余白を作る
    }

    subscribeButton() {
        const allButtons = getElementListSafely(() =>
            this.scheduleSection.querySelectorAll(
                '.schedule__container--school-btns button'
            )
        );
        allButtons.forEach((btn) => {
            const btnId = btn.id.split('__')[1];
            btn.addEventListener('click', () => {
                allButtons.forEach((_btn) => _btn.classList.remove('selected'));
                btn.classList.add('selected');
                if (btnId === 'all') {
                    this.#filteredSchedules = this.#allSchedules;
                } else {
                    this.#filteredSchedules = this.#allSchedules.filter(
                        (schedule) => schedule.schoolCode === btnId
                    );
                }
                this.render();
            });
        });
    }
}
