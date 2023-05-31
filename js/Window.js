// https://coolors.co/ff0000-ff007e-ff7e7e-ff7e00-ffff00-00ff00-00ffff-0000ff-7e7eff-ff00ff
let targetColours = ["#FFFF00", "#FF00FF","#00FFFF","#FF0000","#00FF00","#0000FF","#FF7E00","#FF7E7E","#7E7EFF","#FF007E"];
let shooterTypes = ["bullet"];
let consonants = "BCDFGHKLMNPRSTW";
let vowels = "AEIOU";
let ignoreNames = ["FUK", "FUC", "CUC", "CUK", "KUK", "KUC", "KIL", "CUM", "KUM", "FAP", "CIS", "NOB", "KEK", "CUN"];
let namesUsed = [];

class Window {

    constructor(index, shooterType, w, h, x, y) {

        let padding = 150;
        let wVsH = int(random(100));
        this.w = w ? w : 130+wVsH;
        this.h = h ? h : 130+100-wVsH-30;
        this.x = x ? x : random(padding, width-padding);
        this.y = y ? y : random(padding, height-padding);
        this.x2 = this.x+this.w;
        this.y2 = this.y+this.h+30;
        this.cX = this.x+this.w/2;
        this.cY = this.y+this.h/2;

        while (this.collidingWithTarget()) {
            this.x = x ? x : random(padding, width-padding);
            this.y = y ? y : random(padding, height-padding);
            this.x2 = this.x+this.w;
            this.y2 = this.y+this.h+30;
            this.cX = this.x+this.w/2;
            this.cY = this.y+this.h/2;
        }

        this.canvas = createGraphics(this.w, this.h+30);
        this.canvas.textFont(macFont);
        this.canvas.angleMode(DEGREES);

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
        this.xOffset = 0;
        this.yOffset = 0;

        this.gun = new Gun("singleBullet");

        // this.name = this.generateName();
        // while (ignoreNames.includes(this.name) || namesUsed.includes(this.name)) this.name = this.generateName();
        // namesUsed.push(this.name);
        this.name = this.gun.getBestAsset();

        this.maxHealth = 100;
        this.health = this.maxHealth;
        this.visualHealth = this.health;
        this.dead = false;
        this.losingHealth = false;
        this.healthFlashOffset = random(360);

        this.animatePowerup = false;
        this.animatePowerupTimer = -this.w-(this.w+this.h)/4;
    }

    update() {

        this.move();
        this.moveFromTopEdge();

        if (this.dead) return;

        this.shoot();
        this.grow();
        this.hurt();

        if (this.animatePowerup) {
            this.animatePowerupTimer += (this.w+this.h)/20;
            if (this.animatePowerupTimer > this.w+(this.w+this.h)/4) {
                this.animatePowerup = false;
                this.animatePowerupTimer = -this.w-(this.w+this.h)/4;
            }
        }

        // if (this.visualXp < this.xp) this.visualXp += 0.05;

        // if (this.visualXp >= this.xpCap) {
        //     this.xp = this.xp%this.xpCap;
        //     this.visualXp = 0;
        //     this.level++;
        //     this.xpCap *= 1.2;
        //     this.levelGrowth = 30;
        // }

        this.inRange = false;
        this.shooting = false;

        for (let i = 0; i < targets.length; i++) {
            if (targets[i].inRange(this)) this.inRange = true;
        }

        if (this.inRange) this.shooting = true;

        if (!this.inRange && !this.moving) {
            this.y += sin((frameCount+this.bobOffset)*3)*0.2;
            this.y2 = this.y+this.h+30;
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
        this.y2 = this.y+this.h+30;
        this.cX = this.x+this.w/2;
        this.cY = this.y+this.h/2;
    }

    moveFromTopEdge() {

        if (this.y < 5) {
            this.y = 5;
            this.y2 = this.y+this.h+30;
            this.cY = this.y+this.h/2;
        }
    }

    shoot() {

        this.gun.update(this.inRange);

        // for (let i = 0; i < this.guns.length; i++) {
        //     this.guns[i].update(this.inRange);
        // }

        if (!this.inRange) return;

        let closestTarget = -1;
        let closestDistance = -1;

        for (let i = 0; i < targets.length; i++) {

            let distance = dist(this.cX, this.cY, targets[i].x, targets[i].y);

            if (closestTarget == -1 || distance < closestDistance) {
                closestTarget = targets[i];
                closestDistance = distance;
            }
        }

        // for (let i = 0; i < this.guns.length; i++) {
        //     if (this.guns[i].canFire()) this.fire(closestTarget, this.guns[i]);
        // }

        if (this.gun.canFire()) this.fire(closestTarget, this.gun);
    }

    fire(target, gun) {

        let v = createVector(target.x-this.cX, target.y-this.cY);
        let heading = v.heading();

        // if (gun.type == "singleBullet") {
        //     v.normalize();
        //     v.mult(6);
        //     bullets.push(new Bullet(this.cX, this.cY, v.x, v.y, this, 10));
        // } else if (gun.type == "radial") {
            for (let i = heading; i < heading+360; i += 360/gun.numberOfShots) {
                let v = createVector(this.cX, this.cY);
                v.setHeading(i);
                v.normalize();
                v.mult(6);
                bullets.push(new Bullet(this.cX, this.cY, v.x, v.y, this, gun.shotSize));
            }
        // }

        playSoundFromArray("shootBullet");
    }

    grow() {

        if (this.levelGrowth <= 0) return;

        if (random() < 0.5 || this.h > height-30) {
            this.w++;
        } else {
            this.h++;
        }

        this.x2 = this.x+this.w;
        this.y2 = this.y+this.h+30;
        this.cX = this.x+this.w/2;
        this.cY = this.y+this.h/2;

        this.canvas = createGraphics(this.w, this.h+30);
        this.canvas.textFont(macFont);

        this.levelGrowth--;
    }

    hurt() {

        this.losingHealth = false;

        if (this.health <= 0) return;

        for (let i = 0; i < targets.length; i++) {
            if (this.collide(targets[i])) {
                this.health -= 0.3;
                this.visualHealth -= 0.3;
                this.losingHealth = true;
            }
        }

        // if (this.losingHealth) {
        //     playSoundFromArray("windowHurt");
        // }

        if (this.visualHealth+0.3 < this.health) {
            this.visualHealth += 0.3;
        }

        if (this.visualHealth <= 0) {
            this.dead = true;
            score -= 10;
            if (score < 0) score = 0;
            playSoundFromArray("windowDie");
        }
    }

    generateName() {

        let chars = [];

        chars.push(consonants[int(random(consonants.length))]);
        chars.push(vowels[int(random(vowels.length))]);
        chars.push(consonants[int(random(consonants.length))]);

        return chars.join('');
    }

    rename() {

        this.name = this.gun.getBestAsset();
    }

    collide(collider) {

        if (dist(this.cX, this.cY, collider.x, collider.y) < 30/2 + collider.radius/2) return true;
    }

    collidingWithTarget() {

        for (let i = 0; i < targets.length; i++) {
            if (dist(this.cX, this.cY, targets[i].x, targets[i].y) < 30/2 + targets[i].radius/2 + 20) {
                return true;
            }
        }
    }

    display() {

        this.xOffset = random(-2, 2);
        this.yOffset = random(-2, 2);

        this.canvas.push();
        this.canvas.background(255);
        this.canvas.stroke(0);
        this.canvas.strokeWeight(2);
        this.canvas.translate(0, 30);

        if (!this.dead) {

            if (this.shooting) this.canvas.translate(-this.xOffset, -this.yOffset);

            for (let i = 0; i < folders.length; i++) {
                folders[i].display(this);
            }

            for (let i = 0; i < targets.length; i++) {
                targets[i].display(this);
            }

            for (let i = 0; i < sprays.length; i++) {
                sprays[i].display(this);
            }

            for (let i = 0; i < windows.length; i++) {
                if (windows[i] instanceof Window) windows[i].displayShooter(this);
            }

            for (let i = 0; i < bullets.length; i++) {
                bullets[i].display(this);
            }

            for (let i = 0; i < powerups.length; i++) {
                powerups[i].display(this);
            }

            if (this.shooting) this.canvas.translate(this.xOffset, this.yOffset);
        } else {
            this.canvas.background(this.targetColour);
        }

        if (!this.dead && this.animatePowerup) {
            let thickness = (this.h+this.w)/4;
            this.canvas.strokeWeight(thickness+4);
            this.canvas.stroke(0);
            this.canvas.line(-thickness, -this.animatePowerupTimer-thickness, this.w+thickness, this.w-this.animatePowerupTimer+thickness);
            this.canvas.strokeWeight(thickness);
            this.canvas.stroke(255);
            this.canvas.line(-thickness, -this.animatePowerupTimer-thickness, this.w+thickness, this.w-this.animatePowerupTimer+thickness);
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
        noStroke();

        if (!this.dead && this.shooting) {
            rect(this.x+3, this.y+3, this.w+this.xOffset, this.h+30+this.yOffset);
            image(this.canvas, this.x+this.xOffset, this.y+this.yOffset);
        } else {
            rect(this.x+3, this.y+3, this.w, this.h+30);
            image(this.canvas, this.x, this.y);
        }
    }

    displayShooter(wndw) {

        if (this.dead) return;

        let cnvs = wndw.canvas;

        if (this.shooting) cnvs.translate(this.xOffset, this.yOffset);
        cnvs.stroke(0);
        cnvs.fill(255);
        cnvs.ellipse(this.cX-wndw.x, this.cY-wndw.y, 30);
        cnvs.ellipse(this.cX-wndw.x, this.cY-wndw.y, 20);
        cnvs.ellipse(this.cX-wndw.x, this.cY-wndw.y, 10);

        if (this.shooting) cnvs.translate(-this.xOffset, -this.yOffset);
    }

    displayUI() {

        let percent = (this.visualHealth/this.maxHealth)*this.w;

        this.canvas.stroke(0);
        this.canvas.strokeWeight(2);
        this.canvas.fill(this.targetColour);
        if (this.losingHealth && (int((frameCount+this.healthFlashOffset)/8))%2 == 1) this.canvas.fill(0);
        if (this.dead) this.canvas.fill(this.targetColour);
        this.canvas.rect(percent, 30-5, this.w-percent, 4);
        this.canvas.noFill();
        this.canvas.rect(0, 30-5, this.w, 4);

        this.canvas.line(65, 9, this.w-65, 9);
        this.canvas.line(65, 13, this.w-65, 13);
        this.canvas.line(65, 17, this.w-65, 17);

        this.canvas.noStroke();
        this.canvas.fill(0);
        this.canvas.textSize(20);
        // this.canvas.textAlign(LEFT);
        // this.canvas.text("LVL "+this.level, 8, 18.5);
        this.canvas.textAlign(LEFT);
        this.canvas.text(this.name, 8, 18.5);

        this.canvas.imageMode(CENTER);

        // for (let i = 0; i < this.guns.length; i++) {
        //     this.canvas.image(powerupImages[this.guns[i].type], this.w-13*(i+1), 13, 15, 15);
        // }

        let images = [statusImages.bigger, statusImages.more, statusImages.faster];
        let percents = [this.gun.biggerLevel, this.gun.moreLevel, this.gun.fasterLevel];

        for (let i = 0; i < images.length; i++) {
            this.canvas.image(images[i][percents[i]], this.w-13-18*i, 13, 15, 15);
        }
    }
}