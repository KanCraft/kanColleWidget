describe("Missions (extends EventsBase)", function() {
  var missions;
  var min = 60*1000;

  beforeEach(function() {
    MyStorage.ofTest();
    missions = new Missions();
  });

  it("should manage \"deck_id\" 2,3,4.", function() {
    $.map(missions.getAll(), function(mission, i){
      expect(mission['deck_id']).toEqual(i + 2);
    });
  });

  describe("`add`", function() {
    var deckId = 3;
    var finish = Date.now() + 30*min;
    it("should register finish time by deck_id.",function() {
      missions.add(deckId, finish);
      var addedMission = missions.getAll()[deckId - 2];
      expect(addedMission.finish).toEqual(finish);
    });
  });

  describe("`check`", function() {
    var deckId2 = 2;
    var finish2 = Date.now() + 20*min;
    var deckId3 = 3;
    var finish3 = Date.now();//up to time
    it("should find nearest-end mission and up-to-time mission.",function() {
      missions.add(deckId2, finish2);
      var result = missions.check();
      expect(result.nearestEnd.getEndTime()).toEqual(finish2);
      expect(result.upToTime.length).toEqual(0);

      missions.add(deckId3, finish3);
      var result = missions.check();
      expect(result.nearestEnd.getEndTime()).toEqual(finish3);
      expect(result.upToTime.length).toEqual(1);
      expect(result.upToTime[0].isUpToTime()).toEqual(true);
    });
  });

  describe("`clear`", function() {
    var deckId2 = 2;
    var finish2 = Date.now() + 20*min;
    var deckId3 = 3;
    var finish3 = Date.now();//up to time
    var result = {};
    it("should clear mission by deck_id.",function() {
      missions.add(deckId2, finish2);
      missions.add(deckId3, finish3);
      result = missions.check();

      expect(result.nearestEnd.getEndTime()).toEqual(finish3);
      expect(result.upToTime.length).toEqual(1);
      expect(result.upToTime[0].isUpToTime()).toEqual(true);

      missions.clear(deckId3);
      result = missions.check();

      expect(result.nearestEnd.getEndTime()).toEqual(finish2);
      expect(result.upToTime.length).toEqual(0);
    });
  });

  afterEach(function() {
    MyStorage.ofTest().tearDown();
  });
});
