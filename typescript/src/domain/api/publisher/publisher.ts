
module KCW {
    export class Publisher {
        public static publishByObsoleteEventModel(eventModel: any) {
            var event = EventFactory.createFromObsoleteEventModel(eventModel);
            Publisher.publish(event);
        }
        public static publish(event: EventModel) {
            var subscribers: any = SubscribersRepository.local().get();
            $.each(subscribers, (id: string, subscriber: Subscriber) => {
                chrome.runtime.sendMessage(subscriber.id, event.toPayload(), Publisher.handleResponse);
            });
        }
        private static handleResponse(response: any) {
            // console.log(response);
        }
    }
}