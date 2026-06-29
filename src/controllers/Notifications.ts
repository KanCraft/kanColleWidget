import { Router } from "chromite";
import { Launcher } from "../services/Launcher";
import { Frame } from "../models/Frame";

const onClicked = new Router<typeof chrome.notifications.onClicked>(async (id) => {
  return { __action__: id };
});

onClicked.onNotFound(async (id) => {
  // 通知クリックは「ゲーム窓をアクティブ化する」だけが目的なので、
  // 既存窓へのサイズ調整（retouch）は行わない。非アクティブ窓を retouch すると
  // Windows で上下に黒帯が累積する不具合があったため focusOrLaunch を使う（#1810）。
  const launcher = new Launcher();
  await launcher.focusOrLaunch(await Frame.memory());
  chrome.notifications.clear(id);
})

export {
  onClicked,
}