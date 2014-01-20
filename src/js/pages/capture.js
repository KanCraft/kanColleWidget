var widgetPages = widgetPages || {};
$(function(){
    var view = new widgetPages.CaptureView();
    $('body').append(
        view.render()
    );
    view.startApp();
    $('title').text(Util.getFormattedDateString());
});
