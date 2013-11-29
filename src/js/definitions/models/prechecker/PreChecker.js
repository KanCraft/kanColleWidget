var KanColleWidget = KanColleWidget || {};

(function(){
    // staticなモジュール
    var PreChecker = KanColleWidget.PreChecker = {
        questAccessor : new Quests(),
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
        }
    };
})();
