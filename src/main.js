$require("/categories.js");
$require("/gallery.js");

/**
 * scene based application main controller
 */
$class('hotnews.MainController').extend(tau.ui.SequenceNavigator).define({
	MainController: function (opts){
		
	},

	init: function (){
		this.setRootController(new hotnews.Categories());
		var opts = {
		  title: 'Top Stories',
		  url: 'http://mobileblog.olleh.com/rss',
		};
		this.pushController(new hotnews.Gallery(opts));
	},
	
	destroy: function (){
		
	}
});