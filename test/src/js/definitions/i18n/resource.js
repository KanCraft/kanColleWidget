var KanColleWidget = KanColleWidget || {};
(function(){
    // key-value text storage
    var Resource = KanColleWidget.Resource = {
        "ja": {
            "test": "！すでのなルバーログ",
            "notification-title": "艦これウィジェット",
            "notification-createship-end-prefix": "第",
            "notification-createship-end-suffix": "建造ドックでの建造作業がまもなく完了します"
        },
        "en": {
            "test": "That's what Internationalization is!!",
            "notification-title" : "KanColle Widget",
            "notification-createship-end-prefix" : "Dock No.",
            "notification-createship-end-suffix" : " will finish building new ship."
        },
        "ar": {
            "test": "هذا هو التدويل",
            "notification-title" : "KanColle Widget",
            "notification-createship-end-prefix" : "سوف Dock",
            "notification-createship-end-suffix" : " الانتهاء من بناء سفينة جديدة."
        },
        module: function(lang){
            this.lang = lang;
        }
    };
    Resource.module.prototype = {
        'context-test': function(){
            var mess = Resource[this.lang]['notification-title'];
            mess += " " + Resource[this.lang]['test'];
            return mess;
        },
        'ntf-createship-end': function(p){
            var res = Resource[this.lang];
            var mess = res['notification-createship-end-prefix'];
            mess += p['primaryId'];
            mess += res['notification-createship-end-suffix'];
            return mess;
        }
    };
})();
