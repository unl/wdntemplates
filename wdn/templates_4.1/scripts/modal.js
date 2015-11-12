define([
	'jquery',
	'plugins/colorbox/jquery.colorbox',
	'css!plugins/colorbox/css/colorbox'
], function($) {
    return {
        initialize : function(callback) {
			$.colorbox.settings.className = 'wdn-main';
			$(callback);
        }
    };
});
