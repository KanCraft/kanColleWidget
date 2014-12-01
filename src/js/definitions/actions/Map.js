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

        // {{{ 疲労回復スタート
        var deckId = params['api_deck_id'][0];
        var recoveryMinutes = Config.get("tiredness-recovery-minutes");
        if (recoveryMinutes == 0) return;
        var finish = Date.now() + (recoveryMinutes * 60 * 1000);
        this.sorties.add(deckId, finish);
        // }}}
    };
    MapAction.prototype.forEnd = function(){

        KCW.ShipsStatusWindow.sweep();

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
})();
