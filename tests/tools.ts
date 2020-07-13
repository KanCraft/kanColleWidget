/* tslint:disable no-console max-classes-per-file */
import * as chrome from "sinon-chrome";

declare let global: any;

/**
 * めちゃくちゃかっこいいDateをmockするutil.
 * 使い方:
 *   const clock = Clock.freeze("2020-07-07 22:00:00");
 *   // Do your test
 *   clock.release();
 */
export class Clock {
  constructor(private spied: jest.SpyInstance) {}
  static freeze(datestring: string): Clock {
    const mocked = new Date(datestring);
    const spied = jest.spyOn(global, "Date").mockImplementation(() => mocked);
    return new this(spied);
  }
  release() {
    this.spied.mockRestore();
  }
}

/**
 * 直接使わない。fakeを経由してください。
 * fakeの使い方は下記参照。
 */
export class Stub {
  constructor(private target: any) {
    if (typeof target.yields !== "function") {
      throw new Error("This target doesn't have `yields` method, expected to be `sinon-chrome`.");
    }
  }
  callbacks(value: any) {
    if (typeof value === "function") {
      this.target.yields = value;
    } else {
      this.target.yields(value);
    }
    global.chrome = chrome;
  }
}

/**
 * chromeモジュール由来のメソッドをfakeします。
 * 使い方の例:
 *   fake(chrome.notifications.create).callbacks("some-notification-id");
 * とすると、chrome.notifications.createはcallbackで"some-notification-id"を返すようになります。
 * @param target chrome.{module}.{method}
 */
export function fake(target: any): Stub {
  return new Stub(target);
}

/**
 * @param extend chrome.webRequest.WebRequestBodyDetailsを上書きないし拡張したいときに使う
 */
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

/**
 * fetchをスタブする便利クラス。
 * 使い方の例:
 *    Fetch.replies({message: "Hello"});
 * とすると、global.fetchは一度だけres.json()で{message: "Hello"}を返すようになります。
 */
export class Fetch<T> {
  static replies<T>(data: T) {
    const original = global.fetch;
    global.fetch = (/* _info: RequestInfo, _init?: RequestInit */): Fetch<T> => {
      return new this<T>(data, original);
    };
  }
  constructor(
    private data: T,
    private original: (info: RequestInfo, init?: RequestInit) => Promise<Response>
  ) {}
  json(): Promise<T> {
    return new Promise(resolve => {
      global.fetch = this.original;
      resolve(this.data);
    });
  }
}
