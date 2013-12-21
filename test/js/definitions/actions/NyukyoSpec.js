describe("NyukyoAction", function() {
  var nyukyoAction;
  var achievements;
  beforeEach(function() {
    MyStorage.ofTest();
    nyukyoAction = new KanColleWidget.NyukyoAction();
    Config.set("record-achievements", true);
    achievements = new KanColleWidget.Achievements(MyStorage.ofTest());
    achievements.update();
  });

  describe("`forStart`", function() {
    it("should increment achievements.", function() {
      expect(achievements.toJson()['daily']['contents']['nyukyo_count']).toEqual(0);
      nyukyoAction.forStart({api_ndock_id:1});
      expect(achievements.toJson()['daily']['contents']['nyukyo_count']).toEqual(1);
    });
  });

  afterEach(function() {
    MyStorage.ofTest().tearDown();
  });
});
