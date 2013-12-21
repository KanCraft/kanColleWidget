describe("Quests", function() {
  var quests;

  beforeEach(function() {
    quests = new KanColleWidget.Quests();
  });

  describe("`getAll`", function() {
    it("should give all quests defined today.", function() {
      var f = (16 < Object.keys(quests.getAll().map).length);
      expect(f).toBe(true);
    });
  });
});
