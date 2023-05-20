class SpamWindow {

    constructor(x, y, w, h) {

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

        this.spamImage = random(spamImages);

        this.moving = false;

        this.rendered = false;
    }

    update() {

        this.move();
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

    display() {

        if (this.rendered) return;
        if (!this.rendered) this.rendered;

        this.canvas.push();
        this.canvas.background(255);
        this.canvas.stroke(0);
        this.canvas.strokeWeight(2);
        this.canvas.translate(0, 30);

        this.displaySpam();

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
        rect(this.x+3, this.y+3, this.w, this.h+30);
        image(this.canvas, this.x, this.y);
    }

    displayUI() {

        this.canvas.noFill();
        this.canvas.stroke(0);
        this.canvas.strokeWeight(2);
        this.canvas.rect(0, 30-5, this.w, 4);

        this.canvas.stroke(0);
        this.canvas.strokeWeight(2);
        this.canvas.line(65, 9, this.w-65, 9);
        this.canvas.line(65, 13, this.w-65, 13);
        this.canvas.line(65, 17, this.w-65, 17);

        this.canvas.noStroke();
        this.canvas.fill(0);
        this.canvas.textSize(20);
        this.canvas.textAlign(LEFT);
        this.canvas.text("AD", 8, 18.5);

    }

    displaySpam() {

        let largestDimension = this.w > this.h ? this.w : this.h;

        this.canvas.noStroke();
        this.canvas.fill(0);
        this.canvas.textSize(20);
        this.canvas.textAlign(CENTER);
        this.canvas.imageMode(CENTER);
        this.canvas.image(this.spamImage, this.w/2, this.h/2, largestDimension, largestDimension);
    }
}