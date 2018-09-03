#!/bin/bash

####
# deploy.sh
# このスクリプトは、Travis-CIのビルドが、deploy必要かどうか条件分岐するだけのスクリプトです。
####

# ここにもっと変数名の紹介があるので、条件を細かくしたかったら参考にする
# https://docs.travis-ci.com/user/environment-variables/#default-environment-variables

if [[ ${TRAVIS_PULL_REQUEST} == "false" ]]; then
  echo "SKIP: TRAVIS_PULL_REQUEST = ${TRAVIS_PULL_REQUEST}"
  exit 0
fi

if [[ ! ${TRAVIS_BRANCH} =~ "staging" ]]; then
  echo "SKIP: TRAVIS_BRANCH = ${TRAVIS_BRANCH}"
  exit 0
fi

# たとえば TRAVIS_TAG ってのがあったりするので、
# これを受け取って、npm run version -- ${TRAVIS_TAG} とかすれば、タグからリリースバージョンを作れるかもしれない。
# その場合、githubにプッシュするためのアカウントが必要になるのだが。
npm run build && npm run zip && npm run deploy
