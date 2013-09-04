/**
 * dependency: MyStorage
 */

/***** class definitions *****/
function Createships(){/** localStorageにあるcreateshipsにアクセスするクラス **/}

// extend
Createships.prototype = Object.create(MyStorage.prototype);
Createships.prototype.constructor = Createships;

/* saved: Dict */Createships.prototype.add = function(api_kdock_id, finishTime){
    if(this.get('createships') == undefined) {
        var initialValue = [{api_kdock_id: 1, finish: null}, {api_kdock_id: 2, finish: null}, {api_kdock_id: 3, finish: null}, {api_kdock_id: 4, finish: null}];
        this.set('createships', initialValue);
    }
    var createships = this.get('createships');
    for(var i = 0;i < createships.length;i++) {
        if(createships[i].api_kdock_id == api_kdock_id)
            createships[i].finish = finishTime;
    }
    this.set('createships', createships);
}

/* success: Boolean */Createships.prototype.clear = function(api_kdock_id){
    if(this.get('createships') == undefined) return;
    var createships = this.get('createships');
    for(var i = 0;i < createships.length;i++) {
        if(createships[i].api_kdock_id == api_kdock_id)
            createships[i].finish = null;
    }
    this.set('createships', createships);
}

/* dict{nearestEndCreateship, upToTimeCreateship} */Createships.prototype.check = function(){
    var result = {
        nearestEnd : null,
        upToTime   : []
    };
    if(this.get('createships') == undefined) return result;
    var createships = this.get('createships');
    for(var i= 0,len=createships.length; i<len;i++){
        var cjson = createships[i];
        if(cjson.finish == null) continue;
        var c = new SoloCreateship(cjson);
        if(c.isUpToTime()){
            this.clear(c.api_kdock_id);
            result.upToTime.push(c);
        }
        if(result.nearestEnd == null){
            result.nearestEnd = c;
        }else if(c.getEndTime() < result.nearestEnd.getEndTime()){
            result.nearestEnd = c;
        }else{
            // do nothing
        }
    }
    return result;
}
