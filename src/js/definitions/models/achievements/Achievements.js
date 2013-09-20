/**
 * dependency: MyStorage
 */

/***** class definitions *****/
function Achievements(){/** localStorageにあるachievementsにアクセスするクラス **/}

// extend
Achievements.prototype = Object.create(MyStorage.prototype);
Achievements.prototype.constructor = Achievements;

/* this */Achievements.prototype.update = function(force, target){
    if(typeof force == 'undefined') force = false;
    if(typeof target == 'undefined') target = 'all';
    var initial_achievements = {
        'daily' : {
            'lastUpdated' : Util.getNearestDailyAchievementResetTime(),
            'contents' : {
                mission_count   : 0,
                practice_count  : 0,
                map_count       : 0,
                hokyu_count     : 0,
                kaisou_count    : 0,
                createitem_count: 0,
                createship_count: 0
            }
        },
        'weekly' : {
            'lastUpdated' : Util.getNearestWeeklyAchievementResetTime(),
            'contents' : {
                mission_count   : 0,
                practice_count  : 0,
                map_count       : 0,
                hokyu_count     : 0,
                kaisou_count    : 0,
                createitem_count: 0,
                createship_count: 0
            }
        }
    };
    var achievements_json = this.get('achievements') || initial_achievements;
    if(achievements_json.daily.lastUpdated < Util.getNearestDailyAchievementResetTime()){
        achievements_json.daily.lastUpdated = (new Date()).getTime();
        achievements_json.daily.contents = initial_achievements.daily.contents;
    }
    if(achievements_json.weekly.lastUpdated < Util.getNearestWeeklyAchievementResetTime()){
        achievements_json.weekly.lastUpdated = (new Date()).getTime();
        achievements_json.weekly.contents = initial_achievements.weekly.contents;
    }
    if(force == true){
        if(target == 'all'){
            achievements_json = initial_achievements;
        }else if(target == 'daily'){
            achievements_json.daily = initial_achievements.daily;
        }else if(target == 'weekly'){
            achievements_json.weekly = initial_achievements.weekly;
        }
    }
    this.set('achievements', achievements_json);
    return this;
}

/* this */Achievements.prototype.incrementMissionCount = function(){
    this._incrementByKey('mission_count');
}

/* this */Achievements.prototype.incrementPracticeCount = function(){
    this._incrementByKey('practice_count');
}

/* this */Achievements.prototype.incrementMapCount = function(){
    return this._incrementByKey('map_count');
}

/* this */Achievements.prototype.incrementHokyuCount = function(){
    return this._incrementByKey('hokyu_count');
}

/* this */Achievements.prototype.incrementKaisouCount = function(){
    return this._incrementByKey('kaisou_count');
}

/* this */Achievements.prototype.incrementCreateshipCount = function(){
    return this._incrementByKey('createship_count');
}

/* this */Achievements.prototype.incrementCreateitemCount = function(){
    return this._incrementByKey('createitem_count');
}

/* this */Achievements.prototype._incrementByKey = function(key){
    var achievement_json = this.get('achievements');
    var daily_count = achievement_json.daily.contents[key] || 0;
    achievement_json.daily.contents[key] = parseInt(daily_count) + 1;
    var weekly_count = achievement_json.weekly.contents[key] || 0;
    achievement_json.weekly.contents[key] = parseInt(weekly_count) + 1;
    this.set('achievements',achievement_json);
    return this;
}

/* dict */Achievements.prototype.toJson = function(){
    return this.get('achievements');
}

