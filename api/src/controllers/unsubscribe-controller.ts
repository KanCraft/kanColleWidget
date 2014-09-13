/// <reference path="../errors.ts" />
/// <reference path="../response.ts" />
/// <reference path="./controller.ts" />
/// <reference path="../models/subscriber/subscriber.ts" />
/// <reference path="../models/subscriber/subscriber-repo.ts" />
module API {
    export class UnsubscribeController extends Controller {
        execute() {
            var subscriber = new Subscriber(this.sender.id);
            var repo = new SubscriberRepository();
            if (! repo.alreadyHave(subscriber)) return this.reject(Err.Of(BAD_REQUEST));
            if (! repo.remove(subscriber)) return this.reject(Err.Of(INTERNAL));
            return this.succeeded();
        }
        private succeeded(): JQueryPromise<Response> {
            return this.resolve(new Response("Subscriber deleted"));
        }
    }
}
