$require("/categories.js");
$require("/google_feed.js");
$require("/my_feed.js");
$require("/article.js");


$class('hotnews.Gallery')
    .extend(tau.ui.SceneController)
    .define({

      Gallery: function (category) {
        this.setTitle(category.name);
        this.category = category;
        this.feed;
        this.data = [];
        this.scrollPanel;
      },

      loadScene: function () {
        this.scrollPanel = new tau.ui.ScrollPanel({
          // refresh 기능은 다음에 구현한다.
          // pullToRefresh: 'down',
          // pullDownFn: tau.ctxAware(this.loadModel, this),
          // pullDownLabel: ['업데이트하시려면 아래로 당기세요.', '업데이트하시려면 당겼다 놓으세요.', '업데이트중...'],
          styles: {
            fontSize: '15px',
          }
        });
        this.getScene().add(this.scrollPanel);
      },

      navBtnTapped: function () {
        var navigator = this.getParent();
        navigator.pushController(new hotnews.Categories());
      },

      sceneLoaded: function () {
        // adjust theme 
        this.scrollPanel.renderer
            .addStyleRule(this.scrollPanel.getId(true), '.tau-label-text', 'overflow: visible');
        
        // load feed
        this.loadModel();
      },

      loadModel: function () {
        // feed
        if (!this.feed) {
          // if use google
          var serverParam = tau.getLauncherParam('feed');
          if(serverParam == 'myfeed') {
            this.feed = new hotnews.MyFeed(this.category);
          } else {
            this.feed = new hotnews.GoogleFeed(this.category.url);
          }
        }
        this.feed.load(tau.ctxAware(this.modelLoaded, this));
      },

      modelLoaded: function (entries) {
        if(this.data.length == 0) {
          // 처음 load 할 때에는 순서대로 뒤에 붙인다.
          this.data = this.data.concat(entries);
          this.addCells(entries.length);
        } else {
          // refresh 해서 새글이 추가되면 앞에 붙여 주어야 한다.
        }
      },

      addCells: function (length) {
        for ( var i = 0; i < length; i++) {
          this.loadCell(i);
        }
        this.getScene().update();
      },

      loadCell: function (index) {
        var layout = this.category.layout;
        var sizeVal = this.getColWidth(index);
        var article = this.data[index];
        var panelStyle = {
          width: sizeVal,
          height: '150px',
          float: 'left',
          paddingLeft: '10px',
          borderBottom: '1px solid #BFBFBD',
          display: '-webkit-box',
          '-webkit-box-orient': 'horizontal',
          '-webkit-box-align': (layout != 'list' && layout != 'list_detail') ? 'center'
              : 'start',
        };
        if (index != 0) {
          panelStyle.borderTop = '1px solid #F2F2F0';
        }
        if (layout == 'list') {
          panelStyle.height = '45px';
        }
        if (layout == 'list_detail') {
          panelStyle.height = '90px';
        }
        if (layout == 'gallery') {
          panelStyle.paddingLeft = '0px';
          var imgSrc = this.getImgSrc(article);
          if (imgSrc) {
            panelStyle.backgroundImage = 'url("' + imgSrc + '")';
            panelStyle.backgroundSize = 'contain';
            panelStyle.color = 'white';
          }
        }
        var panel = new tau.ui.Panel({
          styles: panelStyle,
        });

        // img
        if (layout == 'list_img') {
          var imgSrc = this.getImgSrc(article);
          if (imgSrc) {
            var imageView = new tau.ui.ImageView({
              src: imgSrc,
              styles: {
                width: '96px',
                marginRight: '10px',
                '-webkit-border-radius': '5px',
              }
            });
            panel.add(imageView);
          }
        }
        //panel2 (for title and desc)
        var panel2Styles = {
          '-webkit-box-flex': '1',
          display: 'block',
        };
        if (layout != 'list' && layout != 'list_detail') {
          panel2Styles.paddingRight = '3px';
        }
        var panel2 = new tau.ui.Panel({
          styles: panel2Styles,
        });
        panel.add(panel2);
        // title
        var title = new tau.ui.Label({
          text: article.title,
          styles: {
            display: 'block',
            fontWeight: 'bold',
            marginTop: '5px',
            marginBottom: '6px',
          }
        });
        panel2.add(title);
        // description
        if (layout != 'list' && sizeVal != '33.3%') {
          var contentSnippet = article.contentSnippet.replace(/(\r\n|\n|\r)/gm, "");
          if(contentSnippet.length > 200) {
            contentSnippet = contentSnippet.substring(0, 200) + '[..]';
          }
          var description = new tau.ui.Label({
            text: contentSnippet,
            styles: {
              fontSize: '80%',
              display: 'block',
              overflow: 'visible',
              whiteSpace: 'normal',
            }
          });
          panel2.add(description);
        }
        panel.onEvent('tap', this.articleSelected, this);
        panel.dArticleIndex = index;
        this.scrollPanel.add(panel);
      },

      articleSelected: function (e, payload) {
        var source = e.getSource();
        var index = this.getArticleIndex(source);
        if (index != undefined) {
          var navigator = this.getParent();
          navigator.pushController(new hotnews.Article(this.data, index, this
              .getTitle()));
        }
      },

      getArticleIndex: function (comp) {
        while (comp && comp.dArticleIndex == undefined) {
          if (!comp.getParent)
            return;
          comp = comp.getParent();
        }
        return comp.dArticleIndex;
      },

      getImgSrc: function (article) {
        if(article.imageUrl)
          return article.imageUrl;
        var content = article.content;
        var reg = new RegExp("<img[^>]+src\\s*=\\s*['\"]([^'\"]+)['\"][^>]*>");
        var result = reg.exec(content);
        if (result)
          return result[1];
      },

      getColWidth: function (index) {
        var widths;
        // one column
        var layout = this.category.layout;
        if (layout == 'list' || layout == 'list_detail'
            || layout == 'list_img') {
          widths = ['100%'];
        } else {
          // 3
          // 2 1
          // 1 2
          widths = ['100%', '66.6%', '33.3%', '33.3%', '66.6%'];
        }
        return widths[index % widths.length]
      },

    });