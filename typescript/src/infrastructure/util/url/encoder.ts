/// <reference path="../../../../definitions/jquery.d.ts" />

module KCW.Infra {
    export module URL {
        export class Builder {
            constructor(private delim: string = "&",
                        private prefix: string = "?",
                        private joint: string = "=") {}

            /**
             * オブジェクトをパラメータ文字列にエンコード
             * @param params
             * @returns {string}
             */
            public encode(params: any): string {
                var pool: string[] = [];
                for (var key in params) {
                    pool.push([String(key), encodeURIComponent(params[key])].join(this.joint));
                }
                return this.prefix + pool.join(this.delim);
            }

            /**
             * パラメータ文字列をオブジェクトにデコード
             * @param query
             * @param def
             * @returns {any}
             */
            public decode(query: string, def: any = {}): any {
                var t: Object = {};
                $.each(query.replace(this.prefix,"").split(this.delim), (i: number, keyVal: string) => {
                    var kv: string[] = keyVal.split(this.joint);
                    if (kv.length < 2) return;
                    t[kv[0]] =  kv[1];
                });
                return $.extend({}, t, def);
            }
        }
    }
}