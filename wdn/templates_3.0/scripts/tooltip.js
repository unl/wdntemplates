WDN.tooltip = function($) {
	return {
		initialize : function() {
			WDN.log("initialize tooltip");
			WDN.loadJS('wdn/templates_3.0/scripts/plugins/qtip/jquery.qtip.js', WDN.tooltip.idInit);
		},
		idInit : function() {
			// ID's of container elements we want to apply tooltips to right away
			WDN.tooltip.tooltipSetup('wdn_tool_links');
			WDN.tooltip.tooltipSetup('maincontent');
			WDN.tooltip.tooltipSetup('footer');
		},
		tooltipSetup : function(id) {
			// Tooltips can be added to any links by calling this function with
			// the container id and adding a 'title' attribute to the anchor tag or image tag
			$('#'+id+' a.tooltip, #'+id+' img.tooltip').each(function() {
				$(this).qtip({

					content: $(this).attr('title'),
					show: {
						effect: { type: 'fade', length: 0 }
					},
					hide: {
						effect: { type: 'fade', length: 0 }
					},
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
				$(this).removeAttr('title');
				$(this).removeAttr('alt');
			});
		}
	};
}(WDN.jQuery);