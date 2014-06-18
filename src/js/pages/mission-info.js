(function(){
    "use strict";
    $.get('http://wikiwiki.jp/kancolle/?%B1%F3%C0%AC',function(res){
        var HAYAMIHYO_table = 12;
        var table = $(res).find('table')[HAYAMIHYO_table];
        $('body').append(table);
        $('tr').hover(function(ev){
            $(this).css({backgroundColor:'#fff'});
        },function(ev){
            $(this).css({backgroundColor:'inherit'});
        });
    });
})();
