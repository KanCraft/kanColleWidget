/**
 * 編成画面のやつ
 */
import Resource       from "../../Models/Resource";
import CaptureService from "../../Services/CaptureService";
import TrimService    from "../../Services/TrimService";
import Rectangle      from "../../Services/Rectangle";
import WindowService  from "../../Services/WindowService";
import OCR            from "../../Services/API/OCR";

export function onDeck() {
  // {{{ とりあえず頻繁すぎるのは無視する。4時間ごと
  let last = Resource.last();
  if (last && Date.now() - last.created < (4*60*60*1000)) return false;
  // }}}
  const ocr = new OCR();
  const captures = new CaptureService();
  WindowService.getInstance().find(true)
  // 画面が小さすぎると精度が落ちるのと、誤認識したときの対応がめんどいので、rejectする
  .then(tab => tab.width < 400 ? Promise.reject() : Promise.resolve(tab))
  .then(tab => captures.capture(tab.windowId))
  .then(uri => Image.init(uri))
  .then(img => {
    const trim = TrimService.init(img);
    const rect = Rectangle.init(img);
    return Promise.all([
      trim.trim(rect.ofResourceFuel(), true),
      trim.trim(rect.ofResourceAmmo(),true),
      trim.trim(rect.ofResourceSteel(), true),
      trim.trim(rect.ofResourceBauxite(), true),
    ]);
  })
   // .then(urls => urls.map(url => window.open(url)));
  .then(urls => Promise.all(urls.map(url => ocr.execute(url))))
  .then(res =>  Promise.resolve(res.map(r => parseInt(r.result))))
  .then(([fuel, ammo, steel, bauxite]) => Promise.resolve(Resource.new({
    fuel, ammo, steel, bauxite, created: Date.now(),
  })))
  .then(resource => resource.save());
  return true;
}
