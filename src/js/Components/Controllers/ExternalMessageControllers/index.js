import Subscriber from "../../Models/Subscriber";

export function SubscribeStart() {
  const sub = Subscriber.new({
    _id:   this.sender.id, // 一応Chrome拡張につき一意に制限する
    extID: this.sender.id,
  });
  if (!window.confirm(`Extension ID "${sub._id}" が『艦これウィジェット』との連携を要求しています。許可しますか？`)) {
    return {status:403,message:"ユーザが連携を拒否しました"};
  }
  sub.label = window.prompt("この外部Chrome拡張の名前、あるいは管理識別用の名前をつけてください（任意）");
  sub.created = Date.now();
  sub.save();
  console.log("SUBSCRIBER REGISTERED", sub);
  return {status:201,message:"Your app started subscribing."};
}
