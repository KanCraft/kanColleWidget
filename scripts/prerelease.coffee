### global __dirname:false ###
fs       = require "fs"
path     = require "path"
manifest = require "../manifest.json"
exec     = require("shelljs").exec
nextversion = require "./nextversion"

throw "[艦これウィジェット][pre-release] git status が clean じゃないっぽい" if exec("git status --short").stdout

previousVersion = manifest.version
manifest.version = nextversion()

# プロジェクト直下のmanifestに反映
fs.writeFileSync(
  path.join(path.dirname(__dirname), "manifest.json"),
  JSON.stringify(manifest, null, 2)
)

ops = """
git add manifest.json \
&& git commit -m '[#{manifest.version}] [release-build]' \
&& git tag #{manifest.version}
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
