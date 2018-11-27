/* tslint:disable no-console max-classes-per-file */
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

export function dummyrequest(extend: {} = {}): chrome.webRequest.WebRequestBodyDetails {
  return {
    frameId: 12,
    method: "POST",
    parentFrameId: 12334,
    requestBody: {},
    requestId: "12345",
    tabId: 123,
    timeStamp: 123456789,
    type: "main_frame",
    url: "https://hoge.fuga.com",
    ...extend,
  };
}

export class Fetch {
  public static replies(data: any) {
    global.fetch = (url, option) => {
      return new this(data);
    };
  }
  constructor(private data: any) {}
  public json(): Promise<any> {
    return Promise.resolve(this.data);
  }
}
