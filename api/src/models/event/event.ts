
module API {
    export interface KcwEventModel {
        finish: number;
        kind: string;
        label: string;
        primaryId: number;
        prefix: string;
        suffix: string;
    }
    export class ETarget {
        static Mission = "mission";
        static Nyukyo = "nyukyo";
        static Createship = "createship";
        public static mapped(kind: string): string {
            if (kind.match(ETarget.Createship)) return ETarget.Createship;
            if (kind.match(ETarget.Nyukyo)) return ETarget.Nyukyo;
            return ETarget.Mission;
        }
    }
    export class EType {
        static Created = "created";
        static Deleted = "deleted";
        public static mapped(kind: string): string {
            // とりあえず
            return EType.Created;
        }
    }
    export class Event {
        public target: string;
        public type: string;
        public finish: number;
        public params: Object;
        public static createFromWidgetEventModel(kcwEventModel: any): Event {
            var event = new this();
            event.target = ETarget.mapped(kcwEventModel.kind);
            event.type = EType.mapped(kcwEventModel.kind);
            event.finish = kcwEventModel.finish;
            event.params = {
                label: kcwEventModel.label,
                id: kcwEventModel.primaryId,
                format: kcwEventModel.prefix + "%d" + kcwEventModel.suffix
            };
            return event;
        }
    }
}