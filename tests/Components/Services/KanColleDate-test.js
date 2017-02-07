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
    });
    describe("needsUpdateForWeekly", () => {
        it("月曜5時を基準にアップデートが必要かどうかを返す", () => {
            const x = new Date("Tue Feb 07 2017 23:00:00 GMT+0100 (CET)");
            const d = new KanColleDate(x);
            const lastTouched = (new Date("Tue, 07 Feb 2017 10:00:00 CET")).getTime();
            expect(d.needsUpdateForWeekly(lastTouched)).toBe(false);
        });
    });
});
