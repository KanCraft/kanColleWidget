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
    _log(this);
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
        case 'api_req_kousyou/getship':
            this.action.forKousyouGetship(this.params);
            break;
        default:
            //_log('%c[ACTION]%c Do Nothing for this request',true);
    }
}
