import octicons from "octicons";
import { sleep } from "../../../utils";

export default class InAppButtons {

  private static containerID = "kcw-inapp-buttons";

  public container: HTMLDivElement = null;

  constructor(private document: HTMLDocument, private configs: {[key: string]: any}, private client: any) {

    if (!this.enabled()) {
      return;
    }

    this.createContainer();

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

  /**
   * そもそも表示するかしないか決める
   */
  public enabled(): boolean {
    if (this.configs["inapp-mute-button"].value) {
      return true;
    }
    if (this.configs["inapp-screenshot-button"].value) {
      return true;
    }
    return false;
  }

  private createContainer(): HTMLDivElement {
    const existing = this.document.querySelector(`div#${InAppButtons.containerID}`);
    if (existing) {
      existing.remove();
    }
    const container = this.document.createElement("div");
    container.id = InAppButtons.containerID;
    container.style.cssText = `
      position: fixed; right: 0; top: 0; z-index: 3;
      background-color: rgba(0, 0, 0, 0.6); padding: 4px 2px;
      cursor: pointer; opacity: 0;
    `;
    this.container = container;
    container.addEventListener("mouseover", this.onMouseOver);
    container.addEventListener("mouseout", this.onMouseOut);
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
    this.container.removeEventListener("mouseover", this.onMouseOver);
    this.container.style.opacity = "0";
    await this.client.message("/capture/screenshot");
    await sleep(1000); // FIXME: 雑に1秒待つ
    this.container.addEventListener("mouseover", this.onMouseOver);
  }

  private onMouseOver = () => {
    this.container.style.opacity = "0.8";
  }

  private onMouseOut = () => {
    this.container.style.opacity = "0";
  }

}
