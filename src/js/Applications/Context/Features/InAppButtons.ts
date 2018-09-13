import octicons from "octicons";

export default class InAppButtons {

  private static containerID = "kcw-inapp-buttons";

  public enabled: boolean = false;
  public container: HTMLDivElement = null;

  constructor(private document: HTMLDocument, private configs: {[key: string]: any}, private client: any) {
    if (
      !this.configs["inapp-mute-button"].value
    ) {
      return;
    }
    this.enabled = true;

    this.container = this.createContainer();

    if (configs["inapp-mute-button"].value) {
      this.container.appendChild(this.createMuteButton());
    }
    if (configs["inapp-screenshot-button"].value) {
      this.container.appendChild(this.createScreenshotButton());
    }
  }

  public element(): HTMLDivElement {
    return this.container;
  }

  private createContainer(): HTMLDivElement {
    const existing = this.document.querySelector(`div#${InAppButtons.containerID}`);
    if (existing) {
      existing.remove();
    }
    const container = this.document.createElement("div");
    container.id = InAppButtons.containerID;
    container.style.cssText = `
      transition: all 0.1s;
      position: fixed; right: 0; top: 0; z-index: 3;
      background-color: rgba(0, 0, 0, 0.6); padding: 4px 2px;
      cursor: pointer; opacity: 0;
    `;
    container.addEventListener("mouseenter", () => {
      container.style.opacity = "0.8";
    });
    container.addEventListener("mouseleave", () => {
      container.style.opacity = "0";
    });
    return container;
  }

  private createMuteButton(): HTMLButtonElement {
    const button = this.buttonElementForInApp();
    button.innerHTML = octicons.unmute.toSVG({fill: "white"});
    button.addEventListener("click", () => this.toggleMute());
    button.id = "kcw-mute-button";
    return button;
  }

  private updateMuteStatus(muted: boolean) {
    const icon = muted ? octicons.mute : octicons.unmute;
    this.container.querySelector("#kcw-mute-button").innerHTML = icon.toSVG({fill: "white"});
  }

  private createScreenshotButton(): HTMLButtonElement {
    const button = this.buttonElementForInApp();
    button.innerHTML = octicons["device-camera"].toSVG({fill: "white"});
    button.addEventListener("click", () => this.takeScreenshot());
    return button;
  }

  private buttonElementForInApp(): HTMLButtonElement {
    const button = this.document.createElement("button") as HTMLButtonElement;
    button.style.background = "transparent";
    button.style.outline = "none";
    button.style.border = "none";
    button.style.cursor = "pointer";
    button.style.display = "block";
    return button;
  }

  private async toggleMute() {
    const res = await this.client.message("/window/toggle-mute");
    const tab = res.data as chrome.tabs.Tab;
    // FIXME: connection closed で tab が返ってこないことがある
    //        capture.html とのコミュニケーションをsendMessageにしたからな気がする
    this.updateMuteStatus(tab.mutedInfo.muted);
  }

  private async takeScreenshot() {
    this.container.style.transition = "unset";
    this.container.style.visibility = "hidden";
    await this.client.message("/capture/screenshot");
    this.container.style.transition = "all 0.1s";
    this.container.style.visibility = "visible";
  }

}
