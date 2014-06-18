/* jshint browser:true, jquery:true */
/* global Util, chrome */

// Flash結構いろいろあるっぽいので発見し次第追加していく
var targetFlashes = [
    '#externalswf',
    '#maintenanceswf',
    '#entranceswf'
];

$(function() {
    'use strict';

    window.onbeforeunload = function() {
        chrome.runtime.sendMessage({purpose:'syncSave'});
    };

    var aaString = '' +
            '                 __＿___＿\n'+
            '          ／                  ＼\n'+
            '       /    ,.．  -‐‐-   、       ＼\n'+
            '       }∠,.. 艦 __ これ _    ＼       ＼\n'+
            '      /.:.:.:./＼|＼:.:.:.      ＼      ＼,\n'+
            '     ,′ ｉ : / ｎ       ｎ  ＼ i:.:.:.:.i‘   }\n'+
            '     i :人   | U        U    ｌ :.:.: Λ :‘ ，/\n'+
            '    <人  （                  ,\' :.:./__):.∠ニZ\n'+
            '     /:.个:.   __▽___    ,./:∠:._｛>o<｝\n'+
            '     {:.:.:‘.( ) ( )__L/´     /:.:.|\n'+
            '     人:.:.:.:(･x ･l ト--{〉  ノi:.:./\n'+
            '       ｀ ¨¨´|    |___,.{     ､_,.ノ\n'+
            '                |    |     ＼\n'+
            '                |    |___ __／\n'+
            '                /   | |_|\n'+
            '               ⊂ノ⊂ノ ｣.|\n';

    // ウィジェットウィンドウのタイトルをセット
    var $title = $('<title></title>');
    $title.text(Util.getWidgetTitle());
    $('head').append($title);

    // キーバインド登録
    $(document).on('keyup',function(e){
        if(e.shiftKey && e.ctrlKey && e.keyCode === 48){
            chrome.runtime.sendMessage({purpose: 'screenshot'});
        }
    });

    /**
     * 主にリサイズ関係のセットアップを行う
     * @param $embedElement FLASHのembedエレメント
     */
    var setupWidget = function($embedElement) {
        // Flash の embed とその親 div を交換
        $('#flashWrap').replaceWith($embedElement);

        // 余計な div を削除
        $('div').remove();

        // 背景を黒に
        $('body').css('background-color', 'black')
            .css('width', '100%')
            .css('height', '100%');

        // リサイズ周りの挙動
        $embedElement.css('position', 'absolute');
        $embedElement.css('top', '50%');
        $embedElement.css('left', '50%');

        /**
         * ウィンドウがリサイズされた時、アスペクト比を維持しつついい感じに追随するように
         */
        var onResize = function() {
            var width = window.innerWidth;
            var height = window.innerHeight;
            var aspect = height / width;
            if( aspect > 0.6 ){
                height = width * 0.6;
            } else if( aspect < 0.6 ){
                width = height / 0.6;
            }
            $embedElement.attr('height', height);
            $embedElement.attr('width', width);
            $embedElement.css('margin-top', -height/2);
            $embedElement.css('margin-left', -width/2);
        };
        onResize();
        $(window).resize(onResize);

        Util.adjustSizeOfWindowsOSImmediately(window);
    };

    /**
     * Flash の embed 要素取得を試みる
     * あったら setupWidget() を呼ぶ
     * なかったら1秒毎に試す
     */
    var getFlash = (function() {
        var count = 0;
        return function() {
            // Flash の embed 要素あるかな？
            var $embedElement = null;

            try {
                targetFlashes.forEach(function(elem) {
                    $embedElement = $(elem);
                    if($embedElement.length > 0) {
                        // ループを止めるために例外を投げる
                        throw true;
                    }
                });
            } catch (e) {
                if(e === true) {
                    // 発見した
                    setupWidget($embedElement);
                    return;
                }
                // 想定外の例外は投げ直す
                throw e;
            }

            // ないやん。1秒後にまた試すわ
            count = count + 1;
            if(count >= 10) {
                alert(aaString + 'エラー。一回閉じてもう一回試してみてください。');
                window.close();
                return;
            }
            window.setTimeout(getFlash, 1000);
        };
    })();
    setTimeout(getFlash, 1000);

    // ウィンドウ位置記憶かなにか？
    setInterval(function(){
        chrome.runtime.sendMessage({
            purpose  : 'positionTracking',
            position : {
                top  : window.screenTop,
                left : window.screenLeft
            },
            size : {
                innerWidth  : window.innerWidth,
                innerHeight : window.innerHeight,
                outerWidth  : window.outerWidth,
                outerHeight : window.outerHeight
            }
        });
    }, 10 * 1000);

    // faviconつけるよー
    $('<link/>').attr({
        rel : 'shortcut icon',
        href: 'https://raw.github.com/otiai10/kanColleWidget/develop/src/img/dmm.ico'
    }).appendTo('head');
});
