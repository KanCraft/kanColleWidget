function parse(query_str){
    var params = {};
    query_str.replace(/^\?/,'').split('&').map(function(k_v){
        var tmp = k_v.split('=');
        params[tmp[0]] = tmp[1];
    });
    return params;
}

function dump(dict,f){
    var s = '';
    for (var k in dict){
        s += k + "\t: " + dict[k] + "\n";
    }
    if(f) return s;
    alert(s);
}