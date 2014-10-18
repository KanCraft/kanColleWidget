/// <reference path="../../../definitions/jquery.d.ts" />

module KCW {
    export interface Mapper<T> {
        encode(t: T): string;
        decode(stored: string): T;
    }
    export class Repository<T> {
        constructor(private impl: Storage,
                    private name: string,
                    private mapper: Mapper<T>,
                    private prefix = "") {}
        public defaultValue(): T {
            return null;
        }
        private key(): string {
            return this.prefix + this.name;
        }
        public get(): T {
            var stored = this.impl.getItem(this.key());
            if (stored == null) return this.defaultValue();
            return this.mapper.decode(stored);
        }
        public set(val: T) {
            this.impl.setItem(this.key(), this.mapper.encode(val));
        }
        public restore(): T {
            return $.extend(this.defaultValue(), this.get());
        }
    }
}