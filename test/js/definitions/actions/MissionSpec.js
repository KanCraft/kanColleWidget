describe("MissionAction", function() {
  var missionAction;
  var achievements;
  beforeEach(function() {
    MyStorage.ofTest();
    missionAction = new KanColleWidget.MissionAction();
    Config.set("record-achievements", true);
    achievements = new KanColleWidget.Achievements(MyStorage.ofTest());
    achievements.update();
  });

  describe("`forStart`", function() {
    it("should increment achievements.", function() {
      expect(achievements.toJson()['daily']['contents']['mission_count']).toEqual(0);
      missionAction.forStart({api_mission_id:[1],api_deck_id:2});
      expect(achievements.toJson()['daily']['contents']['mission_count']).toEqual(1);
    });
  });

  afterEach(function() {
    MyStorage.ofTest().tearDown();
  });
});
