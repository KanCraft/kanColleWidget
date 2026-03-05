# `requireInteraction: true` による通知の挙動について
（Google Chrome／Web Notification API／拡張機能環境）

## 概要
- 通知 API（Web Notifications API や Chrome 拡張機能の `chrome.notifications.create` 等）では、オプションとして `requireInteraction: true` を指定できることがあります。
- このオプションは「ユーザーが明示的に操作（クリックまたは閉じる）するまで通知を残すべき」という指示を意味します。
- しかしながら、実運用・環境によって **期待どおり残らない／すぐ消える／そもそも表示されない** といった複数の報告があり、「仕様どおり機能する」ことを保証できるわけではありません。
- 特に、OS（例：macOS／Windows）の通知スタイル設定やブラウザ・プラットフォームの実装差異が挙動に大きく影響しています。

## 主な確認事項・報告内容
### ・通知が残らない／すぐ消えるケース
- Web API ドキュメントにも「この機能は一部のブラウザーで動作しない可能性がある（Limited availability）」。  [oai_citation:0‡MDN Web Docs](https://developer.mozilla.org/ja/docs/Web/API/Notification/requireInteraction?utm_source=chatgpt.com)
- Chrome 開発ブログでも、 `requireInteraction` が「残るべきものとするためのフラグ」であるが、プラットフォーム次第である旨の記述があります。  [oai_citation:1‡Chrome for Developers](https://developer.chrome.com/blog/notification-requireInteraction?utm_source=chatgpt.com)
- macOS では、通知スタイルが「バナー（Banners）」に設定されていると、 `requireInteraction:true` を指定しても数秒で消える、という報告があります。例：
  > “When the OSX notification setting is set to ‘Banners’, Chrome notifications will only be shown for a couple seconds then will be hidden, regardless of the `requireInteraction` option.”  [oai_citation:2‡Stack Overflow](https://stackoverflow.com/questions/67038441/notification-requireinteraction-setting-broken-in-chrome?utm_source=chatgpt.com)
- また、macOS の通知設定で「バナー／アラート（Alerts）」が選択可能であり、残したいなら “Alerts” に変更する必要がある旨も示されています。  [oai_citation:3‡Stack Overflow](https://stackoverflow.com/questions/67038441/notification-requireinteraction-setting-broken-in-chrome?utm_source=chatgpt.com)

### ・通知が表示されない／作成されないという報告
- 少なくとも macOS 環境では、 `requireInteraction:true` を指定すると **通知そのものが表示されない**という報告があります。例：
  > “In all my testing so far, `requireInteraction=true` causes the notification to *not be shown at all*, even though the notification displays correctly if `requireInteraction=false`. ”  [oai_citation:4‡Stack Overflow](https://stackoverflow.com/questions/67038441/notification-requireinteraction-setting-broken-in-chrome?utm_source=chatgpt.com)
- 拡張機能用 API のバグトラッカーには、「`requireInteraction` プロパティが無視される／期待する挙動にならない」旨の Issue あり。  [oai_citation:5‡issues.chromium.org](https://issues.chromium.org/41281904?utm_source=chatgpt.com)
- 「もし `{requireInteraction: true}` を指定しても通知が出ない」という macOS 上での Web Push に関するフォーラム報告もあります。  [oai_citation:6‡Opera forums](https://forums.opera.com/topic/31334/push-notifications-with-requireinteraction-true-do-not-display-on-macos?utm_source=chatgpt.com)

### ・プラットフォーム（OS／ブラウザ）依存性
- ドキュメント・報告ともに、「どの環境でも必ず動作する」という記載はなく、「プラットフォームによって通知が消える／残るか異なる」と明記されています。  [oai_citation:7‡Chrome for Developers](https://developer.chrome.com/blog/notification-requireInteraction?utm_source=chatgpt.com)
- macOS においては「アラート（Alerts）スタイルに設定しないと残らない」「バナー（Banners）では残らない」という実体験ベースの報告が比較的多くあります。
- Windows／Linux 等では報告数が少ないものの、「動作しない可能性がある／表示されない可能性がある」ことを前提に設計すべきという注意があります。

## 実務上の留意点
- ユーザーに「通知を画面に残したい」旨を実現するなら、OS側の通知スタイル設定について **ユーザーへの案内**が重要です。例：macOS であれば「システム環境設定 → 通知 → Chrome → スタイルを Alerts にする」など。
- コード上で `requireInteraction: true` を指定したとしても、通知が残らない／即消える／表示されない場合があるため、「残ることを保証する」ものとはしない。
- **加えて、`requireInteraction: true` を指定すると通知がまったく表示されない／作成されないという報告も複数あるため、現在のブラウザ・OS 環境ではこのオプションを主要な制御手段として使うのは慎重を期すべきです。**
- もし「確実にユーザーが明示的に操作するまで通知を残す」ことが *必須要件* であるなら、ブラウザ通知だけに頼らず、ネイティブアプリや Electron／デスクトップ専用通知ライブラリなどの選択も検討する。
- 開発／テスト環境で、**対象 OS／ブラウザ組み合わせごとに実際に挙動を確認する**ことが望ましい。特に Windows／macOS の各バージョン、Chrome のバージョン差、拡張機能 vs WebPush など。
- エラーや表示されないケースでは、ブラウザの通知権限、OSの通知許可・スタイル設定、ブラウザの通知サポート状態を切り分ける。

## 結論
- `requireInteraction: true` は「ユーザー操作まで通知を残す」ための *意図的な指示* ですが、実際の挙動は OS・ブラウザ・ユーザー設定などに大きく左右されます。
- macOS では通知スタイル（Banners vs Alerts）が特に影響を及ぼすという報告が多く、Bannersでは「残らない／消える／表示されない」ケースが起きています。
- Windows 等でも「問題は報告が少ない＝起きていない」わけではなく、環境によっては期待どおり動かない可能性があります。
- **したがって、現時点では `requireInteraction` を使って“ユーザー操作まで確実に通知を残す”ことを期待する設計は避け、フォールバックや別手段（ネイティブ通知・アプリ化）を検討すべきです。**

## 今回確認したソース（参考）
- Stack Overflow: “Notification requireInteraction setting broken in Chrome?” — <https://stackoverflow.com/questions/67038441/notification-requireinteraction-setting-broken-in-chrome?>  [oai_citation:8‡Stack Overflow](https://stackoverflow.com/questions/67038441/notification-requireinteraction-setting-broken-in-chrome?utm_source=chatgpt.com)
- OneSignal Website SDK Issue: “Fix requireInteraction/persistNotification macOS” — <https://github.com/OneSignal/OneSignal-Website-SDK/issues/711>  [oai_citation:9‡GitHub](https://github.com/OneSignal/OneSignal-Website-SDK/issues/711?utm_source=chatgpt.com)
- Chromium Issue Tracker: “‘requireInteraction’ property of chrome.notifications ignored …” — <https://issues.chromium.org/41281904>  [oai_citation:10‡issues.chromium.org](https://issues.chromium.org/41281904?utm_source=chatgpt.com)
- MDN Web Docs: Notification API / requireInteraction — <https://developer.mozilla.org/en-US/docs/Web/API/Notification/requireInteraction>  [oai_citation:11‡MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Notification/requireInteraction?utm_source=chatgpt.com)
- Chrome for Developers Blog: Notification requireInteraction — <https://developer.chrome.com/blog/notification-requireInteraction>  [oai_citation:12‡Chrome for Developers](https://developer.chrome.com/blog/notification-requireInteraction?utm_source=chatgpt.com)
- web.dev article: Notification behavior — <https://web.dev/articles/push-notifications-notification-behaviour>  [oai_citation:13‡web.dev](https://web.dev/articles/push-notifications-notification-behaviour?utm_source=chatgpt.com)
- Opera forum: Push Notifications with `{requireInteraction: true}` do not display on macOS — <https://forums.opera.com/topic/31334/push-notifications-with-requireinteraction-true-do-not-display-on-macos>  [oai_citation:14‡Opera forums](https://forums.opera.com/topic/31334/push-notifications-with-requireinteraction-true-do-not-display-on-macos?utm_source=chatgpt.com)

## 補足
- OS やブラウザのバージョン更新により挙動が改善・変更される可能性がありますので、定期的に最新のドキュメント／Issue を確認することを推奨します。
- 通知機能の UX（ユーザーがどのように通知を受け取り・操作するか）設計上、「長時間残る通知」はユーザーにとって負荷になる可能性もあります。適切に使うことが重要です。