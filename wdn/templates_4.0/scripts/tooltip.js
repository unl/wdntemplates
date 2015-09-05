define([
	'jquery', 
	'plugins/qtip/jquery.qtip',
	'css!plugins/qtip/wdn.qtip'
], function($) {
	var attr = 'title',
	attrBak = 'data-title',
	mainSel = '#maincontent .tooltip[' + attr + ']',
	tipStyleCls = 'qtip-wdn',

	_wdnQTip,

	_sanitizeTooltipElems = function(elems) {
		elems.each(function() {
			var $this = $(this);
			$this.attr(attrBak, $this.attr(attr));
		})
		.removeAttr(attr);
	};

	function tooltipSetup() {
		// Tooltips can only be used in the appropriate sections, and must have the correct class name and a title attribute
		var elems = $(mainSel);

		if (_wdnQTip) {
			Plugin.addTooltip(elems);
			return;
		}

		_sanitizeTooltipElems(elems);
		$.fn.qtip.zindex = 10;

		_wdnQTip = $('<div/>').qtip({
			content: ' ',
			style: {
				tip: {
					width: 8,
					height: 4
				},
				classes: tipStyleCls
			},
			position: {
				target: 'event',
				effect: false,
				adjust: {
					method: 'flip'
				},
				viewport: $(window),
				at: 'top center',
				my: 'bottom center'
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
						api.set('content.text', target.attr(attrBak));
					}
				}
			}
		});
	};

	var Plugin = {
		initialize : function() {
			$(tooltipSetup);
		},
		addTooltips : function($elements) {
			this.addTooltip($elements);
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

	return Plugin;
});
