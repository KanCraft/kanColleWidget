#!/bin/bash

####
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
if [[ $NODE_ENV == "staging" ]]; then
  rm -rf release/kcwidget/dest/img/app
  cp -r src/img/app/staging release/kcwidget/dest/img/app
elif [[ $NODE_ENV == "production" ]]; then
  rm -rf release/kcwidget/dest/img/app
  cp -r src/img/app/production release/kcwidget/dest/img/app
fi

cp manifest.json release/kcwidget

zip -r release/kcwidget.zip release/kcwidget/*
