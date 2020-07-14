#!/bin/bash

set -e
# set -o verbose

####
# should_deliver_dev.sh
# このスクリプトはGitHub Actionsのscheduledのワークフローで実行され、
# 開発版（DEV: NODE_ENV=staging）をリリースするかどうかを判断します。
# 差分があれば、新しいリリースタグを作成し、developブランチにpush-backします。
# 環境変数（主にNODE_ENV）を動的に設定するため、実行ファイルではなく、sourceファイルです。
####

BRANCH=develop

LATEST_TAG=`git describe --tags --abbrev=0`
echo "[INFO] 直近のタグ: ${LATEST_TAG}"

# (1) コミットが無い場合
COMMIT_CNT=`git rev-list --count --no-merges ${LATEST_TAG}..HEAD`
if [[ ${COMMIT_CNT} -eq 0 ]]; then
  echo "[INFO] 直近のtagからコミットが無いのでリリースしない"
  message="[v3テスト版] ${BRANCH}ブランチに、${LATEST_TAG}からの差分が無いため、今日の抜錨はありません！ #艦これウィジェット"
  echo "${message}" > announcement.txt
  exit 0
fi

# (2) アプリケーションに変更が無い場合
FILES_CNT=`git diff --name-only ${LATEST_TAG}..HEAD | grep "^src/\|^dest\|^manifest.json" | wc -l`
if [[ ${FILES_CNT} -eq 0 ]]; then
  echo "[INFO] 直近のtagからアプリのソースコードに変更が無いのでリリースしない"
  message="[v3テスト版] ${LATEST_TAG}からアプリケーションの差分が無いため、今日の抜錨はありません！ #艦これウィジェット"
  echo "${message}" > announcement.txt
  exit 0
fi

# 他のstepも参照できるように ::set-env コマンドを使う
# https://help.github.com/en/actions/reference/workflow-commands-for-github-actions#setting-an-environment-variable
echo '::set-env name=SHOULD_DELIVER_DEV::yes'
sleep 1s

echo "[INFO] タグをつけて commit します"
npm run version -- --commit --tag
sleep 1s

NEW_TAG=`git describe --tags --abbrev=0`
echo "::set-env name=NEW_TAG::${NEW_TAG}"

echo "[INFO] 直近タグからのコミットリスト"
git log --pretty="%h %s" --no-merges ${LATEST_TAG}..HEAD
sleep 1s

echo "[INFO] tag付けコミットとtagそのものをpush"
REPO="https://${GITHUB_ACTOR}:${TOKEN}@github.com/${GITHUB_REPOSITORY}.git"
git push "${REPO}" HEAD:${BRANCH} --tags --follow-tags
sleep 5s

echo '[INFO] /**'
echo "[INFO]  * LATEST_TAG: ${LATEST_TAG}"
echo "[INFO]  * COMMIT_CNT: ${COMMIT_CNT}"
echo "[INFO]  * FILES_CNT:  ${FILES_CNT}"
echo "[INFO]  * NEW_TAG:    ${NEW_TAG}"
echo '[INFO] **/'

exit 0
