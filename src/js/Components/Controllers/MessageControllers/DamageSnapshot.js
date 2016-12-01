/* global sleep:false */
import CaptureService from "../../Services/CaptureService";
import Rectangle      from "../../Services/Rectangle";
const capture = new CaptureService();

export function TakeDamageSnapshot() {
    return sleep(1.2) // TODO: あるいは、第1/第2艦隊でsleepを微妙に変える
    .then(() => capture.capture(this.sender.tab.windowId))
    .then(Image.init)
    .then(img => {
        // TODO: ここの、「全体のURIをもらって、Rectを決めて、URIをconvertする」っていうの、ルーチンなのでどっかにやる
        let rect = (new Rectangle(0, 0, img.width, img.height)).removeBlackspace().shipsStatus();
        let canvas = document.createElement("canvas");
        canvas.width = rect.width; canvas.height = rect.height;
        canvas.getContext("2d").drawImage(img, rect.x, rect.y, rect.width, rect.height, 0, 0, rect.width, rect.height);
        return Promise.resolve(canvas.toDataURL());
    });
}
