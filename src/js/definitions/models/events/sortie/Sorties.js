var KanColleWidget = KanColleWidget || {};
(function(){
    "use strict";
    var Sorties = KanColleWidget.Sorties = function(){
        this.primaryIdName = 'api_deck_id';
        this.storageName   = 'sorties';
        this.soloModel     = KanColleWidget.SoloSortie;
        this.initialValue  = [
            {api_deck_id: 1, finish: null},
            {api_deck_id: 2, finish: null},
            {api_deck_id: 3, finish: null},
            {api_deck_id: 4, finish: null}
        ];
    };
    Sorties.prototype = Object.create(KanColleWidget.EventsBase.prototype);
    Sorties.prototype.constructor = Sorties;

    /**
     * Stashを用いる
     * 艦隊を「出撃中」ステータスにする
     * @param deck_id
     * @returns {*}
     */
    Sorties.prototype.registerStash = function(deck_id){
        KanColleWidget.Stash.deckInSortie[deck_id] = true;
        return this;
    };
    /**
     * 全ての艦隊を「未出撃」ステータスにする
     * @returns {*}
     */
    Sorties.prototype.refreshStash = function(){
        KanColleWidget.Stash.deckInSortie = {
            1: false, 2: false, 3: false, 4: false
        };
        return this;
    };
    /**
     * 出撃中の艦隊idを配列で返す
     * @returns {Array}
     */
    Sorties.prototype.findFromStash = function(){
        var decksInSortie = [];
        for (var i in KanColleWidget.Stash.deckInSortie) {
            if (KanColleWidget.Stash.deckInSortie[i]) decksInSortie.push(i);
        };
        return decksInSortie;
    };
    /**
     * 出撃中の艦隊idを配列で返したうえで、綺麗にする
     * @returns {*}
     */
    Sorties.prototype.sweepStash = function(){
        var decksInSortie = this.findFromStash();
        this.refreshStash();
        return decksInSortie;
    };
})();
