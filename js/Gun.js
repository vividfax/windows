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

        if (type == "faster") {
            if (this.interval <= 2) return false;
            this.interval--;
        } else if (type == "more") {
            this.numberOfShots++;
        } else if (type == "bigger") {
            if (this.shotSize > 20) return false;
            this.shotSize += 0.5;
            this.interval++;
        }

        return true;
    }
}