### global __dirname:false ###
fs       = require "fs"
path     = require "path"
exec     = require("shelljs").exec
release  = require "../release.json"
manifest = require "../manifest.json"
ReleaseNote = require("./releasenote")

throw "[艦これウィジェット][pre-release] git status が clean じゃないっぽい" if exec("git status --short").stdout

newrelease = new ReleaseNote()

previousVersion = manifest.version
manifest.version = newrelease.version

# リリースノートに自動生成した新リリースを追加する
release.unshift newrelease.json()
fs.writeFileSync(
  path.join(path.dirname(__dirname), "release.json"),
  JSON.stringify(release, null, 2)
)

# プロジェクト直下のmanifestに反映
fs.writeFileSync(
  path.join(path.dirname(__dirname), "manifest.json"),
  JSON.stringify(manifest, null, 2)
)

ops = """
git add manifest.json release.json \
&& git commit -m '[#{manifest.version}] [release-build]'
"""
if (exec(ops).code != 0)
  # しっぱいしたので戻す
  manifest.version = previousVersion
  fs.writeFileSync(
    path.join(path.dirname(__dirname), "manifest.json"),
    JSON.stringify(manifest, null, 2)
  )

# リリース用のmanifestに反映
fs.writeFile(
  path.join(path.dirname(__dirname), "release", "kcwidget", "manifest.json"),
  JSON.stringify(manifest, null, 2),
  (err) => throw err if err
)

newrelease.pretty()
