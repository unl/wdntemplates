WDN.tooltip = function() {
	return {
        initialize : function() {
			WDN.log("initialize tooltip");
			WDN.loadJS('wdn/templates_3.0/scripts/plugins/qtip/jquery.qtip.min.js', WDN.tooltip.idInit);
		},
		idInit : function() {
			// ID's of container elements we want to apply tooltips to right away
			WDN.tooltip.tooltipSetup('wdn_tool_links');
			WDN.tooltip.tooltipSetup('maincontent');
		},
		tooltipSetup : function(id) {
			// Tooltips can be added to any links by calling this function with
			// the container id and adding a 'tooltip' attribute to the anchor tag
			jQuery('#'+id+' a[tooltip]').each(function()
					{	
					  jQuery(this).qtip({
		
					      content: jQuery(this).attr('tooltip'),
					      style: { 
					    	  width: 200,
					          padding: 5,
					          'font-family': 'Arial, sans-serif',
					          'font-size': '12px',
					          background: '#faf7aa',
					          color: '#434343',
					          textAlign: 'center',
					          border: {
					             width: 1,
					             radius: 5,
					             color: '#f8e98e'
					          },
					          tip: 'bottomLeft',
					          name: 'cream'
					      },
					      position: { 
					    	  adjust: { screen: true },
					      	  corner: { target: 'topMiddle', tooltip: 'bottomMiddle' }
					      }
					   });
					});
		}
	};
}();