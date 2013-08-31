/**
 * dependency: actions/Mission
 */

/***** class definitions *****/

function Action(){/** APIが叩かれるときのアクション **/
    this.missionAction = new MissionAction();
    this.paymentAction = new PaymentAction();
}

//----- mission start -----
Action.prototype.forMissionStart = function(params){
    this.missionAction.forStart(params);
}

//----- mission result -----
Action.prototype.forMissionResult = function(params){
    this.missionAction.forResult(params);
}

//----- get master payitem -----
Action.prototype.forMasterPayitem = function(){
    this.paymentAction.forMasterPayitem();
}
