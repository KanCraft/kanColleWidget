import { sleep } from "../../../utils";
import Frame from "../../Models/Frame";

const iconURLs = {
  mute: chrome.extension.getURL("/dest/img/mute.svg"),
  unmute: chrome.extension.getURL("/dest/img/unmute.svg"),
  camera: chrome.extension.getURL("/dest/img/camera.svg"),
};

export default class InAppButtons {

  private static containerID = "kcw-inapp-buttons";

  container: HTMLDivElement = null;

  constructor(
    private document: HTMLDocument,
    private configs: {[key: string]: any},
    private frame: Frame,
    private client: any
  ) {

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

    // 最後のmute状態を反映させる
    this.updateMuteStatus(frame.muted);
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
    const img = this.document.createElement("img") as HTMLImageElement;
    img.src = iconURLs.unmute;
    button.appendChild(img);
    button.addEventListener("click", () => this.toggleMute());
    button.id = "kcw-mute-button";
    return button;
  }

  private updateMuteStatus(muted: boolean) {
    const src = muted ? iconURLs.mute : iconURLs.unmute;
    this.container.querySelector("#kcw-mute-button").querySelector("img").src = src;
  }

  private createScreenshotButton(): HTMLButtonElement {
    const button = this.buttonElementForInApp();
    const img = this.document.createElement("img") as HTMLImageElement;
    img.src = iconURLs.camera;
    button.appendChild(img);
    button.addEventListener("click", () => this.takeScreenshot());
    button.id = "kcw-screenshot-button";
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
    await this.client.message("/capture/screenshot", {open: true});
    await sleep(1000); // FIXME: 雑に1秒待つ
    this.container.addEventListener("mouseover", this.onMouseOver);
  }

  private onMouseOver = () => {
    this.container.style.opacity = "0.8";
  }

  private onMouseOut = () => {
    this.container.style.opacity = "0";
  }

  element(): HTMLDivElement {
    return this.container;
  }

  /**
   * そもそも表示するかしないか決める
   */
  enabled(): boolean {
    return this.configs["inapp-mute-button"].value || this.configs["inapp-screenshot-button"].value;
  }

}
