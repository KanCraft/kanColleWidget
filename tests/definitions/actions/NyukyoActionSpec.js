describe("NyukyoAction", function() {

    var nyukyoAction;

    beforeEach(function() {
        nyukyoAction = new NyukyoAction();
        MyStorage.ofTest();
    });

    describe("forStart", function(){
        it("should increment Achievements.Nyukyo count", function() {
            var achievements = new KanColleWidget.Achievements(MyStorage.ofTest());
            achievements.update();

            var params = Fixture.Api.Nyukyo.Start;
            nyukyoAction.forStart(params);

            var achievement = achievements.update().toJson();
            expect(achievement.daily.contents.nyukyo_count).toBe(1);
        });
    });

    afterEach(function() {
        MyStorage.ofTest().tearDown();
    });
});
