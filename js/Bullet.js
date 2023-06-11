class Bullet {

    constructor(x, y, velX, velY, shooter, radius) {

        this.x = x;
        this.y = y;
        this.velX = velX;
        this.velY = velY;
        this.shooter = shooter;

        this.radius = radius;
        this.lifeTime = 0;
    }

    update() {

        this.lifeTime++;
        this.radius -= 0.01;

        if (this.x+this.radius > width || this.x-this.radius < 0 || this.y+this.radius > height || this.y-this.radius < 0) this.destruct();

        for (let i = 0; i < targets.length; i++) {
            if (this.collide(targets[i])) {
                targets[i].radius -= this.radius*0.2;
                sprays.push(new Spray(this.x, this.y, 1, 5));
                if (targets[i].radius <= 10) {
                    this.shooter.xp++;
                    targets[i].destruct();
                } else {
                    let pan = (this.x/width*2)-1;
                    playSoundFromArray("enemyHurt", pan);
                }
                this.destruct();
            }
        }

        this.move();
    }

    move() {

        this.x += this.velX;
        this.y += this.velY;
    }

    destruct() {

        let index = bullets.indexOf(this);
        if (index != -1) bullets.splice(index, 1);
    }

    collide(collider) {

        if (dist(this.x, this.y, collider.x, collider.y) < this.radius/2 + collider.radius/2) {
            return true;
        }
    }

    display(wndw) {

        let cnvs = wndw.canvas;

        if (this.x+this.radius/2 > wndw.x & this.x-this.radius/2 < wndw.x2 && this.y+this.radius/2 > wndw.y && this.y-this.radius/2 < wndw.y2) {
            cnvs.fill(0);
            cnvs.noStroke();
            cnvs.ellipse(this.x-wndw.x, this.y-wndw.y, this.radius);
            return true;
        }
    }
}