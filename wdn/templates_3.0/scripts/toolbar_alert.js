WDN.toolbar_alert = function() {
	return {
        initialize : function() {

        },
        setupToolContent : function() {
        	return 'An alert has been issued!';
        	
        },
        display : function() {
        	WDN.jQuery("#toolbar_alert").load("/wdn/templates_3.0/includes/alert.html");
        }
    };
}();