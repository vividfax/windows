class ResetWindow {

    constructor() {

        this.w = 180;
        this.h = 180-30;
        this.x = width/2 - this.w/2;
        this.y = height/2 - (this.h+30)/2;
        this.x2 = this.x+this.w;
        this.y2 = this.y+this.h;
        this.cX = this.x+this.w/2;
        this.cY = this.y+this.h/2+30;

        this.canvas = createGraphics(this.w, this.h+30);
        this.canvas.textFont(macFont);

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

    hoverResetButton() {

        if (mouseX > this.cX-50 && mouseX < this.cX+50 && mouseY > this.cY-20 && mouseY < this.cY+20) {
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
        this.cY = this.y+this.h/2+30;
    }

    display() {

        if (this.rendered) return;
        if (!this.rendered) this.rendered;

        this.canvas.push();
        this.canvas.background(255);
        this.canvas.stroke(0);
        this.canvas.strokeWeight(2);
        this.canvas.translate(0, 30);

        this.canvas.fill(255);
        if (this.hoverResetButton()) this.canvas.fill(0);
        this.canvas.rectMode(CENTER);
        this.canvas.rect(this.w/2, this.h/2, 100, 40, 2);
        this.canvas.rectMode(CORNER);
        this.canvas.noStroke();
        this.canvas.fill(0);
        if (this.hoverResetButton()) this.canvas.fill(255);
        this.canvas.textAlign(CENTER);
        this.canvas.text("REBOOT", this.w/2, this.h/2+4);

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
        this.canvas.text("SYS", 8, 18.5);
    }
}