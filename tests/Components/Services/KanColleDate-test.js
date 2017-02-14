jest.unmock("../../../src/js/entrypoints/global-pollution.js");
import {init} from "../../../src/js/entrypoints/global-pollution.js";
init(window);
jest.unmock("../../../src/js/Components/Services/KanColleDate");
import KanColleDate from "../../../src/js/Components/Services/KanColleDate";

// TODO: テストもうちょいちゃんとする
describe("KanColleDate", () => {
    describe("constructor", () => {
        it("JSTをあらわすjstというプロパティをつくる", () => {
            const x = new Date("Wed Feb 08 2017 20:00:00 GMT+0100 (CET)");
            const d = new KanColleDate(x);
            expect(d.jst.toDateString()).toBe("Thu Feb 09 2017");
        });
    });
    describe("needsUpdateForDaily", () => {
        it("5時を基準にアップデートが必要かどうかを返す", () => {
            const x = new Date("Wed Feb 08 2017 12:00:00 GMT+0100 (CET)");
            const d = new KanColleDate(x);
            let lastTouched = (new Date("Wed Feb 08 2017 04:00:00 GMT+0100 (CET)")).getTime();
            expect(d.needsUpdateForDaily(lastTouched)).toBe(false);
            lastTouched = (new Date("Tue Feb 07 2017 19:00:00 GMT+0100 (CET)")).getTime();
            expect(d.needsUpdateForDaily(lastTouched)).toBe(true);
        });
        it("ちょうど1ヶ月開いてしまって日にちが同じであってもちゃんと動く", () => {
            const x = new Date("Wed Feb 08 2017 12:00:00 GMT+0100 (CET)");
            const d = new KanColleDate(x);
            let lastTouched = (new Date("Sun Jan 08 2017 00:00:00 GMT+01:00 (CET)")).getTime();
            expect(d.needsUpdateForDaily(lastTouched)).toBe(true);
        });
        it("月をまたいでしまって日にちの大小関係が逆転してもちゃんと動く", () => {
            const y = new Date("Wed Feb 08 2017 01:00:00 GMT+0100 (CET)");
            const d = new KanColleDate(y);
            let lastTouched = (new Date("Thu Jan 12 2017 00:00:00 GMT+01:00 (CET)")).getTime();
            expect(d.needsUpdateForDaily(lastTouched)).toBe(true);
        });
    });
    describe("needsUpdateForWeekly", () => {
        it("月曜5時を基準にアップデートが必要かどうかを返す", () => {
            const x = new Date("Tue Feb 07 2017 23:00:00 GMT+0100 (CET)");
            const d = new KanColleDate(x);
            const lastTouched = (new Date("Tue, 07 Feb 2017 10:00:00 CET")).getTime();
            expect(d.needsUpdateForWeekly(lastTouched)).toBe(false);
        });
        it("前：先週の月曜7時、今：月曜6時というケースで正しくアップデートされる", () => {
            const x = new Date("Mon Feb 06 2017 06:00:00 GMT+09:00");
            const d = new KanColleDate(x);
            const lastTouched = (new Date("Mon Jan 30 2017 07:00:00 GMT+09:00")).getTime();
            expect(d.needsUpdateForWeekly(lastTouched)).toBe(true);
        });
    });
});
