const S = 1000, M = 60*S, H = 60*M, D = 24*H;
export default class KanColleDate {
    constructor(localDate = new Date()) {
        if (typeof localDate === "number") {
            this.local = new Date(localDate);
        } else if (localDate instanceof Date) {
            this.local = localDate;
        } else {
            throw new Error("KanColleDateのコンストラクタに非対応な引数が与えられています");
        }
        this.jst = this.constructor.convertToJST(this.local);
    }
    static convertToJST(d) {
        let copy = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
        copy.setTime(copy.getTime() + (copy.getTimezoneOffset()*60*1000) + (9*60*60*1000));
        return copy;
    }
    static isBefore5AM(anyDate) {
        return anyDate.getHours() < 5;
    }
    toLocaleString() {
        return this.jst.toLocaleString();
    }
    toPrettyString() {
        return `${this.jst.getMonth() + 1}月${this.jst.getDate()}日 ${(this.jst.getHours()).zp()}:${(this.jst.getMinutes()).zp()}`;
    }
    getKcDay() {
        return (this.jst.getDay() + 6) % 7;
    }
    // この時刻から次回更新までの時間長を文字列で返す
    timeLeftToNextUpdate() {
        if (this.jst.isBefore5AM()) {
            return `${4 - this.jst.getHours()}時間${60 - this.jst.getMinutes()}分`;
        }
        return `${(4 - this.jst.getHours())+24}時間${60 - this.jst.getMinutes()}分`;
    }
    needsUpdateForDaily(lastTouched) {
        let last = new this.constructor(lastTouched);
        // 24時間以上の時間の差がある場合は、問答無用で更新が必要
        if (this.jst.getTime() - last.jst.getTime() > 24*H) return true;
        // 日にちが同じ場合、5時前を境界線として互いに異なる領域に存在している場合は更新が必要
        if (this.jst.getDate() == last.jst.getDate()) return this.jst.isBefore5AM() != last.jst.isBefore5AM();
        // 以下、時間差は24時間以内だけど、日付に1の差がある場合となる
        // 現在時刻がすでに5時過ぎていれば、前日以前の最終更新は無効なので更新が必要
        if (!this.jst.isBefore5AM()) return true;
        // あるいは最終更新が5時前であれば、いずれにしても古いので更新が必要
        if (last.jst.isBefore5AM()) return true;
        // 以下、日付の差が1日であり、かつ現在時刻が5時より前、かつ最終更新が5時より後
        return false;
    }
    needsUpdateForWeekly(lastTouched) {
        const last = new this.constructor(lastTouched);
        // 7日以上の差がある場合は、問答無用で更新が必要
        if (this.jst.getTime() - last.jst.getTime() > 7*D) return true;

        // 最終更新が月曜日でない場合
        if (last.getKcDay() > 0) {
            // 現時刻が月曜5時以降なら更新が必要
            if (this.getKcDay() == 0 && !this.jst.isBefore5AM()) return true;
            // 現時刻が月曜より先の日付なら更新が必要
            if ((last.jst.getDate() != this.jst.getDate()) && (this.getKcDay() <= last.getKcDay())) return true;
        }

        // 最終更新が月曜日の場合
        else {

            // 最終更新時刻が5時前の場合
            if (last.jst.isBefore5AM()) {
                // 現時刻が月曜の5時以降なら更新が必要
                if (this.getKcDay() == 0 && !this.jst.isBefore5AM()) return true;
                // 現時刻が火曜以降なら更新が必要
                if (this.getKcDay() > 0) return true;
            }

            // 最終更新時刻が5時以降の場合
            else {
                // 現時刻が最終更新と日付違いの月曜かつ5時以降なら更新が必要
                if ((this.getKcDay() == 0 && !this.jst.isBefore5AM()) && (last.jst.getDate() != this.jst.getDate())) return true;
            }
        }

        return false;
    }
}
