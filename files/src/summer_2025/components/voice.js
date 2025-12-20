export const initVoiceTabs = () => {
    let voiceTabNum = 0; // 0: 親タブ、1: 子タブ

    const parentBtn = document.querySelector('#voice__parent');
    const childrenBtn = document.querySelector('#voice__children');
    const parentContent = document.querySelector('.voice__content--parent');
    const childrenContent = document.querySelector('.voice__content--children');

    const showParent = () => {
        parentBtn.classList.add('active');
        childrenBtn.classList.remove('active');
        childrenContent.style.opacity = 0;
        setTimeout(() => {
            childrenContent.style.display = 'none';
            parentContent.style.display = 'flex';
            setTimeout(() => (parentContent.style.opacity = 1), 10);
        }, 200);
        voiceTabNum = 0;
    };

    const showChildren = () => {
        parentBtn.classList.remove('active');
        childrenBtn.classList.add('active');
        parentContent.style.opacity = 0;
        setTimeout(() => {
            parentContent.style.display = 'none';
            childrenContent.style.display = 'flex';
            setTimeout(() => (childrenContent.style.opacity = 1), 10);
        }, 200);
        voiceTabNum = 1;
    };

    parentBtn.addEventListener('click', () => {
        if (voiceTabNum === 1) showParent();
    });

    childrenBtn.addEventListener('click', () => {
        if (voiceTabNum === 0) showChildren();
    });
};
