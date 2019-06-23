#!/bin/bash

set -o errreturn
# set -o verbose

####
# deploy.sh
# このスクリプトは、Travis-CIのビルドが、deploy必要かどうか条件分岐するだけのスクリプトです。
# 環境変数（主にNODE_ENV）を動的に設定するため、実行ファイルではなく、sourceファイルです。
# 参考
# https://docs.travis-ci.com/user/environment-variables/#default-environment-variables
####

# 将来的には「艦これウィジェット」のtips的なのを垂れ流してもらう
function GET_SKIP_MESSAGE() {
  DEFAULT_MESSAGE="${CRON_DEPLOY_TARGET_BRANCH}ブランチに、${LATEST_TAG}からの差分が無いため、今日の抜錨はありません！ #艦これウィジェット"
  MESSAGES=(
    "こっち見んな！この糞提督！"
    "何？何か用？"
    "あー忙しい忙しい！ 潮、そっち大丈夫！？"
    "あ、提督。何そのTシャツ……く、クソ提督、脱げーっ！"
    "あ～～っもうクソ提督！寒いからって部屋のなかでゴロゴロすんなっ！シャキっと働けよっ！！マジで！"
    "あーもう忙しいっ！...あっ、クソ提督そこどいて！掃除の邪魔、邪ー魔っ！"
    "あたしをこんな所に呼び出すなんて、ずいぶんと偉くなったものねクソ提督…っていうか、どうして告白してるの！？ドMなの！？"
    "どんだけ…言えばわかるの！私はクソ提督のことが大っ嫌いなの！なんで信じないの？"
    "曙、出撃します！"
    "出撃よ。蹴散らしてやるわ！"
    "ホント、冗談じゃないわ。"
    "敵？ふふん、そう来なくっちゃね！"
    "次から次へと... うっざいわね！"
    "いっけぇー！"
    "ぅあっ！"
    "た、たかが主砲と魚雷管と機関部がやられただけなんだから…って、え、えぇー！？"
    "大勝利よ！私に十分感謝しなさい、このクソ提督！"
    "こんだけ？たいしたこと無いわね。"
    "ほんと一人だと清々するわ。私は一人の方が好きなんだから…うん。"
  )
  if [ `expr $(date +%d) % 4` -eq 0 ]; then
    index=$[$RANDOM % ${#MESSAGES[@]}]
    echo "${MESSAGES[$index]}"
  else
    echo ${DEFAULT_MESSAGE}
  fi
}

case ${TRAVIS_EVENT_TYPE} in
cron)
  CRON_DEPLOY_TARGET_BRANCH=develop

  if [[ ! ${TRAVIS_BRANCH} == ${CRON_DEPLOY_TARGET_BRANCH} ]]; then
    echo "SKIP DEPLOY (${TRAVIS_BRANCH}): ${CRON_DEPLOY_TARGET_BRANCH}ブランチではないのでデプロイしない"
    return 1
  fi
  echo "[INFO] このビルドは${CRON_DEPLOY_TARGET_BRANCH}のCRONタイプのビルドです"

  git checkout ${CRON_DEPLOY_TARGET_BRANCH}
  git pull origin ${CRON_DEPLOY_TARGET_BRANCH} --tags

  LATEST_TAG=`git describe --tags --abbrev=0`
  COMMIT_CNT=`git rev-list --count --no-merges ${LATEST_TAG}..HEAD`
  if [[ ${COMMIT_CNT} -eq 0 ]]; then
    message=`GET_SKIP_MESSAGE`
    npm run tweet "${message}"
    return 1
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
  echo "  TRAVIS_BRANCH: ${TRAVIS_BRANCH}"

  return 0

  ;;
push)
  if [[ ! ${TRAVIS_BRANCH} == "master" ]]; then
    echo "SKIP DEPLOY: masterへのpushではないのでデプロイしない"
    return 1
  fi

  # Production用アプリのビルド環境を設定
  export NODE_ENV=production

  echo "// TODO: 現在のところ、masterブランチのプロダクションへのデプロイは実装していないです"
  echo '// TODO: npm run version -- --commit --tag での、test- などのプレフィックスの出し分け'
  echo '// TODO: return 0'
  return 1
  ;;
*)
  echo "SKIP DEPLOY: cronでもpushでもないイベントなのでデプロイしない"
  return 1
  ;;
esac
