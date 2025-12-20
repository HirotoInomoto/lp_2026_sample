import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs';

export function initializePastEventGallery() {
    const root = document.querySelector('.past_event_gallery');
    if (!root) return;

    const mainEl = root.querySelector('.past_event_gallery__mainSwiper');
    if (!mainEl) return;

    const prevEl = root.querySelector('.past_event_gallery__nav--prev');
    const nextEl = root.querySelector('.past_event_gallery__nav--next');

    const thumbsRoot = root.querySelector('.past_event_gallery__thumbs');

    // thumbs がHTMLに無い/空の場合は4枠を自動生成（スクショ仕様）
    const ensureThumbSlots = () => {
        if (!thumbsRoot) return;
        const existing = thumbsRoot.querySelectorAll(
            '.past_event_gallery__thumb'
        );
        if (existing.length > 0) return;

        const frag = document.createDocumentFragment();
        for (let i = 0; i < 4; i += 1) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'past_event_gallery__thumb';
            btn.setAttribute('aria-label', `サムネイル ${i + 1}`);

            const img = document.createElement('img');
            img.className = 'past_event_gallery__thumbImage';
            img.alt = '';
            img.setAttribute('aria-hidden', 'true');
            img.decoding = 'async';
            img.loading = 'lazy';

            btn.appendChild(img);
            frag.appendChild(btn);
        }
        thumbsRoot.appendChild(frag);
    };

    ensureThumbSlots();

    const thumbButtons = Array.from(
        root.querySelectorAll('.past_event_gallery__thumb')
    );
    const thumbImages = thumbButtons.map((btn) =>
        btn.querySelector('img.past_event_gallery__thumbImage')
    );

    const mainImages = Array.from(
        root.querySelectorAll('.past_event_gallery__mainImage')
    ).map((img) => img.getAttribute('src'));

    const slideCount = mainImages.length;
    if (slideCount < 2) return;

    const updateThumbs = (activeIndex) => {
        // 表示中以外の4枚（次から順に）を並べる
        const others = [];
        for (let offset = 1; offset < slideCount; offset += 1) {
            others.push((activeIndex + offset) % slideCount);
        }
        const show = others.slice(0, 4);

        show.forEach((idx, i) => {
            const img = thumbImages[i];
            const btn = thumbButtons[i];
            if (!img || !btn) return;
            img.src = mainImages[idx];
            btn.dataset.slideTo = String(idx);
        });

        // 4枚未満の場合は余りを隠す
        for (let i = show.length; i < thumbButtons.length; i += 1) {
            thumbButtons[i].style.display = 'none';
        }
        for (let i = 0; i < show.length; i += 1) {
            thumbButtons[i].style.display = '';
        }
    };

    const swiper = new Swiper(mainEl, {
        slidesPerView: 1,
        // スライダー内の写真間余白
        spaceBetween: 24,
        loop: true,
        speed: 600,
        centeredSlides: true,
        // デザイン都合：右矢印で「右へ流れる」= Swiper的には prev を進める
        navigation:
            prevEl && nextEl ? { prevEl: nextEl, nextEl: prevEl } : undefined,
        on: {
            init(s) {
                updateThumbs(s.realIndex);
            },
            slideChange(s) {
                updateThumbs(s.realIndex);
            },
        },
    });

    thumbButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const idx = Number(btn.dataset.slideTo);
            if (Number.isNaN(idx)) return;
            swiper.slideToLoop(idx, 600);
        });
    });
}
