
class ExtractFlash {
  constructor(context) {
    this.context = context;
    this.target = 'embed#externalswf';
  }

  static init(context) {
    return new this(context);
  }

  onload(timeout = 300) {
    return new Promise(resolve => {
      let iframe = this.context.document.querySelector('iframe#game_frame');
      if (iframe.addEventListener) {
        iframe.addEventListener('load', () => { resolve(iframe); }, false);
      } else if (iframe.attachEvent) {
        iframe.attachEvent('onload', () => { resolve(iframe); })
      }
    });
  }

  replace(iframe) {
    this.context.location.replace(iframe.src);
  }
}

export default ExtractFlash;
