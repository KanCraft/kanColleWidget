# セットアップ
```sh
npm install
grunt boot
grunt build
```

# デバッグ
`grunt build`コマンドで`build`ディレクトリが作られ、その配下に
```
build
├── beta.kanColleWidget
├── beta.kanColleWidget.zip
├── kanColleWidget
├── kanColleWidget.zip
├── stg.kanColleWidget
└── stg.kanColleWidget.zip

3 directories, 3 files
```
が作られます。Chromeブラウザで[chrome://extensions](chrome://extensions)を開いて、「パッケージ化されていない拡張機能を読み込む」を選択し、上記の`build/kanColleWidget`ディレクトリを読ませます。これで主要機能は動きます。

# Twitter連携のデバッグをする場合

`src/js/AppConfig.js`に適切なコンシューマキーとコンシューマシークレットを記述する必要があります。

1. https://apps.twitter.com/app/new に行き、アプリ登録
    - `Website`とか`Callback URL`とかマジ適当でいい
2. `Allow this application to be used to Sign in with Twitter`の項目にチェックを入れる
3. アプリのPermissionsを`Read and Write`にする
4. 以下の作業後に生成される`API key`と`API secret`をそれぞれ、AppConfigの`consumer_key``consumer_secret`に書く

この状態で「リッチな設定」で「Twitter連携」にチェックを入れると認証フローがはじまるはずです。

# 開発のすすめかた

1. `src`以下を編集
2. `grunt build`を実行
3. [chrome://extensions](chrome://extensions)で`リロード`を実行
4. 必要があればウィジェット窓を開き直す

※ なお、2番の`grunt build`については`grunt watch`（編集を検知して自動ビルド）で代用可能です

# Happy Hacking!
![zkms](test/zkms.png)
