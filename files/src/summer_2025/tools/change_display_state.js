/**
 * [component]の表示・非表示を切り替える。
 * [component]にhiddenクラスが当てられた時の表示がCSSで記述されていることを前提としている。
 * @param {Node} component
 * @param {boolean} toDisplay
 * @returns {void}
 */
export const changeDisplayState = (component, toDisplay) => {
    if (toDisplay === true && component.classList.contains('hidden')) {
        component.classList.remove('hidden');
    } else if (toDisplay === false) {
        component.classList.add('hidden');
    }
};
