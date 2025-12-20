// import { Calendar } from "@fullcalendar/core";
// import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from 'https://cdn.jsdelivr.net/npm/@fullcalendar/interaction@6.1.15/+esm';
import { CalendarCoursesManager } from '../api/calendar_courses.js';
import { Calendar } from 'https://cdn.skypack.dev/@fullcalendar/core@6.1.15';
import dayGridPlugin from 'https://cdn.skypack.dev/@fullcalendar/daygrid@6.1.15';
import { CalendarSchoolButtonManager } from './calendar_school_button.js';
export class CalendarController {
    constructor() {
        this.buttonManager = new CalendarSchoolButtonManager();
        this.calendarCoursesManager = new CalendarCoursesManager();
        this.setCourses();
        // 必要要素の取得
        this.calendarTable = document.querySelector('.calendar__table');
    }

    async setCourses() {
        this.calendar = await this.initializeCalendar();
        const calendarDictCourses = await this.calendarCoursesManager.getAll();
        await this.calendar.addEventSource(calendarDictCourses);
        this.havingCourseDates =
            this.calendarCoursesManager.getAllDatesWithCourse();
        this.getAllDatesAndSchoolMapWithCourse =
            this.calendarCoursesManager.getAllDatesAndSchoolMapWithCourse();
        this.attachCourseFlagToDate();
        // 現在選択されている日付
        this.currentSelectedDateTag = undefined;
        this.addHeaderInfo();
    }

    async initializeCalendar() {
        this.calendarEl = document.getElementById('calendar');
        const calendar = new Calendar(this.calendarEl, {
            plugins: [dayGridPlugin, interactionPlugin],
            initialView: 'dayGridMonth',
            headerToolbar: {
                left: 'prev',
                center: 'title',
                right: 'next',
            },
            validRange: function () {
                return {
                    start: '2025-02-01',
                    end: '2025-04-30',
                };
            },
            dayCellContent: function (e) {
                return e.dayNumberText.replace('日', '');
            },
            locale: 'ja',
            fixedWeekCount: false,
            showNonCurrentDates: false,
            height: 'auto',
            dateClick: (e) => {
                this.handleDateClick(e);
            },
            eventDidMount: () => {
                this.updateMonthCallback();
            },
        });
        calendar.render();
        return calendar;
    }
    changeHeaderFormat() {
        const calendarTitle = document.querySelector('.fc-toolbar-title');
        const calendarTitleText = calendarTitle.innerText;
        const yearMonthList = calendarTitleText.match(
            /(\d{4})年\s*(\d{1,2})月/
        );
        if (yearMonthList) {
            const year = yearMonthList[1];
            const month = yearMonthList[2];
            calendarTitle.innerHTML = `
            ${year}月<span class="ec-title-month">${month}</span>月`;
        }
    }

    /* 月が変更された際に実行する関数 */
    updateMonthCallback() {
        this.changeHeaderFormat();
        // 初回レンダリングの場合
        if (this.havingCourseDates == undefined) {
            return;
        }
        // 2回目以降のレンダリングの場合(これが本当の月移動)
        this.attachCourseFlagToDate();
        this.buttonManager.keepActiveSchool();
    }

    /* courseが存在する曜日にhas-courseフラクを立てる */
    attachCourseFlagToDate() {
        const allDayCells = this.calendarEl.querySelectorAll('.fc-daygrid-day');

        allDayCells.forEach((cell) => {
            // 各セルのdateを取得
            const dateStr = cell.getAttribute('data-date');
            // if (this.havingCourseDates.includes(dateStr)) {
            //     cell.classList.add("has-course");
            // } else {
            //     cell.classList.remove("has-course");
            // }
            if (
                this.getAllDatesAndSchoolMapWithCourse.hasOwnProperty(dateStr)
            ) {
                const schoolNamesStr =
                    this.getAllDatesAndSchoolMapWithCourse[dateStr];
                cell.classList.add('has-course');
                schoolNamesStr.forEach((schoolNameStr) => {
                    cell.classList.add(schoolNameStr);
                });
            } else {
                cell.classList.remove(`has-course`);
            }
        });
    }

    handleDateClick(info) {
        // クリックされた日付に実施されるcourseの情報
        const newSelectedDate = info.dateStr;
        const newSelectedDateTag = document.querySelector(
            `td[data-date="${info.dateStr}"]`
        );
        const courses = this.calendar.getEvents().filter((course) => {
            return course.startStr === newSelectedDate;
        });
        this.updateCalandarTable(courses);
        this.updateSeletedDate(newSelectedDateTag);
        this.buttonManager.updateDisplay();
    }

    // 現在選択されている日付tagを更新する
    updateSeletedDate(newSelectedDateTag) {
        if (this.currentSelectedDateTag) {
            this.currentSelectedDateTag.classList.remove('selected');
        }
        newSelectedDateTag.classList.add('selected');
        this.currentSelectedDateTag = newSelectedDateTag;
    }

    updateCalandarTable(courses) {
        this.resetCalendarTable();
        courses.forEach((course) => {
            this.createCalendarTableItem(course.classNames[0], course.title);
        });
    }

    createCalendarTableItem(schoolName, title) {
        const newItem = document
            .querySelector('#calendar__table--item')
            .content.cloneNode(true)
            .querySelector(`.item--${schoolName}`);
        const newItemTitleTag = newItem.querySelector('.item__title');
        newItemTitleTag.innerHTML = title;
        this.calendarTable.appendChild(newItem);
    }

    resetCalendarTable() {
        while (this.calendarTable.firstChild) {
            this.calendarTable.removeChild(this.calendarTable.firstChild);
        }
    }

    /* カレンダーのヘッダーに説明文を追加する */
    addHeaderInfo() {
        const headerToolbar = document.querySelector('.fc-header-toolbar');
        const headerInfoTag = document.createElement('div');
        headerInfoTag.className = 'header-info';
        headerInfoTag.innerHTML = `<p class="header-info__detail">時間は会により異なります。<br>申し込みフォームにてご確認ください。</p>
        <p class="header-info__detail">※定員に達した場合は、別の時間枠を追加することもあります。</p>`;
        headerToolbar.appendChild(headerInfoTag);
    }
}
