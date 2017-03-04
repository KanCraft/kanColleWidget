import release from "../../../../../release.json";

export default class Meta {
  constructor(history, module = chrome) {
    this.history = history;
    this.module = module;
  }
  manifest() {
    return this.module.runtime.getManifest();
  }
  version() {
    return this.manifest().version;
  }
  hasUpdate() {
    return (this.history.version != this.version() && release.some(r => r.version == this.version()));
  }
  release() {
    return release.filter(r => r.version == this.version())[0];
  }
  checkUpdate() {
    this.history.version = this.version();
    this.history.save();
  }
}
