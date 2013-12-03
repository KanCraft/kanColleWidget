/* jshint browser:true */
(function(){
    'use strict';
    // ここもループにして複数回試行したほうがいいかな？
    setTimeout(function(){
        var iframeUrl = document.getElementsByTagName('iframe').item(0).getAttribute('src');
        // replace() メソッドを使うとブラウザに履歴を残さないので、ブラウザバックできなくできる
        location.replace(iframeUrl);
    }, 300);
})();
