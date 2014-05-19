/* jshint indent: 4 */
var widgetPages = widgetPages || {};
(function() {
    'use strict';
    var SyncSaveTypeView = widgetPages.SyncSaveTypeView = function(){
        this.inputName = 'sync-save-type';
        this.title = "複数PC間のタイマーなどの同期をする";
        this.elements = [
            {value:'0', title: '使わない'},
            {value:'1', title: 'タイマーだけ'},
            {value:'2', title: 'タイマーと任務進捗と実績とメモ'},
            {value:'3', title: '設定・窓サイズ・窓位置などもぜんぶ'}
        ];
        this.description = '艦これウィジェットに保存した遠征終了時刻などのデータを'
                         + '複数PCのChromeブラウザで同期できるようにします。仕組みは'
                         + '<a href="http://developer.chrome.com/extensions/storage">ここ</a>'
                         + '見てください。なお、これを有効にすると、ウィジェット窓を閉じた時にセーブされ、'
                         + 'アイコンポップアップの中に[ load data ]ボタンが表示されます。同期したい複数のPCでこれを有効にしてください。';
        var $saveNowBtn = $('<button id="save-now">save now</button>').on('click', function(){
            MyStorage.sync.save(function(){ window.close(); });
        });
        var $loadNowBtn = $('<button id="load-now">load now</button>').on('click', function(){
            MyStorage.sync.load(function(){ window.close(); });
        });
        var $readMe = $('<a href="http://developer.chrome.com/extensions/storage">これを読んでください</a>');
        this.$appendix = $('<div class="xsmall"></div>').append($saveNowBtn, $loadNowBtn, $readMe);
    };
    Util.extend(SyncSaveTypeView, widgetPages.SettingSelectView);
})();
