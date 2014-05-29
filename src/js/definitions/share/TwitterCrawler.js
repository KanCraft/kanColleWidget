var KanColleWidget = KanColleWidget || {};
(function() {
    // static module
    var TwitterCrawler = KanColleWidget.TwitterCrawler = {};
    TwitterCrawler._baseURL = "https://twitter.com/search";
    TwitterCrawler._getDaysBefore = function(_d) {
        var days = 24*60*60*1000;
        var theDay = new Date(Date.now() - _d*days);
        return theDay.toISOString();
    };
    TwitterCrawler._query = {
        keyword : 'メンテナンス',
        from    : 'KanColle_STAFF',
        since   : TwitterCrawler._getDaysBefore(3),
        f       : 'realtime'
    };
    TwitterCrawler._buildURL = function() {
        var q = TwitterCrawler._query['keyword']
                + '+' + 'from:' + TwitterCrawler._query['from']
                + '+' + 'since:' + TwitterCrawler._query['since'];
        return TwitterCrawler._baseURL + '?q=' + encodeURIComponent(q)
                + '&f=' + TwitterCrawler._query['f'];
    };
    TwitterCrawler.findMaintainanceInfo = function(callback, opt) {
        var mod = TwitterCrawler;
        $.ajax({
            type: 'GET',
            url : mod._buildURL(),
            success : function(res){
                callback(res);
            },
            error : function(err){
                console.log(err);
            }
        });
    };
    TwitterCrawler.get$ = function(callback, opt) {
        TwitterCrawler.findMaintainanceInfo(function(res) {
            var $elements = $.map($(res).find('li.expanding-stream-item'), function(li){
                var $el = $('<div></div>').addClass('stream-item').append(
                     $(li).find('div.stream-item-header')
                );
                $el.append($(li).find('p.tweet-text'));
                $el.find('strong.fullname').remove();
                $el.find('.stream-item-footer').remove();
                $el.find('a').attr({href: TwitterCrawler._buildURL()}).on('click',function(){
                    chrome.tabs.create({
                        url : $(this).attr('href')
                    });
                });
                $el.find('a.account-group').after('<br>');
                return $el;
            });
            callback($elements);
        }, opt);
    };
})();
