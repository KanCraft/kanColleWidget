/**
 * dependency: いまのところなし
 */

/***** class definitions *****/

function KousyouAction(){/*** 工廠系のAPIが叩かれたときのアクション ***/}

KousyouAction.prototype.forCreateship = function(params){
    var path = chrome.extension.getURL('/') + 'src/html/set_creation.html';
    var qstr = '?' + dict2hashString(params);
    window.open(path + qstr, "_blank", "width=400,height=250,left=40,top=40");
}
