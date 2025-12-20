export const voiceTabChange = (voiceTabNum) => {
    const parentBtn = document.querySelector('.voice__header--parent');
    const studentBtn = document.querySelector('.voice__header--student');
    const parentContent = document.querySelector(
        '.voice__content__box--parent'
    );
    const studentContent = document.querySelector(
        '.voice__content__box--student'
    );

    parentBtn.addEventListener('click', () => {
        if (voiceTabNum == 1) {
            parentBtn.classList.add('active');
            studentBtn.classList.remove('active');
            studentContent.style.opacity = 0;
            setTimeout(() => {
                studentContent.style.display = 'none';
                parentContent.style.display = 'flex';
                setTimeout(() => {
                    parentContent.style.opacity = 1;
                }, '10');
            }, '200');
            voiceTabNum = 0;
        }
    });
    studentBtn.addEventListener('click', () => {
        if (voiceTabNum == 0) {
            parentBtn.classList.remove('active');
            studentBtn.classList.add('active');
            parentContent.style.opacity = 0;
            setTimeout(() => {
                parentContent.style.display = 'none';
                studentContent.style.display = 'flex';
                setTimeout(() => {
                    studentContent.style.opacity = 1;
                }, '10');
            }, '200');
            voiceTabNum = 1;
        }
    });

    return voiceTabNum;
};
