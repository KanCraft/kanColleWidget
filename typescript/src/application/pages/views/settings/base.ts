/// <reference path="../../../../../definitions/showv.d.ts" />

module KCW.Pages {
    export interface SettingsInputParams {
        title: string;
        configKey: string;
        description: string;
    }
    export class SettingsInputView extends showv.View {
        public title: string;
        public configKey: string;
        public description: string;
        constructor(params: SettingsInputParams, $el: JQuery = null) {
            super({
                $el: $el
            });
            this.title = params.title;
            this.configKey = params.configKey;
            this.description = params.description;
            this.setCurrentSetting();
        }
        set(key: string, val: any) {
            Config.local().set(key, val);
        }
        setCurrentSetting() {
            // to be overwritten
        }
    }
}
