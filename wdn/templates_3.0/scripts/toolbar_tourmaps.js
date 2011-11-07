WDN.toolbar_tourmaps = function() {
    return {     
    	initialize : function() {
    		
    	},
    	setupToolContent : function() {
    		return '<div id="tourmapscontent"></div>';
    	},
        display : function() {
        	WDN.jQuery.ajax({
            	url: "http://maps.unl.edu/?format=partial",
            	success: function(data) {
            		WDN.jQuery("tourmapcontent").html(data);
            	},
            	error: function() {
            		WDN.jQuery("tourmapcontent").html('Error loading results');
            	}
            });
        }  
    };
}();
