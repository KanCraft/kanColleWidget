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

var proxy_html_string = ''+
'<html><head>'+
'<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>'+
'<script type="text/javascript">'+
'   document.addEventListener("DOMContentLoaded", function(){'+
'       var onResize = function() {'+
'           $("iframe").css("height", window.innerHeight);'+
'           $("iframe").css("width", window.innerWidth);'+
'       };'+
'       onResize();'+
'       $(window).resize(onResize);'+
'   });'+
'</script>'+
'<title>{title}</title>'+
'</head>'+
'<body style="margin:0;">'+
'<iframe id="kancolle" src="{src}" frameborder="0" scrolling="no" width="800" height="480"></iframe>'+
'</body>'+
'</html>';

function getTitle(){
    var _i = Math.floor(Math.random() * Constants.widget.titles.length);
    return Constants.widget.titles[_i];
}

(function(){

    //var body = document.getElementsByTagName('body').item().style.zoom = getZoom();
    var wrapper = document.getElementById('flashWrap');
    wrapper.style.margin = 0;
    setTimeout(function(){
        document.getElementById('sectionWrap').style.display = 'none';
        var div = document.getElementById('spacing_top');
        if(div) div.style.display = 'none';
    },1000);

    var src = null;
    setTimeout(function(){
        var embed = document.getElementById('externalswf');
        if(embed) src = embed.getAttribute('src');
        if(src){
            var doc = window.document;
            doc.open();
            proxy_html_string = proxy_html_string.replace('{src}',src).replace('{title}',getTitle());
            doc.write(proxy_html_string);
            doc.close();
        	adjustSizeOfWindowsOS(window);
        }else{
            alert(aa_string + "Flashのロードに時間がかかりウィジェット化を諦めました。が、ふつうにプレーできます。");
        }
    },1000);
})();
