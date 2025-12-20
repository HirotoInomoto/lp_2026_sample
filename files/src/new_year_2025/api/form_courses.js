class FormCourse {
    constructor(id, title, schoolName, startTime, endTime, isTrial) {
        this.id = id;
        this.title = title;
        this.schoolName = schoolName;
        this.startTime = startTime;
        this.endTime = endTime;
        this.isTrial = isTrial;
    }

    // オブジェクトをJSON形式に変換する
    // toJSON() {
    //     return {
    //         id: this.id,
    //         title: this.title,
    //         schoolName: this.schoolName,
    //         startTime: this.startTime,
    //         endTime: this.endTime,
    //         isTrial: this.isTrial,
    //     };
    // }

    // JSON文字列からオブジェクトを生成する静的メソッド
    static fromJSON(data) {
        return new FormCourse(
            data.id,
            data.title,
            data.schoolName,
            data.startTime,
            data.endTime,
            data.isTrial
        );
    }

    isExpired() {
        const startTime = new Date(this.startTime);
        const expiredTime = new Date(startTime);
        expiredTime.setHours(startTime.getHours() - 48); // startTimeの48時間前の時間を設定
        const now = new Date();
        return now > expiredTime;
    }
    /* 表示用のタイトル */
    displayTitle() {
        return `${this.title} ${this.formatedDateTime()}(${this.schoolName})`;
    }
    /* 表示用の時刻 (YYYY/MM/DD HH:mm~HH:mm)*/
    formatedDateTime() {
        const padZero = (num) => String(num).padStart(2, '0');

        const startTime = new Date(this.startTime);
        const endTime = new Date(this.endTime);

        const year = startTime.getFullYear();
        const month = startTime.getMonth() + 1; // 月は0始まり
        const day = padZero(startTime.getDate());

        const startHour = padZero(startTime.getHours());
        const startMinute = padZero(startTime.getMinutes());
        const endHour = padZero(endTime.getHours());
        const endMinute = padZero(endTime.getMinutes());

        return `${year}/${month}/${day} ${startHour}:${startMinute}~${endHour}:${endMinute}`;
    }
}

export class FormCoursesManager {
    constructor() {
        this.filePath = '../src/new_year_2025/data/form_courses.json';
        this.formCourses = [];
    }

    // JSONファイルからデータを読み込み、FormEventオブジェクトのリストに変換
    async getAll(filePath = this.filePath) {
        return fetch(filePath)
            .then((response) => response.json())
            .then((data) => {
                // jsonから取得したすべてのformCoursesを保持する
                this.formCourses = data
                    .map(FormCourse.fromJSON)
                    .filter((formCourse) => {
                        return !formCourse.isExpired();
                    });
                return this.formCourses;
            })
            .catch((error) => console.error('Error loading JSON:', error));
    }

    // FormEventオブジェクトのリストをJSON文字列に変換
    // toJSONString() {
    //     return JSON.stringify(this.formEvents.map((event) => event.toJSON()));
    // }

    // JSON文字列からFormEventオブジェクトのリストに変換
    fromJSONString(jsonString) {
        const data = JSON.parse(jsonString);
        this.formCourses = data.map(FormCourse.fromJSON);
        return this.formCourses;
    }
}
