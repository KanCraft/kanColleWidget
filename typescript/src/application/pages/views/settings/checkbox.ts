/// <reference path="./base.ts" />
module KCW.Pages {
    export interface CheckboxViewParams extends SettingsInputParams {}
    export class CheckboxView extends SettingsInputView {
        constructor(params: CheckboxViewParams) {
            super(params, $(new Template("settings/checkbox").render(params)));
        }
        render(): CheckboxView {
            return this;
        }
        events(): Object {
            return {
                'change input': 'checkboxChanged'
            }
        }
        public checkboxChanged(ev: Event) {
            var $target = $(ev.currentTarget);
            var checked = $target.prop('checked');
            this.set(this.configKey, checked);
        }
        public setCurrentSetting() {
            $("input", this.$el).prop('checked', Config.local().get(this.configKey));
        }
    }
}