WDN.toolbar_webcams = function() {
	var counter = 0;
	return {
		initialize : function() {},
		setupToolContent : function(contentCallback) {
			WDN.jQuery.ajax({
            	url: WDN.getTemplateFilePath('includes/tools/webcams.html', true),
            	success: function(data) {
            		contentCallback(data);
            	},
            	error: function() {
            		contentCallback("An error occurred while loading this section");
            	}
            });
		},
		display : function() {
			if (counter++ < 1) {
				return;
			}
			
			var now = WDN.jQuery.now(), i = 0, $cam;
			
			for (; i < 3; i++) {
				$cam = WDN.jQuery('#webcamuri' + (i + 1));
				$cam[0].src = $cam[0].src.replace(/(\?t=\d+)?$/, '?t=' + now);
			}
		}
	};
}();