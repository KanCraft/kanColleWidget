(function(){
    var body = document.getElementsByTagName('body').item().style.zoom = getZoom();
    var wrapper = document.getElementById('flashWrap');
    wrapper.style.margin = 0;
    setTimeout(function(){
        document.getElementById('sectionWrap').style.display = 'none';
    },1000);
})();
