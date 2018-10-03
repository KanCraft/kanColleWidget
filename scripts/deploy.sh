#!/bin/bash

set -o errexit

####
# deploy.sh
# このスクリプトは、Travis-CIのビルドが、deploy必要かどうか条件分岐するだけのスクリプトです。
# 参考
# https://docs.travis-ci.com/user/environment-variables/#default-environment-variables
####

if [[ ${TRAVIS_EVENT_TYPE} != "cron" ]]; then
  echo "SKIP DEPLOY: 定常ビルドじゃないのでデプロイしない"
  exit 0
fi

if [[ ! ${TRAVIS_BRANCH} =~ "develop" ]]; then
  echo "SKIP DEPLOY: developブランチではないのでデプロイしない"
  exit 0
fi

latest_tag=`git describe --tags --abbrev=0`
commit_cnt=`git rev-list --count --no-merges ${latest_tag}..HEAD`
if [[ ${commit_cnt} -eq 0 ]]; then
  echo "SKIP DEPLOY: 直近のタグからコミットが無いのでデプロイしない"
  exit 0
fi

####
# このブランチ（develop）をBACKUP（master）にマージして、
# タグを打って、リリースして、BACKUPにpushして終了.
####

BACKUP=master
if [[ ${TRAVIS_BRANCH} == "v3/develop" ]]; then
  BACKUP=v3/staging
fi

git fetch --prune -v origin
git checkout ${BACKUP}
git merge ${TRAVIS_BRANCH}

npm run version -- --commit --tag
npm run build
npm run zip
npm run deploy

git push origin ${BACKUP}

echo "FINISHED"