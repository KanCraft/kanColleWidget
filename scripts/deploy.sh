#!/bin/bash

# ここにもっと変数名の紹介があるので、条件を細かくしたかったら参考にする
# https://docs.travis-ci.com/user/environment-variables/#default-environment-variables

if [[ ${TRAVIS_PULL_REQUEST} == "true" ]]; then
  echo "Skip because it's a pull-request!"
  exit 0
fi

if [[ ! ${TRAVIS_BRANCH} =~ staging ]]; then
  echo "Skip because the branch name is unmatched." ${TRAVIS_BRANCH}
  exit 0
fi

# たとえば TRAVIS_TAG ってのがあったりするので、
# これを受け取って、npm run version -- ${TRAVIS_TAG} とかすれば、タグからリリースバージョンを作れるかもしれない。
# その場合、githubにプッシュするためのアカウントが必要になるのだが。
npm run build && npm run zip && npm run deploy
