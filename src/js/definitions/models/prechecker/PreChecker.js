var KanColleWidget = KanColleWidget || {};

(function(){
    // staticなモジュール
    var PreChecker = KanColleWidget.PreChecker = {
        questAccessor : new Quests(),
        storage : new MyStorage(),
        nyukyoQuest : {
            /**
             * まだ着手すらしてない
             * 入渠系の任務を返す
             * @returns {*}
             */
            check : function(){
                return PreChecker._check('nyukyo');
            }
        },
        /**
         * keyで指定された_listから、
         * まだ着手すらしていない任務を返す　
         * @param key
         * @returns {*}
         * @private
         */
        _check : function(key){
            var all = PreChecker.questAccessor.getAll().map;
            var ids = PreChecker._list[key];
            for (var i in ids) {
                if (all[ids[i]].state < Quests.state.NOW) {
                    return all[ids[i]];
                }
            }
            return;
        },
        /**
         * 順番は依存関係を反映している
         */
        _list : {
            nyukyo : [503],
            hokyu  : [503, 504]
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
