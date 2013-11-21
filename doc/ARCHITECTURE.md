## 2013/09/04
```sh
# 一部順番を入れ替えています
% tree src/js
src/js
├── background.js # メイン。拡張が読み込まれた時に発火し、削除されるまで生きている
├── definitions # クラスの定義なるべく"OOP & DDD"したい
│   ├── ConstantMapping.js # 定数定義（のつもり。TODO: ここに集めてくる）
│   ├── Now.js # 現在時刻やその判定ロジックを持つクラスをOOPっぽく作りたかったが、なんかコイツ微妙な
│   ├── Util.js # definitionsの中で用いられるUtilたち。このままじゃここは肥大化するわ...！！
│   ├── Observer.js # 5秒ごとにリマインダータスクを確認する奴
│   ├── Dispatcher.js # 各リクエストを解析してアクションを振り分ける奴
│   ├── actions # 各HTTPリクエストpathに対応するアクションを定義する
│   │   ├── Action.js # actionsを司るクラス
│   │   ├── Hokyu.js
│   │   ├── Kaisou.js
│   │   ├── Map.js
│   │   ├── Mission.js
│   │   ├── Payment.js
│   │   └── Practice.js
│   └── models # データ(loaclStorage)の実体へのアクセスや操作、最終的なプレゼンテーション(はまだ受け持ってるかな？Observerにぜんぶ渡したっけな？)
│       ├── MyStorage.js # loaclStorageにアクセスする基底くらす。interfaceキーワード欲しぃょ...
│       ├── achievements # 任務達成情報を管理する奴
│       │   └── Achievements.js
│       └── missions # 遠征情報を管理する奴。これと同階層に"Nyukyo"ディレクトリなどがつくられるはず
│           ├── Mission.js
│           └── Missions.js
├── _util.js # ページスクリプトが利用するutils。もっとここを使わせたい
├── settings.js # ページスクリプト。「リッチな設定」に対応
├── proxy.js # ページスクリプト。LAUNCHでまず始めに開かれたページに対応
├── proxy2.js # ページスクリプト。proxy.jsによって抽出されたiframe内抜粋ページに対応
├── announce.js # ページスクリプト。「これの設定など」に対応
└── select.js # ページスクリプト。アイコン押下（おしげ）時に出てくる小さいアレに対応

5 directories, 23 files
```

## 2013/08/30
```
 % tree src/js
src/js
├── _util.js
├── background.js // いわばメイン。manifest.jsonでbackgroundスクリプトとして指名されている。主にイベントのバインドを受け持つ
├── announce.js
├── definitions // なんかかっこいいからdefinitions。クラス定義をここにあつめるこの中はけっこう依存ある :(
│   ├── ConstantMapping.js // 定数
│   ├── Now.js // 今がどういう時間か、判定したりできる
│   ├── Observer.js // これけっこう大事。models/hgoe の 'check'メソッドをインターバル登録する
│   ├── Util.js // ゆーてぃる
│   ├── actions // APIに対して対応するアクションを定義している。こいつらは対応するmodelを呼べる
│   │   ├── Action.js
│   │   ├── Mission.js
│   │   └── Payment.js
│   └── models // 主にストレージに責任を持つ。あと最終的なプレゼンテーション(何も返さない)を担っていることもある。
│       ├── MyStorage.js
│       └── missions
│           ├── Mission.js
│           └── Missions.js
├── proxy.js // 以下はページコンテンツスクリプトたち。manifest.jsonで指定されたURLの時だけしか読まれない可哀想な子達
├── proxy2.js
├── resize.js
└── select.js

4 directories, 17 files
```
ていうかもう寝よう
