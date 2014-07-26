/// <reference path="../errors.ts" />
/// <reference path="../response.ts" />
/// <reference path="./controller.ts" />
/// <reference path="../models/subscriber/subscriber.ts" />
/// <reference path="../models/subscriber/subscriber-repo.ts" />
module API {
    export class SubscribeController extends Controller {
        execute() {
            var subscriber = new Subscriber(this.sender.id);
            var repo = new SubscriberRepository();
            if (repo.alreadyHave(subscriber)) return this.reject(Err.Of(ALREADY_SUBSCRIBED));
            if (! this.confirm()) return this.reject(Err.Of(ACCESS_DENIED));
            if (! repo.add(subscriber)) return this.reject(Err.Of(INTERNAL));
            return this.succeeded();
        }
        private confirm(): bool {
            var message = "https://chrome.google.com/webstore/detail/";
            message += String(this.sender.id) + "\n";
            message += "が艦これウィジェットのデータを要求しています.\n";
            message += "許可するっぽい？";
            return window.confirm(message);
        }
        private succeeded(): JQueryPromise<Response> {
            return this.resolve(new Response("Subscriber accepted"));
        }
    }
}
