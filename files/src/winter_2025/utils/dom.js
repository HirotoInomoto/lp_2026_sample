/**
 * @param {()=>Element|HTMLElement|null} query
 * @returns {Element|HTMLElement}
 */
export const getElementSafely = (query) => {
    const el = query();
    if (!el) throw new Error('Element not found');
    return el;
};
/**
 * @param {()=>NodeListOf<Element|HTMLElement> |null} query
 * @returns {NodeListOf<Element|HTMLElement>}
 */
export const getElementListSafely = (query) => {
    const el = query();
    if (!el) throw new Error('Element not found');
    return el;
};

/**
 * @param {string} tag
 * @param {Partial<HTMLElement>} [props]
 * @param {Partial<CSSStyleDeclaration>} [styles]
 * @returns {HTMLElement}
 */
export const createElementWithSettings = (tag, props = {}, styles = {}) => {
    const el = document.createElement(tag);
    Object.assign(el, props);
    Object.assign(el.style, styles);
    return el;
};
