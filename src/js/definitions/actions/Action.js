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
    this.nyukyoAction = new NyukyoAction();
    this.questAction = new QuestAction();
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
Action.prototype.forPracticePreparation = function(){
    this.practiceAction.forPreparation();
}

Action.prototype.forMapStart = function(params){
    this.mapAction.forStart(params);
}
Action.prototype.forMapEnd = function(params){
    this.mapAction.forEnd(params);
}
Action.prototype.forMapPreparation = function(){
    this.mapAction.forPreparation();
};

Action.prototype.forHokyuCharge = function(params){
    this.hokyuAction.forCharge(params);
}

Action.prototype.forKaisouPowerup = function(params){
   this.kaisouAction.forPowerup(params);
}

Action.prototype.forKousyouCreateship = function(params){
    this.kousyouAction.forCreateship(params);
}

Action.prototype.forKousyouCreateshipCompleted = function(){
    this.kousyouAction.forCreateshipCompleted();
}
Action.prototype.forKousyouCreateitem = function(params){
    this.kousyouAction.forCreateitem(params);
}
Action.prototype.forKousyouCreateitemComplete = function(params){
    this.kousyouAction.forCreateitemComplete(params);
}

Action.prototype.forKousyouGetship = function(params){
    this.kousyouAction.forGetship(params);
}

Action.prototype.forNyukyoStart = function(params){
    this.nyukyoAction.forStart(params);
}
Action.prototype.forNyukyoStartCompleted = function(){
    this.nyukyoAction.forStartCompleted();
}

Action.prototype.forNyukyoSpeedchange = function(params){
    this.nyukyoAction.forSpeedchange(params);
}

Action.prototype.forNyukyoPreparation = function(params){
    this.nyukyoAction.forPreparation();
}

Action.prototype.forQuestStart = function(params){
    this.questAction.forStart(params);
}
Action.prototype.forQuestClear = function(params){
    this.questAction.forClear(params);
}
Action.prototype.forQuestStop = function(params){
    this.questAction.forStop(params);
}
