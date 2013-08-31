## 2013/08/30
```
 % tree src/js
src/js
├── _util.js
├── background.js // いわばメイン。manifest.jsonでbackgroundスクリプトとして指名されている。主にイベントのバインドを受け持つ
├── config.js
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
