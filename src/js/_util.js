/* dict */function parse(query_str){
    var params = {};
    query_str.replace(/^\?/,'').split('&').map(function(k_v){
        var tmp = k_v.split('=');
        params[tmp[0]] = tmp[1];
    });
    return params;
}

/* dict.stringify */function dump(dict,f){
    var s = '';
    for (var k in dict){
        s += k + "\t: " + dict[k] + "\n";
    }
    if(f) return s;
    alert(s);
}

/* mode: string */function getMode(){
    var mapWidthMode = {
        '1200': 'l',
        '800' : 'm',
        '600' : 's',
        '400' : 'xs'
    }
    return mapWidthMode[window.innerWidth];
}

/* zoom: string */function getZoom(){
    var mapWidthZoom = {
        '1200': '1.5',
        '800' : '1',
        '600' : '0.75',
        '400' : '0.5'
    }
    return mapWidthZoom[window.innerWidth];
}