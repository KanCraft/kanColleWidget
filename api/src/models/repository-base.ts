module API {
    export class RepositoryBase {
        private storage: Storage = window.localStorage || window.sessionStorage;
        private key: string;
        constructor(name: string) {
            this.key = "KanColleWidget.API." + name;
        }
        _save(value: any): bool {
            var valueString: string = "";
            try {
                valueString = JSON.stringify(value);
                this.storage.setItem(this.key, valueString);
                return true;
            } catch (e) {
                debug(this.key, e);
                return false;
            }
        }
        _get(): Object {
            try {
                var valuString = this.storage.getItem(this.key);
                if (! valuString) return {};
                return JSON.parse(valuString);
            } catch (e) {
                debug(this.key, e);
                return {};
            }
        }
    }
}
