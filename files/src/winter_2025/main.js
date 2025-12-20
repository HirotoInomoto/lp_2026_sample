// @ts-check
// @ts-ignore
import ENV from '../../../env.js';
import CustomLinkHandler from '../common/custom_link.js';
import { headerToggle } from './components/header.js';
import { ScheduleRenderer } from './components/schedule.js';
import { initSchoolModal } from './components/school.js';
import { initProgrammingModal } from './components/programming.js';
import { clickEvent } from './components/analytics.js';

document.addEventListener('DOMContentLoaded', () => {
    if (true) {
        // 環境変数の読み込みサンプル
        console.log(ENV.API_URL);
        console.log(ENV.STAGE);
    }
    // カスタムリンクの実行
    new CustomLinkHandler().applyLinks();
    // ここから下に追加する
    headerToggle();
    new ScheduleRenderer();
    initSchoolModal();
    initProgrammingModal();
    clickEvent();
});
