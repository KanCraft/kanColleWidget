
export function init(context) {
    context.Number.prototype.zp = function(pad = "0", digits = 2) {
        return ((new Array(digits)).fill(pad).join("") + this).slice(-1 * digits);
    };
    context.Date.prototype.toClockString = function(rest = false) {
        if (!rest) return this.toTimeString().split(":").slice(0,2).join(":");
        const target = new Date();
        let mins = Math.ceil((this.getTime() - target.getTime()) / (1000 * 60));
        let hours = Math.floor(mins / 60);
        mins = mins - (hours * 60);
        return [(hours).zp("0", 2), (mins).zp("0", 2)].join(":");
    };
    context.Date.prototype.toRemainingMinutes = function(target = new Date()) {
        const rest = Math.ceil((this.getTime() - target.getTime()) / 1000 / 60);
        return (rest <= 0) ? 0 : rest;
    };
    context.Date.prototype.format = function (fmt = "yyyy-MM-dd-HHmmss") {
        return fmt.replace("yyyy", this.getFullYear())
          .replace("MM", (this.getMonth() + 1).zp())
          .replace("dd", (this.getDate()).zp())
          .replace("HH", (this.getHours()).zp())
          .replace("mm", (this.getMinutes()).zp())
          .replace("ss", (this.getSeconds()).zp());
    };
    context.Array.prototype.has = function(e) {
        return this.filter(v => v == e).length !== 0;
    };
    context.Image.init = function(url) {
        return new Promise(resolve => {
            let image = new Image();
            image.onload = () => {
                resolve(image);
            };
            image.src = url;
        });
    };
    context.sleep = function(seconds) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, seconds * 1000);
        });
    };
}
