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
            'lastUpdated' : this.getNearestDailyAchievementResetTime(),
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
            'lastUpdated' : this.getNearestWeeklyAchievementResetTime(),
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

    if(achievements_json.daily.lastUpdated < this.getNearestDailyAchievementResetTime()){
        achievements_json.daily.lastUpdated = Date.now();
        achievements_json.daily.contents = initial_achievements.daily.contents;
    }
    if(achievements_json.weekly.lastUpdated < this.getNearestWeeklyAchievementResetTime()){
        achievements_json.weekly.lastUpdated = Date.now();
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

/* epoch: msec */Achievements.prototype.getNearestDailyAchievementResetTime = function(){
    var now = new Date();
    var diffHours = (now.getHours() + 19) % 24;
    var _1hourMsec = 1*60*60*1000;
    var last5am = new Date(now - diffHours * _1hourMsec);
    return (new Date(1900 + last5am.getYear(), last5am.getMonth(), last5am.getDate(), 5, 0)).getTime();
}
/* epoch: msec */Achievements.prototype.getNearestWeeklyAchievementResetTime = function(){
    var now = new Date();
    var diffDays = (now.getDay() + 6) % 7;
    var _1dayMsec = 1*24*60*60*1000;
    var lastMonday = new Date(now - diffDays * _1dayMsec);
    return (new Date(1900 + lastMonday.getYear(), lastMonday.getMonth(), lastMonday.getDate(), 5, 0)).getTime();
}
