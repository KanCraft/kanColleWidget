/***** class definitions *****/

function Dispatcher(data){/** パースの結果をラップします **/
    this.keyword = null;
    this.params  = null;
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
    switch(this.keyword){
        case 'api_req_mission/start':
            this.action.forMissionStart(this.params);
            break;
        case 'api_req_mission/result':
            this.action.forMissionResult(this.params);
            break;
        case 'api_get_master/payitem':
            this.action.forMasterPayitem(this.params);
        default:
            _log('%c[ACTION]%c Do Nothing for this request',true);
            _log(this);
    }
}
