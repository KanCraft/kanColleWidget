/**
 * dependency: いまのところなし
 */

/***** class definitions *****/

function KousyouAction(){/*** 工廠系のAPIが叩かれたときのアクション ***/}

KousyouAction.prototype.forCreateship = function(params){
    if(params.api_highspeed == 1) return;
    var path = chrome.extension.getURL('/') + 'src/html/set_createship.html';
    var qstr = '?' + dict2hashString(params);
    window.open(path + qstr, "_blank", "width=400,height=250,left=70,top=70");
}
KousyouAction.prototype.forCreateshipSpeedchange = function(params){
    // createshipsモデルから削除するんだろうな...
    // params.api_kdoc_id   = int
    // params.api_highspeed = 1
}
