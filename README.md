# KanColleWidget

![CI](https://github.com/otiai10/kanColleWidget/workflows/CI/badge.svg?branch=develop)
[![Coverage Status](https://coveralls.io/repos/github/otiai10/kanColleWidget/badge.svg?branch=develop)](https://coveralls.io/github/otiai10/kanColleWidget?branch=develop)
[![Web Store TEST](https://github.com/otiai10/kanColleWidget/workflows/Web%20Store%20TEST/badge.svg)](https://groups.google.com/forum/#!forum/kcwidget)
[![Contribution Notice](https://github.com/otiai10/kanColleWidget/workflows/Contribution%20Notice/badge.svg)](https://twitter.com/KanColleWidget)

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/iachoklpnnjfgmldgelflgifhdaebnol.svg)](https://chrome.google.com/webstore/detail/%E8%89%A6%E3%81%93%E3%82%8C%E3%82%A6%E3%82%A3%E3%82%B8%E3%82%A7%E3%83%83%E3%83%88/iachoklpnnjfgmldgelflgifhdaebnol?hl=ja)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/users/iachoklpnnjfgmldgelflgifhdaebnol.svg)](https://chrome.google.com/webstore/detail/%E8%89%A6%E3%81%93%E3%82%8C%E3%82%A6%E3%82%A3%E3%82%B8%E3%82%A7%E3%83%83%E3%83%88/iachoklpnnjfgmldgelflgifhdaebnol?hl=ja)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/stars/iachoklpnnjfgmldgelflgifhdaebnol.svg)](https://chrome.google.com/webstore/detail/%E8%89%A6%E3%81%93%E3%82%8C%E3%82%A6%E3%82%A3%E3%82%B8%E3%82%A7%E3%83%83%E3%83%88/iachoklpnnjfgmldgelflgifhdaebnol?hl=ja)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/rating-count/iachoklpnnjfgmldgelflgifhdaebnol.svg)](https://chrome.google.com/webstore/detail/%E8%89%A6%E3%81%93%E3%82%8C%E3%82%A6%E3%82%A3%E3%82%B8%E3%82%A7%E3%83%83%E3%83%88/iachoklpnnjfgmldgelflgifhdaebnol?hl=ja)

# 開発

環境

- Node.js: v12.14 (ぐらい)
- npm: 6.13.14 (ぐらい)

```bash
git clone git@github.com:otiai10/kanColleWidget.git
cd kanColleWidget
npm ci
npm test
npm run build
# destディレクトリが生成される.
# 次にChromeブラウザで chrome://extensions ページへ行き
# 開発者モードを有効にし、パッケージを読み込みから、
# このkanColleWidgetディレクトリを読み込む.

# 競合のため、公開版・テスト版を削除しておいたほうがいいです.
```

開発上べんりなコマンド

```bash
npm start
# ファイル差分を見てbuildを自動で作り直します
```

# リリースフローについて

- `develop`: [test-艦これウィジェット](https://chrome.google.com/webstore/detail/test-%E8%89%A6%E3%81%93%E3%82%8C%E3%82%A6%E3%82%A3%E3%82%B8%E3%82%A7%E3%83%83%E3%83%88/egkgleinehaapbpijnlpbllfeejjpceb)に自動でリリースされる
- `release`: 公開版の[艦これウィジェット](https://chrome.google.com/webstore/detail/%E8%89%A6%E3%81%93%E3%82%8C%E3%82%A6%E3%82%A3%E3%82%B8%E3%82%A7%E3%83%83%E3%83%88/iachoklpnnjfgmldgelflgifhdaebnol)に自動でリリースされる

くわしくは[このへん](https://github.com/otiai10/kanColleWidget/blob/develop/scripts/should_deliver_dev.sh)を参照。
