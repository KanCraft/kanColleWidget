/// <reference path="./base.ts" />
module KCW.Pages {
    export interface NumberViewParams extends SettingsInputParams {
      min: number;
      max: number;
      unit: string;
    }
    export class NumberView extends SettingsInputView {
        constructor(params: NumberViewParams) {
            super(params, $(new Template("settings/number").render(params)));
        }
        render(): NumberView {
            return this;
        }
        events(): Object {
            return {
                'change input[type=number]': 'numberChanged'
            }
        }
        public numberChanged(ev: Event) {
            this.set(this.configKey, $(ev.currentTarget).val());
        }
        public setCurrentSetting() {
            $("input", this.$el).val(Config.local().get(this.configKey));
        }
    }
}
