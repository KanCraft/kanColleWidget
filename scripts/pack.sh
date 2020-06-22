#!/bin/bash

####
# このスクリプトは、 npm run build 済みのソースを
# NODE_ENV=development npm run pack
# NODE_ENV=staging     npm run pack
# NODE_ENV=production  npm run pack
# みたいな感じで、release以下のアイコンを差し替えたりして
# zipをつくるアレ。
####
set -o errexit

rm -rf release/kcwidget release/kcwidget.zip
mkdir -p release/kcwidget

cp -r dest release/kcwidget
case ${NODE_ENV} in
  staging)
    echo "[INFO] staging用アイコンを使う"
    rm -rf release/kcwidget/dest/img/app
    cp -r src/img/app/staging release/kcwidget/dest/img/app
    ;;
  production)
    echo "[INFO] production用のアイコンを使う"
    rm -rf release/kcwidget/dest/img/app
    cp -r src/img/app/production release/kcwidget/dest/img/app
    ;;
  *)
    echo "[INFO] 開発用アイコンを使う"
    ;;
esac

cp manifest.json release/kcwidget

zip -r release/kcwidget.zip release/kcwidget/*
