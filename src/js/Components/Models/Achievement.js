import {Model} from "chomex";

import * as Const from "../../Constants";
import KanColleDate from "../Services/KanColleDate";

export default class Achievement extends Model {
    static daily() {
        let now = new KanColleDate();
        let daily = this.find("daily");
        if (now.needsUpdateForDaily(daily.lastTouched)) {
            daily.records = this.default.daily.records;
        }
        daily.lastTouched = Date.now();
        daily.save();
        return daily;
    }
    static weekly() {
        let now = new KanColleDate();
        let weekly = this.find("weekly");
        if (now.needsUpdateForWeekly(weekly.lastTouched)) {
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
