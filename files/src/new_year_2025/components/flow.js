import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs';

export const initializeSwiperFlow = () => {
    const swiper = new Swiper('.flow__past_event_photo', {
        slidesPerView: 1,
        spaceBetween: 5,
        loop: true,
        speed: 1000,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: '.flow_swiper-button-next',
            prevEl: '.flow_swiper-button-prev',
        },
    });
};

export const addSliderNextPrevBtn = () => {
    const sliderNextBtn = document.querySelector('.flow_swiper-button-next');
    const sliderPrevBtn = document.querySelector('.flow_swiper-button-prev');
    sliderNextBtn.innerHTML +=
        '<div class="flow_swiper-button-next_btn"></div>';
    sliderPrevBtn.innerHTML +=
        '<div class="flow_swiper-button-prev_btn"></div>';
};
