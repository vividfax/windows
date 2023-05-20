let bigBadCount = 0;

class Target {

    constructor(x, y) {

        let padding = 150;
        this.x = x ? x : random(padding, width-padding);
        this.y = y ? y : random(padding, height-padding);
        this.radius = score > 10 ? random(25, 100) : 50;
        this.radius += score/5;
        if (score > 30 && bigBadCount < 1 && random() < 0.05) {
            this.radius = random(200, 300);
            bigBadCount++;
            this.bigBad = true;
        }
        this.visualRadius = 0;

        while (this.collidingWithShooter()) {
            this.x = x ? x : random(padding, width-padding);
            this.y = y ? y : random(padding, height-padding);
        }

        this.velX = random(-1, 1);
        this.velY = random(-1, 1);
    }

    update() {

        if (this.visualRadius < this.radius) this.visualRadius++;
        else if (this.visualRadius > this.radius) this.visualRadius--;

        if (random() < 0.03) {
            this.velX = random(-1, 1);
            this.velY = random(-1, 1);
        }

        this.speed = 0.4 + score*0.01;
        if (this.speed > 1) this.speed = 1;
        this.x += this.velX*this.speed;
        this.y += this.velY*this.speed;

        if (this.x > width && this.velX > 0) this.velX *= -1;
        else if (this.x < 0 && this.velX < 0) this.velX *= -1;
        if (this.y > height && this.velY > 0) this.velY *= -1;
        else if (this.y < 50 && this.velY < 0) this.velY *= -1;
    }

    destruct() {

        if (this.bigBad) {
            bigBadCount--;
        }

        newWindowCount++;
        if (newWindowCount >= newWindowInterval) {
            newWindowCount = 0;
            newWindowInterval *= 2;
            powerups.push(new Powerup(this.x, this.y, "new"));
        } else if (score % 12 == 11) {
            powerups.push(new Powerup(this.x, this.y, "spam"));
        } else {
            powerups.push(new Powerup(this.x, this.y));
        }

        score++;

        let index = targets.indexOf(this);
        if (index != -1) targets.splice(index, 1);
    }

    inRange(wndw) {

        if (this.x+this.visualRadius/2 > wndw.x & this.x-this.visualRadius/2 < wndw.x2 && this.y+this.visualRadius/2 > wndw.y && this.y-this.visualRadius/2 < wndw.y2) {
            return true;
        }
    }

    collidingWithShooter() {

        for (let i = 0; i < windows.length; i++) {
            if (windows[i] instanceof Window && dist(this.x, this.y, windows[i].cX, windows[i].cY) < this.radius/2 + 30/2 + 20) {
                return true;
            }
        }
    }

    display(wndw) {

        let cnvs = wndw.canvas;

        if (this.x+this.visualRadius/2 > wndw.x & this.x-this.visualRadius/2 < wndw.x2 && this.y+this.visualRadius/2 > wndw.y && this.y-this.visualRadius/2 < wndw.y2) {
            cnvs.fill(wndw.targetColour);
            cnvs.noStroke();
            cnvs.ellipse(this.x-wndw.x, this.y-wndw.y, this.visualRadius);
            return true;
        }
    }
}