(function(){
    var aspect = 0.6;
    var conf_list = {"l": 1200,"m": 800,"s": 600,"xs": 400};
    document.forms[0].elements['launch'].addEventListener('click', function(){
        var mode = document.forms[0].elements['mode'].value;
        var w = conf_list[mode];
        var options = "width={w},height={h},menubar=no,status=no,scrollbars=no,resizable=no,left=40,top=40".replace('{w}', w).replace('{h}', String(w * aspect));
        var kanColleUrl = 'https://www.dmm.com/netgame/social/-/gadgets/=/app_id=854854/?mode='+mode;
        window.open(kanColleUrl,"_blank_new", options)
    });
})();
