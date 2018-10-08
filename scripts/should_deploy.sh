#!/bin/bash

set -o errexit
# set -o verbose

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
  LATEST_TAG=`git describe --tags --abbrev=0`
  COMMIT_CNT=`git rev-list --count --no-merges ${LATEST_TAG}..HEAD`
  if [[ ${COMMIT_CNT} -eq 0 ]]; then
    echo "SKIP DEPLOY: 直近のタグからコミットが無いのでデプロイしない"
    exit 1
  fi

  # タグをつけて push back します
  npm run version -- --commit --tag
  echo "[INFO] 直近タグからのコミットリスト"
  git log --pretty="%s" ${LATEST_TAG}..HEAD
  echo "[INFO] Remote Repository URL のリスト"
  git remote --verbose
  echo "[EXEC] tag付けコミットとtagそのものをpush"
  git push origin ${TRAVIS_BRANCH}
  git push origin ${TRAVIS_BRANCH} --tags
  echo "[REPORT]"
  echo "  LATEST_TAG: ${LATEST_TAG}"
  echo "  COMMIT_CNT: ${COMMIT_CNT}"
  echo "  TRAVIS_BRANCH: ${TRAVIS_BRANCH}"

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
