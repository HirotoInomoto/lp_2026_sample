// @ts-check
import ENV from '../../../env.js';

const DAYS = ['日', '月', '火', '水', '木', '金', '土'];
/**
 * @typedef {typeof ENV.SCHOOL_CODE[number]['code']} SchoolCode
 */

/**
 * @typedef {Object} ScheduleDate
 * @property {string} startAt
 * @property {string|null} endAt
 */

/**
 * @typedef {Object} ScheduleTime
 * @property {string} startAt
 * @property {string} endAt
 */

export class Schedule {
    /** @type {string|null} */
    #htmlContent = null;

    /**
     * @param {object} params
     * @param {string} params.id
     * @param {string} params.title
     * @param {ScheduleDate} params.date
     * @param {ScheduleTime} params.time
     * @param {SchoolCode} params.schoolCode
     * @param {string[]} params.tags
     */
    constructor({ id, title, date, time, schoolCode, tags }) {
        /** @type {string} */
        this.id = id;

        /** @type {string} */
        this.title = title;

        /** @type {ScheduleDate} */
        this.date = date;

        /** @type {ScheduleTime} */
        this.time = time;

        /** @type {SchoolCode} */
        this.schoolCode = schoolCode;

        /** @type {string[]} */
        this.tags = tags;
    }
    /**
     * @returns {boolean}
     */
    isExpired() {
        const startTime = new Date(
            `${this.date.startAt}T${this.time.startAt}:00`
        );
        const expiredTime = new Date(startTime);
        expiredTime.setHours(startTime.getHours() - 48);
        const now = new Date();
        return now > expiredTime;
    }

    /**
     *
     * @param {string} dateStr yyyy-mm-dd形式
     */
    #toDay(dateStr) {
        const date = new Date(dateStr);
        return DAYS[date.getDay()];
    }

    /**
     *
     * @param {string} dataStr yyyy-mm-dd形式
     */
    #toDisplayDate(dataStr) {
        const [_, month, day] = dataStr.split('-');
        return `${month}/${day}`;
    }
    /**
     *
     * @param {SchoolCode} code
     */
    #toDisplaySchoolCode(code) {
        return (
            ENV.SCHOOL_CODE.find((school) => school.code === code)?.name ?? ''
        );
    }

    toHtml() {
        if (this.#htmlContent) return this.#htmlContent;
        this.#htmlContent = `<div class="item item-${this.id}">
                                <div class="item__header">
                                    <div class="item__header--date">
                                        <div class="date-block">
                                            <p class="date">${this.#toDisplayDate(this.date.startAt)}</p>
                                            <p class="day" data-day=${this.#toDay(this.date.startAt)}>${this.#toDay(this.date.startAt)}</p>
                                        </div>
                                        ${
                                            this.date.endAt != null
                                                ? `
                                                <div class="line">
                                                    <img src="../assets/images/winter_2025/svg/arrow_right.svg" alt="=>"/>
                                                </div>
                                                <div class="date-block">
                                                    <p class="date">${this.#toDisplayDate(this.date.endAt)}</p>
                                                    <p class="day" data-day=${this.#toDay(this.date.endAt)}>${this.#toDay(this.date.endAt)}</p>
                                                </div>
                                                `
                                                : ''
                                        }
                                    </div>
                                    <div class="item__header--school ${this.schoolCode}">
                                        <p>${this.#toDisplaySchoolCode(this.schoolCode)}</p>
                                    </div>
                                    <div class="item__header--time pc-only">
                                        <p class="time">${this.time.startAt}~${this.time.endAt}</p>
                                    </div>
                                </div>
                                <div class="item__time mobile-only">
                                        <p class="time">${this.time.startAt}~${this.time.endAt}</p>
                                    </div>
                                <div class="item__body">
                                    <div class="item__body--title">${this.title}</div>
                                    <div class="item__body--tags">
                                        ${this.tags
                                            .map(
                                                (tag) => `
                                            <div class="tag">
                                                <p>#${tag}</p>
                                            </div>`
                                            )
                                            .join('')}
                                    </div>
                                </div>
                            </div>
                `;
        return this.#htmlContent;
    }
}

export class SchedulesApi {
    /** @type {Schedule[]} */
    #schedules = [];

    /**
     * @returns {Promise<Schedule[]>}
     */
    async fetchAll() {
        const filePath = '../src/winter_2025/data/schedules.json';
        const res = await fetch(filePath);
        const data = await res.json();
        this.#schedules = data
            .map(
                (
                    /** @type {{ id: string; title: string; date: ScheduleDate; time: ScheduleTime; schoolCode: any; tags: string[]; }} */ s
                ) =>
                    new Schedule({
                        id: s.id,
                        title: s.title,
                        date: s.date,
                        time: s.time,
                        schoolCode: s.schoolCode,
                        tags: s.tags,
                    })
            )
            .filter((/** @type {Schedule} */ s) => !s.isExpired());
        return this.#schedules;
    }
}
