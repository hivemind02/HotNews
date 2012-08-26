$require("/article.js");
$require('http://www.google.com/jsapi');

$class('hotnews.Gallery').extend(tau.ui.SceneController).define({

  $static: {
    EVENT_LIB_LOADED: 'googleLibLoaded'
  },

  Gallery: function (opts) {
    this.setTitle('Hot News');
    this.data = [];
    this.feed;
    this.scrollPanel;
  },

  loadScene: function () {
    this.scrollPanel = new tau.ui.ScrollPanel({
      styles: {
        fontSize : '15px',
      }
    });
    this.getScene().add(this.scrollPanel);
  },
  
  sceneLoaded: function () {
    function onLoad () {
      this.loadModel();
    }
    google.load("feeds", "1", {
      "callback": tau.ctxAware(onLoad, this)
    });
    this.scrollPanel.renderer.addStyleRule(this.scrollPanel.getId(true),'*','font-family: "맑은 고딕"');
  },

  loadModel: function () {
    if (!this.feed) {
      this.feed = new google.feeds.Feed("http://mobileblog.olleh.com/rss");

      function feedLoaded (result) {
        if (!result.error && result.feed) {
          var entries = result.feed.entries;
          this.data = this.data.concat(entries);
          this.addCells(this.data.length - entries.length, entries ? entries.length : 0);
        }
      }
    }

    this.feed.setNumEntries(100);
    this.feed.load(tau.ctxAware(feedLoaded, this));
    this.feed.load(tau.ctxAware(feedLoaded, this));
  },

  addCells: function (index, length) {
    for ( var i = index, end = index + length; i < end; i++) {
      this.loadCell(i);
    }
    this.getScene().update();
  },

  // 3
  // 2 1
  // 1 2
  // 1 1 1
  loadCell: function (index) {
    var sizeVals = ['100%', '66.6%', '33.3%', '33.3%', '66.6%'];
    var sizeVal = sizeVals[index % sizeVals.length];
    var data = this.data[index];
    var panel = new tau.ui.Panel({
      styles : {
        width: sizeVal,
        height: '100px',
        float: 'left',
        marginBottom: '10px',
      },
    });
    
    var title = new tau.ui.Label({
      text: data.title,
      styles:  {
        display: 'block',
        fontWeight: 'bold',
        fontSize: '110%',
      }
    });
    panel.add(title);
    var description = new tau.ui.Label({
      text: data.contentSnippet.replace(/(\r\n|\n|\r)/gm,""),
      styles:  {
        fontSize: '90%',
        display: 'block',
      }
    }); 
    panel.add(description);
    
    
    
    this.scrollPanel.add(panel);
  },

});