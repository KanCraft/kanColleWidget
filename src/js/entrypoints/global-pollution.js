
export function init(context) {
    context.Number.prototype.zp = function(pad = "0", digits = 2) {
        return ((new Array(digits)).fill(pad).join("") + this).slice(-1 * digits);
    };
    context.Date.prototype.toClockString = function() {
        return this.toTimeString().split(":").slice(0,2).join(":");
    };
    context.Date.prototype.format = function (fmt = "yyyy-MM-dd-HHmmss") {
        return fmt.replace("yyyy", this.getFullYear())
          .replace("MM", (this.getMonth() + 1).zp())
          .replace("dd", (this.getDate()).zp())
          .replace("HH", (this.getHours()).zp())
          .replace("mm", (this.getMinutes()).zp())
          .replace("ss", (this.getSeconds()).zp());
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
