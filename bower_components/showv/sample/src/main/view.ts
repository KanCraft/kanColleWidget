/// <reference path="../../../build/showv.d.ts" />
/// <reference path="./usage.view.ts" />

module Sample {
    export class MainView extends showv.View {
        private usage: UsageView;
        constructor(){
            super();
            this.usage = new UsageView();
        }
        render(): MainView {
            this.$el.append(
                this.usage.render().$el
            );
            return this;
        }
    }
}
