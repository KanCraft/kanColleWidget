/* jshint browser:true, jquery:true */
/* global Util, chrome */

$(function() {
  'use strict';

  var aa_string = '' +
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

  // 背景を黒に
  $('body').css('background-color', 'black');

  /**
   * 主にリサイズ関係のセットアップを行う
   * @param $externalswf $('#externalswf')を渡す
   */
  var setupWidget = function($externalswf) {
    // Flash 以外の余計な div を削除
    $('div:not(#flashWrap)').remove();

    // Flash の embed とその親 div を交換
    $('#flashWrap').replaceWith($externalswf);

    // リサイズ周りの挙動
    $externalswf.css('position', 'absolute');
    $externalswf.css('top', '50%');
    $externalswf.css('left', '50%');

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
      $externalswf.attr('height', height);
      $externalswf.attr('width', width);
      $externalswf.css('margin-top', -height/2);
      $externalswf.css('margin-left', -width/2);
    };
    onResize();
    $(window).resize(onResize);

    Util.adjustSizeOfWindowsOS(window);
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
      var $externalswf = $('#externalswf');
      if($externalswf.length === 0) {
        // ないやん。1秒後にまた試すわ
        count = count + 1;
        if(count >= 5) {
          alert(aa_string + 'エラー。一回閉じてもう一回試してみてください。');
        }
        setTimeout(getFlash, 1000);
      } else {
        // あった
        setupWidget($externalswf);
      }
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
});
