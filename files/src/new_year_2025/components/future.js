import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs';

export const initializeSwiperFuture = () => {
    if (window.innerWidth <= 1023) {
        const swiper = new Swiper('.future__slide__wrapper', {
            slidesPerView: 2,
            spaceBetween: 32,
            loop: true,
            speed: 8000,
            autoplay: {
                delay: 0,
                disableOnInteraction: false,
            },
        });
    } else {
        const swiper = new Swiper('.future__slide__wrapper', {
            slidesPerView: 7,
            spaceBetween: 32,
            loop: true,
            speed: 8000,
            autoplay: {
                delay: 0,
                disableOnInteraction: false,
            },
        });
    }
};

export const initializeSwiperGraduate = () => {
    const swiper = new Swiper('.future__graduate__slide__wrapper', {
        slidesPerView: 1,
        spaceBetween: 5,
        loop: true,
        speed: 1000,
        autoplay: {
            delay: 8000,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: '.graduate_swiper-button-next',
            prevEl: '.graduate_swiper-button-prev',
        },
    });
};

export const addSliderNextPrevBtnGraduate = () => {
    const sliderNextBtn = document.querySelector(
        '.graduate_swiper-button-next'
    );
    const sliderPrevBtn = document.querySelector(
        '.graduate_swiper-button-prev'
    );
    sliderNextBtn.innerHTML +=
        '<div class="graduate_swiper-button-next_btn"></div>';
    sliderPrevBtn.innerHTML +=
        '<div class="graduate_swiper-button-prev_btn"></div>';
};
