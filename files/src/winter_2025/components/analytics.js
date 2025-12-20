export const clickEvent = () => {
    document
        .querySelectorAll('.form__content__item--trial a')
        .forEach((element) => {
            element.addEventListener('click', () => {
                gtag('event', 'winter_25_form_trial', {
                    event_category: 'form',
                    event_label: 'winter_25_form_trial',
                    value: 1,
                });
            });
        });
    document
        .querySelectorAll('.form__content__item--event a')
        .forEach((element) => {
            element.addEventListener('click', () => {
                gtag('event', 'winter_25_form_event', {
                    event_category: 'form',
                    event_label: 'winter_25_form_event',
                    value: 1,
                });
            });
        });
};
