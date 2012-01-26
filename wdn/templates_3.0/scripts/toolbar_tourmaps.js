WDN.toolbar_tourmaps = function() {
    return {     
    	initialize : function() {},
    	setupToolContent : function(contentCallback) {
    		contentCallback('<div id="tourmapscontent"></div>');
    	},
        display : function() {
        	WDN.jQuery.ajax({
            	url: "http://maps.unl.edu/?format=partial",
            	success: function(data) {
            		WDN.jQuery("#tourmapscontent").html(data);
            	},
            	error: function() {
            		WDN.jQuery("#tourmapscontent").html('Error loading results');
            	}
            });
        }  
    };
}();
