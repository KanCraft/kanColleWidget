var KanColleWidget = KanColleWidget;
var Fixture = Fixture;
describe("OcrServer", function() {
    var ocrServer,
        data,
        flag;

    beforeEach(function() {
        data = {};
        flag = false;
        ocrServer = KanColleWidget.Ocr;
    });

    it("should OCR from imageURI.", function() {
        var imageURI = Fixture.ImageURI['01:24:56'];
        runs(function(){
            ocrServer.send(imageURI, function(resdata){
                data = resdata;
                flag = true;
            });
            waitsFor(function(){
                return flag;
            }, "in 2 seconds", 2000);
        });
    });
    runs(function() {
        expect(data.message).toBe('DONE');
        expect(data.status).toBe(200);
        expect(data.result).toBe('01:24:56');
    });
});