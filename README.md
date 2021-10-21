# KanColleWidget

![CI](https://github.com/KanCraft/kanColleWidget/workflows/CI/badge.svg?branch=develop)
[![codecov](https://codecov.io/gh/KanCraft/kanColleWidget/branch/develop/graph/badge.svg?token=GqJlbto2hH)](https://codecov.io/gh/KanCraft/kanColleWidget)
[![Maintainability](https://api.codeclimate.com/v1/badges/90bab592be22a66bf72f/maintainability)](https://codeclimate.com/github/KanCraft/kanColleWidget/maintainability)

[![Contribution Notice](https://github.com/KanCraft/kanColleWidget/workflows/Contribution%20Notice/badge.svg)](https://twitter.com/KanColleWidget)
[![Web Store TEST](https://github.com/KanCraft/kanColleWidget/workflows/Web%20Store%20TEST/badge.svg)](https://groups.google.com/forum/#!forum/kcwidget)
![Web Store PRODUCTION](https://github.com/KanCraft/kanColleWidget/workflows/Web%20Store%20PRODUCTION/badge.svg)

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/iachoklpnnjfgmldgelflgifhdaebnol.svg)](https://chrome.google.com/webstore/detail/%E8%89%A6%E3%81%93%E3%82%8C%E3%82%A6%E3%82%A3%E3%82%B8%E3%82%A7%E3%83%83%E3%83%88/iachoklpnnjfgmldgelflgifhdaebnol?hl=ja)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/users/iachoklpnnjfgmldgelflgifhdaebnol.svg)](https://chrome.google.com/webstore/detail/%E8%89%A6%E3%81%93%E3%82%8C%E3%82%A6%E3%82%A3%E3%82%B8%E3%82%A7%E3%83%83%E3%83%88/iachoklpnnjfgmldgelflgifhdaebnol?hl=ja)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/stars/iachoklpnnjfgmldgelflgifhdaebnol.svg)](https://chrome.google.com/webstore/detail/%E8%89%A6%E3%81%93%E3%82%8C%E3%82%A6%E3%82%A3%E3%82%B8%E3%82%A7%E3%83%83%E3%83%88/iachoklpnnjfgmldgelflgifhdaebnol?hl=ja)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/rating-count/iachoklpnnjfgmldgelflgifhdaebnol.svg)](https://chrome.google.com/webstore/detail/%E8%89%A6%E3%81%93%E3%82%8C%E3%82%A6%E3%82%A3%E3%82%B8%E3%82%A7%E3%83%83%E3%83%88/iachoklpnnjfgmldgelflgifhdaebnol?hl=ja)

# 開発

環境

- Node.js: v12.14 (ぐらい)
- npm: 6.13.14 (ぐらい)

```bash
git clone git@github.com:KanCraft/kanColleWidget.git
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

- テスト版リリース [test-艦これウィジェット](https://chrome.google.com/webstore/detail/test-%E8%89%A6%E3%81%93%E3%82%8C%E3%82%A6%E3%82%A3%E3%82%B8%E3%82%A7%E3%83%83%E3%83%88/egkgleinehaapbpijnlpbllfeejjpceb)
  - デイリーで`develop`ブランチの差分を見て新しいタグをつけて上記の非公開Chrome拡張にリリースされます
- プロダクション版リリース [艦これウィジェット](https://chrome.google.com/webstore/detail/%E8%89%A6%E3%81%93%E3%82%8C%E3%82%A6%E3%82%A3%E3%82%B8%E3%82%A7%E3%83%83%E3%83%88/iachoklpnnjfgmldgelflgifhdaebnol)
  - 上記のデイリーバッチが作成したリリースPRに、規定の人数以上の👍コメントが付くと、公開版にリリースされます

くわしくは[このへん](https://github.com/KanCraft/kanColleWidget/blob/main/scripts/should-release.js)を参照。
