
module KCW {
    export class Config {
        private prefix: string = "kcw.config.";
        constructor(private impl: Storage = window.localStorage) {
        }
        private static defaultValues: Object = {
            'hide-loader-window':     false,
            'share-kousyo-result':    false,
            'report-mention-prefix':   true,
            'dashboard-type':             0,
            'panelize-ships-status':  false,
            'allow-third-party':      false
        };
        public static local(): Config {
            return new Config();
        }
        public get(key: string): any {
            var stored = JSON.parse(this.impl.getItem(this.prefix + key));
            if (stored == null) return Config.defaultValues[key];
            return stored;
        }
        public set(key: string, value: any) {
            var valueString = JSON.stringify(value);
            this.impl.setItem(this.prefix + key, value);
        }
    }
}
