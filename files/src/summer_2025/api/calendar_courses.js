import ENV from '../../../env.js';
export class CalendarCourse {
    /**
     *
     * @param {string} id
     * @param {string} title
     * @param {string} date
     * @param {string} schoolName
     */
    constructor(id, title, date, schoolName) {
        this.id = id;
        this.title = title;
        this.date = date;
        this.classNames = this.getClassNames(schoolName);
        this.schoolName = schoolName;
        this.color = this.getColor(schoolName);
    }
    /**
     * @typedef {Object} CalendarResponse
     * @property {number} [id]
     * @property {string} [custom_id]
     * @property {string} [title]
     * @property {number} [school_code_id]
     * @property {string} [date]
     */
    /**
     *
     * @param {CalendarResponse} data
     * @returns {CalendarCourse}
     */
    static fromJSON(data) {
        return new CalendarCourse(
            data.custom_id,
            CalendarCourse.convertToShortTitle(data.title),
            data.date,
            CalendarCourse.convertIdToSchoolName(data.school_code_id)
        );
    }

    static convertToShortTitle(title) {
        const CONVERT_TITLE = new Map([
            ['無料体験会', '無料体験'],
            ['Pythonマスター講座', 'Python'],
            ['SUPER MAN DASH!', '2Dゲーム'],
            ['機械学習で日曜のじゃんけんに勝とう！', 'じゃんけん'],
            ['人狼ゲームを作ろう！', '人狼'],
            ['タイピングゲームを自動化しよう！', 'タイピング'],
            ['ホワイトハッカーになろう！', 'ハッカー'],
        ]);
        return CONVERT_TITLE.get(title) || title;
    }

    getColor(schoolName) {
        const SCHOOL_COLOR = {
            京大本校: '#32b16c',
            梅田校: '#eb6877',
            飯田橋校: '#00a0e9',
            横浜校: '#f39800',
            秋葉原校: '#556fb5',
        };
        return SCHOOL_COLOR[schoolName];
    }
    getClassNames(schoolName) {
        const SCHOOL_CLASS_NAMES = {
            京大本校: 'kyoto',
            梅田校: 'umeda',
            飯田橋校: 'iidabashi',
            横浜校: 'yokohama',
            秋葉原校: 'akihabara',
        };
        return SCHOOL_CLASS_NAMES[schoolName];
    }
    /**
     * school_code_idを後者に変更する
     * @param {number} schoolId
     * @returns {string}
     */
    static convertIdToSchoolName(schoolId) {
        const schoolCodes = ENV.SCHOOL_CODE;
        return schoolCodes.filter((schoolCode) => schoolCode.id === schoolId)[0]
            .name;
    }

    toDict() {
        return {
            id: this.id,
            title: this.title,
            date: this.date,
            classNames: this.classNames,
            schoolName: this.schoolName,
            color: this.color,
        };
    }
}

export class CalendarCoursesManager {
    constructor() {
        const rowUrl = `${window.location.origin}${window.location.pathname}`;
        this.calendarApiUrl = `${ENV.API_URL}/lp/calendar-data?lp_path=${rowUrl}`;
        this.calendarCourses = [];
        // 辞書型に変換したリスト
        this.calendarDictCourses = [];
    }
    async getAll(calendarApiUrl = this.calendarApiUrl) {
        return fetch(calendarApiUrl)
            .then((response) => response.json())
            .then((data) => {
                // jsonから取得したすべてのformCoursesを保持する
                this.calendarCourses = data.map(CalendarCourse.fromJSON);
                this.calendarDictCourses = this.calendarCourses
                    .map((calendarCourse) => calendarCourse.toDict())
                    .filter((course) => course.schoolName !== '秋葉原校');
                console.log(this.calendarDictCourses);
                return this.calendarDictCourses;
            })
            .catch((error) => console.error('Error loading JSON:', error));
    }
    /* courseが存在する全ての日程を返す */
    getAllDatesWithCourse() {
        const allDatesWithCourse = this.calendarCourses.map(
            (calendarCourse) => calendarCourse.date
        );
        return [...new Set(allDatesWithCourse)];
    }
    /* courseが存在する全ての日程をkey　それぞれの日程で実施する校舎名-course をvalue */
    getAllDatesAndSchoolMapWithCourse() {
        const dateToSchoolNamesMap = {};

        // 各日付に対応する学校名のリストを作成
        this.calendarCourses.forEach((calendarCourse) => {
            const date = calendarCourse.date;
            const schoolName = `${calendarCourse.classNames}-course`;

            if (!dateToSchoolNamesMap[date]) {
                dateToSchoolNamesMap[date] = new Set();
            }
            dateToSchoolNamesMap[date].add(schoolName);
        });

        // Setを空白区切りの文字列に変換
        const dateToSchoolNamesList = {};
        Object.keys(dateToSchoolNamesMap).forEach((date) => {
            dateToSchoolNamesList[date] = Array.from(
                dateToSchoolNamesMap[date]
            );
        });

        return dateToSchoolNamesList;
    }
    /**
     * カレンダーで表示する最も早い日付と最も遅い日付を返す（YYYY-MM-DD形式）
     * ※それぞれの月の初日と最終日に丸める
     * @returns {{ start: string, end: string } | null}
     */
    getDateRange() {
        if (this.calendarCourses.length === 0) {
            return null;
        }

        const dates = this.calendarCourses.map(
            (course) => new Date(course.date)
        );
        const minDate = new Date(Math.min(...dates));
        const maxDate = new Date(Math.max(...dates));

        // 月の初日に補正
        const firstOfMonth = new Date(
            minDate.getFullYear(),
            minDate.getMonth(),
            1
        );

        // 月の最終日に補正
        const lastOfMonth = new Date(
            maxDate.getFullYear(),
            maxDate.getMonth() + 1,
            1
        );

        const formatDate = (date) =>
            `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

        return {
            start: formatDate(firstOfMonth),
            end: formatDate(lastOfMonth),
        };
    }
}
