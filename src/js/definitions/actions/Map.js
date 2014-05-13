var KanColleWidget = KanColleWidget || {};
(function(){
    "use strict";
    var MapAction = KanColleWidget.MapAction = function(){
        this.achievements = new KanColleWidget.Achievements(new MyStorage());
        this.sorties = new KanColleWidget.Sorties();
        this.precheckKeyword = 'mapQuest';
    };
    MapAction.prototype = Object.create(KanColleWidget.ActionBase.prototype);
    MapAction.prototype.constructor = MapAction;

    MapAction.prototype.forStart = function(params){
        this.achievements.update().incrementMapCount();
        var deck_id = params['api_deck_id'][0];
        // 同時に複数デッキは出撃できないとする
        this.sorties.refreshStash().registerStash(deck_id);

        // {{{ 疲労回復スタート
        var recoveryMinutes = Config.get("tiredness-recovery-minutes");
        if (recoveryMinutes == 0) return;
        var deckIds = this.sorties.sweepStash();
        for (var i in deckIds) {
            var finish = Date.now() + (recoveryMinutes * 60 * 1000);
            this.sorties.add(deckIds[i], finish);
        }
        // }}}
    };
    MapAction.prototype.forEnd = function(){

        this._clearShipsStatusWindow();

        /* {{{ 疲労回復スタート
        var recoveryMinutes = Config.get("tiredness-recovery-minutes");
        if (recoveryMinutes == 0) return;
        var deckIds = this.sorties.sweepStash();
        for (var i in deckIds) {
            var finish = Date.now() + (recoveryMinutes * 60 * 1000);
            this.sorties.add(deckIds[i], finish);
        }
        }}} */
    };
    MapAction.prototype.forNext = function(){
        this._clearShipsStatusWindow();
    };
    MapAction.prototype._clearShipsStatusWindow = function(){
        if (KanColleWidget.Stash.statusWindow
            && KanColleWidget.Stash.statusWindow.close) {
            KanColleWidget.Stash.statusWindow.close();
        }
        KanColleWidget.Stash.statusWindow = null;
    };
})();
