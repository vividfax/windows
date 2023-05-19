// https://coolors.co/ff0000-ff007e-ff7e7e-ff7e00-ffff00-00ff00-00ffff-0000ff-7e7eff-ff00ff
let targetColours = ["#FFFF00", "#FF00FF","#00FFFF","#FF0000","#00FF00","#0000FF","#FF7E00","#FF7E7E","#7E7EFF","#FF007E"];
let shooterTypes = ["bullet"];
let consonants = "BCDFGHKLMNPRSTW";
let vowels = "AEIOU";
let ignoreNames = ["FUK", "FUC", "CUC", "CUK", "KUK", "KUC", "KIL"];

class Window {

    constructor(index, shooterType, w, h, x, y) {

        let padding = 150;
        this.x = x ? x : random(padding, width-padding);
        this.y = y ? y : random(padding, height-padding);
        let wVsH = int(random(100));
        this.w = w ? w : 130+wVsH;
        this.h = h ? h : 130+100-wVsH-30;
        this.x2 = this.x+this.w;
        this.y2 = this.y+this.h;
        this.cX = this.x+this.w/2;
        this.cY = this.y+this.h/2;

        this.canvas = createGraphics(this.w, this.h+30);
        this.canvas.textFont(macFont);

        this.moving = false;
        this.bulletTimer = 0;
        this.inRange = false;

        let colours = [200, 255, 0, 0];
        shuffle(colours, true);

        this.targetColour = targetColours[index];
        this.shooterType = shooterType ? shooterType : random(shooterTypes);

        this.xp = 0;
        this.visualXp = 0;
        this.xpCap = 10;
        this.level = 1;
        this.levelGrowth = 0;

        this.bobOffset = random(360);

        this.name = this.generateName();
        while (ignoreNames.includes(this.name)) this.name = this.generateName();
    }

    update() {

        this.move();
        this.shoot();
        this.grow();

        if (this.visualXp < this.xp) this.visualXp += 0.05;

        if (this.visualXp >= this.xpCap) {
        this.xp = this.xp%this.xpCap;
        this.visualXp = 0;
        this.level++;
        this.xpCap *= 1.2;
        this.levelGrowth = 30;
        }

        this.inRange = false;

        for (let i = 0; i < targets.length; i++) {
        if (targets[i].inRange(this)) this.inRange = true;
        }

        if (!this.inRange && !this.moving) {
        this.y += sin((frameCount+this.bobOffset)*3)*0.2;
        this.y2 = this.y+this.h;
        this.cY = this.y+this.h/2;
        }
    }

    hover() {

        if (mouseX > this.x && mouseX < this.x2 && mouseY > this.y && mouseY < this.y2) {
        return true;
        }
    }

    hoverBar() {

        if (mouseX > this.x && mouseX < this.x2 && mouseY > this.y && mouseY < this.y+30) {
        return true;
        }
    }

    move() {

        if (this.moving && (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height)) this.moving = false;
        if (!this.moving) return;

        this.x += mouseX - pmouseX;
        this.y += mouseY - pmouseY;
        this.x2 = this.x+this.w;
        this.y2 = this.y+this.h;
        this.cX = this.x+this.w/2;
        this.cY = this.y+this.h/2;
    }

    shoot() {

        if (!this.inRange) return;

        this.bulletTimer++;

        if (this.bulletTimer > 10) {
        this.bulletTimer = 0;
        } else {
        return;
        }

        let closestTarget = -1;
        let closestDistance = -1;

        for (let i = 0; i < targets.length; i++) {

        let distance = dist(this.cX, this.cY, targets[i].x, targets[i].y);

        if (closestTarget == -1 || distance < closestDistance) {
            closestTarget = targets[i];
            closestDistance = distance;
        }
        }

        let distance = dist(this.cX, this.cY, closestTarget.x, closestTarget.y);

        if (distance < 400) {

        this.fire(closestTarget);
        }
    }

    fire(closestTarget) {

        if (this.shooterType == "bullet") {
        let v = createVector(closestTarget.x-this.cX, closestTarget.y-this.cY);
        v.normalize();
        v.mult(2);
        bullets.push(new Bullet(this.cX, this.cY, v.x, v.y, this, 10));
        } else if (this.shooterType == "radial") {
        for (let i = 0; i < 360; i += 360/18) {
            let v = createVector(this.cX, this.cY);
            v.setHeading(i);
            v.normalize();
            v.mult(2);
            bullets.push(new Bullet(this.cX, this.cY, v.x, v.y, this, 3));
        }
        }
    }

    grow() {

        if (this.levelGrowth <= 0) return;

        if (random() < 0.5) {
        this.w++;
        } else {
        this.h++;
        }

        this.x2 = this.x+this.w;
        this.y2 = this.y+this.h;
        this.cX = this.x+this.w/2;
        this.cY = this.y+this.h/2;

        this.canvas = createGraphics(this.w, this.h+30);
        this.canvas.textFont(macFont);

        this.levelGrowth--;
    }

    generateName() {

        let chars = [];

        chars.push(consonants[int(random(consonants.length))]);
        chars.push(vowels[int(random(vowels.length))]);
        chars.push(consonants[int(random(consonants.length))]);

        return chars.join('');
    }

    display() {

        this.canvas.push();
        this.canvas.background(255);
        this.canvas.stroke(0);
        this.canvas.strokeWeight(2);
        this.canvas.translate(0, 30);

        for (let i = 0; i < circles.length; i++) {
        circles[i].display(this);
        }

        for (let i = 0; i < targets.length; i++) {
        targets[i].display(this);
        }

        for (let i = 0; i < sprays.length; i++) {
        sprays[i].display(this);
        }

        for (let i = 0; i < windows.length; i++) {
        windows[i].displayShooter(this);
        }

        for (let i = 0; i < bullets.length; i++) {
        bullets[i].display(this);
        }

        this.canvas.translate(0, -30);
        this.canvas.stroke(0);
        this.canvas.strokeWeight(2);
        this.canvas.noFill();
        this.canvas.rect(1, 1, this.w-2, this.h+30-2);
        this.canvas.fill(255);
        this.canvas.rect(1, 1, this.w-2, 30-2);

        this.canvas.pop();

        this.displayUI();

        fill(0);

        if (this.inRange) {
        let xOffset = random(-1, 1);
        let yOffset = random(-1, 1);
        rect(this.x+3, this.y+3, this.w+xOffset, this.h+30+yOffset);
        image(this.canvas, this.x+xOffset, this.y+yOffset);
        } else {
        rect(this.x+3, this.y+3, this.w, this.h+30);
        image(this.canvas, this.x, this.y);
        }
    }

    displayShooter(wndw) {

        let cnvs = wndw.canvas;

        cnvs.stroke(0);
        cnvs.fill(255);
        cnvs.ellipse(this.cX-wndw.x, this.cY-wndw.y, 30);
        cnvs.ellipse(this.cX-wndw.x, this.cY-wndw.y, 20);
        cnvs.ellipse(this.cX-wndw.x, this.cY-wndw.y, 10);
        return true;
    }

    displayUI() {

        let percent = this.visualXp/this.xpCap*this.w;

        this.canvas.fill(0);
        this.canvas.noStroke();
        this.canvas.rect(0, 30-5, percent, 4);
        this.canvas.noFill();
        this.canvas.stroke(0);
        this.canvas.strokeWeight(2);
        this.canvas.rect(0, 30-5, this.w, 4);

        this.canvas.line(65, 9, this.w-65, 9);
        this.canvas.line(65, 13, this.w-65, 13);
        this.canvas.line(65, 17, this.w-65, 17);

        this.canvas.noStroke();
        this.canvas.fill(0);
        this.canvas.textSize(20);
        this.canvas.textAlign(LEFT);
        this.canvas.text("LVL "+this.level, 8, 18.5);
        this.canvas.textAlign(RIGHT);
        this.canvas.text(this.name, this.w-8, 18.5);
    }
}