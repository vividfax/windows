class Target {

    constructor(x, y) {

        let padding = 150;
        this.x = x ? x : random(padding, width-padding);
        this.y = y ? y : random(padding, height-padding);
        this.radius = score > 10 ? random(25, 100) : 50;
        this.visualRadius = 0;

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

        this.x += this.velX*0.2;
        this.y += this.velY*0.2;

        if (this.x > width) this.x = 0;
        else if (this.x < 0) this.x = width;
        if (this.y > height) this.y = 0;
        else if (this.y < 0) this.y = height;
    }

    destruct() {

        newWindowCount++;
        if (newWindowCount >= newWindowInterval && windows.length < targetColours.length) {
            newWindowCount = 0;
            newWindowInterval *= 3;
            powerups.push(new Powerup(this.x, this.y, "new"));
            // windows.push(new Window(windows.length));
        } else {
            powerups.push(new Powerup(this.x, this.y));
        }

        score++;
        newRewardCount++;

        // if (newRewardCount % newRewardInterval == 0) {
        //     newRewardCount = 0;
        //     newRewardInterval++;
        // }

        let index = targets.indexOf(this);
        if (index != -1) targets.splice(index, 1);
    }

    inRange(wndw) {

        if (this.x+this.visualRadius/2 > wndw.x & this.x-this.visualRadius/2 < wndw.x2 && this.y+this.visualRadius/2 > wndw.y && this.y-this.visualRadius/2 < wndw.y2) {
        return true;
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