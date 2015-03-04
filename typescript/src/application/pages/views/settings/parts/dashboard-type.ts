/// <reference path="../checkbox.ts" />

module KCW.Pages {
    export class DashboardType extends CheckboxView {
        constructor() {
            super({
                title: "クロックモードを最前面に固定",
                configKey: "dashboard-type",
                description: "クロックモードが最前面に固定っぽい挙動をします。chrome://flags/#enable-panels のページで「パネルの有効化」を有効にする必要があります"
            });
        }
    }
}