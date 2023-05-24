let powerupTypes = ["bigger", "more", "faster", "expand", "health"];

class Powerup {

    constructor(x, y, type) {

        let padding = 100;
        this.x = x ? x : random(padding, width-padding);
        this.y = y ? y : random(padding, height-padding);
        this.radius = 30;
        this.visualRadius = -30;

        this.type = type ? type : random(powerupTypes);

        this.pulseOffset = random(360);
    }

    update() {

        if (won && this.visualRadius > 0) {
            this.visualRadius -= 3;
            return;
        } else if (won && this.visualRadius <= 0) {
            this.destruct();
        }

        if (this.visualRadius < this.radius) {
            this.visualRadius++;
            return;
        }

        this.visualRadius += sin((frameCount+this.pulseOffset)*14)*0.3;

        for (let i = 0; i < windows.length; i++) {
            if (windows[i] instanceof Window == false && windows[i] == dead) continue;
            if (this.collideWithShooter(windows[i])) {
                this.x = lerp(this.x, windows[i].cX, 0.25);
                this.y = lerp(this.y, windows[i].cY, 0.25);
                if (this.overlapWithShooter(windows[i])) {

                    if (this.bestowPower(windows[i])) {
                        if (this.type != "expand" && this.type != "health" && this.type != "new" && this.type != "spam") windows[i].animatePowerup = true;
                        this.destruct();
                    }
                }
                break;
            } else if (this.drawnToShooter(windows[i])) {
                let vec = createVector(windows[i].cX-this.x, windows[i].cY-this.y);
                let gravity = (windows[i].x+windows[i].y)*0.001*0.25;
                vec.normalize().mult(gravity);
                this.x += vec.x;
                this.y += vec.y;
            }
        }
    }

    drawnToShooter(collider) {

        let colliderRadius = (collider.w+collider.h)/2;
        if (dist(this.x, this.y, collider.cX, collider.cY) < colliderRadius/2 + 30/2) return true;
    }

    collideWithShooter(collider) {

        if (dist(this.x, this.y, collider.cX, collider.cY) < this.radius/2 + 30/2) return true;
    }

    overlapWithShooter(collider) {

        if (dist(this.x, this.y, collider.cX, collider.cY) < 2) return true;
    }

    bestowPower(shooter) {

        if (this.type == "expand") {
            shooter.levelGrowth += 30;
            shooter.health += 10;
            shooter.visualHealth += 10;
            shooter.maxHealth += 10;
            return true;
        } else if (this.type == "health") {
            if (shooter.health >= shooter.maxHealth) return false;
            shooter.health += 30;
            if (shooter.health > shooter.maxHealth) shooter.health = shooter.maxHealth;
            return true;
        } else if (this.type == "new") {
            windows.push(new Window(windows.length%targetColours.length));
            return true;
        } else if (this.type == "spam") {
            windows.push(new SpamWindow());
            return true;
        } else {
            let upgraded = shooter.gun.upgrade(this.type)
            shooter.rename();
            return upgraded;
        }
    }

    destruct() {

        let index = powerups.indexOf(this);
        if (index != -1) powerups.splice(index, 1);
    }

    display(wndw) {

        if (this.visualRadius <= 0) return;

        let cnvs = wndw.canvas;

        if (this.x+this.visualRadius/2 > wndw.x & this.x-this.visualRadius/2 < wndw.x2 && this.y+this.visualRadius/2 > wndw.y && this.y-this.visualRadius/2 < wndw.y2) {
            cnvs.imageMode(CENTER);
            cnvs.image(powerupImages[this.type], this.x-wndw.x, this.y-wndw.y, this.visualRadius, this.visualRadius);
            cnvs.stroke(0);
            cnvs.strokeWeight(2);
            cnvs.noFill();
            cnvs.ellipse(this.x-wndw.x, this.y-wndw.y, this.visualRadius-1, this.visualRadius-1);
        }
    }
}