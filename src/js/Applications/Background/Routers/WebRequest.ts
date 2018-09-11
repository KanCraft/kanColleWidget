/**
 * chrome.webRequest.onBeforeRequest
 * background.js で扱うためのルーティングを定義します。
 * requestBodyが必要なリクエストフックはここに定義。
 */
import {SerialRouter} from "chomex";
import { OnPort } from "../Controllers/onBeforeRequest";

const resolver = (detail) => {
  // host部分を削除したものをrouting nameとして使う
  return (detail.url || "").replace(/^https?:\/\/.+\/kcsapi\//, "");
};

const router = new SerialRouter(2, resolver);
router.on(["api_port/port"], OnPort);

export default router.listener();
