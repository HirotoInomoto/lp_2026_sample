import { FormCoursesManager } from '../api/form_courses.js';
import { changeDisplayState } from '../tools/change_display_state.js';

export class FormController {
    constructor() {
        // 操作対象は全てここで取得する
        this.formSelector = document.querySelector('.form__body--selector');
        this.freeEventForm = document.querySelector(
            '.form__body--main--freeEvent'
        );
        this.freeTrialForm = document.querySelector(
            '.form__body--main--freeTrial'
        );
        this.requestInfoForm = document.querySelector(
            '.form__body--main--requestInfo'
        );
        // 初期値のセット
        // 現在選択されているformの名前
        this.currentSelectedFormName = this.formSelector.formSelector.value;
        // イベントのセット
        this.setEvents();
        // formEventsManagerの初期化
        this.formCoursesManager = new FormCoursesManager();
        this.formSetUp();
        this.modalController = new ModalController();
    }
    // 非同期実行が必要なセットアップ
    async formSetUp() {
        const allCourses = await this.formCoursesManager.getAll();
        const freeEventCourses = this.getOnlyFreeEventCoureses(allCourses);
        const freeTrialCourses = this.getOnlyFreeTrialCourses(
            this.getOnlyFreeTrialCourses(allCourses)
        );
        this.setFreeEventForm(freeEventCourses);
        this.setFreeTrialForm(freeTrialCourses);
        this.setRequestInfoForm();
    }

    setEvents() {
        this.formSelector.addEventListener('change', () => {
            this.newSelectedFormName = this.formSelector.formSelector.value;
            this.changeDisplayedForm();
        });
    }
    /* 無料イベントのセットアップ */
    setFreeEventForm(courses) {
        const schoolNameInput =
            this.freeEventForm.querySelector('.school__choice');
        const courseSelectInput =
            this.freeEventForm.querySelector('.course__choice');
        // 校舎選択時の処理
        schoolNameInput.addEventListener('change', () => {
            const newSchoolName = schoolNameInput.value;
            const newFilteredCourses = this.filterCoursesBySchoolName(
                courses,
                newSchoolName
            );
            this.changeDisplayCourses(courseSelectInput, newFilteredCourses);
            this.handleNoneValueOption(
                newSchoolName,
                courseSelectInput,
                newFilteredCourses
            );
        });
        // form送信時の処理
        this.freeEventForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const toAddress = this.getToAddress(this.freeEventForm);
            this.onSubmit(this.freeEventForm, toAddress);
        });
    }

    setFreeTrialForm(courses) {
        const schoolNameInput =
            this.freeTrialForm.querySelector('.school__choice');
        const courseSelectInput =
            this.freeTrialForm.querySelector('.course__choice');
        schoolNameInput.addEventListener('change', () => {
            const newSchoolName = schoolNameInput.value;
            const newFilteredCourses = this.filterCoursesBySchoolName(
                courses,
                newSchoolName
            );
            this.changeDisplayCourses(courseSelectInput, newFilteredCourses);
            this.handleNoneValueOption(
                newSchoolName,
                courseSelectInput,
                newFilteredCourses
            );
        });
        // form送信時の処理
        this.freeTrialForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const toAddress = this.getToAddress(this.freeTrialForm);
            this.onSubmit(this.freeTrialForm, toAddress);
        });
    }
    setRequestInfoForm() {
        // form送信時の処理
        this.requestInfoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const toAddress = this.getToAddress(this.requestInfoForm);
            this.onSubmit(this.requestInfoForm, toAddress);
        });
    }

    getToAddress(form) {
        return form.querySelector("input[type='email']").value;
    }

    async onSubmit(form, toAddress) {
        const formData = new FormData(form);
        try {
            const res = await fetch(form.action, {
                method: form.method,
                body: formData,
                mode: 'no-cors',
            });

            if (res) {
                // submitButton.textContent = "送信が完了しました";
                form.reset();
                this.modalController.showModal(toAddress);

                // Google Analyticsで申し込みを検出するためのイベントを設置
                // 無料イベント
                if (
                    form.getAttribute('class') ==
                    'form__body--main form__body--main--freeEvent'
                ) {
                    gtag('event', 'newyear_25_event_apply', {
                        event_category: 'form',
                        event_label: 'newyear_25_event_apply',
                        value: 1,
                    });
                    let url = new URL(window.location.href);
                    let params = url.searchParams;
                    if (params.get('rd_code')) {
                        this.sendGetAccess(
                            '6656',
                            '18986',
                            `event_${this.getTimeStamp()}`,
                            params.get('rd_code')
                        );
                    }
                }
                // 無料体験会
                else if (
                    form.getAttribute('class') ==
                    'form__body--main form__body--main--freeTrial'
                ) {
                    gtag('event', 'newyear_25_trial_apply', {
                        event_category: 'form',
                        event_label: 'newyear_25_trial_apply',
                        value: 1,
                    });
                    let url = new URL(window.location.href);
                    let params = url.searchParams;
                    if (params.get('rd_code')) {
                        this.sendGetAccess(
                            '6656',
                            '18988',
                            `trial_${this.getTimeStamp()}`,
                            params.get('rd_code')
                        );
                    }
                }
                // 資料請求
                else if (
                    form.getAttribute('class') ==
                    'form__body--main form__body--main--requestInfo'
                ) {
                    gtag('event', 'newyear_25_brochure_apply', {
                        event_category: 'form',
                        event_label: 'newyear_25_brochure_apply',
                        value: 1,
                    });
                    let url = new URL(window.location.href);
                    let params = url.searchParams;
                    if (params.get('rd_code')) {
                        this.sendGetAccess(
                            '6656',
                            '18990',
                            `brochure_${this.getTimeStamp()}`,
                            params.get('rd_code')
                        );
                    }
                }
            }
        } catch (error) {
            console.error('送信エラー:', error);
        }
    }

    /* value=""の表示を管理する */
    handleNoneValueOption(newSchoolName, courseSelectInput, filteredcourses) {
        const noneValueOption =
            courseSelectInput.querySelector("option[value='']");
        if (newSchoolName === '') {
            // 校舎が選択されていない状態
            noneValueOption.innerHTML = '先に校舎を選択してください';
        } else if (filteredcourses.length === 0) {
            noneValueOption.innerHTML = '選択された校舎にはコースがありません';
        } else {
            noneValueOption.innerHTML = '未選択';
        }
    }
    /**
     *指定された<select>内に表示している選択肢を変更する
     *
     * @param {*} courseSelectInput　対象となるselectタグ
     * @param {*} courses　埋めるcourses
     * @memberof FormController
     */
    changeDisplayCourses(courseSelectInput, courses) {
        this.resetCourseOption(courseSelectInput);
        const fg = new DocumentFragment();
        courses.forEach((course) => {
            const newOption = this.createOption(
                course.displayTitle(),
                course.displayTitle()
            );
            fg.appendChild(newOption);
        });
        courseSelectInput.appendChild(fg);
    }

    createOption(value, displayName) {
        const newCourseOption = document
            .querySelector('template#course__option')
            .content.cloneNode(true)
            .querySelector('option');
        newCourseOption.value = value;
        newCourseOption.innerHTML = displayName;
        return newCourseOption;
    }

    /* <select>タグ内のvalue=""以外の全てのoptionを削除する */
    resetCourseOption(selectInput) {
        const options = selectInput.querySelectorAll('option'); // 全ての<option>を取得
        options.forEach((option) => {
            if (option.value !== '') {
                option.remove(); // value が空でないものを削除
            }
        });
    }

    // /* formの送信完了を伝えるformを送信 */
    // showFormSendedModal(toAddress) {}
    // hiddenFormSendedModal(toAddress) {}

    /* formSelectorの変化で発火する　formの切り替え */
    changeDisplayedForm() {
        this.displayForm(this.newSelectedFormName);
        this.hiddenForm(this.currentSelectedFormName);
        this.currentSelectedFormName = this.newSelectedFormName;
    }

    /* formの表示を行う */
    displayForm(formName) {
        const newDisplayedForm = this.getFormFromName(formName);
        changeDisplayState(newDisplayedForm, true);
    }

    /* formの削除の非表示化を行う */
    hiddenForm(formName) {
        const currentDisplayedForm = this.getFormFromName(formName);
        changeDisplayState(currentDisplayedForm, false);
    }

    /* formNameからformの取得をする */
    getFormFromName(formName) {
        return document.querySelector(`.form__body--main--${formName}`);
    }

    /* 学校名でfilterをかける(学校名不記載の場合は何も中身なし) */
    filterCoursesBySchoolName(courses, schoolName) {
        if (schoolName === undefined) {
            return [];
        }
        return courses.filter(
            (formEvent) => formEvent.schoolName === schoolName
        );
    }
    /* 体験会のみを取得する*/
    getOnlyFreeTrialCourses(courses) {
        return courses.filter((formCourse) => formCourse.isTrial);
    }
    // 無料イベントのみを取得する
    getOnlyFreeEventCoureses(courses) {
        return courses.filter((formCourse) => !formCourse.isTrial);
    }

    // アフィリエイトのidとしてタイムスタンプを発行する
    getTimeStamp() {
        let date = new Date();
        date.getMonth(); // 1 (月)
        date.getDate(); // 11 (日)
        date.getDay(); // 4 (曜)
        date.getHours(); // 11 (時)
        date.getMinutes(); // 30 (分)
        date.getSeconds();
        return `${date.getMonth()}_${date.getDate()}_${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}`;
    }

    // アフィリエイトで、リクエストを送信
    sendGetAccess(p_id, pc_id, m_v, rd_code) {
        const baseUrl = 'https://r.moshimo.com/af/r/result';
        const params = {
            p_id: p_id,
            pc_id: pc_id,
            m_v: m_v,
            rd_code: rd_code,
        };

        const queryString = Object.entries(params)
            .map(
                ([key, value]) =>
                    `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
            )
            .join('&');

        const url = `${baseUrl}?${queryString}`;
        console.log(url);

        fetch(url)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then((data) => console.log(data))
            .catch((error) =>
                console.error(
                    'There was a problem with your fetch operation:',
                    error
                )
            );
    }
}

class ModalController {
    constructor() {
        this.tag = document.querySelector('.form__modal');
        this.toAddressTag = this.tag.querySelector('.toAddress');
        this.closeBtn = this.tag.querySelector('.form__modal--close-btn');
        this.bg = document.querySelector('.bg');
        this.setEvents();
    }
    setEvents() {
        this.closeBtn.addEventListener('click', () => {
            this.hiddenModal();
        });
        this.bg.addEventListener('click', () => {
            this.hiddenModal();
        });
    }
    hiddenModal() {
        changeDisplayState(this.tag, false);
        changeDisplayState(this.bg, false);
    }

    showModal(toAddress) {
        this.toAddressTag.innerHTML = toAddress;
        changeDisplayState(this.bg, true);
        changeDisplayState(this.tag, true);
    }
}
