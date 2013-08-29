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

- 2013/08/28 : 遠征完了通知の実装
- 2013/08/27 : 表示の修正
- 2013/08/24 : 公開
