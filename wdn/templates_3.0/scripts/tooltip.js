WDN.tooltip = function($) {
	return {
		initialize : function() {
			WDN.log("initialize tooltip");
			WDN.loadJS('wdn/templates_3.0/scripts/plugins/qtip/jquery.qtip.js', WDN.tooltip.tooltipSetup);
		},
		tooltipSetup : function() {
			WDN.loadCSS('/wdn/templates_3.0/css/header/tooltip.css');
			// Tooltips can only be used in the appropriate sections, and must have the correct class name and a title attribute
			$('#wdn_tool_links .tooltip[title], #maincontent .tooltip[title], #footer .tooltip[title]').each(function() {
				$(this).qtip({

					content: $(this).attr('title'),
					show: {
						effect: { length: 0 }
					},
					hide: {
						effect: { length: 0 }
					},
					style: {
						tip: {
							corner : 'bottomMiddle',
							size : {x : 17, y : 10}
						},
						width : {
							min : 100
						},
						'background' : 'url("/wdn/templates_3.0/css/header/images/qtip/defaultBG.png") repeat-x bottom',
						border : {
							color : '#f7e77c',
							width : 2
						},
						'color' : '#504500'
					},
					position: { 
						adjust: { 
							screen: true,
							y : -5
						},
						corner: { target: 'topMiddle', tooltip: 'bottomMiddle' }
					}
				});
				$(this).removeAttr('title');
				$(this).removeAttr('alt');
			});
		}
	};
}(WDN.jQuery);