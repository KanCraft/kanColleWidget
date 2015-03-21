/// <reference path="../../../build/showv.d.ts" />

module Sample {
    export class FooterView extends showv.View {
        constructor(){
            super();
        }
        render(): FooterView {
            this.$el.append(
                '<h4>This software is released under the MIT License.</h4>'
            );
            return this;
        }
    }
}
