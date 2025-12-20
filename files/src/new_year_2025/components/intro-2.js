import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs';

export const initializeSwiperAchieve = () => {
    if (window.innerWidth <= 1023) {
        const swiper = new Swiper('.intro-2__content__achieve__image__list', {
            slidesPerView: 1.4,
            spaceBetween: 5,
            loop: true,
            speed: 1000,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
            },
            centeredSlides: true,
            navigation: {
                nextEl: '.achieve_swiper-button-next',
                prevEl: '.achieve_swiper-button-prev',
            },
        });
    }
};

export const addSliderNextPrevBtn = () => {
    const sliderNextBtn = document.querySelector('.achieve_swiper-button-next');
    const sliderPrevBtn = document.querySelector('.achieve_swiper-button-prev');
    sliderNextBtn.innerHTML +=
        '<div class="achieve_swiper-button-next_btn"></div>';
    sliderPrevBtn.innerHTML +=
        '<div class="achieve_swiper-button-prev_btn"></div>';
};
