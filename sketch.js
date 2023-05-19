let windows = [];
let circles = [];
let targets = [];
let bullets = [];
let sprays = [];

let targetTimer = 60*5;
let newWindowCount = 0;
let newWindowInterval = 3;
let score = 0;
let targetsVisualCount = 0;

let backgroundLayer;

let macFont;

function preload() {

    macFont = loadFont("./fonts/VT323-Regular.ttf");
}

function setup() {

    let w = windowWidth < 2560/2-10 ? windowWidth : 2560/2-10;
    let h = windowHeight < 1406/2-10 ? windowHeight : 1406/2-10;

    createCanvas(w, h);
    textAlign(CENTER, CENTER);
    angleMode(DEGREES);

    shuffle(targetColours, true);

    for (let i = 0; i < width*height*0.0002; i++) {
        circles.push(new BackgroundCircle());
    }

    for (let i = 0; i < 1; i++) {
        windows.push(new Window(i, "bullet", 180, 180-30, width/2-90, height/2-90-15));
    }

    let padding = 150;
    for (let i = 0; i < 1; i++) {
        let x = random(padding, width-padding);
        let y = random(padding, height-padding);
        let distance = dist(width/2, height/2, x, y);
        console.log(distance)
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

    displayBackground();
    fill(150);
    noStroke();
    rect(0, 0, width, height-targetsVisualCount);
    stroke(0);
    strokeWeight(2);
    line(0, height-targetsVisualCount, width, height-targetsVisualCount);

    for (let i = 0; i < circles.length; i++) {
        circles[i].update();
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
        windows[i].display();
    }

    if (frameCount%targetTimer == 0) {
        targets.push(new Target());
        if (targetTimer > 60*1.5) targetTimer -= 3;
    }

    strokeWeight(6);
    noFill();
    stroke("#A5A292");
    rect(-3, -3, width+6, height+6, 16);
    stroke(0);
    rect(3, 3, width-6, height-6, 10);
}

function mousePressed() {
    for (let i = windows.length-1; i >= 0; i--) {
        if (windows[i].hover()) {
        if (windows[i].hoverBar()) windows[i].moving = true;
        let thisWindow = windows[i];
        windows.splice(i, 1);
        windows.push(thisWindow);
        break;
        }
    }
}

function mouseReleased() {

    for (let i = 0; i < windows.length; i++) {
        windows[i].moving = false;
    }
}

function displayBackground() {

    background(150);
    stroke(0);
    strokeWeight(2);

    for (let i = 0; i < width+height; i += 8) {

        line(i, 0, 0, i);
    }
}
