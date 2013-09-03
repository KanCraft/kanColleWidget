/**
 * dependency: MyStorage
 */

/***** class definitions *****/
function Achievements(){/** localStorageにあるachievementsにアクセスするクラス **/}

// extend
Achievements.prototype = Object.create(MyStorage.prototype);
Achievements.prototype.constructor = Achievements;

/* this */Achievements.prototype.update = function(force){
    if(typeof force == 'undefined') force = false;
    var initial_achievements = {
        'daily' : {
            'lastUpdated' : getNearestDailyAchievementResetTime(),
            'contents' : {}
        },
        'weekly' : {
            'lastUpdated' : getNearestWeeklyAchievementResetTime(),
            'contents' : {}
        }
    };
    var achievements_json = this.get('achievements') || initial_achievements;
    if(achievements_json.daily.lastUpdated < getNearestDailyAchievementResetTime()){
        achievements_json.daily.lastUpdated = (new Date()).getTime();
        achievements_json.daily.contents = {};
    }
    if(achievements_json.weekly.lastUpdated < getNearestWeeklyAchievementResetTime()){
        achievements_json.weekly.lastUpdated = (new Date()).getTime();
        achievements_json.weekly.contents = {};
    }
    if(force == true){
        achievements_json = initial_achievements;
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

