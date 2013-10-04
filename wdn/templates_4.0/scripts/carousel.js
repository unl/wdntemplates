/*
 *
 * Function to create a carousel. See http://www1.unl.edu/wdn/wiki/Carousel for more details
 *
 */
define(['wdn', 'require', 'jquery'], function(WDN, require, $) {
	var defaultSel = '#wdn_Carousel',
	flexCls = 'flexslider',
	pluginPath = './plugins/flexslider/',
	initd = false;
	
	return {
		initialize : function(callback) {
			var min = '', body = $('body');
			if (!body.length || !body.hasClass('debug')) {
				min = '-min';
			}
			
			var done = function() {
				var defaults = WDN.getPluginParam('carousel', 'defaults') || {};
				$(defaultSel).addClass(flexCls).flexslider(defaults);
				$('.' + flexCls).flexslider(defaults);
				initd = true;
				
				if (callback) {
					callback();
				}
			};
			
			if (!initd) {
				WDN.loadCSS(require.toUrl(pluginPath + 'css/flexslider.css'));
				
				WDN.loadJQuery(function(){
					require([pluginPath + 'jquery.flexslider' + min], done);
				});
			} else {
				done();
			}
		}
	};
});
