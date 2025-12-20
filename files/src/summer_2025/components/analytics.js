export const clickEvent = () => {
    document
        .querySelector('.challenge__sns__line')
        .addEventListener('click', () => {
            gtag('event', 'summer_25_sns_share_line', {
                event_category: 'form',
                event_label: 'summer_25_sns_share_line',
                value: 1,
            });
        });
    document
        .querySelector('.challenge__sns__x')
        .addEventListener('click', () => {
            gtag('event', 'summer_25_sns_share_twitter', {
                event_category: 'form',
                event_label: 'summer_25_sns_share_twitter',
                value: 1,
            });
        });
    document
        .querySelector('.challenge__sns__fb')
        .addEventListener('click', () => {
            gtag('event', 'summer_25_sns_share_fb', {
                event_category: 'form',
                event_label: 'summer_25_sns_share_fb',
                value: 1,
            });
        });
    document.querySelector('#copyButton').addEventListener('click', () => {
        gtag('event', 'summer_25_sns_link_copy', {
            event_category: 'form',
            event_label: 'summer_25_sns_link_copy',
            value: 1,
        });
    });
    document
        .querySelector('.form__content__item--trial a')
        .addEventListener('click', () => {
            gtag('event', 'summer_25_form_trial', {
                event_category: 'form',
                event_label: 'summer_25_form_trial',
                value: 1,
            });
        });
    document
        .querySelector('.form__content__item--event a')
        .addEventListener('click', () => {
            gtag('event', 'summer_25_form_event', {
                event_category: 'form',
                event_label: 'summer_25_form_event',
                value: 1,
            });
        });
};
