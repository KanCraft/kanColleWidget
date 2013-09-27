/***** class definitions *****/

function Dispatcher(data){/** パースの結果をラップします **/
    this.keyword = null;
    this.params  = null;
    this.rawData = data;
    if(data.url.match(/\/kcsapi\//)){
        this.keyword = data.url.match(/\/kcsapi\/(.*)/)[1];
        if(data.method == 'POST'){
            this.params = data.requestBody.formData;
        }
    }
}
/* this: Dispatcher */Dispatcher.prototype.bind = function(_action/* Action */){
    this.action = _action;
    return this;
}
/* void (でいいのか？) */Dispatcher.prototype.execute = function(){
    //Util.system.log(this);
    switch(this.keyword){
        case 'api_req_mission/start':
            this.action.forMissionStart(this.params);
            break;
        case 'api_req_mission/result':
            this.action.forMissionResult(this.params);
            break;
        case 'api_get_master/payitem':
            this.action.forMasterPayitem(this.params);
            break;
        case 'api_req_practice/battle':
            this.action.forPracticeBattle(this.params);
            break;
        case 'api_req_map/start':
            this.action.forMapStart(this.params);
            break;
        case 'api_req_hokyu/charge':
            this.action.forHokyuCharge(this.params);
            break;
        case 'api_req_kaisou/powerup':
            this.action.forKaisouPowerup(this.params);
            break;
        case 'api_req_kousyou/createship':
            this.action.forKousyouCreateship(this.params);
            break;
        case 'api_req_kousyou/createitem':
            this.action.forKousyouCreateitem(this.params);
            break;
        case 'api_req_kousyou/getship':
            this.action.forKousyouGetship(this.params);
            break;
        case 'api_req_nyukyo/start':
            this.action.forNyukyoStart(this.params);
            break;
        case 'api_req_nyukyo/speedchange':
            this.action.forNyukyoSpeedchange(this.params);
            break;
        default:
            //_log('%c[ACTION]%c Do Nothing for this request',true);
    }
}

function CompleteDispatcher(){/** webRequest.onCompletedの結果をラップします **/
    this.recordCount = 6;
    this.requestSequence = new Array(this.recordCount);
}
CompleteDispatcher.prototype.bind = function(_action){
    this.action = _action;
    return this;
}
CompleteDispatcher.prototype.eat = function(detail){
    if(detail.url.match('kcsapi/api')){
        var path = detail.url.match(/kcsapi\/(.*)$/)[1];
        this.requestSequence.unshift(path);
    }else{
        this.requestSequence.unshift(undefined);
    }
    this.requestSequence = this.requestSequence.slice(0,this.recordCount);
    return this;
}
CompleteDispatcher.prototype.execute = function(){
    // TODO : リファクタ -> 判定をどっかに押し込める
    // TODO : 条件厳しくする -> https://gist.github.com/otiai10/6724596
    if(
        this.requestSequence[3] == 'api_req_nyukyo/start'
    ){
        this.action.forNyukyoStartCompleted();
    }else if(
        this.requestSequence[5] == 'api_req_kousyou/createship'
    ){
        this.action.forKousyouCreateshipCompleted();
    }
}
