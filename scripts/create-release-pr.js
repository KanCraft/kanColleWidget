// const core = require("@actions/core");
const github = require("@actions/github");

async function main() {
  const { owner, repo } = { owner: "KanCraft", repo: "kanColleWidget" };
  const token = process.env.GITHUB_TOKEN;
  const octokit = github.getOctokit(token);

  // 直近のリリース上のコミットハッシュを取得
  const release = await octokit.repos.listReleases({ owner, repo, per_page: 1, page: 1 });
  const { sha: latest } = await octokit.repos.getCommit({ owner, repo, ref: release.data[0].tag_name });

  // 直近のリリースからのコミットをすべて取得
  const contributions = await octokit.repos.listCommits({ owner, repo, sha: latest });
  const exp = /\/([a-z0-9]+)$/;
  const commits = contributions.data.map(({ commit }) => {
    const message = commit.message.split("\n")[0];
    if (message.startsWith("Merge pull request")) return null;
    if (message.match(/^[0-9]+\.[0-9]+\.[0-9]/)) return null;
    return { hash: exp.exec(commit.url)[1], author: commit.author.name, message };
  }).filter(c => !!c);

  // すでに "RLEASE PR" が開いているなら、bodyの更新、無いならPRの作成をする
  const head = "develop", base = "main";
  const title = `RELEASE: ${process.env.NEW_TAG || (new Date()).toLocaleDateString()}`;
  const body = commits.map(c => `${c.hash} (${c.author}) ${c.message}`).join("\n");
  const exists = await octokit.pulls.list({ owner, repo, head, base, state: "open" })
  if (exists.data.length) {
    const res = await octokit.pulls.update({ owner, repo, title, body, pull_number: exists.data[0].number });
    console.log("[INFO] RELEASE PR UPDATED:", res.data.html_url);
  } else {
    const res = await octokit.pulls.create({ owner, repo, head, body, base, title });
    console.log("[INFO] RELEASE PR CREATED:", res.data.html_url);
  }
};

if (require.main === module) {
  main();
}