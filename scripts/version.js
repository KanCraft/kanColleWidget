/**
 * このスクリプトは、package.jsonと、manifest.jsonのバージョンを
 * デフォルトではマイナーバージョンを1上げるだけのスクリプトです.
 * gitのコミットなどはしないので、diffができたらあとはマニュアルでやる.
 * TODO: 今後考える
 * 
 * @param {string} [version]
 */

const fs = require("fs");
const path = require("path");

const project = path.dirname(__dirname);

/**
 * getPackagejson
 * 
 * @return {object} packagejson
 */
function getPackagejson() {
  const buf = fs.readFileSync(path.join(project, "package.json"), "utf8");
  return JSON.parse(buf); 
}
/**
 * writePackagejson
 */
function writePackagejson(pkg) {
  return fs.writeFileSync(path.join(project, "package.json"), JSON.stringify(pkg, null, 2) + "\n", "utf8");
}

/**
 * getManifestjson
 * 
 * @return {object} manifestjson
 */
function getManifestjson() {
  const buf = fs.readFileSync(path.join(project, "manifest.json"), "utf8");
  return JSON.parse(buf);
}
/**
 * writeManifestjson
 */
function writeManifestjson(mnf) {
  return fs.writeFileSync(path.join(project, "manifest.json"), JSON.stringify(mnf, null, 2) + "\n", "utf8");
}

/**
 * defineNextVersion
 * 
 * @param {object} [pkg]
 * @param {object} [mnf]
 * @return {{version, version_name}} versions
 */
function defineNextVersion(pkg, mnf, new_version_name) {
  if (new_version_name) {
    return [new_version_name.replace(/\.[^.^0-9]+/, ".0"), new_version_name];
  }
  const minor = Math.max(parseInt(pkg.version.split(".").pop()), parseInt(mnf.version.split(".").pop())) + 1;
  return [mnf.version.replace(/\.[^.]+$/, `.${minor}`), mnf.version_name.replace(/\.[^.]+$/, `.${minor}`)];
}

/**
 * main
 */
function main(new_version_name) {
  const pkg = getPackagejson();
  const mnf = getManifestjson();
  const [version, version_name] = defineNextVersion(pkg, mnf, new_version_name);
  pkg.version = version_name;
  mnf.version = version;
  mnf.version_name = version_name;
  writePackagejson(pkg);
  writeManifestjson(mnf);
}

if (require.main == module) {
  main(process.argv[2]);
}
