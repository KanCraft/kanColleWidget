/// <reference path="../../../../../../definitions/jquery.d.ts" />
/// <reference path="../checkbox.ts" />

module KCW.Pages {
    export class ReportCreateResult extends CheckboxView {
        constructor() {
            super({
                title: "開発・建造の報告窓を出す",
                configKey: "share-kousyo-result",
                description: '開発・建造の結果を報告します。自動ではツイートされません。'
                    + "<div style='border:solid thin #ddd;border-radius: 10px; padding:5px;margin-top:5px;'>"
                    + "<div><span style='font-weight: bold;'>レシピ検索</span></div>"
                    + new Template("settings/search-area").render({label:"建造", id:"search-ship-recipe",placeholder:"艦名"})
                    + new Template("settings/search-area").render({label:"開発", id:"search-item-recipe",placeholder:"装備名"})
                    + "</div>"
            });
        }
        events(): Object {
            return $.extend({}, super.events(), {
                'click #search-ship-recipe-commit': 'searchTwitter',
                'click #search-item-recipe-commit': 'searchTwitter'
            });
        }
        searchTwitter(ev: Event) {
            var $this = $(ev.currentTarget);
            var target = $this.attr('data-target');
            var query = $('#' + target).val();
            if (!query) return;
            var tag = '#kancolle_ship';
            switch (target) {
                case 'search-item-recipe':
                    tag = '#kancolle_item';
            }
            KCW.Infra.open(
                'https://twitter.com/search',
                {
                    f:'realtime',
                    q:tag + ' ' + query,
                    src:'typd'
                }
            );

        }
    }
}