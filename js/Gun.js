class Gun {

    constructor(type) {

        this.type = type;
        this.intervalTimer = 0;
        this.interval = 20;
        this.numberOfShots = 1;
        this.shotSize = 10;
    }

    update(inRange) {

        this.intervalTimer++;

        if (inRange && this.intervalTimer > this.interval) this.intervalTimer = 0;
    }

    canFire() {

        if (this.intervalTimer == 0) return true;
    }

    upgrade(type) {

        if (type == "faster" && this.interval > 0) this.interval -= 2;
        else if (type == "more") this.numberOfShots++;
        else if (type == "bigger") this.shotSize += 2;
    }
}