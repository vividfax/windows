class Gun {

    constructor(type) {

        this.type = type;
        this.intervalTimer = 0;
        this.interval = 20;
        this.numberOfShots = 1;
        this.shotSize = 10;
        this.damage = 5;

        this.fasterLevel = 0;
        this.moreLevel = 0;
        this.biggerLevel = 0;
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
            if (this.fasterLevel >= 20) return false;
            // if (this.interval <= 2) return false;
            this.interval -= 0.5;
            this.fasterLevel++;
        } else if (type == "more") {
            if (this.moreLevel >= 20) return false;
            // if (this.numberOfShots >= 20) return false;
            this.numberOfShots++;
            this.moreLevel++;
        } else if (type == "bigger") {
            if (this.biggerLevel >= 20) return false;
            // if (this.shotSize >= 20) return false;
            this.shotSize += 0.5;
            this.damage += 0.2;
            // this.interval++;
            this.biggerLevel++;
        }

        return true;
    }

    getBestAsset() {

        let bestAsset = -1;
        let bestAssetLevel = -1;

        let assets = [this.fasterLevel, this.moreLevel, this.biggerLevel];
        let assetName = ["QUICK", "MANY", "STRONG"];

        for (let i = 0; i < assets.length; i++) {
            if (assets[i] > bestAssetLevel) {
                bestAsset = assetName[i];
                bestAssetLevel = assets[i];
            }
        }

        if (bestAssetLevel < 4) return "NORMAL";
        else if (assets[0] == 20 && assets[1] == 20 && assets[2] == 20) return "GODLY";

        return bestAsset;
    }
}