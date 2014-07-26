/// <reference path="../../../definitions/jquery/jquery.d.ts" />
/// <reference path="../../../definitions/chrome/chrome.d.ts" />
/// <reference path="../subscriber/subscriber.ts" />
/// <reference path="../subscriber/subscriber-repo.ts" />
/// <reference path="../event/event.ts" />
/// <reference path="../payload/payload.ts" />
module API {
    export class Publisher {
        private static instance: Publisher = null;
        public static getInstance(): Publisher {
            if (Publisher.instance == null) {
                Publisher.instance = new this();
            }
            return Publisher.instance;
        }
        publishEvent(kcwEventModel: any) {
            var event: Event = Event.createFromWidgetEventModel(kcwEventModel);
            this.publishToAllSubscribers(event);
        }
        private publishToAllSubscribers(event: Event) {
            var repo = new SubscriberRepository();
            var subscribers: Subscriber[] = repo.findAll();
            $.map(repo.findAll(), (subscriber) => {
                this.publish(subscriber, event);
            });
        }
        private publish(subscriber: Subscriber, event: Event) {
            var payload = new Payload(event);
            chrome.runtime.sendMessage(subscriber.getId(), payload);
        }

    }
}