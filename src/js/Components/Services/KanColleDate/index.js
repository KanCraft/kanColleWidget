
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
    // この時刻から次回更新までの時間長を文字列で返す
    timeLeftToNextUpdate() {
        if (this.jst.isBefore5AM()) {
            return `${4 - this.jst.getHours()}時間${60 - this.jst.getMinutes()}分`;
        }
        return `${(4 - this.jst.getHours())+24}時間${60 - this.jst.getMinutes()}分`;
    }
    // FIXME: これもっとエレガントにできませんか
    needsUpdateForDaily(lastTouched) {
        let last = new this.constructor(lastTouched);
        // 日付が同じ場合、5時前を境界線として互いに異なる領域に存在している場合は更新が必要
        if (last.jst.getDate() == this.jst.getDate())
            return this.constructor.isBefore5AM(last.jst) != this.constructor.isBefore5AM(this.jst);
        // 2日以上の日付の差がある場合は、問答無用で更新が必要
        if (this.jst.getDate() - last.jst.getDate() > 1) return true;
        // 以下、日付の差が1日
        // 現在時刻がすでに5時過ぎていれば、前日以前の最終更新は無効なので更新が必要
        if (!this.jst.isBefore5AM()) return true;
        // あるいは最終更新が5時前であれば、いずれにしても古いので更新が必要
        if (last.jst.isBefore5AM()) return true;
        // 以下、日付の差が1日であり、かつ現在時刻が5時より前、かつ最終更新が5時より後
        return false;
    }
    // TODO: 超だるいロジックをここに書く
    needsUpdateForWeekly(/* lastTouched */) {
        return false;
    }
}
