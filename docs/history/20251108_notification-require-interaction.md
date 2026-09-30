---
date: 2025-11-08
kind: report
---

# `requireInteraction` は通知を残す保証にならない（macOS はバナー設定に従う）

**Date**: 2025-11-08
**正本（コード）**: `src/services/NotificationService.ts`（`stay === false` のとき 10 秒後に明示的に消す）、`src/models/entry/*.ts`（`requireInteraction: overwrite.stay ?? false`）、`src/models/configs/NotificationConfig.ts`（`stay` の既定は false）

## 分かったこと

- `requireInteraction: true` は「ユーザーが操作するまで残す」ための指示だが、挙動は OS・ブラウザ・ユーザー設定に左右される。
- macOS で通知スタイルが「バナー」だと、`requireInteraction` に関係なく数秒で消える。残したいユーザーには「システム設定 → 通知 → Google Chrome → 通知スタイルを『アラート』にする」と案内するしかない。
- macOS では `requireInteraction: true` で通知そのものが出ないという報告もある。
- 逆に、`stay` を使わない通知が OS 設定しだいで残り続けることもある。そのため `stay === false` なら拡張側で 10 秒後に明示的に消している。

## 出典

- Stack Overflow「Notification requireInteraction setting broken in Chrome?」 https://stackoverflow.com/questions/67038441
- Chromium Issue 41281904「'requireInteraction' property of chrome.notifications ignored」 https://issues.chromium.org/41281904
- Chrome for Developers「Notification requireInteraction」 https://developer.chrome.com/blog/notification-requireInteraction
