export class DecorateDMMPage {
  constructor(context) {
    this.context = context;
  }

  static init(context) {
    return new this(context);
  }

  decorate(params = {top: '-77px', left: '-110px'}) {
    let body = this.context.document.querySelector('body');
    body.style.position = 'fixed';
    body.style.top = params.top;
    body.style.left = params.left;
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

  decorateWrap() {
    let wrap = this.context.document.querySelector('div#flashWrap');
    if (!wrap) return false;
    wrap.style.position = 'absolute';
    wrap.style.top = '0';
    wrap.style.width = '100%';
    wrap.style.height = '100%';
    return true;
  }

  decorateEmbed() {
    let embed = this.context.document.querySelector('embed#externalswf');
    if (!embed) return false;
    embed.style.width = '100%';
    embed.style.height = '100%';
    return true;
  }

  decorateSpaceTop() {
    let spaceTop = this.context.document.querySelector('div#spacing_top');
    if (!spaceTop) return false;
    spaceTop.style.height = '0';
    spaceTop.style.visibility = 'hidden';
    return true;
  }

  decorateSectionWrap() {
    let sectionWrap = this.context.document.querySelector('div#sectionWrap');
    if (!sectionWrap) return false;
    sectionWrap.style = 'visibility: hidden;';
    return true;
  }

  effort() {
    if (this.decorateWrap()
      && this.decorateEmbed()
      && this.decorateSpaceTop()
      && this.decorateSectionWrap()
    ) return true;

    // TODO: 回数制限
    this.count++;
    this.interval += 100;
    setTimeout(() => {
      this.effort()
    }, this.interval);
  }

}
