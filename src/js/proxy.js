(function(){
    var ifrm_url = document.getElementsByTagName('iframe').item().getAttribute('src');
    //analyze(ifrm_url);
    //
    var width = 800;
    var height= width*0.6;
    ifrm_url = ifrm_url + '&mode=m';
    //
    var w1 = window;
    var w2 = window.open(ifrm_url, "_blank", "titile=しごとしろ,width="+width+",height="+height+",menubar=no,status=no,scrollbars=no,resizable=no,left=40,top=40");
    w1.close();
})();

function analyze(url){
    var matches = url.match(/^http:\/\/(osapi.dmm.com\/gadgets\/ifr)\?(.*)/);
    var params = {};
    matches[2].split('&').map(function(k_v){
        var tmp = k_v.split('=');
        params[tmp[0]] = tmp[1];
    });
    params['winName'] = window.name;
    params['winQuery'] = window.location.search;
    alert(dump(params));
}

function dump(dict){
    var s = '';
    for (var k in dict){
        s += k + "\t: " + dict[k] + "\n";
    }
    return s;
}