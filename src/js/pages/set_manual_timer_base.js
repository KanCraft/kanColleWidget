/* dict */function parseQueryString(){
    var res = {};
    var qstr = location.search;
    qstr.replace(/^\?/,'').split('&').map(function(k_v){
        var _tmp = k_v.split('=');
        res[_tmp[0]] = _tmp[1];
    });
    return res;
}

/* void */function applyView(dict){
    for(var k in dict){
        var el = document.getElementById(k);
        if(el) el.innerHTML = dict[k];
    }
}

/* void */function delegateCarretActions(){
    _delegateUpAction();
    _delegateDownAction();
}
/* private void */function _delegateUpAction(){
    var ups = document.getElementsByClassName('up');
    for(var i =0,len=ups.length;i<len;i++){
        var target = document.getElementById(ups[i].getAttribute('target'));
        if(target.id.match('hour')) bindEdit1By1(ups[i], true, target);
        if(target.id.match('minute')) bindEditByRange(ups[i], true, target);
    }
}
/* private void */function _delegateDownAction(){
    var downs = document.getElementsByClassName('down');
    for(var i =0,len=downs.length;i<len;i++){
        var target = document.getElementById(downs[i].getAttribute('target'));
        if(target.id.match('hour')) bindEdit1By1(downs[i], false, target);
        if(target.id.match('minute')) bindEditByRange(downs[i], false, target);
    }
}
/* private void */function bindEdit1By1(trigger, doIncrement, target){
    trigger.addEventListener('click', function(){
        var num = parseInt(target.value);
        if(!num) num = 0;
        if(doIncrement == true) num++;
        else if(num != 0) num--;
        target.value = Util.zP(2, num);
    });
}
/* private void */function bindEditByRange(trigger, doIncrement, target){
    var range = 5;
    trigger.addEventListener('click', function(){
        var num = parseInt(target.value);
        if(!num) num = 0;
        if(doIncrement == true) num = num + range;
        else if(0 <= (num - range)) num = num - range;
        else num = 60 - range;

        if(num >= 60) num = 0;
        target.value = Util.zP(2, num);
    });
}
/* void */function delegateCancelAction(callback){
    if(!callback) callback = function(){ window.close(); };
    document.getElementById('register-cancel').addEventListener('click',function(){
        callback();
    });
}
/* void */function delegateCommitAction(callback){

    if(!callback) throw new Error('delegateCommitAction requires 1 parameter');

    document.getElementById('register-commit').addEventListener('click',function(){
        var finish_time = generateEpochTime();
        callback(finish_time);
    });
}

/* epoch: int */function generateEpochTime(){
    return (new Date()).getTime() + value2msec();
}
/* int */function value2msec(){
    var hours      = parseInt(document.getElementById('input-hour').value);
    var minutes    = parseInt(document.getElementById('input-minute').value);

    if(typeof hours   != 'number') hours   = 0;
    if(typeof minutes != 'number') minutes = 0;

    return (hours * 60 + minutes) * 60 * 1000;
}

/* void */function affectInputTracking(trackingKey){
    var inputTracking = Tracking.get(trackingKey);
    document.getElementById('input-hour').value   = inputTracking.hour;
    document.getElementById('input-minute').value = inputTracking.minute;
}
/* void */function updateInputTracking(trackingKey){
    var inputTracking = Tracking.get(trackingKey);
    inputTracking.hour   = document.getElementById('input-hour').value;
    inputTracking.minute = document.getElementById('input-minute').value;
    Tracking.set(trackingKey,inputTracking);
}
/* void */function delegateValidation(){
    var allInputs = document.getElementsByTagName('input');
    for(var i= 0,len=allInputs.length;i<len;i++){
        validateTimeInput(allInputs[i]);
    }
}
/* void */function validateTimeInput(inputDOM){
    inputDOM.addEventListener('change',function(e){

        // truncate heading
        if(2 < inputDOM.value.length){
            inputDOM.value = inputDOM.value.slice(-2);
        }

        // validate
        if(inputDOM.value.match(/^[0-9]*$/)) return;

        alert('oh...');
    });
}
