
module KCW.Infra {
        export function strings(str: string): Strings {
            return new Strings(str);
        }
        export class Strings {
            private val: string;
            constructor(val: any) {
                this.val = String(val);
            }
            public hit(exps: RegExp[]): boolean {
                for (var i = 0; i < exps.length; i++) {
                    if (exps[i].test(this.val)) return true;
                }
                return false;
            }
            public satisfy(exps: RegExp[]): boolean {
                for (var i = 0; i < exps.length; i++) {
                    if (! exps[i].test(this.val)) return false;
                }
                return true;
            }
        }
}
module KCW {
    export interface Coordinates {
        left: number;
        top: number;
    }
    export interface Size {
        width: number;
        height: number;
    }
    export interface WinMakeParams {
        coords: Coordinates;
        size: Size;
    }
}
