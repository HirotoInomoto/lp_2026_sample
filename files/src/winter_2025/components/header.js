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
};
