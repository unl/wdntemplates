WDN.tooltip = (function($) {
	var _wdnQTip,
		_sanitizeTooltipElems = function(elems) {
			elems.each(function() {
				var $this = $(this);
				$this.attr('oldtitle', $this.attr('title'));
			})
			.removeAttr('title');
		};
	
	return {
		initialize : function() {
			WDN.log("initialize tooltip");
			WDN.loadCSS(WDN.getTemplateFilePath('scripts/plugins/qtip/jquery.qtip.min.css'));
			WDN.loadJS(WDN.getTemplateFilePath('scripts/plugins/qtip/jquery.qtip.min.js'), WDN.tooltip.tooltipSetup);
		},
		tooltipSetup : function() {
			// Tooltips can only be used in the appropriate sections, and must have the correct class name and a title attribute
			var elems = $('#wdn_tool_links .tooltip[title], #maincontent .tooltip[title], #footer .tooltip[title]');
			
			if (_wdnQTip) {
				WDN.tooltip.addTooltip(elems);
				return;
			}
			
			_sanitizeTooltipElems(elems);
			
			_wdnQTip = $('<div />').qtip({
				content: ' ',
				style: {
					tip: {
						corner: true,
						width: 17,
						height: 10
					},
					classes: "ui-tooltip-shadow ui-tooltip-rounded"
				},
				position: {
					target: 'event',
					effect: false,
					adjust: {
						y: -5,
						method: "flip"
					},
					viewport: $(window),
					at: "top center",
					my: "bottom center"
				},
				show: {
					target: elems
				},
				hide: {
					target: elems
				},
				events: {
					show: function(event, api) {
						var target = $(event.originalEvent.target);
						
						if (target.length) {
							api.set('content.text', target.attr('oldtitle'));
						}
					}
				}
			});
		},
		addTooltips : function($elements) {
			WDN.tooltip.addTooltip($elements);
		},
		addTooltip: function(el) {
			var elems = $(el);
			_sanitizeTooltipElems(elems);
			
			var oldElems = _wdnQTip.qtip('option', 'show.target'),
				newTargets = oldElems.add(elems);
			
			if (oldElems.length < newTargets.length) {
				_wdnQTip.qtip('option', {
					'show.target': newTargets,
					'hide.target': newTargets
				});
			}
		}
	};
})(WDN.jQuery);