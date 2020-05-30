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

# 将来的には「艦これウィジェット」のtips的なのを垂れ流してもらう
function GET_SKIP_MESSAGE() {
  DEFAULT_MESSAGE="${CRON_DEPLOY_TARGET_BRANCH}ブランチに、${LATEST_TAG}からの差分が無いため、今日の抜錨はありません！ #艦これウィジェット"
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

CRON_DEPLOY_TARGET_BRANCH=develop

git checkout ${CRON_DEPLOY_TARGET_BRANCH}
git pull origin ${CRON_DEPLOY_TARGET_BRANCH} --tags

# {{{ DEBUG
set -v
git branch
git status
git describe --tags
# }}}
# 直近のtagから差分が無ければリリースしない
LATEST_TAG=`git describe --tags --abbrev=0`
COMMIT_CNT=`git rev-list --count --no-merges ${LATEST_TAG}..HEAD`
if [[ ${COMMIT_CNT} -eq 0 ]]; then
  message=`GET_SKIP_MESSAGE`
  npm run tweet "${message}"
  # TODO: exit 1 だと GitHub Actions上での表示がかっこわるいので、
  #       続くstepsが参照できるなんらかの方法でここでの判断を引き継げるようにしたい。
  #       参考: https://github.community/t/support-global-environment-variables/16146/5
  exit 1
fi

# Staging用アプリのビルド環境を設定
export NODE_ENV=staging

# タグをつけて push back します
npm run version -- --commit --tag
echo "[INFO] 直近タグからのコミットリスト"
git log --pretty="  %H %s" ${LATEST_TAG}..HEAD
echo "[EXEC] tag付けコミットとtagそのものをpush"
git push origin ${CRON_DEPLOY_TARGET_BRANCH} --tags
echo "[DONE]"
echo "  LATEST_TAG: ${LATEST_TAG}"
echo "  COMMIT_CNT: ${COMMIT_CNT}"

# {{{ DEBUG
set +v
# }}}

exit 0
