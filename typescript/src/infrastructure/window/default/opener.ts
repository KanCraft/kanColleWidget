/// <reference path="../../util/url/encoder.ts" />

module KCW.Infra {
    export interface IWindowFrameCreateParams {
        url: string;
        target?: string;
        left?: number;
        top?: number;
        width?: number;
        height?: number;
        option?: Object;
    }
    export class WindowFrame {
        constructor(private url:string,
                    private target: string,
                    private position: WindowPosition,
                    private size: WindowSize,
                    private options: Object = {}) {
        }

        /**
         * window.openまでうけもつ
         * @returns {Window}
         */
        public open(): Window {
            return window.open(this.url, this.target, this.encodeQuery());
        }
        private encodeQuery(): string {
            return [
                this.position.encodeQuery(),
                this.size.encodeQuery()
            ].join(",");
        }

        /**
         * つくるだけ. 出すのはopen
         * @param params
         * @returns {KCW.Infra.WindowFrame}
         */
        public static create(params: IWindowFrameCreateParams): WindowFrame {
            return new WindowFrame(
                params.url,
                params.target || "_blank",
                new WindowPosition(params.left,params.top),
                new WindowSize(params.width, params.height),
                params.option
            );
        }
    }
    export class WindowPosition {
        constructor(private left: number,
                    private top: number,
                    private builder: URL.Builder = new URL.Builder(",","")) {}
        public encodeQuery(): string {
            return this.builder.encode({
                left: this.left,
                top: this.top
            });
        }
    }
    export class WindowSize {
        constructor(private width: number,
                    private height: number,
                    private builder: URL.Builder = new URL.Builder(",","")) {}
        public encodeQuery(): string {
            return this.builder.encode({
                width: this.width,
                height: this.height
            });
        }
    }

    export function open(baseURL: string,params: any = {}, target: string = '_blank'): Window {
        var builder: URL.Builder = new URL.Builder();
        return window.open(baseURL + builder.encode(params), target);
    }
}