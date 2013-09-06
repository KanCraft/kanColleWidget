![猫](src/img/icon.png)
# 仕事中に艦これをするためにウィジェット化するChrome拡張
仕事用のブラウザウィンドウでやるより後ろめたさが軽減するというアレ

# 注意
ポイント決済はふつうにブラウザからやってね

# つかいかた
- 適当な場所にKanColleWidgetをcloneします
- Chromeのツール→拡張機能→パッケージ化されていない拡張機能を読み込む からcloneしてきたディレクトリを選択します
- ブラウザ右上に追加されたアイコンをクリックします

# 背景
- MacのFluidってアプリ使えばいいんだろうけど使いこなせないのでてへ

# 予定
- 遠征終わった通知とか欲しいよ！

# for develop
### debug
in browser console, set `localStorage.isDebug`

```javascript
localStorage.isDebug = true;
```

### build
do `sh cli/build`
and read package `release/kanColleWidget` on Chrome

# Release Note

- 2013/09/04 v0.2.5
    - 通知をクリックしたら前面に
    - 既にある場合LAUNCHしたら前面に
    - 残り時間をバッジにする設定の追加
    - 補給回数など任務に関係ある回数を記録
    - その他バグ修正
- 2013/08/31 v0.2.4
    - Windowsの絶妙なスキマを殲滅
    - payment系API叩こうとしたらalert
    - ウィジェットタイトルを設定
- 2013/08/28 v0.2.3
    - 遠征完了通知の実装
- 2013/08/27 v0.1.1
    - 表示の修正
- 2013/08/24 v0.1.0
    - 公開
