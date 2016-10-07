
export function init(context) {
    context.Date.prototype.toClockString = function() {
        return this.toTimeString().split(":").slice(0,2).join(":");
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
