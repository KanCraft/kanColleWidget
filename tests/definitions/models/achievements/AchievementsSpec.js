describe("Achievements", function() {

    var achievements;

    beforeEach(function() {
        achievements = new KanColleWidget.Achievements(MyStorage.ofTest());
    });

    describe("toJson", function() {
        it("should supply key-value object.", function() {
            var achievementsJSON = achievements.update().toJson();
            expect(typeof achievementsJSON).toBe('object');
        });
    });

    describe("incrementMissionCount", function() {
        it("should increment Mission Achievement Count.", function() {
            var old = achievements.update().toJson();
            achievements.update().incrementMissionCount();
            var incremented = achievements.update().toJson();
            expect(
                incremented.daily.contents.mission_count
            ).toBe(
                old.daily.contents.mission_count + 1
            );
            expect(
                incremented.weekly.contents.mission_count
            ).toBe(
                old.weekly.contents.mission_count + 1
            );
        });
    });

    describe("incrementNyukyoCount", function() {
        it("should increment Nyukyo Achievement Count.", function() {
            var old = achievements.update().toJson();
            achievements.update().incrementNyukyoCount();
            var incremented = achievements.update().toJson();
            expect(
                incremented.daily.contents.nyukyo_count
            ).toBe(
                old.daily.contents.nyukyo_count + 1
            );
            expect(
                incremented.weekly.contents.nyukyo_count
            ).toBe(
                old.weekly.contents.nyukyo_count + 1
            );
        });

    });

    afterEach(function() {
        MyStorage.ofTest().tearDown();
    });
});
