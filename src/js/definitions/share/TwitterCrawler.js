var KanColleWidget = KanColleWidget || {};
(function() {
    // static module
    var TwitterCrawler = KanColleWidget.TwitterCrawler = {};
    TwitterCrawler._baseURL = "https://twitter.com/search";
    TwitterCrawler._get5daysBefore = function() {
        var days = 24*60*60*1000;
        var theDay = new Date(Date.now() - 5*days);
        return theDay.toISOString();
    };
    TwitterCrawler._query = {
        keyword : 'メンテナンス',
        from    : 'KanColle_STAFF',
        since   : TwitterCrawler._get5daysBefore()
    };
    TwitterCrawler._buildURL = function() {
        var q = TwitterCrawler._query['keyword']
                + '+' + 'from:' + TwitterCrawler._query['from']
                + '+' + 'since:' + TwitterCrawler._query['since']
        return TwitterCrawler._baseURL + '?q=' + encodeURIComponent(q);
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
    TwitterCrawler.find$e = function(callback, opt) {
        TwitterCrawler.findMaintainanceInfo(function(res) {
            var $elements = $.map($(res).find('li.expanding-stream-item'), function(li){
                var $el = $(li).find('div.stream-item-header');
                $el.append($(li).find('p.tweet-text'));
                console.log($el);
                return $el;
            });
            $('body').append($('<div>').append($elements));
        }, opt);
    };
})();
