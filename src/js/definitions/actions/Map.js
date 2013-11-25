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
    console.log("デッキ", params['api_deck_id'][0], "は出撃中とする");
    var deck_id = params['api_deck_id'][0];
    // 同時に複数デッキは出撃できないとする
    this.sorties.refreshStash().registerStash(deck_id);
}
MapAction.prototype.forEnd = function(){
    console.log("出撃中の全てのデッキは、今帰投したと判断する");
    var deckIds = this.sorties.sweepStash();
    for (var i in deckIds) {
        console.log("第" + deckIds[i] + "艦隊が出撃から帰投したので、モデルにaddする", this.sorties);
    }
};
