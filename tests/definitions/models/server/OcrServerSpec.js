describe("OcrServer", function() {
  var data, flag;
  var ocrServer;

  beforeEach(function() {
    data = {};
    flag = false;
    ocrServer = new Ocr();
  });
 
  it("can OCR base64-encoded imageURI.", function() {
    var imgURI = Fixture.base64img.sample000;

    runs(function(){
      ocrServer.send(imgURI, function(resdata){
        data = resdata;
        flag = true;
      });
    });
    waitsFor(function(){
      return flag;
    }, "in 2 seconds", 2000);
  });

  runs(function() {
    expect(data.message).toBe('DONE');
    expect(data.status).toBe(200);
    expect(data.result).toBe('00:59:43');
  });
});
