WDN.tooltip = (function() {
	var _wdnQTip,
		_sanitizeTooltipElems = function(elems) {
			elems.each(function() {
				var $this = WDN.jQuery(this);
				$this.attr('oldtitle', $this.attr('title'));
			})
			.removeAttr('title');
		};
	
	return {
		initialize : function() {
			WDN.log("initialize tooltip");
			WDN.loadCSS(WDN.getTemplateFilePath('scripts/plugins/qtip/jquery.qtip.min.css'));
			WDN.loadJQuery(function() {
				WDN.loadJS(WDN.getTemplateFilePath('scripts/plugins/qtip/jquery.qtip.min.js'), WDN.tooltip.tooltipSetup);
			});
		},
		tooltipSetup : function() {
			// Tooltips can only be used in the appropriate sections, and must have the correct class name and a title attribute
			var elems = WDN.jQuery('#maincontent .tooltip[title]');
			
			if (_wdnQTip) {
				WDN.tooltip.addTooltip(elems);
				return;
			}
			
			_sanitizeTooltipElems(elems);
			
			_wdnQTip = WDN.jQuery('<div />').qtip({
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
					viewport: WDN.jQuery(window),
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
						var target = WDN.jQuery(event.originalEvent.target);
						
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
			var elems = WDN.jQuery(el);
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
})();