class Spray {

    constructor(x, y, particleNum, size) {

        this.x = x;
        this.y = y;

        this.particles = [];

        for (let i = 0; i < particleNum; i++) {
        this.particles.push({
            x: this.x,
            y: this.y,
            velX: random(-1, 1),
            velY: random(-1, 1),
            size: random(size-5, size+5),
        })
        }
    }

    update() {

        for (let i = 0; i < this.particles.length; i++) {
        this.particles[i].x += this.particles[i].velX;
        this.particles[i].y += this.particles[i].velY;
        this.particles[i].size -= 0.3;
        }

        if (this.particles[0].size <= 0) this.destruct();
    }

    destruct() {

        let index = sprays.indexOf(this);
        if (index != -1) sprays.splice(index, 1);
    }

    display(wndw) {

        if (this.x > wndw.x & this.x < wndw.x2 && this.y > wndw.y && this.y < wndw.y2) {

        wndw.canvas.fill(wndw.targetColour);
        wndw.canvas.noStroke();

        for (let i = 0; i < this.particles.length; i++) {
            wndw.canvas.ellipse(this.particles[i].x-wndw.x, this.particles[i].y-wndw.y, this.particles[i].size);
        }
        return true;
        }

    }
}