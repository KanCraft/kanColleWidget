
Object.defineProperty(HTMLImageElement.prototype, "src", {
  set(src) {
    this._src = src;
    if (typeof this.onload === "function") {
      this.onload();
    }
  },
  get() {
    return this._src;
  },
});
