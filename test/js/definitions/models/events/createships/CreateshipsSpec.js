describe("Createships (extends EventsBase)", function() {
  var missions;
  var min = 60*1000;

  beforeEach(function() {
    MyStorage.ofTest();
    missions = new KanColleWidget.Createships();
  });

  it("should manage \"api_kdock_id\" 1,2,3,4.", function() {
    $.map(missions.getAll(), function(mission, i){
      expect(mission['api_kdock_id']).toEqual(i + 1);
    });
  });

  describe("`add`", function() {
    var kdockId = 3;
    var finish = Date.now() + 30*min;
    it("should register finish time by api_kdock_id.",function() {
      missions.add(kdockId, finish);
      var addedCreateship = missions.getAll()[kdockId - 1];
      expect(addedCreateship.finish).toEqual(finish);
    });
  });

  describe("`check`", function() {
    var kdockId2 = 2;
    var finish2 = Date.now() + 20*min;
    var kdockId3 = 3;
    var finish3 = Date.now();//up to time
    it("should find nearest-end mission and up-to-time mission.",function() {
      missions.add(kdockId2, finish2);
      var result = missions.check();
      expect(result.nearestEnd.getEndTime()).toEqual(finish2);
      expect(result.upToTime.length).toEqual(0);

      missions.add(kdockId3, finish3);
      var result = missions.check();
      expect(result.nearestEnd.getEndTime()).toEqual(finish3);
      expect(result.upToTime.length).toEqual(1);
      expect(result.upToTime[0].isUpToTime()).toEqual(true);
    });
  });

  describe("`clear`", function() {
    var kdockId2 = 2;
    var finish2 = Date.now() + 20*min;
    var kdockId3 = 3;
    var finish3 = Date.now();//up to time
    var result = {};
    it("should clear mission by api_kdock_id.",function() {
      missions.add(kdockId2, finish2);
      missions.add(kdockId3, finish3);
      result = missions.check();

      expect(result.nearestEnd.getEndTime()).toEqual(finish3);
      expect(result.upToTime.length).toEqual(1);
      expect(result.upToTime[0].isUpToTime()).toEqual(true);

      missions.clear(kdockId3);
      result = missions.check();

      expect(result.nearestEnd.getEndTime()).toEqual(finish2);
      expect(result.upToTime.length).toEqual(0);
    });
  });

  afterEach(function() {
    MyStorage.ofTest().tearDown();
  });
});
