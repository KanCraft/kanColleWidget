
export class ScriptingService {
  constructor(
        private readonly mod: typeof chrome.scripting = chrome.scripting,
  ) { }
  private target(target: number | chrome.scripting.InjectionTarget) {
    return { ...((typeof target === "number") ? { tabId: target } : target) };
  }

  public async func<Args extends unknown[], Result>(target: number | chrome.scripting.InjectionTarget, func: (...args: Args) => Result, args?: Args) {
    return await this.mod.executeScript({ target: this.target(target), func, ...((args && args.length) ? { args } : {}), });
  }

  public async js(target: number | chrome.scripting.InjectionTarget, jsfiles: string[]) {
    return await this.mod.executeScript({ target: this.target(target), files: jsfiles, });
  }

  public async style(target: number | chrome.scripting.InjectionTarget, css: string) {
    return await this.mod.insertCSS({ target: this.target(target), css, });
  }
  public async css(target: number | chrome.scripting.InjectionTarget, cssfiles: string[]) {
    return await this.mod.insertCSS({ target: this.target(target), files: cssfiles, });
  }
}