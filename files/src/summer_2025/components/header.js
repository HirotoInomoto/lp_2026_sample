export const headerToggle = () => {
    const headermenu = document.querySelector('#header div');
    const openBtn = document.getElementById('header__menu');
    const closeBtn = document.querySelector('#header div span');

    const openHeaderMenu = () => {
        if (window.innerWidth >= 1023) return;
        headermenu.style.transform = 'translateX(0)';
    };

    const closeHeaderMenu = () => {
        if (window.innerWidth >= 1023) return;
        headermenu.style.transform = 'translateX(100vw)';
    };

    openBtn.addEventListener('click', () => {
        openHeaderMenu();
    });
    closeBtn.addEventListener('click', () => {
        closeHeaderMenu();
    });

    const headerMenuItem = headermenu.querySelectorAll('a');
    headerMenuItem.forEach((item) => {
        item.addEventListener('click', () => {
            closeHeaderMenu();
        });
    });

    let previousWidth = window.innerWidth;

    window.addEventListener('resize', () => {
        const currentWidth = window.innerWidth;
        if (previousWidth <= 1023 && currentWidth >= 1024) {
            headermenu.style.transform = 'translateX(0)';
        }

        previousWidth = currentWidth;
    });
    // const parentBtn = document.querySelector('#voice__parent');
    // const childrenBtn = document.querySelector('#voice__children');
    // const parentContent = document.querySelector(
    //     '.voice__content--parent'
    // );
    // const childrenContent = document.querySelector(
    //     '.voice__content--children'
    // );

    // parentBtn.addEventListener('click', () => {
    //     if (voiceTabNum == 1) {
    //         parentBtn.classList.add('active');
    //         childrenBtn.classList.remove('active');
    //         childrenContent.style.opacity = 0;
    //         setTimeout(() => {
    //             childrenContent.style.display = 'none';
    //             parentContent.style.display = 'flex';
    //             setTimeout(() => {
    //                 parentContent.style.opacity = 1;
    //             }, '10');
    //         }, '200');
    //         voiceTabNum = 0;
    //     }
    // });
    // childrenBtn.addEventListener('click', () => {
    //     if (voiceTabNum == 0) {
    //         parentBtn.classList.remove('active');
    //         childrenBtn.classList.add('active');
    //         parentContent.style.opacity = 0;
    //         setTimeout(() => {
    //             parentContent.style.display = 'none';
    //             childrenContent.style.display = 'flex';
    //             setTimeout(() => {
    //                 childrenContent.style.opacity = 1;
    //             }, '10');
    //         }, '200');
    //         voiceTabNum = 1;
    //     }
    // });

    // return voiceTabNum;
};
