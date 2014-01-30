$(function(){
    $('body').css({
        position: 'fixed',
        top: -95,
        left: -70
    });
    // adjust to windows
    if (navigator.userAgent.match(/Win/) || navigator.platform.indexOf('Win') !== -1) {
        var diffWidth = window.outerWidth - window.innerWidth;
        var diffHeight = window.outerHeight - window.innerHeight;
        window.resizeTo(window.outerWidth + diffWidth, window.outerHeight + diffHeight);
    }
    history.forward();
});
