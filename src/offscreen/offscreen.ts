import { SOUND_PLAY_ACTION } from "../services/SoundService";

chrome.runtime.onMessage.addListener((message) => {
  if (!message || message.__action__ !== SOUND_PLAY_ACTION) return;
  if (typeof message.url !== "string" || !message.url) return;
  const audio = new Audio(message.url);
  audio.play().catch(() => { /* 再生失敗は握りつぶす */ });
});
