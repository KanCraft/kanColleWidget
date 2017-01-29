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
        return (this.history.version != this.version() && !!release[this.version()]);
    }
    release() {
        return release[this.version()];
    }
    checkUpdate() {
        this.history.version = this.version();
        this.history.save();
    }
}
