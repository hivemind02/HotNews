$class('hotnews.Server').define({
  $static: {
    HOST: 'http://14.63.213.239:8080/newsdev/',

    star: function (id) {
      function callback (resp) {
        tau.alert(resp.responseJSON.message);
      }
      tau.req({
        type: 'POST',
        url: hotnews.Server.HOST + 'star/add',
        params: {
          id: id,
        },
        async: false,
        callbackFn: tau.ctxAware(callback, this),
      }).send();
    },

    loadCategories: function () {
      var categories = [{
        id: 'all',
        name: 'all',
      }];
      function doLoad (resp) {
        categories = categories.concat(resp.responseJSON);
      }
      tau.req({
        type: 'GET',
        url: hotnews.Server.HOST + 'category',
        async: false,
        callbackFn: doLoad,
      }).send();
      for ( var i = 0; i < categories.length; i++) {
        categories[i].layout = 'list_img';
      }
      return categories;
    },
  },
});

$class('hotnews.MyFeed').define({
  MyFeed: function (category) {
    this.category = category;
  },

  load: function (callback) {
    function doLoad (resp) {
      if (resp.status == 200) {
        var entries = resp.responseJSON;
        callback(entries);
      } else {
        callback();
      }
    }
    tau.req({
      type: 'GET',
      url: hotnews.Server.HOST + 'news/' + this.category.name,
      callbackFn: tau.ctxAware(doLoad, this),
    }).send();
  },

});
