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

async function getReleasePR(octokit, owner = "KanCraft", repo = "kanColleWidget", head = "develop", base = "main", state = "open") {
  const pulls = await octokit.pulls.list({ repo, owner, head, base, state });
  return pulls.data[0];
}

const REQUIRED_LGTM_FOR_PRODUCTION_RELEASE = 3;
function getReleasePRAnnounce(pr) {
  return (
    "自動リリースプロセスがOPENしています。\n"
    + "テストユーザ各位は、テストリリースに問題が無ければ、下記リンクのコメント欄に「👍」とコメントしてください。\n"
    + `${REQUIRED_LGTM_FOR_PRODUCTION_RELEASE}人以上の 👍 が集まると自動で本番環境へリリースされます！\n\n`
    + `> ${pr.title}\n#艦これウィジェット\n`
    + pr.html_url
  );
}

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
  const BRANCH = "develop";
  const octokit = github.getOctokit(process.env.GITHUB_TOKEN);
  // const tags = await octokit.repos.listTags({ repo, owner, });
  const LATEST_TAG = shell.execSync(`git describe --tags --abbrev=0`).toString().trim();
  console.log("[DEBUG]", "LATEST_TAG:", LATEST_TAG);

  // 直近タグからのコミットリスト取得
  const commits = shell.execSync(`git log --pretty="%h (%an) %s" --no-merges ${LATEST_TAG}..HEAD`).toString().trim().split("\n");
  console.log("[DEBUG]", "commits:\n" + commits.join("\n"));

  // すでに開いているリリースPRを取得
  const pr = await getReleasePR(octokit);

  // 直近のコミットが無い場合はテストリリースをスキップする
  const count = shell.execSync(`git rev-list --count --no-merges ${LATEST_TAG}..HEAD`).toString().trim();
  if (parseInt(count, 10) == 0) {
    if (pr) {
      console.log("[DEBUG]", "RELEASE PR:", pr.title);
      return await writeAnnouncement(getReleasePRAnnounce(pr));
    } else {
      console.log("[DEBUG]", "RELEASE PR:", pr);
      return await writeAnnouncement("開発鎮守府海域、異常なし.");
    }
  };

  // (2) アプリケーションに変更が無い場合テストリリースをスキップする
  // const diff_files = shell.execSync(`git diff --name-only ${LATEST_TAG}..HEAD`).toString().split("\n").filter(line => {
  //   return /^src\/|^dest\/|^manifest\.json/.test(line.trim());
  // });
  // console.log("[DEBUG]", "diff_files:", diff_files.length);
  // if (diff_files == 0) {
  //   if (pr) {
  //     return await writeAnnouncement(getReleasePRAnnounce(pr));
  //   } else {
  //     return await writeAnnouncement("開発鎮守府海域、船影あれど異常なし. 抜錨の必要なしと判断.");
  //   }
  // }

  // 次のタグを決定
  const NEW_TAG = await getNextVersion();

  // リリースアナウンスを作成
  await writeAnnouncement(createStageReleaseAnnounce(LATEST_TAG, NEW_TAG));

  if (!process.env.GITHUB_WORKFLOW) return console.log("[DEBUG]", "終了")

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
  const octokit = github.getOctokit(process.env.GITHUB_TOKEN);
  const pr = await getReleasePR(octokit);
  if (!pr) return console.log("[INFO]", "リリースPRがopenされていない");
  // if (pr.number != process.env.ISSUE_NUMBER) return console.log("[INFO]", "RELEASE PR 上のコメントではない");
  console.log("[DEBUG]", pr.number, process.env.ISSUE_NUMBER);

  const comments = await octokit.issues.listComments({ repo, owner, issue_number: pr.number });
  if (comments.data.length == 0) return console.log("[INFO]", "リリースPRにコメントが無い");
  const EXPRESSION = /(^👍|^:\+1:|^:shipit:|^LGTM)/i;

  // {{{ ひとりで何回も👍してもムダです
  const summary = comments.data.reduce((ctx, comment) => {
    console.log("[DEBUG]", EXPRESSION.test(comment.body), comment.body);
    if (EXPRESSION.test(comment.body)) ctx[comment.user.login] = (ctx[comment.user.login] || 0) + 1;
    return ctx;
  }, {});
  console.log("[INFO]", "SUMMARY\n", summary);
  const reviewers = Object.keys(summary);
  // }}}

  if (reviewers.length < REQUIRED_LGTM_FOR_PRODUCTION_RELEASE) return console.log("[INFO]", "LGTM:", reviewers.length);
  const body = `${reviewers.length}人の「👍」が集まったのでマージし、プロダクションリリースします！\n`
    + `Thank you! ${reviewers.map(name => "@" + name).join(", ")}`;
  await octokit.issues.createComment({ repo, owner, issue_number: pr.number, body });
  await octokit.pulls.merge({ repo, owner, pull_number: pr.number });

  // {{{ リリースを作成
  const LATEST_TAG = shell.execSync(`git describe --tags --abbrev=0`).toString().trim();
  core.exportVariable("RELEASE_TAG", LATEST_TAG);
  core.exportVariable("SHOULD_RELEASE_PRODUCTION", "yes");
  const { data: release } = await octokit.repos.createRelease({ repo, owner, tag_name: LATEST_TAG, name: LATEST_TAG, body: pr.body.split("\n").slice(2).join("\n") });
  core.exportVariable("RELEASE_URL", release.html_url);
  core.exportVariable("RELEASE_UPLOAD_URL", release.upload_url);
  // }}}
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