let windows = [];
let folders = [];
let targets = [];
let bullets = [];
let sprays = [];
let powerups = [];

let targetTimer = 60*5;
let newWindowCount = 0;
let newWindowInterval = 5;
let score = 0;
let targetsVisualCount = 0;

let backgroundLayer;

let macFont;

let interacted = false;
let resetWindowVisible = false;

let powerupImages = {};
let statusImages = {
    more: [],
    faster: [],
    bigger: [],
};
let spamImages = [];
let cursorImages = {};
let cursorImage;

let won = false;

let holdingWindow = false;

let sounds = {};
let panners = {};
let soundIndexes = {};

function preload() {

    macFont = loadFont("./fonts/VT323-Regular.ttf");

    powerupImages.more = loadImage("./images/powerups/more.png");
    powerupImages.faster = loadImage("./images/powerups/faster.png");
    powerupImages.bigger = loadImage("./images/powerups/bigger.png");
    powerupImages.expand = loadImage("./images/powerups/expand.png");
    powerupImages.health = loadImage("./images/powerups/health.png");
    powerupImages.new = loadImage("./images/powerups/new.png");
    powerupImages.spam = loadImage("./images/powerups/spam.png");

    for (let i = 0; i < 21; i++) {
        let percent = i*5;
        statusImages.more.push(loadImage("./images/status/more"+percent+".png"));
        statusImages.faster.push(loadImage("./images/status/faster"+percent+".png"));
        statusImages.bigger.push(loadImage("./images/status/bigger"+percent+".png"));

    }

    for (let i = 0; i < 10; i++) {
        spamImages.push(loadImage("./images/spam/"+i+".png"));
    }

    cursorImages.arrow = loadImage("./images/cursors/arrow.png");
    cursorImages.point = loadImage("./images/cursors/point.png");
    cursorImages.grab = loadImage("./images/cursors/grab.png");

    sounds.shootBullet = [];
    panners.shootBullet = [];
    soundIndexes.shootBullet = 0;
    for (let i = 0; i < 8; i++) {
        let panner = new Tone.Panner(0).toDestination();
        sounds.shootBullet.push(new Tone.Player("./sounds/shoot-bullet.wav").connect(panner));
        panners.shootBullet.push(panner);
    }

    sounds.enemyBurst = [];
    panners.enemyBurst = [];
    soundIndexes.enemyBurst = 0;
    for (let i = 0; i < 8; i++) {
        let panner = new Tone.Panner(0).toDestination();
        sounds.enemyBurst.push(new Tone.Player("./sounds/enemy-burst.wav").connect(panner));
        panners.enemyBurst.push(panner);
    }

    sounds.enemyHurt = [];
    panners.enemyHurt = [];
    soundIndexes.enemyHurt = 0;
    for (let i = 0; i < 18; i++) {
        let panner = new Tone.Panner(0).toDestination();
        sounds.enemyHurt.push(new Tone.Player("./sounds/enemy-hurt.wav").connect(panner));
        panners.enemyHurt.push(panner);
    }

    sounds.windowGrow = [];
    panners.windowGrow = [];
    soundIndexes.windowGrow = 0;
    for (let i = 0; i < 8; i++) {
        let panner = new Tone.Panner(0).toDestination();
        sounds.windowGrow.push(new Tone.Player("./sounds/window-grow.wav").connect(panner));
        panners.windowGrow.push(panner);
    }

    sounds.windowHeal = [];
    panners.windowHeal = [];
    soundIndexes.windowHeal = 0;
    for (let i = 0; i < 8; i++) {
        let panner = new Tone.Panner(0).toDestination();
        sounds.windowHeal.push(new Tone.Player("./sounds/window-heal.wav").connect(panner));
        panners.windowHeal.push(panner);
    }

    sounds.collectPowerup = [];
    panners.collectPowerup = [];
    soundIndexes.collectPowerup = 0;
    for (let i = 0; i < 8; i++) {
        let panner = new Tone.Panner(0).toDestination();
        sounds.collectPowerup.push(new Tone.Player("./sounds/collect-powerup.wav").connect(panner));
        panners.collectPowerup.push(panner);
    }

    sounds.newWindow = [];
    panners.newWindow = [];
    soundIndexes.newWindow = 0;
    for (let i = 0; i < 3; i++) {
        let panner = new Tone.Panner(0).toDestination();
        sounds.newWindow.push(new Tone.Player("./sounds/new-window.wav").connect(panner));
        panners.newWindow.push(panner);
    }

    sounds.windowDie = [];
    panners.windowDie = [];
    soundIndexes.windowDie = 0;
    for (let i = 0; i < 3; i++) {
        let panner = new Tone.Panner(0).toDestination();
        sounds.windowDie.push(new Tone.Player("./sounds/window-die.wav").connect(panner));
        panners.windowDie.push(panner);
    }

    sounds.rebootButton = new Tone.Player("./sounds/reboot-button.wav").toDestination();
    sounds.winGame = new Tone.Player("./sounds/win-game.wav").toDestination();

    sounds.music = new Audio("./sounds/windowsdefender-music.ogg");
    sounds.music.loop = true;
}

function setup() {

    let w = windowWidth < 2560/2-10 ? windowWidth : 2560/2-10;
    let h = windowHeight < 1406/2-10 ? windowHeight : 1406/2-10;

    createCanvas(w, h);
    textAlign(CENTER, CENTER);
    angleMode(DEGREES);

    noCursor();
    cursorImage = cursorImages.arrow;

    newGame();
}

function draw() {

    if (targetsVisualCount+0.5 < targets.length*height/50) targetsVisualCount += 0.05;
    else if (targetsVisualCount-0.5 > targets.length*height/50) targetsVisualCount -= 0.5;

    if (!resetWindowVisible) {

        let allDead = true;

        for (let i = 0; i < windows.length; i++) {
            if (windows[i] instanceof Window && !windows[i].dead) {
                allDead = false;
                break;
            }
        }

        if (allDead) {
            resetWindowVisible = true;
            windows.push(new ResetWindow());
            sounds.music.pause();
        }
    }

    background(150);
    displayBackground();

    for (let i = 0; i < folders.length; i++) {
        folders[i].update();
    }

    for (let i = 0; i < targets.length; i++) {
        targets[i].update();
    }

    for (let i = 0; i < bullets.length; i++) {
        bullets[i].update();
    }

    for (let i = 0; i < sprays.length; i++) {
        sprays[i].update();
    }

    if (!holdingWindow) cursorImage = cursorImages.arrow;

    for (let i = 0; i < windows.length; i++) {
        windows[i].update();
        if (windows[i].hoverBar() && !holdingWindow) cursorImage = cursorImages.point;
    }

    if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) {
        holdingWindow = false;
        cursorImage = cursorImages.point;
    }

    for (let i = 0; i < powerups.length; i++) {
        powerups[i].update();
    }

    let displayLater = -1;
    for (let i = 0; i < windows.length; i++) {
        if (!windows[i].moving) windows[i].display();
        else displayLater = windows[i];
    }
    if (displayLater != -1) displayLater.display();

    if (frameCount%targetTimer == 0 && interacted && !won) {
        targets.push(new Target());
        if (targetTimer > 60*1) targetTimer -= 3;
    }

    imageMode(CENTER);
    image(cursorImage, mouseX, mouseY, 50, 50);
    imageMode(CORNER);

    strokeWeight(6);
    noFill();
    stroke("#A5A292");
    rect(-3, -3, width+6, height+6, 16);
    stroke(0);
    rect(3, 3, width-6, height-6, 10);
}

function mousePressed() {

    if (holdingWindow) {

        for (let i = 0; i < windows.length; i++) {
            if (windows[i].moving) {
                let thisWindow = windows[i];
                windows.splice(i, 1);
                windows.push(thisWindow);
                windows[i].moving = false;
            }
        }

        cursorImage = cursorImages.arrow;
        holdingWindow = false;
        return;
    }

    for (let i = windows.length-1; i >= 0; i--) {
        if (windows[i].hover()) {

            if (!interacted) {
                interacted = true;
                sounds.music.currentTime = 0;
                sounds.music.volume = 1;
                sounds.music.play();
            }
            if (windows[i].hoverBar()) {
                windows[i].moving = true;
                cursorImage = cursorImages.grab;
                holdingWindow = true;
            } else if (windows[i] instanceof ResetWindow && windows[i].       hoverResetButton()) {
                newGame();
                sounds.rebootButton.start();
                return;
            }
            let thisWindow = windows[i];
            windows.splice(i, 1);
            windows.push(thisWindow);
            return;
        }
    }
}

// function mouseReleased() {

//     for (let i = 0; i < windows.length; i++) {
//         windows[i].moving = false;
//     }

//     cursorImage = cursorImages.arrow;
// }

function displayBackground() {

    stroke(0);
    strokeWeight(2);

    for (let i = 0; i < width+height; i += 8) {
        line(i, 0, 0, i);
    }

    let percent = 0;

    for (let i = folders.length-3*2; i < folders.length; i++) {
        percent += folders[i].downloadProgress/folders[i].downloadMax/(3*2);
    }

    percent += 5/6;

    if (!won && percent > 5/6) {
        sounds.music.volume = 1-percent%(1/6)*6;
    }

    if (!won && percent > 0.99) {
        won = true;
        windows.push(new ResetWindow());
        sounds.winGame.start();
        sounds.music.pause();
    }
    if (won) percent = 1;

    fill(150);
    noStroke();
    rect(percent*width, 0, width-percent, height);
    stroke(0);
    strokeWeight(2);
    line(percent*width, 0, percent*width, height);
}

function newGame() {

    won = false;

    windows = [];
    folders = [];
    targets = [];
    bullets = [];
    sprays = [];
    powerups = [];

    targetTimer = 60*5;
    newWindowCount = 0;
    newWindowInterval = 5;
    score = 0;
    targetsVisualCount = 0;

    interacted = false;
    resetWindowVisible = false;

    shuffle(targetColours, true);

    let cols = 3*3;
    let rows = 2*3;
    let padding = 100;
    let w = width-padding*2;
    let h = height-padding*2;
    let xSpacing = w/cols;
    let ySpacing = h/rows;

    let x = 0;
    let y = 0;

    for (let i = padding+xSpacing/2; i <= width-padding; i += xSpacing) {
        for (let j = padding+ySpacing/2; j <= height-padding; j += ySpacing) {

            if (x%3 == 1 && y%3 == 1) folders.push(new Folder(true, i, j));
            else folders.unshift(new Folder(false, i, j));
            x++;
        }
        y++;
        x = 0;
    }

    for (let i = 0; i < 1; i++) {
        windows.push(new Window(i%targetColours.length, "bullet", 180, 180-30, width/2-90, (height+30)/2-90-15));
    }

    padding = 150;
    for (let i = 0; i < 10; i++) {
        let x = random(padding, width-padding);
        let y = random(padding, height-padding);
        let distance = dist(width/2, height/2, x, y);
        while (distance < 200) {
            x = random(padding, width-padding);
            y = random(padding, height-padding);
            distance = dist(width/2, height/2, x, y);
        }
        targets.push(new Target(x, y));
    }
}

function playSoundFromArray(name, pan) {

    if (pan != null) {
        panners[name][soundIndexes[name]].pan.setValueAtTime(pan, 0);
    }
    if (sounds[name][soundIndexes[name]].state == "stopped") sounds[name][soundIndexes[name]].start();
    soundIndexes[name]++;
    if (soundIndexes[name] >= sounds[name].length) soundIndexes[name] = 0;
    return soundIndexes[name];
}