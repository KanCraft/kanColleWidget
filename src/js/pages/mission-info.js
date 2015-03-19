(function(){
    "use strict";
    // あーめんどくせ
    $.get('http://wikiwiki.jp/kancolle/?%B1%F3%C0%AC',function(res){
        var table = $(res).find('h2:contains("報酬早見表")').nextUntil('h2', 'div').children('table')[0];
        $('#mission-info').append(table);
        $('tr', table).hover(function(ev){
            $(this).css({backgroundColor:'#fff'});
        },function(ev){
            $(this).css({backgroundColor:'inherit'});
        });
    });
    $.get('http://wikiwiki.jp/kancolle/?%B2%FE%BD%A4%B9%A9%BE%B3',function(res){
        var table = $(res).find('p:contains("簡易改修表")').nextUntil('h2', 'div').children('table')[0];
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
