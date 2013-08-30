/***** class definitions *****/
function MyStorage(){/** localStorageにアクセスするクラス **/}
MyStorage.prototype.get = function(key){
    try{
        return JSON.parse(localStorage.getItem(key));
    }catch(e){
        return localStorage.getItem(key);
    }
};
MyStorage.prototype.set = function(key,value){
    localStorage.setItem(key,JSON.stringify(value));
};
/***** ここで書かなきゃいけないのつらい(´・ω・`) *****/

var myStorage = new MyStorage();

function updateTimeLeft(){
    var renderParams = [];
    var missions = myStorage.get('missions');
    if(missions == null) return render(renderParams);
    missions.map(function(m){
        if(m.finish == null) return;
        var d = new Date(m.finish);
        renderParams.push({
            deck_id : String(m.deck_id),
            time    : zP(2,String(d.getHours())) + '<span class="twincle sec">:</span>' + zP(2,String(d.getMinutes()))
        });
    });
    return render(renderParams);
}

function render(params){
    var template = '<li id="deck{deck_id}"><span id="time-left-deck2">{time}</span> <span class="deck-id">第{deck_id}艦隊</span></li>';
    var ul = document.getElementById('time-list-container');
    params.map(function(p){
        var dom = template.replace(/\{deck_id\}/g, p.deck_id).replace('{time}', p.time);
        ul.innerHTML += dom;
    });
    if(params.length == 0) toggleTimeLeftArea(false);
}

function toggleTimeLeftArea(switcher){
    var div = document.getElementById('mission-time-left');
    if(switcher == true){
        console.log(1);
        div.style.display = '';
    }
    if(switcher == false){
        console.log(2);
        div.style.display = 'none';
    }
}

/* zero_padding: string */function zP(order, text){
    for(var i=0;i<order;i++){
        text = '0' + text;
    }
    return text.slice(order*(-1));
}

/* void */function uncheckAll(){
    var checkboxes = document.getElementsByTagName('input');
    for(var i= 0,len=checkboxes.length;i<len;i++){
        checkboxes[i].checked = false;
    }
}

(function(){
    updateTimeLeft();
    var aspect = 0.6;
    var conf_list = {"l": 1200,"m": 800,"s": 600,"xs": 400};
    document.forms[0].elements['launch'].addEventListener('click', function(){
        var mode = document.forms[0].elements['mode'].value;
        var w = conf_list[mode];
        var options = "width={w},height={h},menubar=no,status=no,scrollbars=no,resizable=no,left=40,top=40".replace('{w}', w).replace('{h}', String(w * aspect));
        var kanColleUrl = 'https://www.dmm.com/netgame/social/-/gadgets/=/app_id=854854/?mode='+mode;
        window.open(kanColleUrl,"_blank_new", options)
    });
    var divs = document.getElementsByClassName('select');
    for(var i= 0,len=divs.length; i<len; i++){
        divs[i].addEventListener('click',function(){
            uncheckAll();
            this.childNodes[1].checked = true;
        });
    }
})();