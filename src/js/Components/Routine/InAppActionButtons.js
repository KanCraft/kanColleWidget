
export default class InAppActionButtons {
    constructor(self, client, context = window) {
        this.extId   = self.id;
        this.tab     = self.tab;
        this.client  = client;
        this.context = context;
        this.muted   = this.tab.mutedInfo.muted;

        let div = this.context.document.createElement("div");
        div.style.position = "fixed";
        div.style.top      = 0;
        div.style.right    = 0;
        div.style.transition = "all 0.1s";
        div.style.opacity  = 0;
        div.addEventListener("mouseover", () => { div.style.opacity = 1; });
        div.addEventListener("mouseleave", () => { div.style.opacity = 0; });
        this.container = div;
    }
    static create(tab, client, context) {
        return new this(tab, client, context);
    }
    wrap(img) {
        let div = this.context.document.createElement("div");
        div.appendChild(img);
        return div;
    }
    getBaseImageTemplate() {
        let img = this.context.document.createElement("img");
        img.style.cursor = "pointer";
        img.style.height = `${(this.context.innerHeight / 10)}px`;
        img.style.opacity = 0.92;
        return img;
    }
    getMuteButton() {
        let img = this.getBaseImageTemplate();
        img.src = `chrome-extension://${this.extId}/dest/img/icons/vol_${this.muted ? "off" : "on"}.svg`;
        img.addEventListener("click", () => {
            this.client.message("/window/mute", {tab: this.tab, mute: !this.muted}).then(res => {
                this.muted = res.tab.mutedInfo.muted;
                img.src = `chrome-extension://${this.extId}/dest/img/icons/vol_${this.muted ? "off" : "on"}.svg`;
            });
        });
        return this.wrap(img);
    }
    html() {
        this.container.appendChild(this.getMuteButton());
        return this.container;
    }
}
