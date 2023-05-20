let windows = [];
let folders = [];
let targets = [];
let bullets = [];
let sprays = [];
let powerups = [];
let spamWindows = [];

let targetTimer = 60*5;
let newWindowCount = 0;
let newWindowInterval = 5;
let score = 0;
let targetsVisualCount = 0;
let newRewardCount = 0;
let newRewardInterval = 1;

let backgroundLayer;

let macFont;

let interacted = false;

let powerupImages = {};
let spamImages = [];

function preload() {

    macFont = loadFont("./fonts/VT323-Regular.ttf");

    powerupImages.more = loadImage("./images/more.png");
    powerupImages.faster = loadImage("./images/faster.png");
    powerupImages.bigger = loadImage("./images/bigger.png");
    powerupImages.expand = loadImage("./images/expand.png");
    powerupImages.health = loadImage("./images/health.png");
    powerupImages.new = loadImage("./images/new.png");
    powerupImages.spam = loadImage("./images/spam.png");

    for (let i = 0; i < 10; i++) {
        spamImages.push(loadImage("./images/spam/"+i+".png"));
    }
}

function setup() {

    let w = windowWidth < 2560/2-10 ? windowWidth : 2560/2-10;
    let h = windowHeight < 1406/2-10 ? windowHeight : 1406/2-10;

    createCanvas(w, h);
    textAlign(CENTER, CENTER);
    angleMode(DEGREES);

    shuffle(targetColours, true);

    for (let i = 0; i < width*height*0.0002; i++) {
        folders.push(new Folder());
    }

    for (let i = 0; i < 1; i++) {
        windows.push(new Window(i, "bullet", 180, 180-30, width/2-90, height/2-90-15));
    }

    // for (let i = 0; i < 1; i++) {
    //     let x = random(width/2-50, width/2+50);
    //     let y = random(height/2-50, height/2+50);
    //     let distance = dist(width/2, height/2, x, y);
    //     while (distance < 50) {
    //         x = random(width/2-50, width/2+50);
    //         y = random(height/2-50, height/2+50);
    //         distance = dist(width/2, height/2, x, y);
    //     }
    //     powerups.push(new Powerup(x, y, "faster"));
    // }

    let padding = 150;
    for (let i = 0; i < 3; i++) {
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

function draw() {

    if (targetsVisualCount+0.5 < targets.length*height/50) targetsVisualCount += 0.05;
    else if (targetsVisualCount-0.5 > targets.length*height/50) targetsVisualCount -= 0.5;

    let allDead = true;

    for (let i = 0; i < windows.length; i++) {
        if (windows[i] instanceof Window && !windows[i].dead) {
            allDead = false;
            break;
        }
    }

    if (allDead) windows.push(new Window(windows.length));

    background(150);
    // displayBackground();

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

    for (let i = 0; i < windows.length; i++) {
        windows[i].update();
    }

    for (let i = 0; i < powerups.length; i++) {
        powerups[i].update();
    }

    for (let i = 0; i < windows.length; i++) {
        windows[i].display();
    }

    for (let i = 0; i < spamWindows.length; i++) {
        spamWindows[i].update();
        spamWindows[i].display();
    }

    if (frameCount%targetTimer == 0 && interacted) {
        targets.push(new Target());
        if (targetTimer > 60*1) targetTimer -= 3;
    }

    strokeWeight(6);
    noFill();
    stroke("#A5A292");
    rect(-3, -3, width+6, height+6, 16);
    stroke(0);
    rect(3, 3, width-6, height-6, 10);
}

function mousePressed() {

    for (let i = spamWindows.length-1; i >= 0; i--) {

        if (!interacted) interacted = true;
            if (spamWindows[i].hover()) {
            if (spamWindows[i].hoverBar()) spamWindows[i].moving = true;
            let thisWindow = spamWindows[i];
            spamWindows.splice(i, 1);
            spamWindows.push(thisWindow);
            return;
        }
    }

    for (let i = windows.length-1; i >= 0; i--) {

        if (!interacted) interacted = true;
            if (windows[i].hover()) {
            if (windows[i].hoverBar()) windows[i].moving = true;
            let thisWindow = windows[i];
            windows.splice(i, 1);
            windows.push(thisWindow);
            return;
        }
    }
}

function mouseReleased() {

    for (let i = 0; i < windows.length; i++) {
        windows[i].moving = false;
    }
}

function displayBackground() {

    stroke(0);
    strokeWeight(2);

    for (let i = 0; i < width+height; i += 8) {

        line(i, 0, 0, i);
    }

    fill(150);
    noStroke();
    rect(0, 0, width, height-targetsVisualCount);
    stroke(0);
    strokeWeight(2);
    line(0, height-targetsVisualCount, width, height-targetsVisualCount);
}
