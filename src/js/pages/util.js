/* zero_padding: string */function zP(order, text){
    for(var i=0;i<order;i++){
        text = '0' + text;
    }
    return text.slice(order*(-1));
}
/* dict.stringify */function dump(dict,f){
    var s = '';
    for (var k in dict){
        s += k + "\t: " + dict[k] + "\n";
    }
    if(f) return s;
    alert(s);
}

/* zoom: string */function getZoom(){
    return Constants.widget.width[window.innerWidth].zoom;
}

/* dict.stringify */function dump(dict,f){
    var s = '';
    for (var k in dict){
        s += k + "\t: " + dict[k] + "\n";
    }
    if(f) return s;
    alert(s);
}

/* dict */function parse(query_str){
    var params = {};
    query_str.replace(/^\?/,'').split('&').map(function(k_v){
        var tmp = k_v.split('=');
        params[tmp[0]] = tmp[1];
    });
    return params;
}