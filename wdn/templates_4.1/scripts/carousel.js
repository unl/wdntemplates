/*
 *
 * Function to create a carousel. See http://www1.unl.edu/wdn/wiki/Carousel for more details
 *
 */
define([
	'wdn',
	'jquery',
	'plugins/flexslider/jquery.flexslider',
	'css!plugins/flexslider/css/flexslider'
], function(WDN, $) {

	var defaultSel = '#wdn_Carousel',
	flexCls = 'flexslider',
	pluginPath = 'plugins/flexslider/',
	initd = false;
	
	return {
		initialize : function(callback) {
			$(function() {
				var defaults = WDN.getPluginParam('carousel', 'defaults') || {};
				$(defaultSel).addClass(flexCls);
				$('.' + flexCls).flexslider(defaults);
				initd = true;
				
				if (callback) {
					callback();
				}
			});
		}
	};
});
