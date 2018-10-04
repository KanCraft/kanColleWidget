#!/bin/bash

set -o errexit

####
# deploy.sh
# このスクリプトは、Travis-CIのビルドが、deploy必要かどうか条件分岐するだけのスクリプトです。
# 参考
# https://docs.travis-ci.com/user/environment-variables/#default-environment-variables
####

case ${TRAVIS_EVENT_TYPE} in
cron)
  if [[ ! ${TRAVIS_BRANCH} =~ "develop" ]]; then
    echo "SKIP DEPLOY: ブランチ名にdevelopを含まないのでデプロイしない"
    exit 1
  fi
  latest_tag=`git describe --tags --abbrev=0`
  commit_cnt=`git rev-list --count --no-merges ${latest_tag}..HEAD`
  if [[ ${commit_cnt} -eq 0 ]]; then
    echo "SKIP DEPLOY: 直近のタグからコミットが無いのでデプロイしない"
    exit 1
  fi

  # タグをつけて push back します
  npm run version -- --commit --tag
  git push origin ${TRAVIS_BRANCH}
  exit 0

  ;;
push)
  if [[ ! ${TRAVIS_BRANCH} == "master" ]]; then
    echo "SKIP DEPLOY: masterへのpushではないのでデプロイしない"
    exit 1
  fi
  exit 0
  ;;
*)
  echo "SKIP DEPLOY: cronでもpushでもないイベントなのでデプロイしない"
  exit 1
  ;;
esac
