class WindowService {
  constructor(mod = chrome) {
    this.module = mod;
  }
  open(params) {
    return new Promise((resolve, reject) => {
      this.module.windows.create(params, (win) => {
        resolve(win);
      });
    })
  }
}

export default WindowService;
