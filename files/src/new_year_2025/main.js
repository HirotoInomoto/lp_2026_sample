import { CalendarController } from './components/calendar.js';
import {
    addSliderNextPrevBtn,
    initializeSwiperFlow,
} from './components/flow.js';
import { FormController } from './components/form.js';
import {
    addSliderNextPrevBtnGraduate,
    initializeSwiperFuture,
    initializeSwiperGraduate,
} from './components/future.js';
import { initializeSwiperAchieve } from './components/intro-2.js';
import { voiceTabChange } from './components/voice.js';

document.addEventListener('DOMContentLoaded', () => {
    initializeSwiperFlow();
    addSliderNextPrevBtn();
    let voiceTabNum = 0;
    voiceTabNum = voiceTabChange(voiceTabNum);

    initializeSwiperFuture();
    initializeSwiperGraduate();
    addSliderNextPrevBtnGraduate();
    initializeSwiperAchieve();

    new FormController();
    new CalendarController();
});

import ENV from '../../../env.js';
console.log(ENV.STAGE);
console.log(ENV.API_URL);
