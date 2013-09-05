/**
 * dependency: actions/Mission
 */

/***** class definitions *****/

function Action(){/** APIが叩かれるときのアクション **/
    this.missionAction = new MissionAction();
    this.paymentAction = new PaymentAction();
    this.practiceAction = new PracticeAction();
    this.mapAction = new MapAction();
    this.hokyuAction = new HokyuAction();
    this.kaisouAction = new KaisouAction();
    this.kousyouAction = new KousyouAction();
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

Action.prototype.forMapStart = function(params){
    this.mapAction.forStart(params);
}

Action.prototype.forHokyuCharge = function(params){
    this.hokyuAction.forCharge(params);
}

Action.prototype.forKaisouPowerup = function(params){
   this.kaisouAction.forPowerup(params);
}

Action.prototype.forKousyouCreateship = function(params){
    this.kousyouAction.forCreateship(params);
}

Action.prototype.forKousyouGetship = function(params){
    this.kousyouAction.forGetship(params);
}
