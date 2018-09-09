import {Client} from "chomex";

export default class InAppButtons {

  private static containerID = "kcw-inapp-buttons";

  public enabled: boolean = false;
  public container: HTMLDivElement = null;

  constructor(private document: HTMLDocument, private configs: {[key: string]: any}, private client: any /* Client */) {
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
      position: fixed; right: 0; top: 0; z-index: 3;
      background-color: rgba(0, 0, 0, 0.6); padding: 16px;
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
    const button = this.document.createElement("button") as HTMLButtonElement;
    button.innerText = "mute!!";
    button.addEventListener("click", () => this.toggleMute());
    return button;
  }

  private async toggleMute() {
    const res = await this.client.message("/window/toggle-mute");
    /* tslint:disable no-console */
    console.log(res);
  }

}
