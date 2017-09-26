
export default class InAppActionButtons {
  constructor(client, context = window) {
        // this.extId   = self.id;
        // this.tab     = self.tab;
    this.client  = client;
    this.context = context;
    this.muted   = false; //this.tab.mutedInfo.muted;

    let div = this.context.document.createElement("div");
    div.style.position = "fixed";
    div.style.top      = 0;
    div.style.right    = 0;
    div.style.opacity  = 0;
    div.addEventListener("mouseover", () => { div.style.opacity = 1; });
    div.addEventListener("mouseleave", () => { div.style.opacity = 0; });
    this.container = div;
  }
  static create(tab, client, context) {
    return new this(tab, client, context);
  }
  setContext(self) {
    this.extId = self.id;
    this.tab   = self.tab;
    this.muted = this.tab.mutedInfo.muted;
    return this;
  }
  wrap(img) {
    let div = this.context.document.createElement("div");
    div.appendChild(img);
    return div;
  }
  getBaseImageTemplate() {
    let img = this.context.document.createElement("img");
    img.style.cursor = "pointer";
    img.style.height = `${(this.context.innerHeight / 16)}px`;
    img.style.opacity = 0.92;
    return img;
  }
  getMuteButton() {
    let img = this.getBaseImageTemplate();
    img.src = `chrome-extension://${this.extId}/dest/img/icons/vol_${this.muted ? "off" : "on"}.svg`;
    img.id = "kcw-inapp-mute";
    img.addEventListener("click", () => {
      this.client.message("/window/mute", {tab: this.tab, mute: !this.muted}).then(res => {
        this.muted = res.tab.mutedInfo.muted;
        img.src = `chrome-extension://${this.extId}/dest/img/icons/vol_${this.muted ? "off" : "on"}.svg`;
      });
    });
    return this.wrap(img);
  }
  getScreenShotButton() {
    let img = this.getBaseImageTemplate();
    img.src = `chrome-extension://${this.extId}/dest/img/icons/camera.svg`;
    img.id = "kcw-inapp-camera";
    img.addEventListener("click", () => {
      this.container.style.opacity = 0;
      Promise.resolve()
      .then(() => new Promise(resolve => setTimeout(resolve, 50)))
      .then(() => this.client.message("/window/current-action"));
    });
    return this.wrap(img);
  }
  html() {
    this.container.appendChild(this.getMuteButton());
    this.container.appendChild(this.getScreenShotButton());
    return this.container;
  }
  muteChanged(muted) {
    this.muted = muted;
        // FIXME: querySelector使っちゃうかあw
    let img = this.context.document.querySelector("img#kcw-inapp-mute");
    img.src = `chrome-extension://${this.extId}/dest/img/icons/vol_${muted ? "off" : "on"}.svg`;
  }
}
