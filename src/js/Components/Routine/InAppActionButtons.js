
export default class InAppActionButtons {
    constructor(self, client, context = window) {
        this.extId   = self.id;
        this.tab     = self.tab;
        this.client  = client;
        this.context = context;
        this.muted   = this.tab.mutedInfo.muted;
    }
    static create(tab, client, context) {
        return new this(tab, client, context);
    }
    getButtonContainer() {
        let div = this.context.document.createElement("div");
        return div;
    }
    getMuteButton() {
        let container = this.getButtonContainer();
        let img = this.context.document.createElement("img");
        img.style.cursor = "pointer";
        img.style.width = "36px";
        img.style.height = "36px";
        img.style.opacity = 0.8;
        img.src = `chrome-extension://${this.extId}/dest/img/icons/vol_${this.muted ? "off" : "on"}.png`;
        img.addEventListener("click", () => {
            this.client.message("/window/mute", {tab: this.tab, mute: !this.muted}).then(res => {
                this.muted = res.tab.mutedInfo.muted;
                img.src = `chrome-extension://${this.extId}/dest/img/icons/vol_${this.muted ? "off" : "on"}.png`;
            });
        });
        container.appendChild(img);
        return container;
    }
    html() {
        let div = this.context.document.createElement("div");
        div.style.position = "fixed";
        div.style.top      = 0;
        div.style.right    = 0;
        div.style.transition = "all 0.2s";
        div.addEventListener("mouseover", () => { div.style.opacity = 1; });
        div.addEventListener("mouseleave", () => { div.style.opacity = 0; });
        div.appendChild(this.getMuteButton());
        return div;
    }
}
