
export default class DamageSnapshotDisplay {
  constructor(client, id = "damagesnapshot", context = window) {
    this.client = client;
    this.id = id;
    this.context = context;
    this.count   = 0;
    this.onmousedown = this.onmousedown.bind(this);
    this.appendImage = this.appendImage.bind(this);
  }
  embed() {
    return this.context.document.querySelector("embed");
  }
  getContainer() {
    let container = this.context.document.querySelector(`div#${this.id}`);
    if (container) return container;
    container = this.context.document.createElement("div");
    container.id = this.id;
    container.style.position ="fixed";
    if (this.embed()) {
      container.style.left = `${this.embed().offsetLeft}px`;
      container.style.top  = `${this.embed().offsetTop}px`;
      container.addEventListener("mouseover", () => container.style.opacity = 1);
      container.addEventListener("mouseleave", () => container.style.opacity = 0);
    }
    container.style.transition = "0.2s all";
    container.style.opacity = 1;
    this.context.document.body.appendChild(container);
    return container;
  }
  createImage(uri) {
    let img = this.context.document.createElement("img");
    img.src = uri;
    if (this.embed()) {
      img.style.height = (this.context.innerHeight / 4.2) + "px";
    } else {
      img.style.height = "100%";
      img.addEventListener("click", () => this.client.message("/window/open", {}));
    }
    return img;
  }
  show(uri) {
    console.log("DamageSnapshot", "show");
    let img = this.createImage(uri);
    this.getContainer().appendChild(img);
    return true;
  }
  appendImage({data: uri}) {
    let img = this.createImage(uri);
    this.getContainer().appendChild(img);
  }
  onmousedown() {
    if (this.count > 1) return this.cleanup();
    this.count++;
    this.client.message("/snapshot/take");
  }
  prepare() {
    console.log("DamageSnapshot", "prepare");
    let embed = this.context.document.querySelector("embed");
    embed.setAttribute("wmode", "transparent");
    if (typeof embed.onmousedown == "function") return true;
    embed.addEventListener("mousedown", this.onmousedown);
    return true;
  }
  cleanup() {
    let embed = this.context.document.querySelector("embed");
    embed.removeAttribute("wmode");
    embed.removeEventListener("mousedown", this.onmousedown, false);
    this.count = 0;
    console.log("DamageSnapshot", "cleanup");
  }
  remove() {
    this.getContainer().remove();
    return true;
  }
}
