(function() {
  var jasmineEnv = jasmine.getEnv();
  jasmineEnv.updateInterval = 1000;

  var htmlReporter = new jasmine.HtmlReporter(null, effect);

  jasmineEnv.addReporter(htmlReporter);

  jasmineEnv.specFilter = function(spec) {
    return htmlReporter.specFilter(spec);
  };

  var currentWindowOnload = window.onload;

  window.onload = function() {
    if (currentWindowOnload) {
      currentWindowOnload();
    }
    execJasmine();
  };

  function execJasmine() {
    jasmineEnv.execute();
  }

  function effect() {
    $('div.results').prepend(
      $('<div>').css({float:'right'}).append(
        $('<img>').attr({src:'zkms.png'}),
        '<br>',
        $('<a>Illustrated by </a>').addClass('description').append($('<a href="https://twitter.com/akaitera">@akaitera</a>'))
      )
    );
  }
})();
