describe("KousyouAction", function() {
  var createshipAction;
  var achievements;
  beforeEach(function() {
    MyStorage.ofTest();
    createshipAction = new KanColleWidget.KousyouAction();
    Config.set("record-achievements", true);
    achievements = new KanColleWidget.Achievements(MyStorage.ofTest());
    achievements.update();
  });

  describe("`forCreateship`", function() {
    it("should increment achievements.", function() {
      expect(achievements.toJson()['daily']['contents']['createship_count']).toEqual(0);
      createshipAction.forCreateship({api_kdock_id:1});
      expect(achievements.toJson()['daily']['contents']['createship_count']).toEqual(1);
    });
  });

  afterEach(function() {
    MyStorage.ofTest().tearDown();
  });
});
