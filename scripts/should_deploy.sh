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
  CRON_DEPLOY_TARGET_BRANCH=develop

  if [[ ! ${TRAVIS_BRANCH} == ${CRON_DEPLOY_TARGET_BRANCH} ]]; then
    echo "SKIP DEPLOY (${TRAVIS_BRANCH}): ${CRON_DEPLOY_TARGET_BRANCH}ブランチではないのでデプロイしない"
    exit 1
  fi
  echo "[INFO] このビルドは${CRON_DEPLOY_TARGET_BRANCH}のCRONタイプのビルドです"

  git checkout ${CRON_DEPLOY_TARGET_BRANCH}
  git pull origin ${CRON_DEPLOY_TARGET_BRANCH} --tags

  LATEST_TAG=`git describe --tags --abbrev=0`
  COMMIT_CNT=`git rev-list --count --no-merges ${LATEST_TAG}..HEAD`
  if [[ ${COMMIT_CNT} -eq 0 ]]; then
    npm run tweet "${CRON_DEPLOY_TARGET_BRANCH}ブランチに、${LATEST_TAG}タグからの差分が無いため、今日の抜錨はありません！ #艦これウィジェット"
    exit 1
  fi

  # タグをつけて push back します
  npm run version -- --commit --tag
  echo "[INFO] 直近タグからのコミットリスト"
  git log --pretty="  %H %s" ${LATEST_TAG}..HEAD
  echo "[EXEC] tag付けコミットとtagそのものをpush"
  git push origin ${CRON_DEPLOY_TARGET_BRANCH} --tags
  echo "[DONE]"
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

  echo "// TODO: 現在のところ、masterブランチのプロダクションへのデプロイは実装していないです"
  echo '// TODO: npm run version -- --commit --tag での、test- などのプレフィックスの出し分け'
  echo '// TODO: exit 0'
  exit 1
  ;;
*)
  echo "SKIP DEPLOY: cronでもpushでもないイベントなのでデプロイしない"
  exit 1
  ;;
esac
