describe("Memo", function() {
  var memo;
  beforeEach(function() {
    MyStorage.ofTest();
    memo = new KanColleWidget.Memo();
  });

  it("can save memo.", function() {
    expect(memo.toJson().value).toBe("");
    var val = "This is sample value.\nです";
    memo.save(val);
    expect(memo.toJson().value).toBe(val);
  });

  afterEach(function(){
    MyStorage.ofTest().tearDown();
  });
});
