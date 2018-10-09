import NotificationService from "../../../../Services/Notification";

export function OnUpdateAvailable(details: chrome.runtime.UpdateAvailableDetails) {
  const ns = new NotificationService();
  ns.create("ExtensionUpdate", {
    iconUrl: "https://github.com/otiai10/kanColleWidget/blob/develop/dest/img/icons/chang.128.png?raw=true",
    message: `あたらしいバージョン「${details.version}」がダウンロード可能です。
次に母港へ帰還したタイミングで、Chromeの再起動、または拡張管理ページから「艦これウィジェット」の更新を行ってください。`,
    requireInteraction: true,
    title: "「艦これウィジェット」の更新",
    type: "basic",
  });
}
