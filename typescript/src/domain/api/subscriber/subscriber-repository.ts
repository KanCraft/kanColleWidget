
module KCW {
    class SubscribersMapper implements Mapper {
        public encode(s: Subscriber): string {
            return JSON.stringify(s);
        }
        public decode(stored: string): any {
            var raw: Object = JSON.parse(stored) || {};
            var dict: any = {};
            $.each(raw, (id: string, val: Object) => {
                dict[id] = new Subscriber(val[id]);
            });
            return dict;
        }
    }
    // (any) is meant to be `map[string]Subscriber`
    export class SubscribersRepository extends Repository<any> {
        constructor(impl: Storage) {
            super(impl, "api.subscribers", new SubscribersMapper());
        }
        public static local(): SubscribersRepository {
            return new this(window.localStorage);
        }
        public defaultValue(): any {
            return {};
        }
        public find(id: string): Subscriber {
            var dict: any /* map[string]Subscriber */ = this.get();
            if (dict[id]) return dict[id];
            return null;
        }
        public add(subscriber: Subscriber): Subscriber {
            var dict: any = this.get();
            dict[subscriber.id] = subscriber;
            this.set(dict);
            return subscriber;
        }
    }
}