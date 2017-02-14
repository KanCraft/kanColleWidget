import Achievement from "../../Models/Achievement";
import Config from "../../Models/Config";
import Quest, {YET} from "../../Models/Quest";
import {PRACTICE}  from "../../../Constants";

export function onPracticeStart() {
    Achievement.increment(PRACTICE);
}

export function onPracticePrepare() {
    const [q] = Quest.daily(false).filter(q => q.trigger == PRACTICE && q.state == YET);
    if (q && Config.find("quest-manager-alert").value) {
        alert(`未着手任務があります\n${q.title}\nTODO: 通知ポップアップとか使ってもうちょっとなんかちゃんとした感じで表示する`);
    }
}
