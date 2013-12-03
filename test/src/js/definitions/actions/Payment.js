var KanColleWidget = KanColleWidget || {};
(function(){
    "use strict";
    var PaymentAction = KanColleWidget.PaymentAction = function(){};
    PaymentAction.prototype.forMasterPayitem = function(){
        this._forPaymentRelatedApi();
    };
    PaymentAction.prototype._forPaymentRelatedApi = function(){
        Util.ifCurrentIsKCWidgetWindow(function(){
            Util.presentation(
                "！！！注意！！！\nポイント決済など課金の関わる操作は、ウィジェットを閉じてブラウザから行って下さい",
                {sound:false,isPaymentRequired:true}
            );
        });
    };
})();
