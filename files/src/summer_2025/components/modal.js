export const modalSchoolActivate = () => {
    const modalSchoolBtn = document.getElementById('banner__school__btn');
    const modalSchool = document.getElementById('modal__school');
    const modalSchoolClose = document.getElementById('modal__school__close');

    modalSchoolBtn.addEventListener('click', () => {
        modalSchool.style.display = 'flex';
        setTimeout(() => {
            modalSchool.style.opacity = 1;
        }, '10');
    });

    modalSchoolClose.addEventListener('click', () => {
        modalSchool.style.opacity = 0;
        setTimeout(() => {
            modalSchool.style.display = 'none';
        }, '300');
    });
};

export const modalProgrammingActivate = () => {
    const modalProgrammingBtn = document.getElementById(
        'banner__programming__btn'
    );
    const modalProgramming = document.getElementById('modal__programming');
    const modalProgrammingClose = document.getElementById(
        'modal__programming__close'
    );

    modalProgrammingBtn.addEventListener('click', () => {
        modalProgramming.style.display = 'flex';
        setTimeout(() => {
            modalProgramming.style.opacity = 1;
        }, '10');
    });

    modalProgrammingClose.addEventListener('click', () => {
        modalProgramming.style.opacity = 0;
        setTimeout(() => {
            modalProgramming.style.display = 'none';
        }, '300');
    });
};
