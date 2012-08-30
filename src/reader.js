$require('http://www.google.com/jsapi');

$class('hotnews.GoogleFeed').define({

  GoogleFeed: function (url) {
    this.url = url;
  },

  load: function (callback) {
    console.log('loading...');
    this.callback = callback;
    if (!this.feed) {
      function libLoaded () {
        this.feed = new google.feeds.Feed(this.url);
        this.feed.includeHistoricalEntries();
        this.doLoad();
      }
      google.load("feeds", "1", {
        "callback": tau.ctxAware(libLoaded, this)
      });
    } else {
      this.doLoad();
    }
  },

  doLoad: function () {
    this.feed.setNumEntries(30);
    this.feed.load(tau.ctxAware(this.feedLoaded, this));
  },

  feedLoaded: function (result) {
    if (!result.error && result.feed) {
      console.log('loaded');
      var entries = result.feed.entries;
      this.callback(entries);
    }
  },

});