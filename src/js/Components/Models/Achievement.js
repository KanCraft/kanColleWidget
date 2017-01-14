import {Model} from "chomex";

import * as Const from "../../Constants";

export default class Achievement extends Model {
    static needsUpdateForDaily(lastTouched, _now = new Date()) {
        let last = (new Date(lastTouched)).toJST();
        let now  = _now.toJST();
        // 日付が同じ場合、5時前を境界線として互いに異なる領域に存在している場合は更新が必要
        if (last.getDate() == now.getDate()) return last.isBefore5AM() != now.isBefore5AM();
        // 2日以上の日付の差がある場合は、問答無用で更新が必要
        if (now.getDate() - last.getDate() > 1) return true;
        // 以下、日付の差が1日
        // 現在時刻がすでに5時過ぎていれば、前日以前の最終更新は無効なので更新が必要
        if (!now.isBefore5AM()) return true;
        // あるいは最終更新が5時前であれば、いずれにしても古いので更新が必要
        if (last.isBefore5AM()) return true;
        // 以下、日付の差が1日であり、かつ現在時刻が5時より前、かつ最終更新が5時より後
        return false;
    }
    static daily() {
        let daily = this.find("daily");
        if (this.needsUpdateForDaily(daily.lastTouched)) {
            daily.records = this.default.daily.records;
        }
        daily.lastTouched = Date.now();
        daily.save();
        return daily;
    }
    // TODO: 超だるいロジックをここに書く...
    static needsUpdateForWeekly() {
        return false;
    }
    static weekly() {
        let weekly = this.find("weekly");
        if (this.needsUpdateForWeekly(weekly.lastTouched)) {
            weekly.records = this.default.weekly.records;
        }
        weekly.lastTouched = Date.now();
        weekly.save();
        return weekly;
    }
    /**
     * dailyもweeklyもincrementするやつ
    **/
    static increment(key) {
        let daily = this.daily();
        daily.increment(key);
        let weekly = this.weekly();
        weekly.increment(key);
    }
    increment(key) {
        this.records[key].count++;
        this.lastTouched = Date.now();
        this.save();
    }
}

// FIXME: 順番を担保するためにArrayにしたほうがいいかも？
Achievement.default = {
    "daily": {
        "lastTouched": Date.now(),
        "records": {
            [Const.MISSION]:     {count:0, name:"遠征"},
            [Const.PRACTICE]:    {count:0, name:"演習"},
            [Const.SORTIE]:      {count:0, name:"出撃"},
            [Const.SUPPLY]:      {count:0, name:"補給"},
            [Const.RECOVERY]:    {count:0, name:"修復"},
            [Const.CUSTOMIZE]:   {count:0, name:"近改"},
            [Const.REMODEL]:     {count:0, name:"改工"},
            [Const.CREATEITEM]:  {count:0, name:"開発"},
            [Const.CREATESHIP]:  {count:0, name:"建造"},
            [Const.DESTROYITEM]: {count:0, name:"廃棄"},
        },
    },
    "weekly": {
        "lastTouched": Date.now(),
        "records": {
            [Const.MISSION]:     {count:0, name:"遠征"},
            [Const.PRACTICE]:    {count:0, name:"演習"},
            [Const.SORTIE]:      {count:0, name:"出撃"},
            [Const.SUPPLY]:      {count:0, name:"補給"},
            [Const.RECOVERY]:    {count:0, name:"修復"},
            [Const.CUSTOMIZE]:   {count:0, name:"近改"},
            [Const.REMODEL]:     {count:0, name:"改工"},
            [Const.CREATEITEM]:  {count:0, name:"開発"},
            [Const.CREATESHIP]:  {count:0, name:"建造"},
            [Const.DESTROYITEM]: {count:0, name:"廃棄"},
        },
    }
};
