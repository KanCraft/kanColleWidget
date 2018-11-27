
Object.defineProperty(HTMLImageElement.prototype, "src", {
  set(src) {
    if (typeof this.onload === "function") {
      this.onload();
    }
  },
  get() {
    return;
  },
});
