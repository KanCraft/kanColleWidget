var KanColleWidget = KanColleWidget || {};
(function(){
    "use strict";
    /**
     * @static
     */
    var PreChecker = KanColleWidget.PreChecker = {
        questAccessor : new KanColleWidget.Quests(),
        storage : new KanColleWidget.MyStorage(),
        mapQuest : {
            /**
             * まだ着手すらしてない
             * && ignoreListに追加されていない
             * 入渠系の任務を返す
             * @returns {*}
             */
            check : function(){
                return PreChecker._check('map');
            }
        },
        practiceQuest : {
            check : function(){
                return PreChecker._check('practice');
            }
        },
        missionQuest : {
            check : function(){
                return PreChecker._check('mission');
            }
        },
        hokyuQuest : {
            check : function(){
                return PreChecker._check('hokyu');
            }
        },
        nyukyoQuest : {
            check : function(){
                return PreChecker._check('nyukyo');
            }
        },
        kousyouQuest : {
            check : function(){
                return PreChecker._check('kousyou');
            }
        },
        kaisouQuest : {
            check : function(){
                return PreChecker._check('kaisou');
            }
        },
        _filterIgnoredAndEmbarked : function(quest){
            // undefinedなら、これを除外する
            if (! quest) return;
            // 既にembarkしているなら、これを除外する
            if (quest.state == KanColleWidget.Quests.state.NOW) return;
            // 既にignoreListに追加されているなら、これを除外する
            if (Util.inArray(quest.id, PreChecker.getIgnoreList())) return;
            // それ以外は、これを返す
            return quest;
        },
        /**
         * keyで指定された_listから、
         * まだ着手すらしてない
         * && ignoreされてない
         * 任務を返す
         * @param key
         * @returns {*}
         * @private
         */
        _check : function(key){
            // まだ達成されていない任務
            var questNotCompletedYet;
            // 本日の全ての任務
            var all = PreChecker.questAccessor.getAll().map;
            // PreCheckリスト
            var ids = PreChecker._list[key];
            for (var i in ids) {
                // PreCheckリストにはあるが「本日の」任務には含まれない場合がある
                if (! all[ids[i]]) continue;
                // PreCheckが必要な本日の任務で、達成してない最初のものを返す
                if (all[ids[i]].state < KanColleWidget.Quests.state.DONE) {
                    questNotCompletedYet = all[ids[i]];
                    break;
                }
            }
            //console.log("まだ達成されてない最初のもの", questNotCompletedYet);
            return PreChecker._filterIgnoredAndEmbarked(questNotCompletedYet);
        },
        /**
         * 順番は依存関係を反映している
         * @see src/js/definitions/models/quests/Quests.js
         */
        _list : {
            map      : [201,216,211,212,218,210,226,230],
            practice : [303, 304],
            mission  : [402, 403],
            hokyu    : [503, 504],
            nyukyo   : [503],
            kousyou  : [605,606,607,608,609],
            kaisou   : [702]
        },
        /**
         * もう通知出さないリストに入ってるか判定
         * @param questId
         * @returns {boolean}
         */
        isInIgnoreList : function(questId) {
            var currentIgnoreList = PreChecker.getIgnoreList();
            return Util.inArray(questId, currentIgnoreList);
        },
        /**
         * 与えられた任務idを、もう通知出さないリストに入れる
         * @param questId
         * @returns {*}
         */
        ignore : function(questId){
            var update = PreChecker.refresh();
            update.ignoreList.push(questId);
            return PreChecker.storage.set("precheck", update);
        },
        /**
         * デイリーリセットも考慮して
         * 現時点で通知もう出さないとされた任務idの配列を返す
         * @returns int[]
         */
        getIgnoreList : function(){
            return PreChecker.refresh().ignoreList;
        },
        /**
         * lastUpdateがresetTimestampよりも前なら
         * ストレージを初期値で上書きしてしたうえで
         * このスタティックモジュールそのものを
         * そうでなければ、なにもせずにこのモジュールを返す
         * @returns PreChecker
         */
        refresh : function(){
            var stored = PreChecker._repair();
            // 直近でデイリーがリセットされた時間の方が先に進んでいるなら
            // ストレージされている情報は古い
            if (stored.lastUpdate < Util.getDailyResetTimestamp()) {
                return PreChecker._repair(true);
            }
            return PreChecker.storage.get("precheck");
        },
        /**
         * ストレージが存在しなければ初期値を採用し
         * lastUpdateを更新してセットする
         * @param doInit // 強制リセットならこれを初期化し更新する
         * @returns ストレージされている内容
         * @private
         */
        _repair : function(doInit){
            var stored = PreChecker.storage.get("precheck");
            if (doInit || ! stored) {
                var initial = PreChecker._initialValue;
                initial.lastUpdate = Date.now();
                // TODO: setして次の行でgetしてるのアホっぽいので、setの返り値をsetしたvalueにしてはどうか
                PreChecker.storage.set("precheck", initial);
                stored = PreChecker.storage.get("precheck");
            }
            return stored;
        },
        /**
         * 通知をしてもう出さないとかそういうのの、初期値のみを定義している
         * 注意) 初期値のみを定義している！！
         */
        _initialValue : {
            ignoreList : [],//「もう通知を出さない」を押したらこのリストに追加される
            lastUpdate : 0// 最後に「もう通知を出さない」操作をした時間
        }
    };
})();
