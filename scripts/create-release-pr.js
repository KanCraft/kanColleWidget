// const core = require("@actions/core");
const github = require("@actions/github");

async function main() {
  // const { owner, repo } = github.context.repo
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
    return { hash: exp.exec(commit.url)[1], message };
  }).filter(c => !!c);

  // TODO: すでに "RLEASE PR" が開いているなら、bodyの更新、無いならPRの作成をする
  const res = await octokit.pulls.create({
    owner, repo,
    title: `RELEASE: ${process.env.NEW_TAG}`,
    head: "develop",
    base: "main",
    body: commits.map(c => `${c.hash} ${c.message}`).join("\n"),
  });
  console.log(res.data);
};

if (require.main === module) {
  main();
}