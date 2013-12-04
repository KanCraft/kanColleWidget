セットアップ
=========

```sh
npm install
grunt build
```

ブラウザの`chrome://extensions`のアドレスから、
`デベロッパーモード`を有効にして、
`パッケージ化されていない拡張機能を読み込む`を選択し、
上記のcliで生成された
`release/kanColleWidget`ディレクトリを選択。

テスト(ぜんぜん書いてない)
=========

## Running the test
1. Install `test` directory into your Chrome as an extension.
2. Open `Option Page` of the extension.
3. Test will run that page. (Jasmine output)

## Affecting changes of `src` to `test/src`
```
grunt watch
```
watching changes in `src/*` and copy into `test/src/*`,
so affecting test output automatically.

Let's start editing `src/`! :+1:

## Adding new file to `src/`
If you want to add new files in `src/`,
you have to add new path reference to `test/SpecRnner.html`.

# Happy Hacking!
![zkms](test/zkms.png)
