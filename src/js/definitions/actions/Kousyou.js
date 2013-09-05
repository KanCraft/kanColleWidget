/**
 * dependency: Createships
 */

/***** class definitions *****/

function KousyouAction(){/*** 工廠系のAPIが叩かれたときのアクション ***/
    this.achievements = new Achievements();
}

KousyouAction.prototype.forCreateship = function(params){

    this.achievements.update().incrementCreateshipCount();

    if(!Config.get('enable-manual-reminder')) return; // 設定されていない
    if(params.api_highspeed == 1) return; // 高速建造を使用する

    var path = chrome.extension.getURL('/') + 'src/html/set_createship.html';
    var qstr = '?' + dict2hashString(params);
    // レスポンスが帰って来て建造時間が可視化されるまで待つ
    setTimeout(function(){
        // TODO: left,topは動的に欲しい。screenLeftが謎に0
        window.open(path + qstr, "_blank", "width=400,height=250,left=800,top=800");
    },1000);
}
KousyouAction.prototype.forGetship = function(params){
    var createships = new Createships();
    createships.clear(params.api_kdock_id);
}
KousyouAction.prototype.forCreateitem = function(params){
    this.achievements.update().incrementCreateitemCount();
}
