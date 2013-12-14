describe("Util", function() {
  describe("`getLoaderBackgroundImage`", function() {
    it("should provide existing img file.", function() {
      var totalLength = Constants.ocr.loader.images.normal.length;
      var allFired = false;
      var resultsStack = [];
      for (var i=0;i<totalLength;i++) {
        var url = Util.getLoaderBackgroundImage(i).url;
        $.ajax({
          type: 'GET', url: url,
          success: function(res, message, xhr) {
            if (xhr.status === 200) return resultsStack.push(true);
            return resultsStack.push(false);
          },
          error: function(a, b, c) {
            return resultsStack.push(false);
          }
        });
      }
      var checkResults = function(){
        if (resultsStack.length !== totalLength) {
          // listen again
          return setTimeout(checkResults, 0);
        }
        $.map(resultsStack, function(stackedResult, i){
          if (stackedResult === false) {
            return expect(i).toBe(true); 
          }
        });
        expect(resultsStack.length).toBe(totalLength);
      };
      // listen
      setTimeout(checkResults,0);
    });
  });
});
