(function(){
    var src = null;
    setTimeout(function(){
        var embed = document.getElementById('externalswf');
        if(embed) src = embed.getAttribute('src');
        if(src){
            var diffWidth = window.outerWidth - window.innerWidth;
            var diffHeight = window.outerHeight - window.innerHeight;
            var width = window.outerWidth + diffWidth;
            var height= window.outerHeight + diffHeight;
            window.resizeTo(width,height);
            var doc = window.document;
            doc.open();
                doc.write('<html><head>');
                doc.write('<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>');
                doc.write('<script type="text/javascript">');
                doc.write('$(function() {var onResize = function() {');
                doc.write('$("iframe").css("height", window.innerHeight);');
                doc.write('$("iframe").css("width", window.innerWidth);');
                doc.write('};');
                doc.write('onResize();');
                doc.write('$(window).resize(onResize);');
                doc.write('});');
                doc.write('</script>');
                doc.write('<title>艦これウィジェット</title>');
                doc.write('</head>');
                doc.write('<body>');
                doc.write('<iframe id="kancolle" src='+src+' frameborder="0" scrolling="no" width="800" height="480"></iframe>');
                doc.write('</body>');
                doc.write('</html>');
            doc.close();
        }else{
            alert("ウィジェット化に失敗しました。が、ふつうにプレーできます。");
        }
    },1000);
})();
