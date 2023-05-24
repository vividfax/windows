class Folder {

    constructor(downloadable, x, y) {

        let padding = 100;
        this.x = x ? x : random(padding, width-padding);
        this.y = y ? y : random(padding, height-padding);
        this.originX = this.x;
        this.originY = this.y;
        this.radius = downloadable ? 100 : random(50, 100);

        this.xOffset = random(360);
        this.yOffset = random(360);
        this.radiusOffset = random(360);
        this.xDirection = random([-1, 1]);
        this.yDirection = random([-1, 1]);

        this.downloadable = downloadable;
        this.downloading = false;
        this.downloadProgress = 0;
        this.downloadMax = 100;

        this.strokeColour = 202;

        for (let i = -300; i < 0; i++) {
            this.move(i);
        }
    }

    update() {

        this.move();

        if (won) {
            this.radius = lerp(this.radius, 90, 0.05);
            this.strokeColour = lerp(this.strokeColour, 0, 0.05);
        }
        this.radius += sin((frameCount+this.radiusOffset)*4)*0.1;

        this.download();
    }

    move(preloadCounter) {

        let count = preloadCounter < 0 ? preloadCounter : frameCount;

        if (won) {
            this.x = lerp(this.x, this.originX, 0.05);
            this.y = lerp(this.y, this.originY, 0.05);
        } else {
            if (this.downloadable) {
                if (count < 0) {
                    this.x += sin((count+this.xOffset)*0.1)*0.1 * this.xDirection*0.3;
                    this.y -= cos((count+this.yOffset)*0.1)*0.1 * this.yDirection*0.3;
                }
            } else {
                this.x += sin((count+this.xOffset)*0.1)*0.1 * this.xDirection;
                this.y -= cos((count+this.yOffset)*0.1)*0.1 * this.yDirection;
            }
        }
    }

    download() {

        let downloading = false;

        for (let i = 0; i < windows.length; i++) {
            if (windows[i] instanceof Window == false || windows[i].dead) continue;
            if (this.collideWithShooter(windows[i])) {
                this.downloadProgress += 1.5;
                downloading = true;
            }
        }

        if (!downloading) this.downloadProgress -= 1.5;

        if (this.downloadProgress > this.downloadMax) this.downloadProgress = this.downloadMax;
        else if (this.downloadProgress < 0) this.downloadProgress = 0;
    }

    collideWithShooter(collider) {

        if (dist(this.x, this.y, collider.cX, collider.cY) < this.radius*0.7/2 + 30/2) return true;
    }

    display(wndw) {

        let cnvs = wndw.canvas;

        if (this.x+this.radius/2 > wndw.x & this.x-this.radius/2 < wndw.x2 && this.y+this.radius/2 > wndw.y && this.y-this.radius/2 < wndw.y2) {
            cnvs.fill(255);
            cnvs.stroke(this.strokeColour);
            if (this.downloadable) cnvs.stroke(0);
            cnvs.strokeWeight(2);
            cnvs.rectMode(CENTER);
            cnvs.rect(this.x-wndw.x-this.radius/5, this.y-wndw.y-this.radius/5, this.radius/5*2, this.radius/5*2, this.radius*0.05);
            cnvs.rect(this.x-wndw.x, this.y-wndw.y, this.radius, this.radius*0.65, this.radius*0.05, this.radius*0.05, 0, 0);

            if (this.downloadable) {

                if (won) this.downloadProgress = this.downloadMax;
                let percent = this.downloadProgress/this.downloadMax*this.radius*0.7;
                cnvs.rect(this.x-wndw.x, this.y-wndw.y+this.radius*0.1, this.radius*0.7, this.radius*0.05);
                cnvs.fill(0);
                cnvs.rectMode(CORNER);
                cnvs.rect(this.x-wndw.x-this.radius*0.35, this.y-wndw.y+this.radius*0.075, percent, this.radius*0.05);
                cnvs.noStroke();
                cnvs.textAlign(CENTER);
                cnvs.textSize(this.radius*0.2);
                let string = this.downloadProgress == this.downloadMax ? "WAITING" : "DOWNLOADING";
                if (won) string = "COMPLETE";
                cnvs.text(string, this.x-wndw.x, this.y-wndw.y-this.radius*0.01);
            }

            cnvs.rectMode(CORNER);

            return true;
        }
    }
}