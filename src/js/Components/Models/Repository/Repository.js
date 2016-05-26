export default class Repository {
  constructor(namespace, storage = window.localStorage) {
    this.ns = namespace;
    this.storage = storage;
  }
  _getInitialValue() {
    debugger;
    if (typeof(this.initialValues) == 'function') {
      return this.initialValues();
    }
    return {};
  }
  all() {
    const raw = this.storage.getItem(this.ns);
    if (raw === null) return this._getInitialValue();
    return JSON.parse(raw); // Let it throw Exception!
  }
  get(key) {
    return this.all()[key] || this._getInitialValue()[key];
  }
  set(key, value) {
    let all = this.all();
    all[key] = value;
    this.storage.setItem(this.ns, JSON.stringify(all));
  }
}
