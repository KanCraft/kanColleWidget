describe("Nyukyos (extends EventsBase)", function() {
  var nyukyos;
  var min = 60*1000;

  beforeEach(function() {
    MyStorage.ofTest();
    nyukyos = new KanColleWidget.Nyukyos();
  });

  it("should manage \"api_ndock_id\" 1,2,3,4.", function() {
    $.map(nyukyos.getAll(), function(nyukyo, i){
      expect(nyukyo['api_ndock_id']).toEqual(i + 1);
    });
  });

  describe("`add`", function() {
    var ndockId = 3;
    var finish = Date.now() + 30*min;
    it("should register finish time by api_ndock_id.",function() {
      nyukyos.add(ndockId, finish);
      var addedMission = nyukyos.getAll()[ndockId - 1];
      expect(addedMission.finish).toEqual(finish);
    });
  });

  describe("`check`", function() {
    var ndockId2 = 2;
    var finish2 = Date.now() + 20*min;
    var ndockId3 = 3;
    var finish3 = Date.now();//up to time
    it("should find nearest-end nyukyo and up-to-time nyukyo.",function() {
      nyukyos.add(ndockId2, finish2);
      var result = nyukyos.check();
      expect(result.nearestEnd.getEndTime()).toEqual(finish2);
      expect(result.upToTime.length).toEqual(0);

      nyukyos.add(ndockId3, finish3);
      var result = nyukyos.check();
      expect(result.nearestEnd.getEndTime()).toEqual(finish3);
      expect(result.upToTime.length).toEqual(1);
      expect(result.upToTime[0].isUpToTime()).toEqual(true);
    });
  });

  describe("`clear`", function() {
    var ndockId2 = 2;
    var finish2 = Date.now() + 20*min;
    var ndockId3 = 3;
    var finish3 = Date.now();//up to time
    var result = {};
    it("should clear nyukyo by api_ndock_id.",function() {
      nyukyos.add(ndockId2, finish2);
      nyukyos.add(ndockId3, finish3);
      result = nyukyos.check();

      expect(result.nearestEnd.getEndTime()).toEqual(finish3);
      expect(result.upToTime.length).toEqual(1);
      expect(result.upToTime[0].isUpToTime()).toEqual(true);

      nyukyos.clear(ndockId3);
      result = nyukyos.check();

      expect(result.nearestEnd.getEndTime()).toEqual(finish2);
      expect(result.upToTime.length).toEqual(0);
    });
  });

  afterEach(function() {
    MyStorage.ofTest().tearDown();
  });
});
