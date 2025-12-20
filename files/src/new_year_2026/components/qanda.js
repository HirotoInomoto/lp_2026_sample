export function initializeQanda() {
    const root = document.getElementById('qanda');
    if (!root) return;

    const items = Array.from(root.querySelectorAll('.qanda__item'));
    const buttons = Array.from(root.querySelectorAll('.qanda__q'));

    const openByButton = (btn) => {
        const item = btn.closest('.qanda__item');
        const panelId = btn.getAttribute('aria-controls');
        const panel = panelId ? root.querySelector(`#${panelId}`) : null;
        if (!item || !panel) return;

        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
        const toggle = btn.querySelector('.qanda__toggle');
        if (toggle) toggle.textContent = '−';
        panel.removeAttribute('hidden');
    };

    const closeByButton = (btn) => {
        const item = btn.closest('.qanda__item');
        const panelId = btn.getAttribute('aria-controls');
        const panel = panelId ? root.querySelector(`#${panelId}`) : null;
        if (!item || !panel) return;

        item.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
        const toggle = btn.querySelector('.qanda__toggle');
        if (toggle) toggle.textContent = '+';
        panel.setAttribute('hidden', '');
    };

    // 初期状態：HTMLの状態を尊重（複数open可）。open指定が無ければ先頭をopen。
    // また、要件により「開いたものは閉じない」＝クリックでcloseしない。
    let hasOpen = false;
    buttons.forEach((btn) => {
        const item = btn.closest('.qanda__item');
        const panelId = btn.getAttribute('aria-controls');
        const panel = panelId ? root.querySelector(`#${panelId}`) : null;
        if (!item || !panel) return;

        const isOpen =
            item.classList.contains('is-open') ||
            btn.getAttribute('aria-expanded') === 'true';

        if (isOpen) {
            hasOpen = true;
            item.classList.add('is-open');
            btn.setAttribute('aria-expanded', 'true');
            const toggle = btn.querySelector('.qanda__toggle');
            if (toggle) toggle.textContent = '−';
            panel.removeAttribute('hidden');
        } else {
            btn.setAttribute('aria-expanded', 'false');
            const toggle = btn.querySelector('.qanda__toggle');
            if (toggle) toggle.textContent = '+';
            panel.setAttribute('hidden', '');
        }
    });

    if (!hasOpen && buttons[0]) {
        openByButton(buttons[0]);
    }

    buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const isOpen = btn.getAttribute('aria-expanded') === 'true';
            // 開いている（=「−」）なら、その項目だけ閉じる
            if (isOpen) {
                closeByButton(btn);
                return;
            }
            // 閉じているなら開く（他の項目は触らない）
            openByButton(btn);
        });
    });

    // share links
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(document.title);

    const line = root.querySelector('[data-share="line"]');
    if (line) {
        line.setAttribute(
            'href',
            `https://social-plugins.line.me/lineit/share?url=${url}`
        );
        line.setAttribute('target', '_blank');
        line.setAttribute('rel', 'noopener noreferrer');
    }

    const x = root.querySelector('[data-share="x"]');
    if (x) {
        x.setAttribute(
            'href',
            `https://twitter.com/intent/tweet?text=${text}&url=${url}`
        );
        x.setAttribute('target', '_blank');
        x.setAttribute('rel', 'noopener noreferrer');
    }
}
