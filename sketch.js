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
let newRewardCount = 0;
let newRewardInterval = 1;

let backgroundLayer;

let macFont;

let interacted = false;

let powerupImages = {};
let spamImages = [];
let cursorImages = {};
let cursorImage;

function preload() {

    macFont = loadFont("./fonts/VT323-Regular.ttf");

    powerupImages.more = loadImage("./images/powerups/more.png");
    powerupImages.faster = loadImage("./images/powerups/faster.png");
    powerupImages.bigger = loadImage("./images/powerups/bigger.png");
    powerupImages.expand = loadImage("./images/powerups/expand.png");
    powerupImages.health = loadImage("./images/powerups/health.png");
    powerupImages.new = loadImage("./images/powerups/new.png");
    powerupImages.spam = loadImage("./images/powerups/spam.png");

    for (let i = 0; i < 10; i++) {
        spamImages.push(loadImage("./images/spam/"+i+".png"));
    }

    cursorImages.arrow = loadImage("./images/cursors/arrow.png");
    cursorImages.point = loadImage("./images/cursors/point.png");
    cursorImages.grab = loadImage("./images/cursors/grab.png");
}

function setup() {

    let w = windowWidth < 2560/2-10 ? windowWidth : 2560/2-10;
    let h = windowHeight < 1406/2-10 ? windowHeight : 1406/2-10;

    createCanvas(w, h);
    textAlign(CENTER, CENTER);
    angleMode(DEGREES);

    noCursor();
    cursorImage = cursorImages.arrow;

    shuffle(targetColours, true);

    for (let i = 0; i < width*height*0.0001; i++) {
        folders.push(new Folder());
    }

    for (let i = 0; i < 1; i++) {
        windows.push(new Window(i%targetColours.length, "bullet", 180, 180-30, width/2-90, height/2-90-15));
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

    if (allDead) windows.push(new Window(windows.length%targetColours.length));

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

    if (!mouseIsPressed) cursorImage = cursorImages.arrow;

    for (let i = 0; i < windows.length; i++) {
        windows[i].update();
        if (!mouseIsPressed && windows[i].hoverBar()) cursorImage = cursorImages.point;
    }

    for (let i = 0; i < powerups.length; i++) {
        powerups[i].update();
    }

    for (let i = 0; i < windows.length; i++) {
        windows[i].display();
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

    imageMode(CENTER);
    image(cursorImage, mouseX, mouseY, 50, 50);
    imageMode(CORNER);
}

function mousePressed() {

    for (let i = windows.length-1; i >= 0; i--) {

        if (!interacted) interacted = true;
        if (windows[i].hover()) {
            if (windows[i].hoverBar()) {
                windows[i].moving = true;
                cursorImage = cursorImages.grab;
            }
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

    cursorImage = cursorImages.arrow;
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
