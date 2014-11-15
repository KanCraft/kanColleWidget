/// <reference path="../../../../definitions/handlebars.d.ts" />

module KCW.Pages {
    export class Template {
        private tpl: HandlebarsTemplate = null;
        constructor(name: string) {
            this.tpl = HBS['tpl/' + name + '.hbs'];
        }
        render(params?: any): string {
            return this.tpl(params);
        }
    }
}