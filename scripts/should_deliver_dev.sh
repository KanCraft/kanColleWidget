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

# 将来的には「艦これウィジェット」のtips的なのを垂れ流してもらう
function GET_SKIP_MESSAGE() {
  DEFAULT_MESSAGE="${BRANCH}ブランチに、${LATEST_TAG}からの差分が無いため、今日の抜錨はありません！ #艦これウィジェット"
  MESSAGES=(
    "v3の開発をがんばっているみたい..."
    "iPhone/iPad向けの #i168 というアプリも開発中みたい..."
    "こっち見んな！この糞提督！"
    "ホント、冗談じゃないわ。"
    "こんだけ？たいしたこと無いわね。"
  )
  if [ `expr $(date +%d) % 4` -eq 0 ]; then
    index=$[$RANDOM % ${#MESSAGES[@]}]
    echo "${MESSAGES[$index]}"
  else
    echo ${DEFAULT_MESSAGE}
  fi
}

LATEST_TAG=`git describe --tags --abbrev=0`
echo "[INFO] 直近のタグ: ${LATEST_TAG}"

# (1) コミットが無い場合
COMMIT_CNT=`git rev-list --count --no-merges ${LATEST_TAG}..HEAD`
if [[ ${COMMIT_CNT} -eq 0 ]]; then
  echo "[INFO] 直近のtagからコミットが無いのでリリースしない"
  message=`GET_SKIP_MESSAGE`
  cat "${message}" > announcement.txt
  exit 0
fi

# (2) アプリケーションに変更が無い場合
FILES_CNT=`git diff --name-only ${LATEST_TAG}..HEAD | grep "^src/\|^dest\|^manifest.json" | wc -l`
if [[ ${FILES_CNT} -eq 0 ]]; then
  echo "[INFO] 直近のtagからアプリのソースコードに変更が無いのでリリースしない"
  message=`GET_SKIP_MESSAGE`
  cat "${message}" > announcement.txt
  exit 0
fi

# 他のstepも参照できるように ::set-env コマンドを使う
# https://help.github.com/en/actions/reference/workflow-commands-for-github-actions#setting-an-environment-variable
echo '::set-env name=SHOULD_DELIVER_DEV::yes'
sleep 1s

echo "[INFO] タグをつけて commit します"
npm run version -- --commit --tag
sleep 1s

echo "[INFO] 直近タグからのコミットリスト"
git log --pretty="  %H %s" ${LATEST_TAG}..HEAD
sleep 1s

echo "[EXEC] tag付けコミットとtagそのものをpush"
REPO="https://${GITHUB_ACTOR}:${TOKEN}@github.com/${GITHUB_REPOSITORY}.git"
git push "${REPO}" HEAD:${BRANCH} --tags --follow-tags
sleep 5s

echo "[DONE]"
echo "  LATEST_TAG: ${LATEST_TAG}"
echo "  COMMIT_CNT: ${COMMIT_CNT}"
echo "  FILES_CNT:  ${FILES_CNT}"
exit 0
