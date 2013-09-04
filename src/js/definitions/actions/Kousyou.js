/**
 * dependency: いまのところなし
 */

/***** class definitions *****/

function KousyouAction(){/*** 工廠系のAPIが叩かれたときのアクション ***/}

KousyouAction.prototype.forCreateship = function(params){
    if(params.api_highspeed == 1) return;
    var path = chrome.extension.getURL('/') + 'src/html/set_createship.html';
    var qstr = '?' + dict2hashString(params);
    // レスポンスが帰って来て建造時間が可視化されるまで待つ
    setTimeout(function(){
        // TODO: left,topは動的に欲しい。screenLeftが謎に0
        window.open(path + qstr, "_blank", "width=400,height=250,left=1000,top=1000");
    },1500);
}
KousyouAction.prototype.forCreateshipSpeedchange = function(params){
    // createshipsモデルから削除するんだろうな...
    // params.api_kdoc_id   = int
    // params.api_highspeed = 1
}
