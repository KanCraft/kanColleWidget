import Resource       from "../Models/Resource";
import CaptureService from "../Services/CaptureService";
import TrimService    from "../Services/TrimService";
import Rectangle      from "../Services/Rectangle";
import WindowService  from "../Services/WindowService";
import OCR            from "../Services/API/OCR";

function _shouldSquash(last, now) {
  // とりあえず1日24レコードあったら十分多いので、1時間でまとめる
  now = new Date(now);
  last = new Date(last);
  return now.format("MMddHH") == last.format("MMddHH");
}

export default function record(auto = true) {
  const ocr = new OCR();
  const captures = new CaptureService();
  const last = Resource.last() || {};
  const _10min = 10*60*1000;
  if (auto && Date.now() - last.created < _10min) return Promise.reject("やりすぎ問題");// あんまりherokuを酷使しない
  return WindowService.getInstance().find(true)
  // 画面が小さすぎると精度が落ちるのと、誤認識したときの対応がめんどいので除外する
  .then(tab => tab.width < 800 ? Promise.reject("小さすぎ問題") : Promise.resolve(tab))
  // 画面比がぴったりでない場合は、めんどいので除外する
  .then(tab => tab.width/tab.height == 800/480 ? Promise.resolve(tab) : Promise.reject("アスペクト比問題"))
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
      trim.trim(rect.ofResourceBuckets(), true),
      trim.trim(rect.ofResourceMaterial(), true),
    ]);
  })
  //  .then(urls => urls.map(url => window.open(url)));
  .then(urls => Promise.all(urls.map(url => ocr.execute(url, {whitelist:"0123456789",trim:"\n"}))))
  .then(res =>  Promise.resolve(res.map(r => parseInt(r.result))))
  .then(([fuel, ammo, steel, bauxite, buckets, material]) => Promise.resolve(Resource.new({
    fuel, ammo, steel, bauxite, buckets, material, created: Date.now(),
    _id: auto && _shouldSquash(last.created, Date.now()) ? last._id : undefined
  })))
  .then(resource => resource.save());
}
