/// <reference path="../repository-base.ts" />
/// <reference path="./subscriber.ts" />
module API {
    export class SubscriberRepository extends RepositoryBase {
        constructor() {
            super("subscriber");
        }
        findAll(): Subscriber[] {
            var all: Subscriber[] = [];
            var saved = this._get();
            for (var i in saved) {
                if (saved[i]["extId"]) all.push(new Subscriber(saved[i]['extId']));
            }
            return all;
        }
        add(subscriber: Subscriber): boolean {
            var saved = this._get();
            saved[subscriber.getId()] = subscriber.toJSON();
            return this._save(saved);
        }
    }
}