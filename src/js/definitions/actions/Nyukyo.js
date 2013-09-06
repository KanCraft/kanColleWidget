/**
 * dependency: Nyukyos
 */

/***** class definitions *****/

function NyukyoAction(){/*** 工廠系のAPIが叩かれたときのアクション ***/}

NyukyoAction.prototype.forStart = function(params){

    if(!Config.get('enable-manual-reminder')) return; // 設定されていない
    if(params.api_highspeed == 1) return; // 高速建造を使用する

    var path = chrome.extension.getURL('/') + 'src/html/set_nyukyo.html';
    var qstr = '?' + dict2hashString(params);
    // レスポンスが帰って来て建造時間が可視化されるまで待つ
    setTimeout(function(){
        // TODO: left,topは動的に欲しい。screenLeftが謎に0
        window.open(path + qstr, "_blank", "width=400,height=250,left=600,top=200");
    },1000);
}
NyukyoAction.prototype.forSpeedchange = function(params){
    var nyukyos = new Nyukyos();
    nyukyos.clear(params.api_ndock_id);
}
