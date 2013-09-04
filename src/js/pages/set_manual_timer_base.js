function basic(){
    alert('this is basic');
}

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