describe("PreChecker (static module)", function() {
  var preChecker;
  beforeEach(function() {
    MyStorage.ofTest();
    preChecker = KanColleWidget.PreChecker;
  });

  describe("`{quest category}`.`check`", function(){
    it("should give the first of not-embarked quests.", function() {
      var notEmbarked = preChecker.mapQuest.check();
      expect(notEmbarked.id).toEqual(201);
      expect(notEmbarked.state).toEqual(KanColleWidget.Quests.state.YET);
    });
  });

  afterEach(function(){
    MyStorage.ofTest().tearDown();
  });
});
