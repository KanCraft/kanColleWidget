/// <reference path="../../build/showv.d.ts" />

/// <reference path="./header/view.ts" />
/// <reference path="./main/view.ts" />
/// <reference path="./footer/view.ts" />

module Sample {
    export class WrapperView extends showv.View {

        private header = new HeaderView();
        private main   = new MainView();
        private footer = new FooterView();

        constructor(){
            super({
                id: 'wrapper'
            });
        }

        render(): WrapperView {
            this.$el.append(
                this.header.render().$el,
                this.main.render().$el,
                this.footer.render().$el
            );
            return this;
        }
    }
}
