(function(){
    "use strict";
    $.get('http://wikiwiki.jp/kancolle/?%B1%F3%C0%AC',function(res){
        var table = $(res).find('table')[12];
        $('body').append(table);
        $('tr').hover(function(ev){
            $(this).css({backgroundColor:'#fff'});
        },function(ev){
            $(this).css({backgroundColor:'inherit'});
        });
    });
})();
