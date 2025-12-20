export const game = () => {
    // ここからチュートリアル

    let test_textbox = document.getElementById('test');

    let clickWord;
    let controlText;

    let screenHeight = window.screen.height;

    if (navigator.userAgent.match(/iPhone|Android.+Mobile/)) {
        clickWord = 'タップ';
        controlText =
            '画面上の黄色いボタンで左右移動、ジャンプをすることができます。';
    } else {
        clickWord = 'クリック';
        controlText =
            '十字キー「←」「→」で左右に移動、「A」でジャンプできます。';
    }

    const steps = [
        {
            title: 'まずはゲームをプレイ！',
            content: `ここを${clickWord}してまずはゲームを体験してみましょう。${controlText}`,
            target: '.tutorial_1_1',
            order: 1,
            group: 'tutorial_1',
        },
        {
            title: 'コードを書き換えてみよう！',
            content: `プレイヤーの動きが遅いな、、そう思いませんでしたか？`,
            target: '.tutorial_2_1',
            order: 1,
            group: 'tutorial_2',
        },
        {
            title: 'コードを書き換えてみよう！',
            content:
                'ここの数字を書き換えることで、プレイヤーのスピードを変更することができます。10にしてみましょう。',
            target: '.tutorial_2_2',
            order: 2,
            group: 'tutorial_2',
        },
        {
            title: 'コードを書き換えてみよう！',
            content: `数字を変えた後は更新ボタンを${clickWord}しましょう。`,
            target: '.tutorial_2_3',
            order: 3,
            group: 'tutorial_2',
        },
        {
            title: 'ゲームをアレンジしよう！',
            content: `ここの数字を変えると、プレイヤーのジャンプ力が変わります。`,
            target: '.tutorial_3_1',
            order: 1,
            group: 'tutorial_3',
        },
        {
            title: 'ゲームをアレンジしよう！',
            content: `黄色いメモのあるところを好きな数字に変えてみましょう。オリジナルのゲームを完成させてみましょう！`,
            target: '.tutorial_3_2',
            order: 2,
            group: 'tutorial_3',
        },
        {
            title: 'ゲームをアレンジしよう！',
            content: `数字を変えた後は更新ボタンを${clickWord}するのを忘れないようにしましょう。`,
            target: '.tutorial_2_3',
            order: 3,
            group: 'tutorial_3',
        },
    ];

    const tg = new tourguide.TourGuideClient({
        steps: steps,
        autoScroll: false,
        dialogZ: 10000000000000,
    });

    let tutorialFlag = true;
    let tutorialEndFlag = false;
    let firstTimeFlag = true;
    let secondTimeFlag = true;
    var scrollY = window.pageYOffset;
    let tutorialBorderTop =
        document.querySelector('#challenge').getBoundingClientRect().top +
        scrollY;
    let tutorialBorderBottom =
        document.querySelector('.slide__challenge').getBoundingClientRect()
            .top + scrollY;

    let headerLink = document.querySelectorAll('#header div a');
    headerLink.forEach((item) => {
        item.addEventListener('click', () => {
            tutorialFlag = false;
        });
    });

    window.addEventListener('scroll', () => {
        scrollY = window.pageYOffset;
        if (
            scrollY + screenHeight * 0.2 > tutorialBorderTop &&
            scrollY + screenHeight * 0.4 <= tutorialBorderBottom
        ) {
            document.querySelector('.fixed_btn').style.transform =
                'translateY(148px)';
            document.querySelector('#header').style.transform =
                'translateY(-100%)';
            if (tutorialFlag) {
                tg.start('tutorial_1');
                tutorialFlag = false;
                tutorialEndFlag = true;
            }
        }
        if (scrollY + screenHeight * 0.4 > tutorialBorderBottom) {
            document.querySelector('.fixed_btn').style.transform =
                'translateY(0)';
            document.querySelector('#header').style.transform = 'translateY(0)';
            if (tutorialEndFlag) {
                tg.exit('tutorial_1');
                tutorialEndFlag = false;
            }
        }
        if (scrollY + screenHeight * 0.2 <= tutorialBorderTop) {
            document.querySelector('.fixed_btn').style.transform =
                'translateY(0)';
            document.querySelector('#header').style.transform = 'translateY(0)';
        }
    });

    document.getElementById('review_tutorial').addEventListener('click', () => {
        tutorialFlag = false;
        tutorialEndFlag = true;
        firstTimeFlag = true;
        tg.start('tutorial_1');
    });

    // ここからゲーム

    //  画面状態の管理
    const START_SCREEN = 0;
    const GAME_SCREEN = 1;
    const GAMEOVER_SCREEN = 2;
    const CLEAR_SCREEN = 3;

    // 画面の大きさを設定
    const DISPLAY_HEIGHT = 480;
    const DISPLAY_WIDTH = 540;

    // プレイヤーに関する情報を設定
    const PLAYER_WIDTH = 32;
    const PLAYER_HEIGHT = 32;
    let PLAYER_SPEED_X = 3;
    let PLAYER_SPEED_Y = -12;

    // 重力の大きさを設定
    let GRAVITY = 0.8;

    // 的に関する情報を設定
    const ENEMY_WIDTH = 32;
    const ENEMY_HEIGHT = 32;
    let ENEMY_SPEED_X = -2;

    // ブロックに関する情報を設定
    const BLOCK_HEIGHT = 32;

    // 衝突判定において画像の余白が直感よりも遠い距離での当たり判定を生んでいるので、調整するために使用
    const COLLISION_MARGIN_X = 8;
    const COLLISION_MARGIN_Y = 8;

    // ボタンに関数る情報を設定
    const BUTTON_WIDTH = 200;
    const BUTTON_HEIGHT = 50;

    // 敵が出現する座標を設定
    let ENEMY_POSITIONS = [32 * 16, 32 * 18, 32 * 24, 32 * 32, 32 * 40];

    // HTMLの要素を取得
    const canvas = document.getElementById('maincanvas');
    const ctx = canvas.getContext('2d');

    const challenge__left = document.getElementById('challenge__left');
    const challenge__right = document.getElementById('challenge__right');
    const challenge__jump = document.getElementById('challenge__jump');

    // ** Block クラス **
    // 地面となるブロックに関するコードをまとめたブロック
    class Block {
        // 固有のブロックの設定
        constructor(x, y, width, height) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.image = new Image();
            this.image.src =
                '../../../assets/images/summer_2025/png/ground.png';
        }

        // ブロックを画面表示するメソッド
        draw() {
            for (let i = 0; i < this.width / BLOCK_HEIGHT; i++) {
                for (let j = 0; j < this.height / BLOCK_HEIGHT; j++) {
                    ctx.drawImage(
                        this.image,
                        this.x - offsetX + 96 + BLOCK_HEIGHT * i,
                        this.y + BLOCK_HEIGHT * j,
                        BLOCK_HEIGHT,
                        BLOCK_HEIGHT
                    );
                }
            }
        }
    }

    // ** Player クラス **
    // プレイヤーに関するコードをまとめたブロック
    class Player {
        // 固有のプレイヤーの設定
        constructor() {
            this.x = 0;
            this.y = 300;
            this.speedY = 0;
            this.isJumping = false;
            this.image = new Image();
            this.image.src =
                '../../../assets/images/summer_2025/png/character.png';
            this.width = PLAYER_WIDTH;
            this.height = PLAYER_HEIGHT;
        }

        // プレイヤーの情報を更新するメソッド
        update() {
            let updatedX = this.x;
            if (keys['ArrowRight']) {
                updatedX = this.x + PLAYER_SPEED_X;
            } else if (keys['ArrowLeft']) {
                if (offsetX >= 0) {
                    updatedX = this.x - PLAYER_SPEED_X;
                }
            }
            const updatedY = this.y + this.speedY;

            let result = checkCollision(blocks, this, updatedX, updatedY);
            let flagX = result[0];
            let groundY = result[1];
            let ceilingY = result[2];

            if (!flagX) {
                this.x = updatedX;
            } else {
                this.x = flagX;
            }
            offsetX = this.x;

            if (ceilingY) {
                this.speedY = 0;
                this.y = ceilingY;
            }

            if (!groundY) {
                this.y += this.speedY;
                this.speedY += GRAVITY;
            } else {
                this.y = groundY - PLAYER_HEIGHT;
                this.speedY = 0;
                this.isJumping = false;
            }

            if (keys['a'] && !player.isJumping) {
                this.isJumping = true;
                this.speedY = PLAYER_SPEED_Y;
            }
        }

        // プレイヤーを画面表示するメソッド
        draw() {
            ctx.drawImage(this.image, 96, this.y, PLAYER_WIDTH, PLAYER_HEIGHT);
        }
    }

    // ** Enemy クラス **
    // 敵に関するコードをまとめたブロック
    class Enemy {
        // 固有の敵の設定
        constructor(x) {
            this.x = x;
            this.y = 0;
            this.speedY = 0;
            this.isJumping = true;
            this.image = new Image();
            this.image.src = '../../../assets/images/summer_2025/png/enemy.png';
            this.width = ENEMY_WIDTH;
            this.height = ENEMY_HEIGHT;
            this.speedX = ENEMY_SPEED_X;
        }

        // 敵の情報を更新するメソッド
        update() {
            const updatedY = this.y + this.speedY;

            let result = checkCollision(
                blocks,
                this,
                this.x + this.speedX,
                updatedY,
                true
            );
            let flagX = result[0];
            let groundY = result[1];
            // let ceilingY = result[2];

            if (flagX == null) {
                this.x += this.speedX;
            } else {
                this.x = flagX;
            }

            this.speedX = result[3].speedX;

            if (!groundY) {
                this.y += this.speedY;
                this.speedY += GRAVITY;
            } else {
                this.y = groundY - ENEMY_HEIGHT;
            }
        }

        // 敵を画面表示するメソッド
        draw() {
            ctx.drawImage(
                this.image,
                this.x - offsetX + 96,
                this.y,
                ENEMY_WIDTH,
                ENEMY_HEIGHT
            );
        }
    }

    function checkCollision(
        blocks,
        object,
        updatedX,
        updatedY,
        is_enemy = false
    ) {
        let flagX = null;
        let flagYGround = null;
        let flagYCeiling = null;
        blocks.forEach((block) => {
            // 地面との衝突判定
            if (flagYGround == null) {
                if (
                    object.y + object.height <= block.y &&
                    updatedY + object.height > block.y
                ) {
                    if (
                        block.x <= object.x + object.width &&
                        object.x <= block.x + block.width
                    ) {
                        flagYGround = block.y;
                    }
                }
            }

            // 頭上のブロックの当たり判定
            if (flagYCeiling == null) {
                if (
                    block.x <= updatedX + object.width &&
                    updatedX <= block.x + block.width
                ) {
                    if (
                        updatedY <= block.y + block.height &&
                        object.y >= block.y + block.height
                    ) {
                        flagYCeiling = block.y + block.height + 1;
                    }
                }
            }

            // 左右の衝突判定
            if (flagX == null) {
                if (
                    (updatedX + object.width >= block.x &&
                        updatedX + object.width <= block.x + block.width &&
                        object.y >= block.y &&
                        object.y <= block.y + block.height) ||
                    (updatedX + object.width >= block.x &&
                        updatedX + object.width <= block.x + block.width &&
                        object.y + object.height - 1 >= block.y &&
                        object.y + object.height - 1 <= block.y + block.height)
                ) {
                    flagX = block.x - object.width;
                    object.speedX *= -1;
                }
                if (
                    (updatedX - 1 >= block.x &&
                        updatedX - 1 <= block.x + block.width &&
                        object.y >= block.y &&
                        object.y <= block.y + block.height) ||
                    (updatedX - 1 >= block.x &&
                        updatedX - 1 <= block.x + block.width &&
                        object.y + object.height - 1 >= block.y &&
                        object.y + object.height - 1 <= block.y + block.height)
                ) {
                    flagX = block.x + block.width;
                    object.speedX *= -1;
                }
            }
        });
        if (flagYCeiling != null) {
            flagX = null;
        }
        return [flagX, flagYGround, flagYCeiling, object];
    }

    // 落下して画面外に落ちたことを判定する関数
    function isFallen(updatedY) {
        return updatedY + PLAYER_HEIGHT > DISPLAY_HEIGHT;
    }

    // プレイヤーと敵との衝突を判定する関数
    function isCollide(player, enemy) {
        return (
            player.x + COLLISION_MARGIN_X <
                enemy.x + ENEMY_WIDTH - COLLISION_MARGIN_X &&
            player.x + PLAYER_WIDTH - COLLISION_MARGIN_X >
                enemy.x + COLLISION_MARGIN_X &&
            player.y + COLLISION_MARGIN_Y <
                enemy.y + ENEMY_HEIGHT - COLLISION_MARGIN_Y &&
            player.y + PLAYER_HEIGHT - COLLISION_MARGIN_Y >
                enemy.y + COLLISION_MARGIN_Y
        );
    }

    function isClear() {
        if (player.x > 1778 && player.x < 1844 && player.y > 385) {
            return true;
        }
        return false;
    }

    // 落下や敵との衝突をもとにゲームオーバーかどうかを判定する関数
    function isGameOver() {
        const updatedY = player.y + player.speedY;

        if (isFallen(updatedY)) {
            return true;
        }

        for (let i = 0; i < enemies.length; i++) {
            const enemy = enemies[i];

            if (isCollide(player, enemy)) {
                if (player.y + PLAYER_HEIGHT < enemy.y + ENEMY_HEIGHT) {
                    enemies.splice(i, 1);
                    i--;
                    return false;
                }
                return true;
            }
        }

        return false;
    }

    // ゲーム開始画面を表示する関数
    function drawStartScreen() {
        // 画面をクリア
        ctx.clearRect(0, 0, DISPLAY_WIDTH, DISPLAY_HEIGHT);

        // ボタンの背景
        ctx.fillStyle = '#4CAF50';

        // ボタンのサイズ
        const buttonWidth = BUTTON_WIDTH;
        const buttonHeight = BUTTON_HEIGHT;
        const buttonX = (DISPLAY_WIDTH - buttonWidth) / 2;
        const buttonY = (DISPLAY_HEIGHT - buttonHeight) / 2;
        ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

        // ボタンのテキスト
        ctx.fillStyle = 'white';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
            'ゲーム開始',
            buttonX + buttonWidth / 2,
            buttonY + buttonHeight / 2
        );
    }

    // クリア画面を表示する関数
    function drawClearScreen() {
        ctx.fillStyle = 'red';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('クリア！', DISPLAY_WIDTH / 2, DISPLAY_HEIGHT / 2);

        ctx.font = '24px Arial';
        ctx.fillText(
            'クリックでリスタート',
            DISPLAY_WIDTH / 2,
            DISPLAY_HEIGHT / 2 + 50
        );
    }

    // ゲームオーバー画面を表示する関数
    function drawGameOverScreen() {
        ctx.clearRect(0, 0, DISPLAY_WIDTH, DISPLAY_HEIGHT);

        // 背景を黒に
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, DISPLAY_WIDTH, DISPLAY_HEIGHT);

        // ゲームオーバーのテキストを赤色で
        ctx.fillStyle = 'red';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('ゲームオーバー', DISPLAY_WIDTH / 2, DISPLAY_HEIGHT / 2);

        // リスタートメッセージ
        ctx.font = '24px Arial';
        ctx.fillText(
            'クリックでリスタート',
            DISPLAY_WIDTH / 2,
            DISPLAY_HEIGHT / 2 + 50
        );
    }

    // プレイヤー、ブロック、敵の表示メソッドをまとめて実行する関数
    function draw() {
        ctx.fillStyle = 'red';
        ctx.font = '36px Arial';
        ctx.fillText('着地でクリア！', 1600 - player.x, 100);
        ctx.fillText('→　→　→', 1600 - player.x, 132);
        player.draw();
        blocks.forEach((block) => block.draw());
        enemies.forEach((enemy) => enemy.draw());
    }

    // プレイヤー、敵の情報更新メソッドをまとめて実行する関数
    function update() {
        player.update();
        enemies.forEach((enemy) => enemy.update());
    }

    // ゲーム全体の実行関数
    function game() {
        if (isClear()) {
            screenStatus = CLEAR_SCREEN;
            drawClearScreen();
            return;
        }
        if (isGameOver()) {
            screenStatus = GAMEOVER_SCREEN;
            drawGameOverScreen();
            if (firstTimeFlag) {
                setTimeout(() => {
                    document.querySelector('.challenge__code').scrollTo(0, 0);
                    tg.start('tutorial_2');
                    firstTimeFlag = false;
                }, '300');
            } else if (secondTimeFlag) {
                setTimeout(() => {
                    document.querySelector('.challenge__code').scrollTo(0, 0);
                    tg.start('tutorial_3');
                    secondTimeFlag = false;
                }, '300');
            }
            return;
        }
        ctx.clearRect(0, 0, DISPLAY_WIDTH, DISPLAY_HEIGHT);
        draw();
        update();
        setTimeout(() => {
            requestAnimationFrame(game);
        }, '20');
    }

    // ゲーム開始時に実行することをまとめた関数
    function start() {
        document.addEventListener('keydown', function (e) {
            keys[e.key] = true;
        });
        document.addEventListener('keyup', function (e) {
            keys[e.key] = false;
        });

        challenge__left.addEventListener('touchstart', () => {
            keys['ArrowLeft'] = true;
        });
        challenge__right.addEventListener('touchstart', () => {
            keys['ArrowRight'] = true;
        });
        challenge__jump.addEventListener('touchstart', () => {
            keys['a'] = true;
        });
        challenge__left.addEventListener('touchend', () => {
            keys['ArrowLeft'] = false;
        });
        challenge__right.addEventListener('touchend', () => {
            keys['ArrowRight'] = false;
        });
        challenge__jump.addEventListener('touchend', () => {
            keys['a'] = false;
        });
        game();
    }

    // 音声を再生するにはUserからのなんらかの操作がトリガーになる必要があるため、
    // canvasをクリックしてから開始するように変更
    // Chrome自動再生ポリシー（https://developer.chrome.com/blog/autoplay?hl=en）
    canvas.addEventListener('click', () => {
        switch (screenStatus) {
            case START_SCREEN:
                screenStatus = GAME_SCREEN;
                start();
                break;
            case GAME_SCREEN:
                break;
            case GAMEOVER_SCREEN:
                screenStatus = START_SCREEN;
                offsetX = 0;
                player = new Player();
                enemies = ENEMY_POSITIONS.map((x) => new Enemy(x));
                keys = [];
                break;
            case CLEAR_SCREEN:
                screenStatus = START_SCREEN;
                offsetX = 0;
                player = new Player();
                enemies = ENEMY_POSITIONS.map((x) => new Enemy(x));
                keys = [];
                break;
        }
        gtag('event', 'summer_25_game_play', {
            event_category: 'form',
            event_label: 'summer_25_game_play',
            value: 1,
        });
    });

    // ステージ上のブロックを設定するリスト
    const blocks = [
        new Block(-32 * 3, 418, 32 * (40 + 3), BLOCK_HEIGHT * 2),
        new Block(32 * 56, 418, 32 * 2, BLOCK_HEIGHT * 2),

        new Block(32 * 16, 354, 32 * 2, BLOCK_HEIGHT * 2),

        new Block(32 * 22, 322, 32 * 2, BLOCK_HEIGHT * 3),

        new Block(32 * 26, 290, 32 * 2, BLOCK_HEIGHT * 4),

        new Block(32 * 5, 290, 32 * 1, BLOCK_HEIGHT * 1),

        new Block(32 * 8, 290, 32 * 5, BLOCK_HEIGHT * 1),
        new Block(32 * 10, 162, 32 * 1, BLOCK_HEIGHT * 1),

        new Block(32 * 34, 290, 32 * 1, BLOCK_HEIGHT * 1),
        new Block(32 * 37, 162, 32 * 1, BLOCK_HEIGHT * 1),
        new Block(32 * 37, 290, 32 * 1, BLOCK_HEIGHT * 1),
        new Block(32 * 40, 290, 32 * 1, BLOCK_HEIGHT * 1),

        new Block(32 * 38, 386, 32 * 1, BLOCK_HEIGHT * 1),
    ];

    // 実行
    let screenStatus = START_SCREEN;
    let offsetX = 0;
    let player = new Player();
    let enemies = ENEMY_POSITIONS.map((x) => new Enemy(x));
    let keys = [];

    drawStartScreen();

    let PLAYER_SPEED_XInput = document.getElementById('game_PLAYER_SPEED_X');
    let game_PLAYER_SPEED_YInput = document.getElementById(
        'game_PLAYER_SPEED_Y'
    );
    let game_gravityInput = document.getElementById('game_gravity');
    let game_ENEMY_SPEED_XInput = document.getElementById('game_ENEMY_SPEED_X');
    let game_ENEMY_POSITIONS1Input = document.getElementById(
        'game_ENEMY_POSITIONS1'
    );
    let game_ENEMY_POSITIONS2Input = document.getElementById(
        'game_ENEMY_POSITIONS2'
    );
    let game_ENEMY_POSITIONS3Input = document.getElementById(
        'game_ENEMY_POSITIONS3'
    );
    let game_ENEMY_POSITIONS4Input = document.getElementById(
        'game_ENEMY_POSITIONS4'
    );
    let game_ENEMY_POSITIONS5Input = document.getElementById(
        'game_ENEMY_POSITIONS5'
    );
    let challengeBtn = document.getElementById('challenge__btn');

    function reloadGame() {
        if (parseInt(PLAYER_SPEED_XInput.value) <= 3) {
            PLAYER_SPEED_X = parseInt(PLAYER_SPEED_XInput.value);
        } else {
            PLAYER_SPEED_X = parseInt(PLAYER_SPEED_XInput.value) ^ (1 / 4 + 3);
        }
        PLAYER_SPEED_Y = parseInt(game_PLAYER_SPEED_YInput.value) * -1;
        GRAVITY = parseInt(game_gravityInput.value) * 0.08;
        ENEMY_SPEED_X = parseInt(game_ENEMY_SPEED_XInput.value) * -1;
        ENEMY_POSITIONS = [
            parseInt(game_ENEMY_POSITIONS1Input.value),
            parseInt(game_ENEMY_POSITIONS2Input.value),
            parseInt(game_ENEMY_POSITIONS3Input.value),
            parseInt(game_ENEMY_POSITIONS4Input.value),
            parseInt(game_ENEMY_POSITIONS5Input.value),
        ];
        screenStatus = START_SCREEN;
        offsetX = 0;
        player = new Player();
        enemies = ENEMY_POSITIONS.map((x) => new Enemy(x));
        keys = [];
        drawStartScreen();
    }

    challengeBtn.addEventListener('click', () => {
        reloadGame();
        gtag('event', 'summer_25_game_codearrange', {
            event_category: 'form',
            event_label: 'summer_25_game_codearrange',
            value: 1,
        });
    });

    let codeToggleFlag = false;
    document
        .querySelector('.challenge__code__toggle')
        .addEventListener('click', () => {
            if (codeToggleFlag) {
                document.querySelector('.challenge__code').style.height =
                    '250px';
                document.querySelector(
                    '.challenge__code__toggle img'
                ).style.transform = 'rotate(0)';
                codeToggleFlag = false;
            } else {
                document.querySelector('.challenge__code').style.height =
                    'max-content';
                document.querySelector(
                    '.challenge__code__toggle img'
                ).style.transform = 'rotate(180deg)';
                codeToggleFlag = true;
            }
        });
};
