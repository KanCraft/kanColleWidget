(function(){
    var q = window.location.search;
    //alert(dump(parse(q)));
    getMode();
    var wrapper = document.getElementById('flashWrap');
    wrapper.style.margin = 0;
    setTimeout(function(){
        document.getElementById('sectionWrap').style.display = 'none';
    },1000);
})();

/* dict */function parse(query){
    var dict = {};
    query.replace(/^\?/,'').split(/&/).map(function(k_v){
        var tmp = k_v.split('=');
        dict[tmp[0]] = tmp[1];
    });
    return dict;
}

/* string */function dump(dict){
    var s = '';
    for (var k in dict){
        s += k + "\t: " + dict[k] + "\n";
    }
    return s;
}

/* mode: string */function getMode(){
    var mapWidthZoom = {
        '1200': '1.5',
        '800' : '1',
        '600' : '0.75',
        '400' : '0.5'
    }
    alert('in getMode window.innerWidth:' + window.innerWidth + "\n" + 'ZOOM : ' + mapWidthZoom[window.innerWidth]);
}