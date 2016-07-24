var fs       = require('fs');
var path     = require('path');
var manifest = require('../manifest.json');
var exec     = require('shelljs').exec;

if (exec('git status --short').stdout) {
  throw '[艦これウィジェット][pre-release] git status が clean じゃないっぽい';
}

var previousVersion = manifest.version;

// Extensionのversionをインクリメントする
// -vで与えられてたらアレする
var nextVersion = ((version, args) => {
  var i = args.findIndex(arg => {
    return arg === '-v';
  });
  if (i > 0 && (args.length - 1) > i) {
    return args[i+1];
  }
  var versions = version.split('.');
  var minor = parseInt(versions.pop());
  return versions.concat(minor + 1).join('.');
})(manifest.version, process.argv);

manifest.version = nextVersion;

// プロジェクト直下のmanifestに反映
fs.writeFile(
  path.join(path.dirname(__dirname), 'manifest.json'),
  JSON.stringify(manifest, null, 2),
  (err) => {
    if (err) throw err;
  }
);

if (
  exec(`git add manifest.json`).code !== 0
  || exec(`git commit -m '[${manifest.version}]'`).code !== 0
) {
  // しっぱいしたので戻す
  manifest.version = previousVersion;
  fs.writeFile(
    path.join(path.dirname(__dirname), 'manifest.json'),
    JSON.stringify(manifest, null, 2),
    (err) => {
      if (err) throw err;
    }
  );
}

// リリース用のmanifestに反映
fs.writeFile(
  path.join(
    path.dirname(__dirname),
    'release', 'kcwidget', 'manifest.json'
  ),
  JSON.stringify(manifest, null, 2),
  (err) => {
    if (err) throw err;
  }
);
