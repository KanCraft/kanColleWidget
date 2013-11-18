/* jshint browser:true */
(function(){
    'use strict';
    var iframeUrl = document.getElementsByTagName('iframe').item(0).getAttribute('src');
    // replace() メソッドを使うとブラウザに履歴を残さないので、ブラウザバックできなくできる
    location.replace(iframeUrl);
})();
