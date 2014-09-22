/// <reference path="../../domain/event/event-factory.ts" />

module KCW {
    export class ObsoleteBadgeManager extends Badge {
        constructor(event: ObsoleteEventModel) {
            super();
            this.dispatch(event);
        }
        show() {
            super.show();
        }
        private dispatch(event: ObsoleteEventModel) {
            this.text = this.getText(event.finish);
            this.color = this.getColor(event.kind);
        }
        private getColor(kind: string): string {
            switch (kind) {
                case EventKind.MissionFinish:
                    return "#0fabb1";
                case EventKind.NyukoFinish:
                    return "#5b84ff";
                case EventKind.CreateshipFinish:
                    return "#ff8e1b";
                case EventKind.SortieFinish:
                    return "#d0d0d0";
                default :
                    return "#0fabb1";
            }
        }
        private getText(finish: number): string {
            var diffMilliSec = finish - (new Date()).getTime();
            var sec = Math.floor(diffMilliSec / 1000);
            if(sec < 60) {
                return "0";
            }
            var min = Math.floor(sec / 60);
            if(min < 60){
                return String(min) + 'm';
            }
            var hour = Math.floor(min / 60);
            return String(hour) + 'h' + '+';
        }
    }
}