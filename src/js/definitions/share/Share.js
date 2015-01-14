
var KanColleWidget = KanColleWidget || {};

(function(){
    var Share = KanColleWidget.Share = function(){};
    Share.prototype.url = "";
    Share.prototype.defaultOpt = {
        target : "_blank",
        windowOpt : "width=550,height=260"
    };
    Share.prototype.share = function(opt) {
        opt = opt || this.defaultOpt;
        var createData = {
            url: this.url,
            width:  550,
            height: 260,
            type:   'popup'
        };
        chrome.windows.create(createData,function(win){
            KanColleWidget.Stash.twitterShareWindowIds.push(win.id);
        });
    };

    var Twitter = KanColleWidget.Twitter = function(){
        this.baseUrl = "https://twitter.com/intent/tweet?";
    };
    Twitter.prototype = Object.create(Share.prototype);
    Twitter.prototype.constructor = Twitter;
    Twitter.prototype.shareCreateItem = function(params){
        var tweet_body = "[開発報告] #kancolle_item\n";
        tweet_body += "資材 => " + params.api_item1[0] + "/" + params.api_item2[0] + "/" + params.api_item3[0] + "/" + params.api_item4[0] + "\n";
        tweet_body += "結果 => ";
        this.url = this.baseUrl + "text=" + encodeURIComponent(tweet_body);
        return this.share();
    };
    Twitter.prototype.shareCreateShip = function(params){
        var flag = '';
        var item5 = '';
        var optionalTag = '';
        if (params['api_large_flag'] == 1) {
            flag = '大型！';
            item5 = ' +' + params.api_item5[0];
            optionalTag = ' #kancolle_ship_large';
        }
        var tweet_body = "[" + flag + "建造報告] #kancolle_ship" + optionalTag + "\n";
        tweet_body += "資材 => " + params.api_item1[0] + "/" + params.api_item2[0] + "/" + params.api_item3[0] + "/" + params.api_item4[0] + item5 + "\n";
        tweet_body += "結果 => ";
        this.url = this.baseUrl + "text=" + encodeURIComponent(tweet_body);
        return this.share();
    };

})();
