/// <reference path="../checkbox.ts" />

module KCW.Pages {
    export class AllowKampaAlchemy extends CheckboxView {
        constructor() {
            super({
                title: "錬金カンパを有効にする<b>（非推奨設定）</b>",
                configKey: "allow-kampa-alchemy",
                description: "平素は『艦これウィジェット』を使っていただきありがとうございます。" +
                "ご存知のように『艦これウィジェット』はフリーソフトですし、広告も入れるつもりはないので、これによる収入はないです。" +
                "もともと、自分が艦これをするうえで「もっとこうなればいいなあ」というのを自作しただけですし、"+
                "それを公開することで自分の技術力でどのくらい人を喜ばせることができるか腕試しのようなつもりで作り始めました。"+
                "今後もそのつもりなので、ごくごく自分のために開発し続け、何か収益化するようなつもりはないです。<div/>"+
                "それでもなお、<u>もしどうしても</u>カンパしてくれるという方がいるのなら、この設定をオンにしていただけると微妙に嬉しいです（胸中複雑です）。"+
                "この設定をオンにすると、以下のポリシーにのっとって、ウェブページ上のamazonのリンクに開発者のアフィリエイトタグを付加します。"+
                "<ol>" +
                "<li><u>amazon.co.jp, amazon.com 以外のリンクには付与しない</u></li>"+
                "<li><u>GETクエリの無いリンクには新たにGETクエリを追加しない</u></li>"+
                "<li><u>すでに誰か（ブログ主など）のアフィリエイトタグが付いている場合はこれを尊重し、置換しない</u></li>"+
                "</ol>"+
                "参考: <a href='https://affiliate.amazon.co.jp/gp/associates/promo/participationrequirements?ie=UTF8' target='_blank'>Amazonアソシエイト・プログラム参加要件</a><div/>"+
                "なお、amazonのアフィリエイトタグは、クリックするひとへの負担はありませんので、だれも痛くない感じで、わりと錬金っぽいので、"+
                "これを採用し、「錬金カンパ」といたしました。この仕組みについては、こちらのブログ"+
                "<a href='http://blog.ironsand.net/2013/give-money-to-blogger-by-amazon' target='_blank'>Amazonギフト券を買って自分は損をせずにブログ書いてる人にお金を上げる方法</a>"+
                "がわかりやすいです。タイトルはめっちゃいかがわしいですけど。<div></div>"+
                "また、かつて同様の方法で利益を得ようとして炎上したひともいます。それはこちらのまとめ"+
                "<a href='http://matome.naver.jp/odai/2137476713798995301' target='_blank'>Chromeの拡張がamazonアフィリエイトを書き換えていた件と、その顛末</a>" +
                "にわりとくわしく書いてあります。『艦これウィジェット』をはじめ、「すべてのウェブページ」へのパーミッションを要求する" +
                "Chrome拡張は、やろうと思えばかなり悪どいことができますので、信頼できる開発者ではない限りなるべく削除したほうがいいと僕は思います。" +
                "<div/>" +
                "そして大事なことですが、『艦これウィジェット』は僕<a href='https://twitter.com/otiai10' target='_blank'>otiai10</a>だけで" +
                "開発したソフトウェアでは<u>ありません</u>。"+
                "<a href='https://github.com/otiai10/kanColleWidget/graphs/contributors' target='_blank'>多くのひとの協力</a>によって作り上げられてきました。"+
                "感謝申し上げるとともに、要請を頂ければ、この設定のリストへの追加をいたしますので、お申し付けください。<div/>"+
                "最後になりましたが、今後も『艦これウィジェット』は非公式ツールです。使わないならぜったいにそのほうがいいので、"+
                "当然、『艦これウィジェット』は『艦これウィジェット』の使用を推奨しません。<div/>"+
                "提督各位が『艦これ』をほどよく、快適に、たのしめることを、切に望みます。"
            });
        }
        public checkboxChanged(ev: Event) {
          var confirmMessage = "ちゃんと説明を読んで、ポリシーに賛同して頂けましたか？";
          if ($(ev.currentTarget).prop("checked") && !window.confirm(confirmMessage)) {
            $(ev.currentTarget).prop("checked", false);
            super.checkboxChanged(ev);
            return;
          }
          super.checkboxChanged(ev);
        }
    }
}
