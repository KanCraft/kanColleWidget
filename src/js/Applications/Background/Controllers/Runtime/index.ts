import KanColleServerSetting from "../../../Models/Settings/KanColleServerSetting";
import NotificationService from "../../../../Services/Notification";
// import WindowService from "../../../../Services/Window";

/**
 * optional_permissionsをアレしてもらうためにアレする
 */
export async function OnInstalled() {
  const setting = KanColleServerSetting.user();
  // const ws = new WindowService();
  if (setting.servers.length == 0) {
    // await ws.openOptionsPage();
    return { status: 405 };
  }
  const granted = await setting.check();
  if (!granted) {
    // await ws.openOptionsPage();
    return { status: 405 };
  }
  return { status: 200 };
}

/**
 * バックグラウンドで更新がかかったときの通知
 */
export function OnUpdated() {
  const ns = new NotificationService();
  const iconUrl = chrome.extension.getURL("dest/img/app/icon.128.png");
  ns.create(`ExtensionOnUpdated?ts=${Date.now()}`, {
    iconUrl,
    message: "バックグラウンドでChrome拡張がアップデートされました。現在出撃中の場合、大破進撃防止やミュートの接続が切れている可能性があります。次に母港へ帰還したタイミングで、Chromeの再起動、またはゲーム画面を右上のアイコンから開き直してください。",
    requireInteraction: true,
    title: "「艦これウィジェット」の更新",
    type: "basic",
  });
}


/**
 * ストアでアップデートが利用可能になったときの通知
 * これなんでうごかんのやろな
 */
export function OnUpdateAvailable(details: chrome.runtime.UpdateAvailableDetails) {
  const ns = new NotificationService();
  const iconUrl = chrome.extension.getURL("dest/img/app/icon.128.png");
  ns.create(`ExtensionUpdate?ts=${Date.now()}`, {
    iconUrl,
    message: `あたらしいバージョン「${details.version}」がダウンロード可能です。次に母港へ帰還したタイミングで、Chromeの再起動、または拡張管理ページから「艦これウィジェット」の更新を行ってください。`,
    requireInteraction: true,
    title: "「艦これウィジェット」の更新",
    type: "basic",
  });
}
