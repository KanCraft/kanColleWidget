/**
 * Window.ts
 * このファイルで定義されるコントローラ群は、
 * ゲーム窓の作成、ダッシュボード窓の作成、
 * それぞれの位置の記憶など、
 * backgroundからの窓の操作などを担います。
 */

import WindowService from "../../../Services/Window";

/**
 * WindowOpen
 * すでにあれば、指定されたフレーム情報にリサイズする.
 * なければ、指定されたフレームか、最後に指定されたフレームにリサイズする.
 */
export async function WindowOpen() {
  const wins = WindowService.getInstance();
  const tab = await wins.find();

  if (!!tab) {
    // TODO: リサイズ
    return {status: 202, data: tab};
  }

  return true;
}

/**
 * WindowDecoration
 */
export async function WindowDecoration(message: any) {
  console.log(this.sender.tab.id);
  return true;
}
