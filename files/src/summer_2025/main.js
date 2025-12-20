import ENV from '../../../env.js';
import CustomLinkHandler from '../common/custom_link.js';
import { CalendarController } from './components/calendar.js';
import { firstviewTextChange } from './components/firstview.js';
import { game } from './components/game.js';
import { headerToggle } from './components/header.js';
import {
    modalProgrammingActivate,
    modalSchoolActivate,
} from './components/modal.js';
import {
    initializeSwiperAchieveChallenge,
    initializeSwiperAchieveSchool,
} from './components/slide.js';
import { initVoiceTabs } from './components/voice.js';
import { clickEvent } from './components/analytics.js';

document.addEventListener('DOMContentLoaded', () => {
    if (false) {
        console.log(ENV.API_URL);
        console.log(ENV.STAGE);
    }
    firstviewTextChange();
    initVoiceTabs();
    initializeSwiperAchieveSchool();
    initializeSwiperAchieveChallenge();
    modalSchoolActivate();
    modalProgrammingActivate();
    game();
    headerToggle();
    clickEvent();
    new CustomLinkHandler().applyLinks();
    new CalendarController();
});
