/**
 * このスクリプトは、 `package.json` と `manifest.json` の
 * マイナーバージョンを1上げるだけのスクリプトです.
 * -commit が与えられたらコミットまでします.
 * -tag    が与えられたらtag付けまでします.
 * ここではpushはしません. ローカルの作業のみです.
 */

const fs = require("fs");
const path = require("path");
const shell = require("child_process");

const project = path.dirname(__dirname);

/**
 * getPackagejson
 * package.jsonを読んでJSONオブジェクトにして返すよ.
 * @return {object} packagejson
 */
function getPackagejson() {
  const buf = fs.readFileSync(path.join(project, "package.json"), "utf8");
  return JSON.parse(buf);
}
/**
 * writePackagejson
 * package.json相当のJSONオブジェクトを与えられたら
 * package.jsonに書き出すよ.
 */
function writePackagejson(pkg) {
  return fs.writeFileSync(path.join(project, "package.json"), JSON.stringify(pkg, null, 2) + "\n", "utf8");
}

/**
 * getManifestjson
 * manifest.jsonを読んでJSONオブジェクトにして返すよ
 * @return {object} manifestjson
 */
function getManifestjson() {
  const buf = fs.readFileSync(path.join(project, "manifest.json"), "utf8");
  return JSON.parse(buf);
}
/**
 * writeManifestjson
 * manifest.json相当のJSONオブジェクトを与えられたら
 * manifest.jsonに書き出すよ.
 */
function writeManifestjson(mnf) {
  return fs.writeFileSync(path.join(project, "manifest.json"), JSON.stringify(mnf, null, 2) + "\n", "utf8");
}

/**
 * defineNextVersion
 * 次のバージョンを決定して返すよ.
 * @param {object} [pkg]
 * @param {object} [mnf]
 * @return {[version, version_name]}
 */
function defineNextVersion(pkg, mnf, new_version_name) {
  if (new_version_name) {
    return [new_version_name.replace(/\.[^.^0-9]+/, ".0"), new_version_name];
  }
  const minor = Math.max(parseInt(pkg.version.split(".").pop()), parseInt(mnf.version.split(".").pop())) + 1;
  return [mnf.version.replace(/\.[^.]+$/, `.${minor}`), mnf.version_name.replace(/\.[^.]+$/, `.${minor}`)];
}

/**
 * {コミットハッシュ} ({コミッター名}) {コミットタイトル}
 * を1行とする複数行のStringを返す.
 */
function getReleaseInfo() {
  const latest = shell.execSync("git describe --tags --abbrev=0").toString().trim();
  return shell.execSync(`git log --pretty="%h (%an) %s" --no-merges ${latest}..HEAD`).toString().trim()/* .split("\n").join("\n") */;
}

/**
 * main
 */
function main(flags) {
  const pkg = getPackagejson();
  const mnf = getManifestjson();
  const [version, version_name] = defineNextVersion(pkg, mnf, flags.get("version"));
  pkg.version = version_name;
  mnf.version = version;
  mnf.version_name = version_name;
  writePackagejson(pkg);
  writeManifestjson(mnf);
  shell.execSync("npm install");

  const body = getReleaseInfo();
  console.log("[INFO] -- リリースtag用のコミットリスト --\n", body);
  if (flags.get("commit")) {
    const files = ["package.json", "package-lock.json", "manifest.json"];
    shell.execSync(`git add ${files.join(" ")} && git commit -m '${version_name}' -m '${body}'`);
  }

  if (flags.get("tag")) {
    // const release = getReleaseInfo();
    // const commits = "\nCommits\n" + release.commits.map(c => "- " + c).join("\n");
    // const authors = "\nAuthors\n" + release.authors.map(a => "- " + a).join("\n");
    // shell.execSync(`git tag ${version_name} -m '${commits}' -m '${authors}'`);
    shell.execSync(`git tag ${version_name}`);
  }

  console.log("[INFO]", "VERSION:", version_name);
}

class Flags {
  constructor(args) {
    this.dictionary = {};
    args.map((arg, i) => {
      const key = arg.replace(/^-+/, "");
      const next = args[i+1];
      if (next && !/^-+/.test(next)) {
        this.dictionary[key] = next;
      } else {
        this.dictionary[key] = true;
      }
    });
  }
  get(key) {
    return this.dictionary[key];
  }
  usage() {
    return `次のバージョンを自動的に決めて、manifest.json, packae.json, package-lock.json を編集するやつ。

オプション:
  -commit: あたらしいバージョンを、git commit までする
  -tag:    あたらしいバージョンで、git tag までする

使用例:
  npm run version -- -commit -tag
`;
  }
}

if (require.main == module) {
  const flags = new Flags(process.argv.slice(2));
  if (flags.get("help")) return console.log(flags.usage());
  main(flags);
}
