export class DecorateDMMPage {
  constructor(context) {
    this.context = context;
  }

  static init(context) {
    return new this(context);
  }

  decorate(frame) {
    let body = this.context.document.querySelector("body");
    body.style.position = "fixed";
    body.style.top = frame.position.top + "px";
    body.style.left = frame.position.left + "px";
  }
}

export class DecorateOsapiPage {

  constructor(context) {
    this.context = context;
    this.interval = 100;
    this.count = 0;
  }

  static init(context) {
    return new this(context);
  }

  isMaintenanceMode() {
    let embed = this.context.document.querySelector("embed#maintenanceswf");
    return !!embed;
  }
  decorateMaintenanceWindow() {
    this.decorateSpaceTop();
    let wrap = this.context.document.querySelector("div#adFlashWrap");
    let embed = this.context.document.querySelector("embed#maintenanceswf");
    wrap.style.width = "100%";
    wrap.style.height = `${this.context.innerHeight}px`;
    embed.width = "100%";
    embed.height = "100%";
    return true;
  }

  decorateHTML() {
    let html = this.context.document.querySelector("html");
    if (!html) return false;
    html.style.margin = "0 auto";
    html.style.overflow = "hidden";
    return true;
  }

  decorateWrap() {
    let wrap = this.context.document.querySelector("div#flashWrap");
    if (!wrap) return false;
    wrap.style.position = "absolute";
    wrap.style.top = "0";
    wrap.style.width = "100%";
    wrap.style.height = "100%";
    return true;
  }

  decorateEmbed() {
    let embed = this.context.document.querySelector("embed#externalswf");
    if (!embed) return false;
    embed.style.width = "100%";
    embed.style.height = "100%";
    return true;
  }

  decorateSpaceTop() {
    let spaceTop = this.context.document.querySelector("div#spacing_top");
    if (!spaceTop) return false;
    spaceTop.style.height = "0";
    spaceTop.style.visibility = "hidden";
    return true;
  }

  decorateSectionWrap() {
    let sectionWrap = this.context.document.querySelector("div#sectionWrap");
    if (!sectionWrap) return false;
    sectionWrap.style = "visibility: hidden;";
    return true;
  }

  effort() {

        // contextがiframe内（parentを持っている）なら、effortはparetがする
    if (this.context != this.context.parent) return true;

    if (this.isMaintenanceMode()) return this.decorateMaintenanceWindow();

    if (this.decorateHTML()
          && this.decorateEmbed()
          && this.decorateSpaceTop()
          && this.decorateSectionWrap()
          && this.decorateWrap()
        ) return true;

        // TODO: 回数制限
    this.count++;
    this.interval += 100;
    setTimeout(() => {
      this.effort();
    }, this.interval);
  }

}
