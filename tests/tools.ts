/* tslint:disable no-console */
import * as chrome from "sinon-chrome";

declare var global: any;

export class Stub {
  constructor(private target: any) {
    if (typeof target.yields !== "function") {
      throw new Error("This target doesn't have `yields` method, expected to be `sinon-chrome`.");
    }
  }

  public callbacks(value: any) {
    if (typeof value === "function") {
      this.target.yields = value;
    } else {
      this.target.yields(value);
    }
    global.chrome = chrome;
  }

  public cb(value: any) {
    return this.callbacks(value);
  }
}

export function when(target: any): Stub {
  return new Stub(target);
}
