/**
 * 各テストケースでスタブしたいchromeのメソッドが異なるため
 * ここで一括定義はできない... >_<
 */
import * as chrome from "sinon-chrome";
// chrome.tabs.query.yields([]);
// chrome.windows.create.yields({ tabs: [{}] });
declare var global: any;
global.chrome = chrome;
