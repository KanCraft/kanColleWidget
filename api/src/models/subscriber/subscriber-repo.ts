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
        add(subscriber: Subscriber): bool {
            var saved = this._get();
            saved[subscriber.getId()] = subscriber.toJSON();
            return this._save(saved);
        }
        remove(subscriber: Subscriber): bool {
            var saved = this._get();
            delete saved[subscriber.getId()];
            return this._save(saved);
        }
        alreadyHave(subscriber: Subscriber): bool {
            if (this._get()[subscriber.getId()]) return true;
            return false;
        }
    }
}
