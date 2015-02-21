var KanColleWidget = KanColleWidget || {};
(function(){
    "use strict";
    var Action = KanColleWidget.Action = function(){
        this.missionAction = new KanColleWidget.MissionAction();
        this.paymentAction = new KanColleWidget.PaymentAction();
        this.practiceAction = new KanColleWidget.PracticeAction();
        this.mapAction = new KanColleWidget.MapAction();
        this.hokyuAction = new KanColleWidget.HokyuAction();
        this.kaisouAction = new KanColleWidget.KaisouAction();
        this.kousyouAction = new KanColleWidget.KousyouAction();
        this.nyukyoAction = new KanColleWidget.NyukyoAction();
        this.questAction = new KanColleWidget.QuestAction();
        this.sortieBattleAction = new KanColleWidget.SortieBattleAction();
    };
    Action.prototype.forMissionStart = function(params){
        this.missionAction.forStart(params);
    };
    Action.prototype.forMissionResult = function(params){
        this.missionAction.forResult(params);
    };
    Action.prototype.forMissionPreparation = function(){
        this.missionAction.forPreparation();
    };
    Action.prototype.forMasterPayitem = function(){
        this.paymentAction.forMasterPayitem();
    };
    Action.prototype.forPracticeBattle = function(params){
        this.practiceAction.forBattle(params);
    };
    Action.prototype.forPracticePreparation = function(){
        this.practiceAction.forPreparation();
    };
    Action.prototype.forMapStart = function(params){
        this.mapAction.forStart(params);
    };
    Action.prototype.forMapEnd = function(params){
        this.mapAction.forEnd(params);
    };
    Action.prototype.forMapPreparation = function(){
        this.mapAction.forPreparation();
    };
    Action.prototype.forHokyuCharge = function(params){
        this.hokyuAction.forCharge(params);
    };
    Action.prototype.forKaisouPowerup = function(params){
       this.kaisouAction.forPowerup(params);
    };
    Action.prototype.forKousyouCreateship = function(params){
        this.kousyouAction.forCreateship(params);
    };
    Action.prototype.forKousyouCreateshipCompleted = function(){
        this.kousyouAction.forCreateshipCompleted();
    };
    Action.prototype.forKousyouCreateitem = function(params){
        this.kousyouAction.forCreateitem(params);
    };
    Action.prototype.forKousyouCreateitemComplete = function(params){
        this.kousyouAction.forCreateitemComplete(params);
    };
    Action.prototype.forKousyouDestroyitem = function(params){
        this.kousyouAction.forDestroyitem(params);
    };
    Action.prototype.forKousyouGetship = function(params){
        this.kousyouAction.forGetship(params);
    };
    Action.prototype.forKousyouPreparation = function(){
        this.kousyouAction.forPreparation();
    };
    Action.prototype.forKousyouRemodelPreparation = function(){
        this.kousyouAction.forRemodelPreparation();
    };
    Action.prototype.forKousyouRemodelStart = function(){
        this.kousyouAction.forRemodelStart();
    };
    Action.prototype.forNyukyoStart = function(params){
        this.nyukyoAction.forStart(params);
    };
    Action.prototype.forNyukyoStartCompleted = function(){
        this.nyukyoAction.forStartCompleted();
    };
    Action.prototype.forNyukyoSpeedchange = function(params){
        this.nyukyoAction.forSpeedchange(params);
    };
    Action.prototype.forNyukyoPreparation = function(params){
        this.nyukyoAction.forPreparation();
    };
    Action.prototype.forQuestStart = function(params){
        this.questAction.forStart(params);
    };
    Action.prototype.forQuestClear = function(params){
        this.questAction.forClear(params);
    };
    Action.prototype.forQuestStop = function(params){
        this.questAction.forStop(params);
    };
    Action.prototype.forSortieBattle = function(){
        this.sortieBattleAction.forBattle();
    };
    Action.prototype.forSortieBattleResult = function(){
        this.sortieBattleAction.forResult();
    };
})();
