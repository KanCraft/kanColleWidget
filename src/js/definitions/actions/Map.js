/**
 * dependency: いまのところなし
 */
/***** class definitions *****/
function MapAction(){/*** Map出撃系のAPIが叩かれたときのアクション ***/
    this.achievements = new KanColleWidget.Achievements(new MyStorage());
    this.sorties = new KanColleWidget.Sorties();
    this.confirmMessage = "以下の任務が未着手です！\n\n- {{title}}\n\n\n(もうこの任務について通知を出さない？)";
}

MapAction.prototype.forStart = function(params){
    this.achievements.update().incrementMapCount();
    var deck_id = params['api_deck_id'][0];
    // 同時に複数デッキは出撃できないとする
    this.sorties.refreshStash().registerStash(deck_id);
}
MapAction.prototype.forEnd = function(){
    var recoveryMinutes = Config.get("tiredness-recovery-minutes");

    if (recoveryMinutes == 0) return;

    var deckIds = this.sorties.sweepStash();
    for (var i in deckIds) {
        var finish = Date.now() + (recoveryMinutes * 60 * 1000);
        this.sorties.add(deckIds[i], finish);
    }
};
MapAction.prototype.forPreparation = function(){

    if (! Config.get("prevent-forgetting-quest")) return;

    var checker = KanColleWidget.PreChecker;
    var questNotEmbarkedYet = checker.mapQuest.check();

    if (! questNotEmbarkedYet) return;

    this.confirmMessage = this.confirmMessage.replace('{{title}}', questNotEmbarkedYet.title);
    Util.confirm(this.confirmMessage, function(){
        checker.ignore(questNotEmbarkedYet.id);
    });
};
