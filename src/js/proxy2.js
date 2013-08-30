var aa_string = "" +
"                 __＿___＿\n"+
"          ／                  ＼\n"+
"       /    ,.．  -‐‐-   、       ＼\n"+
"       }∠,.. 艦 __ これ _    ＼       ＼\n"+
"      /.:.:.:./＼|＼:.:.:.      ＼      ＼,\n"+
"     ,′ ｉ : / ｎ       ｎ  ＼ i:.:.:.:.i‘   }\n"+
"     i :人   | U        U    ｌ :.:.: Λ :‘ ，/\n"+
"    <人  （                  ,' :.:./__):.∠ニZ\n"+
"     /:.个:.   __▽___    ,./:∠:._｛>o<｝\n"+
"     {:.:.:‘.( ) ( )__L/´     /:.:.|\n"+
"     人:.:.:.:(･x ･l ト--{〉  ノi:.:./\n"+
"       ｀ ¨¨´|    |___,.{     ､_,.ノ\n"+
"                |    |     ＼\n"+
"                |    |___ __／\n"+
"                /   | |_|\n"+
"               ⊂ノ⊂ノ ｣.|\n";

(function(){
    //------------------------->>>
    var body = document.getElementsByTagName('body').item().style.zoom = getZoom();
    var wrapper = document.getElementById('flashWrap');
    wrapper.style.margin = 0;
    setTimeout(function(){
        document.getElementById('sectionWrap').style.display = 'none';
        var div = document.getElementById('spacing_top');
        if(div) div.style.display = 'none';
    },1000);
    //-----------------------<<<
    var src = null;
    setTimeout(function(){
        var embed = document.getElementById('externalswf');
        if(embed) src = embed.getAttribute('src');
        if(src){
            var ua = navigator.userAgent;
            var diffWidth = 0;
            var diffHeight = 0;
            if (navigator.userAgent.match(/Win/) || navigator.platform.indexOf("Win") != -1)
            {
                // Windows版でのみサイズがおかしくなるそうなので
                diffWidth = window.outerWidth - window.innerWidth;
                diffHeight = window.outerHeight - window.innerHeight;
            }
            var width = window.outerWidth + diffWidth;
            var height= window.outerHeight + diffHeight;
            window.resizeTo(width,height);
            var doc = window.document;
            doc.open();
            //doc.write(proxy_html_string);
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
                doc.write('<body style="margin:0;">');
                doc.write('<iframe id="kancolle" src='+src+' frameborder="0" scrolling="no" width="800" height="480"></iframe>');
                doc.write('</body>');
                doc.write('</html>');
            doc.close();
        }else{
            alert(aa_string + "Flashのロードに時間がかかりウィジェット化を諦めました。が、ふつうにプレーできます。");
        }
    },1000);
})();
