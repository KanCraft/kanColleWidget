var myStorage = myStorage || new MyStorage();
$(function(){
    var renderParams = [];
    var missions = myStorage.get('missions') || [];
    missions.map(function(m){
          if(m.finish == null) return;
          var d = new Date(m.finish);
          renderParams.push({
              id      : String(m.deck_id),
              rawtime : d,
              time    : Util.zP(2,String(d.getHours())) + ':' + Util.zP(2,String(d.getMinutes()))
          });
    });
    render('missions',renderParams);

    var renderParamsCreateships = [];
    var createships = myStorage.get('createships') || [];
    createships.map(function(c){
        if(c.finish == null) return;
        var d = new Date(c.finish);
        renderParamsCreateships.push({
            id      : String(c.api_kdock_id),
            rawtime : d,
            time    : Util.zP(2,String(d.getHours())) + ':' + Util.zP(2,String(d.getMinutes()))
        });
    });
    render('createships',renderParamsCreateships);

    var renderParamsNyukyos = [];
    var nyukyos = myStorage.get('nyukyos') || [];
    nyukyos.map(function(n){
        if(n.finish == null) return;
        var d = new Date(n.finish);
        renderParamsNyukyos.push({
            id      : String(n.api_ndock_id),
            rawtime : d,
            time    : Util.zP(2,String(d.getHours())) + ':' + Util.zP(2,String(d.getMinutes()))
        });
    });
    render('nyukyos',renderParamsNyukyos);

    $("#img-commit").on('click',function(){
        updateTimer();
    });
});

function render(targetName, params) {
    $.each(params, function(){
        var $target = $("#" + targetName + "-" + this.id);
        $target.val(this.time);
    });
}

var eventClasses = {
  'missions'    : new Missions(),
  'nyukyos'     : new Nyukyos(),
  'createships' : new Createships()
};

function updateTimer() {
    for(var i=0,len=$("input.editor").length;i<len;i++){
        var $input = $($("input.editor").get(i));
        var val = $input.val();
        if(! val) { continue; }
        if(! val.match(/^[0-9]+:[0-9]+$/)) {
          $("#validation-message").html("00:00の形式で入力してください");
          return;
        }
    }
    for(var i=0,len=$("input.editor").length;i<len;i++){
        var $input = $($("input.editor").get(i));
        var val = $input.val();
        if(! val) { continue; }
        var ev = $input.attr('id').split('-')[0];
        var id = $input.attr('id').split('-')[1];
        var evModel = eventClasses[ev].find(id);
        var newTs = generateNewTimestamp(val, evModel.finish); 
        eventClasses[ev].add(id,newTs);
    }
    location.href = './dashboard.html';
}

function generateNewTimestamp(timestr, finishts){
    if (! finishts) {
        finishts = Date.now();
    }
    var finishDate = new Date(finishts);
    var hour = timestr.split(':')[0];
    var minute = timestr.split(':')[1];

    var diffHours = hour - finishDate.getHours();
    var diffMinuts = minute - finishDate.getMinutes();
    if (diffHours < 0) {
      diffHours = 24 - diffHours;
    }

    var diffMilSec = diffHours*1000*60*60 + diffMinuts*1000*60;
    return finishts + diffMilSec;
}
