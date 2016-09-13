
class ShipsStatusTempWindowManager {

  constructor(mod = chrome) {
    this.mod = mod;
    this.pool = [];
  }

  static __instance = null

  static getInstance() {
    if (this.__instance == null) {
      this.__instance = new this();
    }
    return this.__instance;
  }

  openByImageURI(uri) {
    this.mod.windows.create({
      url: uri,
      width: 100,
      height: 200,
      type: 'panel',
      focused: false
    }, (win) => {
      this.pool.push(win);
    });
  }

  sweep() {
    while (this.pool.length) {
      let win = this.pool.pop();
      this.mod.windows.remove(win.id);
    }
  }
}

export default ShipsStatusTempWindowManager;
