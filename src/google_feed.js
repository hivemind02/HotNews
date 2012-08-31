$require('http://www.google.com/jsapi');

$class('hotnews.GoogleFeed').define({
  
  $static: {
    CATEGORIES:  [{
      id: 'top',
      name: 'Top Stories',
      url: 'http://mobileblog.olleh.com/rss',
      layout: 'list_img',
    },
    {
      id: 'ffff',
      name: 'FFFFoud',
      url: 'http://feeds.feedburner.com/ffffound/everyone',
      layout: 'gallery',
    },
    {
      id: 'dyt',
      name: 'Design You Trust',
      url: 'http://designyoutrust.com/feed/',
      layout: 'gallery',
    },
    {
      id: 'fubiz',
      name: 'Fubiz',
      url: 'http://feeds.feedburner.com/fubiz',
      layout: 'gallery',
    },
    {
      id: 'wishlist',
      name: 'Wishlist',
      url: 'http://wishlist.soup.io/rss',
      layout: 'gallery',
    },{
      id: 'mmm',
      name: 'Modern Metropolis',
      url: 'http://www.mymodernmet.com/profiles/blog/feed?promoted=1&xn_auth=no',
      layout: 'gallery',
    },
    {
      id: 'design',
      name: 'Design',
      url: 'http://dribbble.com/shots/popular.rss',
      layout: 'gallery',
    }, {
      id: 'web',
      name: 'Web',
      url: 'http://feeds.feedburner.com/devparan',
      layout: 'newsify',
    }, {
      id: 'java',
      name: 'Java',
      url: 'http://www.okjsp.pe.kr/rss/okjsp-rss2.jsp?bbs=bbs6',
      layout: 'list_detail',
    }, {
      id: 'eclipse',
      name: 'Eclipse',
      url: 'http://cafe.rss.naver.com/eclipseplugin',
      layout: 'list',
    }],
  },

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
    this.feed.setNumEntries(20);
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