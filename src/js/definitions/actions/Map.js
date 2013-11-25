/**
 * dependency: いまのところなし
 */
/***** class definitions *****/
function MapAction(){/*** Map出撃系のAPIが叩かれたときのアクション ***/
    this.achievements = new KanColleWidget.Achievements(new MyStorage());
    this.sorties = new KanColleWidget.Sorties();
}

MapAction.prototype.forStart = function(params){
    this.achievements.update().incrementMapCount();
    var deck_id = params['api_deck_id'][0];
    // 同時に複数デッキは出撃できないとする
    this.sorties.refreshStash().registerStash(deck_id);
}
MapAction.prototype.forEnd = function(){
    var deckIds = this.sorties.sweepStash();
    for (var i in deckIds) {
        var recoveryMinutes = Config.get("recovery-minutes");
        var finish = Date.now() + (recoveryMinutes * 60 * 1000);
        this.sorties.add(deckIds[i], finish);
    }
};
