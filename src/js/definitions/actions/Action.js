/**
 * dependency: actions/Mission
 */

/***** class definitions *****/

function Action(){/** APIが叩かれるときのアクション **/
    this.missionAction = new MissionAction();
    this.paymentAction = new PaymentAction();
    this.practiceAction = new PracticeAction();
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

//----- api_req_practice/battle -----
Action.prototype.forPracticeBattle = function(params){
    this.practiceAction.forBattle(params);
}
