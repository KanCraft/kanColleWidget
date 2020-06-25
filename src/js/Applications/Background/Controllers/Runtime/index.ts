import KanColleServerSetting from "../../../Models/Settings/KanColleServerSetting";
import WindowService from "../../../../Services/Window";

/**
 * optional_permissionsをアレしてもらうためにアレする
 */
export async function RuntimeOnInstalled() {
  const setting = KanColleServerSetting.user();
  const ws = new WindowService();
  if (setting.servers.length == 0) {
    await ws.openOptionsPage();
    return { status: 405 };
  }
  const granted = await setting.check();
  if (!granted) {
    await ws.openOptionsPage();
    return { status: 405 };
  }
  return { status: 200 };
}