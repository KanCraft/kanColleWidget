(function(){
    "use strict";
    // あーめんどくせ
    $.get('http://wikiwiki.jp/kancolle/?%B1%F3%C0%AC',function(res){
        var HAYAMIHYO_table = 14;
        var table = $(res).find('table')[HAYAMIHYO_table];
        $('#mission-info').append(table);
        $('tr', table).hover(function(ev){
            $(this).css({backgroundColor:'#fff'});
        },function(ev){
            $(this).css({backgroundColor:'inherit'});
        });
    });
    $.get('http://wikiwiki.jp/kancolle/?%B2%FE%BD%A4%B9%A9%BE%B3',function(res){
        var HAYAMIHYO_table = 7;
        var table = $(res).find('table')[HAYAMIHYO_table];
        $('#kousyo-info').append(table);
        $('tr', table).hover(function(ev){
            $(this).css({backgroundColor:'#fff'});
        },function(ev){
            $(this).css({backgroundColor:'inherit'});
        });
    });
    setTimeout(function() {
        $('div.tab-container>.tab-select', document).on('click', function (ev) {
            $('.tab-container>.tab-select').removeClass('selected');
            $(this).addClass('selected');
            $('.contents-container>.contents').removeClass('selected');
            $('#' + $(this).attr('data-target')).addClass('selected');
        });
    }, 0);
})();
