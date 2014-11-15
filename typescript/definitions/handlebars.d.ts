interface HandlebarsTemplate {
    (params?: any): string; 
}

interface HandlebarsStatic {
    [index: string]: HandlebarsTemplate;
}

declare var HBS: HandlebarsStatic;

interface HandlebarsAPI {
    registerHelper(name: string, fn: Function);
    SafeString(str: string): void;
    compile(source: string): HandlebarsTemplate;
}

declare var Handlebars: HandlebarsAPI;