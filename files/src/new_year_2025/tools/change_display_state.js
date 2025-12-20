/*  表示・非表示を切り替える */
// component自体に非表示時の状態をhiddenクラスで指定していることを前提としている
export const changeDisplayState = (component, toDisplay) => {
    if (toDisplay === true && component.classList.contains('hidden')) {
        component.classList.remove('hidden');
    } else if (toDisplay === false) {
        component.classList.add('hidden');
    }
};
