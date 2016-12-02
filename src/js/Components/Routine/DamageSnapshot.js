
export default class DamageSnapshotDisplay {
    constructor(client, id = "damagesnapshot", context = window) {
        this.client = client;
        this.id = id;
        this.context = context;
        this.count   = 0;
        this.onmousedown = this.onmousedown.bind(this);
        this.appendImage = this.appendImage.bind(this);
    }
    getContainer() {
        let container = this.context.document.querySelector(`div#${this.id}`);
        if (container) return container;
        container = this.context.document.createElement("div");
        container.id = this.id;
        container.style.position ="fixed";
        let embed = this.context.document.querySelector("embed");
        container.style.left = `${embed.offsetLeft}px`;
        container.style.top  = `${embed.offsetTop}px`;
        container.style.transition = "0.2s all";
        container.style.opacity = 1;
        container.addEventListener("mouseover", () => container.style.opacity = 1);
        container.addEventListener("mouseleave", () => container.style.opacity = 0);
        this.context.document.body.appendChild(container);
        return container;
    }
    createImage(uri) {
        let img = this.context.document.createElement("img");
        img.src = uri;
        img.style.height = (this.context.innerHeight / 4.2) + "px";
        return img;
    }
    show(uri) {
        let img = this.createImage(uri);
        this.getContainer().appendChild(img);
    }
    appendImage({data: uri}) {
        console.log("DamageSnapshot", "appendImage", this.count);
        let img = this.createImage(uri);
        this.getContainer().appendChild(img);
    }
    onmousedown() {
        if (this.count > 1) return this.cleanup();
        this.count++;
        this.client.message("/snapshot/take").then(this.appendImage);
    }
    prepare() {
        console.log("DamageSnapshot", "prepare");
        let embed = this.context.document.querySelector("embed");
        embed.setAttribute("wmode", "transparent");
        if (typeof embed.onmousedown == "function") return;
        embed.addEventListener("mousedown", this.onmousedown);
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
    }
}
