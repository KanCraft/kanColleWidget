/**
 * dependency: いまのところなし
 */

/***** class definitions *****/

function PracticeAction(){/*** 演習系のAPIが叩かれたときのアクション ***/
    this.achievements = new KanColleWidget.Achievements(new MyStorage());
    this.confirmMessage = "以下の任務が未着手です！\n\n- {{title}}\n\n\n(もうこの任務について通知を出さない？)";
}

PracticeAction.prototype.forBattle= function(){
    this.achievements.update().incrementPracticeCount();
}

PracticeAction.prototype.forPreparation = function(){

    if (! Config.get("prevent-forgetting-quest")) return;

    var checker = KanColleWidget.PreChecker;
    var questNotEmbarkedYet = checker.practiceQuest.check();

    if (! questNotEmbarkedYet) return;
    if (checker.isInIgnoreList(questNotEmbarkedYet.id)) return;

    this.confirmMessage = this.confirmMessage.replace('{{title}}', questNotEmbarkedYet.title);
    Util.confirm(this.confirmMessage, function(){
        checker.ignore(questNotEmbarkedYet.id);
    });
}
