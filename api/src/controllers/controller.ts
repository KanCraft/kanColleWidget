/// <reference path="../../definitions/chrome/chrome.d.ts" />
/// <reference path="../../definitions/jquery/jquery.d.ts" />
/// <reference path="../response.ts" />
/// <reference path="../errors.ts" />
module API {
    export class Controller {
        private deferred: JQueryDeferred<Object> = $.Deferred();
        constructor(public req: IRequestMessage, public sender: chrome.runtime.MessageSender) {}
        execute (): JQueryPromise<Object> {
            return this.deferred.resolve("Each controller should implement `execute`");
        }
        reject(err: Err) {
            return this.deferred.reject(err);
        }
        resolve(res: Response) {
            return this.deferred.resolve(res);
        }
    }
}
