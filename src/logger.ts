import { Logger as ChromiteLogger, LogLevel } from "chromite";

// Vite の MODE に応じて chromite のログレベルを初期化する
ChromiteLogger.setLevel(((mode?: string): LogLevel => {
  return mode === "development" ? LogLevel.DEBUG : LogLevel.WARN;
})(import.meta.env.MODE));

ChromiteLogger.setEmoji({
  [LogLevel.DEBUG]: "🐛",
  [LogLevel.INFO]: "ℹ️",
  [LogLevel.WARN]: "⚠️",
  [LogLevel.ERROR]: "❌",
});

export { ChromiteLogger as Logger };
