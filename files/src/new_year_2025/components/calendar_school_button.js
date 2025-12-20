export class CalendarSchoolButtonManager {
    constructor() {
        this.calendar = document.querySelector('#calendar');
        this.schoolButtons = document.querySelectorAll('.event_btn');
        this.initializeButtons();
    }

    // 初期状態をセットアップ
    initializeButtons() {
        // 初期状態は全て active を外す
        // this.schoolButtons.forEach((button) =>
        //     button.classList.remove("active")
        // );
        this.attachEventListeners();
        this.updateDisplay();
    }

    // ボタンにイベントリスナーを追加
    attachEventListeners() {
        const buttonNames = this.getAllSchoolNames();
        buttonNames.forEach((name) => {
            const button = document.getElementById(`${name}_display`);
            button.addEventListener('click', (e) => {
                this.handleButtonClick(e.target.id, buttonNames);
            });
        });
    }

    // ボタンクリック時の処理
    handleButtonClick(clickedId, buttonNames) {
        if (clickedId === 'all_display') {
            buttonNames.forEach((name) => this.activateSchool(name));
            // 追記
            this.schoolButtons.forEach((schoolButton) => {
                if (schoolButton.id !== 'all_display') {
                    schoolButton.classList.remove('active');
                }
            });
            // 追記終わり(全選択の時、activeをつけるボタンはは「全校舎」ボタンのみ)
        } else {
            // buttonNames.forEach((name) => {
            //     if (`${name}_display` === clickedId) {
            //         this.activateSchool(name);
            //     } else {
            //         this.deactivateSchool(name);
            //     }
            // });
            const deactiveButtons = buttonNames.filter(
                (name) => `${name}_display` != clickedId
            );
            deactiveButtons.forEach((name) => this.deactivateSchool(name));
            this.activateSchool(clickedId.split('_display')[0]);
        }
    }

    // 校舎をアクティブ化
    activateSchool(schoolName) {
        const elements = this.calendar.querySelectorAll(`.${schoolName}`);
        elements.forEach((el) => (el.style.display = 'flex'));
        // ====下のcalendarTableの校舎ごとの表示===
        const calendarTable = document.querySelectorAll(`.item--${schoolName}`);
        calendarTable.forEach((el) => {
            el.style.display = 'flex';
        });

        document
            .querySelectorAll(`.has-course.${schoolName}-course`)
            .forEach((dateCell) => {
                dateCell
                    .querySelector(`.fc-daygrid-day-number`)
                    .classList.remove('hide');
            });
        // ====例外追加終わり=====
        document
            .getElementById(`${schoolName}_display`)
            .classList.add('active');
    }

    // 校舎を非アクティブ化
    deactivateSchool(schoolName) {
        const elements = this.calendar.querySelectorAll(`.${schoolName}`);
        elements.forEach((el) => (el.style.display = 'none'));
        // ====下のcalendarTableの校舎ごとの表示===
        const calendarTable = document.querySelectorAll(`.item--${schoolName}`);
        calendarTable.forEach((el) => {
            el.style.display = 'none';
        });
        document
            .querySelectorAll(`.has-course.${schoolName}-course`)
            .forEach((dateCell) => {
                dateCell
                    .querySelector(`a.fc-daygrid-day-number`)
                    .classList.add('hide');
            });
        // ====例外追加終わり=====
        document
            .getElementById(`${schoolName}_display`)
            .classList.remove('active');
    }

    // 現在アクティブな校舎を取得
    getActiveSchools() {
        const activeSchools = [];
        if (
            document.getElementById('all_display').classList.contains('active')
        ) {
            activeSchools.push(...this.getAllSchoolNames());
            return activeSchools;
        }

        this.schoolButtons.forEach((button) => {
            if (button.classList.contains('active')) {
                activeSchools.push(button.id.replace('_display', ''));
            }
        });

        // アクティブなボタンがない場合、全てをアクティブと見なす
        if (activeSchools.length === 0) {
            this.schoolButtons.forEach((button) => {
                activeSchools.push(button.id.replace('_display', ''));
            });
        }
        return activeSchools;
    }

    // 全ての校舎名を取得
    getAllSchoolNames() {
        return Array.from(this.schoolButtons).map((button) =>
            button.id.replace('_display', '')
        );
    }

    // 表示を更新
    updateDisplay() {
        const activeSchools = this.getActiveSchools();
        const allSchools = this.getAllSchoolNames();

        if (activeSchools.length === allSchools.length) {
            // allSchools.forEach((school) => this.activateSchool(school));
        } else {
            // allSchools.forEach((school) => {
            //     if (activeSchools.includes(school)) {
            //         this.activateSchool(school);
            //     } else {
            //         this.deactivateSchool(school);
            //     }
            // });
            const deactiveSchools = Array.from(
                new Set(
                    allSchools.filter(
                        (school) => !activeSchools.includes(school)
                    )
                )
            );
            deactiveSchools.forEach((school) => this.deactivateSchool(school));
            activeSchools.forEach((school) => this.activateSchool(school));
        }
        // 追記
        if (activeSchools.includes('all')) {
            this.schoolButtons.forEach((schoolButton) => {
                if (schoolButton.id !== 'all_display') {
                    schoolButton.classList.remove('active');
                }
            });
        }
    }

    // 月変更後のアクティブな校舎を維持
    keepActiveSchool() {
        const activeSchools = this.getActiveSchools();
        const allSchools = this.getAllSchoolNames();

        const deactiveSchools = Array.from(
            new Set(
                allSchools.filter((school) => !activeSchools.includes(school))
            )
        );
        deactiveSchools.forEach((school) => this.deactivateSchool(school));
        activeSchools.forEach((school) => this.activateSchool(school));

        // allSchools.forEach((school) => {
        //     if (activeSchools.includes(school)) {
        //         this.activateSchool(school);
        //     } else {
        //         this.deactivateSchool(school);
        //     }
        // });
        // 追記
        if (activeSchools.includes('all')) {
            this.schoolButtons.forEach((schoolButton) => {
                if (schoolButton.id !== 'all_display') {
                    schoolButton.classList.remove('active');
                }
            });
        }
    }
}
