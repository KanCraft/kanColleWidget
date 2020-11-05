/**
 * npm run should-release
 * 超イケてるなんでもやるスクリプト.
 * @entypoint main()
 *
 * NODE_ENV=productionのときは、
 *   "RELEASE PR" についてるコメントを見て、
 *   プロダクションリリースすべきか判断し、
 *   ツイートすべきannouncement.txtを作成.
 *
 * NODE_ENV=stagingのときは、
 *   直近のタグからアプリケーションの更新があるか見て、
 *   テストリリースすべきか判断し、
 *   タグを付けてPUSH BACKし、
 *   ツイートすべきannouncement.txtを作成.
 */

const core = require("@actions/core");
const github = require("@actions/github");
const shell = require("child_process");
const fs = require("fs").promises;

function formatTweetStatus(header, commits, hashtag, suffix = "") {
  const MAX_LENGTH = 140;
  const status = `${header}\n${commits.join("\n")}\n${suffix}\n${hashtag}`;
  if (status.length < MAX_LENGTH) return status;
  return formatTweetStatus(header, commits.slice(0, -1), hashtag, "など");
}
function createStageReleaseAnnounce(LATEST_TAG, NEW_TAG) {
  const commits = shell.execSync(`git log --pretty="%s" --no-merges ${LATEST_TAG}..HEAD`).toString().trim().split("\n");
  return formatTweetStatus(`[テスト版リリース] ${NEW_TAG}`, commits, "#艦これウィジェット");
}

async function writeAnnouncement(announce) {
  const fname = "./announcement.txt";
  await fs.writeFile(fname, announce);
}

async function getNextVersion() {
  const manifest = JSON.parse(await fs.readFile("./manifest.json"));
  const [major, minor, patch] = manifest.version.split(".").map(s => parseInt(s, 10));
  return `${major}.${minor}.${patch + 1}`;
}

async function updateVersion(next_version) {
  // manifest.json
  const manifest = JSON.parse(await fs.readFile("./manifest.json"));
  manifest.version = next_version;
  manifest.version_name = next_version;
  await fs.writeFile("./manifest.json", JSON.stringify(manifest, null, 2) + "\n", "utf-8");
  // package.json
  const package = JSON.parse(await fs.readFile("./package.json"));
  package.version = next_version;
  await fs.writeFile("./package.json", JSON.stringify(package, null, 2) + "\n", "utf-8");
  // package-lock.json
  const lock = JSON.parse(await fs.readFile("./package-lock.json"));
  lock.version = next_version;
  await fs.writeFile("./package-lock.json", JSON.stringify(lock, null, 2) + "\n", "utf-8");
}

// テスト用Chrome拡張をWebStoreにリリースするかどうか決める.
// - トリガ: 定期
// - 条件: 最新のtagから、現在のdevelopブランチに差分があるかどうかで判断.
// - SHOULD_RELEASE_STAGE=yes
// - NEW_TAG=3.2.2
// - 副作用: タグをつけてpush backする
async function shouldReleaseStage() {
  const { repo, owner } = github.context.repo;
  const BRANCH = "develop";
  // const octokit = github.getOctokit(process.env.GITHUB_TOKEN);
  // const tags = await octokit.repos.listTags({ repo, owner, });
  const LATEST_TAG = shell.execSync(`git describe --tags --abbrev=0`).toString().trim();
  console.log("[DEBUG]", "LATEST_TAG:", LATEST_TAG);

  // (1) コミットが無い
  const count = shell.execSync(`git rev-list --count --no-merges ${LATEST_TAG}..HEAD`).toString().trim();
  console.log("[DEBUG]", "count:", count);
  if (parseInt(count, 10) == 0) {
    return await writeAnnouncement("開発鎮守府海域、異常なし.");
  };

  // 直近タグからのコミットリスト取得
  const commits = shell.execSync(`git log --pretty="%h (%an) %s" --no-merges ${LATEST_TAG}..HEAD`).toString().trim().split("\n");
  console.log("[DEBUG]", "commits:\n" + commits.join("\n"));

  // (2) アプリケーションに変更が無い
  const diff_files = shell.execSync(`git diff --name-only ${LATEST_TAG}..HEAD`).toString().split("\n").filter(line => {
    return /^src\/|^dest\/|^manifest\.json/.test(line.trim());
  });
  console.log("[DEBUG]", "diff_files:", diff_files.length);
  if (diff_files == 0) {
    return await writeAnnouncement("開発鎮守府海域、船影あれど異常なし. 抜錨の必要なしと判断.");
  }

  // 次のタグを決定
  const NEW_TAG = await getNextVersion();

  // リリースアナウンスを作成
  await writeAnnouncement(createStageReleaseAnnounce(LATEST_TAG, NEW_TAG));

  // jsonファイルをedit
  await updateVersion(NEW_TAG);

  // 次のタグのバージョンをコミットする
  const body = commits.join("\n");
  const files = ["package.json", "package-lock.json", "manifest.json"];
  shell.execSync(`git add ${files.join(" ")} && git commit -m '${NEW_TAG}' -m '${body}'`);

  // 次のタグを固定する
  shell.execSync(`git tag ${NEW_TAG}`);

  // PUSH BACK する
  const { GITHUB_ACTOR, GITHUB_TOKEN, GITHUB_REPOSITORY } = process.env;
  const REPO = `https://${GITHUB_ACTOR}:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git`;
  shell.execSync(`git push "${REPO}" HEAD:${BRANCH} --tags --follow-tags`);

  // 後続ステップのためにフラグを立てる
  core.exportVariable("SHOULD_RELEASE_STAGE", "yes");
  core.exportVariable("NEW_TAG", NEW_TAG);

  // 確認
  console.log("[INFO] LATEST_TAG:", LATEST_TAG);
  console.log("[INFO] COMMITS:", commits.length);
  console.log("[INFO] NEW_TAG:", NEW_TAG);
}

// 本番用Chrome拡張をWebStoreにリリースするかどうか決める.
// - トリガ: "RELEASE PR" 上でのコメント
// - 条件: コメントに一定数以上の :+1: または :shipit: を含む
// - SHOULD_RELEASE_PRODUCTION=yes
async function shouldReleaseProduction() {
  const { repo, owner } = github.context.repo;
  const head = "develop", base = "main";
  const octokit = github.getOctokit(process.env.GITHUB_TOKEN);
  const pulls = await octokit.pulls.list({ repo, owner, head, base, state: "open" });
  if (pulls.data.length == 0) return console.log("[INFO]", "リリースPRがopenされていない");
  // TODO: このworkflowをトリガしたissue/prが、リリースPRではない
  const [pr] = pulls.data;
  const comments = await octokit.issues.listComments({ repo, owner, issue_number: pr.number });
  if (comments.data.length == 0) return console.log("[INFO]", "リリースPRにコメントが無い");
  const EXPRESSION = /(^👍|^:shipit:|^LGTM)/i;
  const REQUIRED_LGTM = 3;
  const summary = comments.data.reduce((ctx, comment) => {
    if (EXPRESSION.test(comment.body)) ctx[comment.user.login] = (ctx[comment.user.login] || 0) + 1;
    return ctx;
  }, {});
  console.log("[INFO]", "SUMMARY\n", summary);
  const count = Object.keys(summary).length;
  if (count < REQUIRED_LGTM) return console.log("[INFO]", "LGTM:", count);
  const body = `${count}つのLGTMが集まったのでマージし、プロダクションリリースします！`;
  await octokit.issues.createComment({ repo, owner, issue_number: pr.number, body });
  await octokit.pulls.merge({ repo, owner, pull_number: pr.number });
  core.exportVariable("SHOULD_RELEASE_PRODUCTION", "yes");
}

async function main() {
  if (process.env.NODE_ENV == "production") {
    // issue_comment: [created, deleted] でトリガする想定
    shouldReleaseProduction();
  } else {
    // schedule: cron でトリガする想定
    shouldReleaseStage();
  }
};

if (require.main === module) {
  main();
}