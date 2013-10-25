describe("OcrServer", function() {

  var ocrServer;

  beforeEach(function() {
    ocrServer = new Ocr();
  });
 
  it("should be true.", function() {
    for (var i in ocrServer) {
        console.log(i, ocrServer[i]);
    }
    console.log(typeof ocrServer.send);
    expect(true).toBe(true);
  });
});
