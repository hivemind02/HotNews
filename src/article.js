$class('hotnews.Article')
    .extend(tau.ui.SceneController)
    .define({
      Article: function (data, index, navTitle) {
        this.data = data;
        this.index = index;
        this.setTitle(navTitle);
      },

      loadScene: function () {
        var scene = this.getScene();
        this.textView = new tau.ui.TextView({
          text: this.data[this.index].content,
          styles: {
            backgroundColor: 'transparent',
          }
        });

        scene.add(this.textView);

        var toolbar = new tau.ui.ToolBar({
          dock: 'bottom',
          styles: {
            backgroundColor: '#E4E4E2',
            backgroundImage: 'none',
            borderTop: '1px solid #CCCCCA',
            height: '30px',
            width: '100%',
          }
        });
        var starBtn = new tau.ui.Button({
          tap: tau.ctxAware(this.star, this),
          label: {
            normal: ""
          },
          styles: {
            border: 'none',
            height: '19px',
            backgroundColor: 'transparent',
            backgroundImage: 'url("/img/heart@2x.png")',
          }
        });
        toolbar.add(starBtn);

        var shareBtn = new tau.ui.Button({
          label: {
            normal: ""
          },
          styles: {
            border: 'none',
            height: '19px',
            backgroundColor: 'transparent',
            backgroundImage: 'url("/img/letter_open@2x.png")',
          }
        });
        toolbar.add(shareBtn);

        var prevButton = new tau.ui.Button({
          tap: tau.ctxAware(this.goPrev, this),
          label: {
            normal: ""
          },
          styles: {
            border: 'none',
            height: '19px',
            backgroundColor: 'transparent',
            backgroundImage: 'url("/img/prev@2x.png")',
          }
        });
        toolbar.add(prevButton);

        var nextButton = new tau.ui.Button({
          tap: tau.ctxAware(this.goNext, this),
          label: {
            normal: ""
          },
          styles: {
            border: 'none',
            height: '19px',
            backgroundColor: 'transparent',
            backgroundImage: 'url("/img/next@2x.png")',
          }
        });
        toolbar.add(nextButton);

        scene.add(toolbar);
      },

      sceneLoaded: function () {
        this.textView.renderer
            .addStyleRule(this.textView.getId(true), 'img', 'max-width: 100%; height: auto;');
        this.textView.renderer
            .addStyleRule(this.textView.getId(true), 'span', 'max-width: 100%; height: auto;');

        var browserBtn = new tau.ui.Button({
          tap: tau.ctxAware(this.openBrowser, this),
          label: {
            normal: ""
          },
          styles: {
            border: 'none',
            backgroundColor: 'transparent',
            backgroundImage: 'url("/img/globe@2x.png")',
            width: '25px',
            marginRight: '6px',
          }
        });

        var navBar = this.getNavigationBar();
        navBar.setRightItem(browserBtn);
      },

      openBrowser: function () {
        window.open(this.data[this.index].link);
      },

      goNext: function () {
        if (this.index + 1 < this.data.length) {
          this.index++;
          this.textView.setText(this.data[this.index].content);
          this.textView.scrollTo(0, 0, '0ms');
        }
      },

      goPrev: function () {
        if (this.index - 1 >= 0) {
          this.index--;
          this.textView.setText(this.data[this.index].content);
          this.textView.scrollTo(0, 0, '0ms');
        }
      },

      star: function () {
        tau.alert('Starred! id: ' + this.data[this.index].id);
      },

    });