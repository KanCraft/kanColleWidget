
module KCW {

    class ShipsStatusMapper implements Mapper {
        public encode(p: WinMakeParams): string {
            return JSON.stringify(p);
        }
        public decode(stored: string): WinMakeParams {
            var obj: Object = JSON.parse(stored);
            return {
                coords: {left:obj["coords"]["left"],top:obj["coords"]["top"]},
                size: {width:obj["size"]["width"], height:obj["size"]["height"]}
            };
        }
    }

    export class ShipsStatusWindowRepository extends Repository<WinMakeParams> {
        constructor(impl: Storage) {
            super(impl, "tracking.statusWindow", new ShipsStatusMapper());
        }
        public static local(): ShipsStatusWindowRepository {
            return new this(window.localStorage);
        }
        public defaultValue(): WinMakeParams {
            return {
                coords: {
                    left : 50,
                    top  : 50
                },
                size: {
                    width:  132,
                    height: 215
                }
            }
        }
    }
}