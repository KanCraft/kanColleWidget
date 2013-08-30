/**
 * dependency: いまのところなし
 */

/***** class definitions *****/

function PaymentAction(){/*** pay系のAPIが叩かれたときのアクション ***/}

PaymentAction.prototype.forMasterPayitem = function(){
    this._forPaymentRelatedApi();
}

PaymentAction.prototype._forPaymentRelatedApi = function(){
    _presentation("！！！注意！！！\nポイント決済など課金の関わる操作は、ウィジェットを閉じてブラウザから行って下さい", true);
}
