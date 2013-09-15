/**
 * dependency: Createships
 */

/***** class definitions *****/

function KousyouAction(){/*** 工廠系のAPIが叩かれたときのアクション ***/
    this.achievements = new Achievements();
}

KousyouAction.prototype.forCreateship = function(params){

    this.achievements.update().incrementCreateshipCount();

    if(params.api_highspeed == 1) return; // 高速建造を使用する

    var callback = function(res){
        console.log(res);
        var finishTimeMsec = Util.timeStr2finishEpochMsec(res.result);
        if(!finishTimeMsec){
            alert('建造終了時間の取得に失敗しました。マニュアル有効にしているひとは出す');
            return;
        }
        var createships = new Createships();
        createships.add(params.api_kdock_id[0], finishTimeMsec);
    };

    setTimeout(function(){
        Util.ifThereIsAlreadyKCWidgetWindow(function(widgetWindow){
            //chrome.runtime.sendMessage(message);
            Util.extractFinishTimeFromCapture(
                widgetWindow.id,
                'createship',
                params.api_kdock_id[0],
                callback
            );
        });
    },5000);// Thanks to about518

    /***** とりあえず手動は置いとく
    if(!Config.get('enable-manual-reminder')) return; // 設定されていない
    if(params.api_highspeed == 1) return; // 高速建造を使用する

    var path = chrome.extension.getURL('/') + 'src/html/set_createship.html';
    var qstr = '?' + Util.dict2hashString(params);
    // レスポンスが帰って来て建造時間が可視化されるまで待つ
    setTimeout(function(){
        // TODO: left,topは動的に欲しい。screenLeftが謎に0
        var win = window.open(path + qstr, "_blank", "width=400,height=250,left=600,top=200");
        Util.adjustSizeOfWindowsOS(win);
    },1000);
    *****/
}
KousyouAction.prototype.forGetship = function(params){
    var createships = new Createships();
    createships.clear(params.api_kdock_id);
}
KousyouAction.prototype.forCreateitem = function(params){
    this.achievements.update().incrementCreateitemCount();
}
