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

        if (this.visualRadius < this.radius) this.visualRadius++;

        this.visualRadius += sin((frameCount+this.pulseOffset)*14)*0.3;

        for (let i = 0; i < windows.length; i++) {
            if (this.collideWithShooter(windows[i])) {
                this.x = lerp(this.x, windows[i].cX, 0.1);
                this.y = lerp(this.y, windows[i].cY, 0.1);
            }
            if (this.overlapWithShooter(windows[i])) {

                if (this.type == "health" && windows[i].health >= windows[i].maxHealth) continue;

                this.bestowPower(windows[i]);
                this.destruct();
                if (this.type != "expand" && this.type != "health") windows[i].animatePowerup = true;
            }
        }
    }

    collideWithShooter(collider) {

        if (dist(this.x, this.y, collider.cX, collider.cY) < this.radius/2 + 30/2) return true;
    }

    overlapWithShooter(collider) {

        if (dist(this.x, this.y, collider.cX, collider.cY) < 1) return true;
    }

    bestowPower(shooter) {

        // for (let i = 0; i < shooter.guns.length; i++) {
        //     if (shooter.guns[i].type == this.type) {
        //         shooter.guns[i].upgrade();
        //         return;
        //     }
        // }

        // if (this.type == "expand") {
        //     shooter.levelGrowth += 30;
        // } else {
        //     shooter.guns.push(new Gun(this.type));
        // }

        if (this.type == "expand") {
            shooter.levelGrowth += 30;
        } else if (this.type == "health") {
            shooter.health += 30;
            if (shooter.health > shooter.maxHealth) shooter.health = shooter.maxHealth;
        } else {
            shooter.gun.upgrade(this.type);
        }
    }

    destruct() {

        let index = powerups.indexOf(this);
        if (index != -1) powerups.splice(index, 1);
    }

    display(wndw) {

        if (this.visualRadius < 0) return;

        let cnvs = wndw.canvas;

        if (this.x+this.visualRadius/2 > wndw.x & this.x-this.visualRadius/2 < wndw.x2 && this.y+this.visualRadius/2 > wndw.y && this.y-this.visualRadius/2 < wndw.y2) {
            cnvs.imageMode(CENTER);
            cnvs.image(powerupImages[this.type], this.x-wndw.x, this.y-wndw.y, this.visualRadius, this.visualRadius);
        }
    }
}