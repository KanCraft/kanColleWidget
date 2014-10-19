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
        }
    }
}
module KCW.Pages {
    export interface CheckboxViewParams extends SettingsInputParams {}
    export class CheckboxView extends SettingsInputView {
        constructor(params: CheckboxViewParams) {
            super(params, $(new Template("settings/checkbox").render(params)));
        }
        render(): CheckboxView {
            return this;
        }
    }
}

module KCW.Pages {
    export class AllowThirdParty extends CheckboxView {
        constructor() {
            super({
                title: "外部Chrome拡張の連携を許す",
                configKey: "allow-third-party",
                description: "ほげ"
            });
        }
    }
}