import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs';

export const initializeSwiperAchieveSchool = () => {
    if (window.innerWidth <= 1023) {
        new Swiper('.slide__lesson__wrapper--top', {
            spaceBetween: 5,
            loop: true,
            autoplay: {
                delay: 0,
            },
            speed: 8000,
            slidesPerView: 2,
            allowTouchMove: false,
        });
        new Swiper('.slide__lesson__wrapper--bottom', {
            spaceBetween: 5,
            loop: true,
            autoplay: {
                delay: 0,
                reverseDirection: true,
            },
            speed: 8000,
            slidesPerView: 2,
            allowTouchMove: false,
        });
    } else {
        new Swiper('.slide__lesson__wrapper--top', {
            spaceBetween: 5,
            loop: true,
            autoplay: {
                delay: 0,
            },
            speed: 8000,
            slidesPerView: 3,
            allowTouchMove: false,
        });
        new Swiper('.slide__lesson__wrapper--bottom', {
            spaceBetween: 5,
            loop: true,
            autoplay: {
                delay: 0,
                reverseDirection: true,
            },
            speed: 8000,
            slidesPerView: 3,
            allowTouchMove: false,
        });
    }
};

export const initializeSwiperAchieveChallenge = () => {
    if (window.innerWidth <= 1023) {
        new Swiper('.slide__challenge__wrapper', {
            spaceBetween: 5,
            loop: true,
            autoplay: {
                delay: 0,
            },
            speed: 8000,
            slidesPerView: 2,
            allowTouchMove: false,
        });
    } else {
        new Swiper('.slide__challenge__wrapper', {
            spaceBetween: 5,
            loop: true,
            autoplay: {
                delay: 0,
            },
            speed: 8000,
            slidesPerView: 3,
            allowTouchMove: false,
        });
    }
};
