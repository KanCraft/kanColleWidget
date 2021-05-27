import * as github from "@actions/github";

function getRepositoryInformation(): { repo: string, owner: string, head: string, base: string } {
  const head = "develop", base = "main";
  try {
    return { ...github.context.repo, head, base };
  } catch (err) {
    return { owner: "KanCraft", repo: "kanColleWidget", head, base };
  }
}

async function __main__() {
  const { owner, repo, head, base } = getRepositoryInformation();
  const octokit = github.getOctokit(process.env.GITHUB_TOKEN).rest;

  // 直近のReleaseからのCommitsをすべて取得する
  const { data: [release] } = await octokit.repos.listReleases({ owner, repo, per_page: 1, page: 1 });
  const { data: contributions } = await octokit.repos.listCommits({ owner, repo, sha: "develop", since: release.published_at, per_page: 100 });

  // マージコミット、バージョンコミットを除外する
  const exp = /\/([a-z0-9]+)$/;
  const commits = contributions.map(({ commit }) => {
    const message = commit.message.split("\n")[0];
    if (message.startsWith("Merge pull request")) return null;
    if (message.match(/^[0-9]+\.[0-9]+\.[0-9]/)) return null;
    return { hash: exp.exec(commit.url)[1], author: commit.author.name, message, date: commit.committer.date };
  }).filter(c => !!c);

  const title = `RELEASE: ${process.env.NEW_TAG || (new Date()).toLocaleDateString()}`;
  let body = "このバージョンをリリースするには、コメント欄に `:+1:` とコメントしてください.\n----------\n";
  body += commits.map(c => `- ${c.hash} (${c.author}) ${c.message}`).join("\n");

  if (!process.env.GITHUB_WORKFLOW) {
    console.log("TITLE:\n", title);
    console.log("BODY:\n", body);
    console.log("[DEBUG]", "終了");
    return;
  }

  // リリースPRの更新もしくは作成
  const RELEASE_LABEL = "RELEASE";
  // {{{ すでに開いているPRの取得
  const { data: prs } = await octokit.pulls.list({ owner, repo, head, base, state: "open" });
  let pr = prs.find(pr => pr.labels.some(label => label.name == RELEASE_LABEL));
  // }}}

  if (pr) {
    pr = (await octokit.pulls.update({ owner, repo, title, body, pull_number: pr.number })).data;
  } else {
    pr = (await octokit.pulls.create({ owner, repo, title, body, head, base })).data;
    await octokit.issues.addLabels({ owner, repo, issue_number: pr.number, labels: [RELEASE_LABEL] });
  }
  console.log("[INFO] RELEASE PR UPDATED:", pr.html_url);

  // Reviewerの追加
  const reviewers = ["otiai10"];
  await octokit.pulls.requestReviewers({ owner, repo, pull_number: pr.number, reviewers });

  // Authorのlogin nameを取得したいのでわざわざ再度listCommitsをする
  // https://twitter.com/otiai10/status/1329199822323077121
  const { data: prcommits } = await octokit.pulls.listCommits({ owner, repo, pull_number: pr.number, per_page: 100 });
  const authors = prcommits.reduce<Record<string, number>>((ctx, commit) => {
    if (commit.author.login == "ayanel-ci") return ctx;
    ctx[commit.author.login] == (ctx[commit.author.login] || 0) + 1;
    return ctx;
  }, {});
  console.log("[DEBUG]", "PR Authors", authors);
  console.log("[DEBUG]", "PR Author names", Object.keys(authors));
}

if (require.main === module) {
  __main__();
}