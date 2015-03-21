/// <reference path="../../../build/showv.d.ts" />

module Sample {
    export class SourcecodeView extends showv.View {
        private titlePart: TitlePart;
        private sourcePart: SourcePart;
        constructor(title: string, source: string){
            super();
            this.titlePart = new TitlePart(title);
            this.sourcePart = new SourcePart(source);
        }
        render(): SourcecodeView {
            this.$el.append(
                this.titlePart.render().$el,
                this.sourcePart.render().$el
            );
            return this;
        }
    }
    class SourcePart extends showv.View {
        constructor(private sourcecode: string){
            super({
                tagName: 'pre',
                className: 'sourcecode prettyprint'
            });
            this.$el.append(
                this.sourcecode
            );
            return this;
        }
    }
    class TitlePart extends showv.View {
        constructor(private title: string){
            super({
                tagName: 'a',
                id: title,
                className: 'code-title linky'
            });
            this.$el.append(
                $('<h2>').text(this.title)
            );
            this.$el.attr({
                href: '#' + title
            });
            return this;
        }
    }
}
