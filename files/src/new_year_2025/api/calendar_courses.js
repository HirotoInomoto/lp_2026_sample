export class CalendarCourse {
    constructor(id, title, date, schoolName) {
        this.id = id;
        this.title = title;
        this.date = date;
        this.classNames = this.getClassNames(schoolName);
        this.schoolName = schoolName;
        this.color = this.getColor(schoolName);
    }
    static fromJSON(data) {
        return new CalendarCourse(
            data.id,
            data.title,
            data.date,
            data.schoolName
        );
    }

    getColor(schoolName) {
        const SCHOOL_COLOR = {
            京大本校: '#32b16c',
            梅田校: '#eb6877',
            東京飯田橋校: '#00a0e9',
            横浜校: '#f39800',
            秋葉原校: '#556fb5',
        };
        return SCHOOL_COLOR[schoolName];
    }
    getClassNames(schoolName) {
        const SCHOOL_CLASS_NAMES = {
            京大本校: 'kyoto',
            梅田校: 'umeda',
            東京飯田橋校: 'iidabashi',
            横浜校: 'yokohama',
            秋葉原校: 'akihabara',
        };
        return SCHOOL_CLASS_NAMES[schoolName];
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
        this.filePath = '../src/new_year_2025/data/calendar_courses.json';
        this.calendarCourses = [];
        // 辞書型に変換したリスト
        this.calendarDictCourses = [];
    }
    async getAll(filePath = this.filePath) {
        return fetch(filePath)
            .then((response) => response.json())
            .then((data) => {
                // jsonから取得したすべてのformCoursesを保持する
                this.calendarCourses = data.map(CalendarCourse.fromJSON);
                this.calendarDictCourses = this.calendarCourses.map(
                    (calendarCourse) => calendarCourse.toDict()
                );
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
}
