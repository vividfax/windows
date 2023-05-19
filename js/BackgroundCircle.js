class BackgroundCircle {

    constructor() {

        this.x = random(width);
        this.y = random(height);
        this.radius = random(50, 100);

        this.xOffset = random(360);
        this.yOffset = random(360);
        this.radiusOffset = random(360);
        this.xDirection = random([-1, 1]);
        this.yDirection = random([-1, 1]);
    }

    update() {

        this.x += sin((frameCount+this.xOffset)*0.1)*0.1 * this.xDirection;
        this.y -= cos((frameCount+this.yOffset)*0.1)*0.1 * this.yDirection;
        this.radius += sin((frameCount+this.radiusOffset)*4)*0.1;
    }

    display(wndw) {

        let cnvs = wndw.canvas;

        if (this.x+this.radius/2 > wndw.x & this.x-this.radius/2 < wndw.x2 && this.y+this.radius/2 > wndw.y && this.y-this.radius/2 < wndw.y2) {
        cnvs.fill(255);
        cnvs.stroke(0);
        cnvs.strokeWeight(2);
        cnvs.rectMode(CENTER);
        cnvs.rect(this.x-wndw.x-this.radius/5, this.y-wndw.y-this.radius/5, this.radius/5*2, this.radius/5*2, this.radius*0.05);
        cnvs.rect(this.x-wndw.x, this.y-wndw.y, this.radius, this.radius*0.65, this.radius*0.05, this.radius*0.05, 0, 0);
        cnvs.rectMode(CORNER);
        return true;
        } else {
        }
    }
}