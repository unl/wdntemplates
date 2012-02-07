WDN.tooltip = (function($) {
	return {
		initialize : function() {
			WDN.log("initialize tooltip");
			WDN.loadJS(WDN.getTemplateFilePath('scripts/plugins/qtip/jquery.qtip.js'), WDN.tooltip.tooltipSetup);
		},
		tooltipSetup : function() {
			WDN.loadCSS(WDN.getTemplateFilePath('css/header/tooltip.css'));
			// Tooltips can only be used in the appropriate sections, and must have the correct class name and a title attribute
			WDN.tooltip.addTooltips($('#wdn_tool_links .tooltip[title], #maincontent .tooltip[title], #footer .tooltip[title]'));
		},
		addTooltips : function($elements) {
			$elements.each(function() {
				WDN.tooltip.addTooltip(this);
			});
		},
		addTooltip: function(el) {
			$(el).qtip({
				show: {
					effect: { length: 0 }
				},
				hide: {
					effect: { length: 0 }
				},
				style: {
					name: 'cream',
					tip: {
						corner : 'bottomMiddle',
						size : {x : 17, y : 10}
					},
					width : { min : 100	},
					border: { radius: 3 }
				},
				position: {
					adjust: {
						screen: true,
						y : -5,
						scroll: false,
						resize: false
					},
					corner: { target: 'topMiddle', tooltip: 'bottomMiddle' }
				}
			});
		}
	};
})(WDN.jQuery);