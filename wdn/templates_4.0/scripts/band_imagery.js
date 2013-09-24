/**
 * This plugin supports the scrolling effects on wdn-band imagery
 * 
 * class="wdn-flipbook" Use to create a flipbook of the figures contained in the band
 * class="wdn-locked"   Use on a group of figures to lock within the viewport while scrolling a band
 * class="wdn-scroll"   Use on the scrollable content adjecent to the locked imagery
 *
 * For the flipbook feature you must define two points to interpolate between
 * and create the flipbook effect.
 * data-lerp-start Define a secector to begin interpolation at
 * data-lerp-end   Define a selector to end interpolation at
 * e.g. data-lerp-start="#lerp-start" data-lerp-end="#lerp-end" will flip
 * through all figures within the flipbook as the user's viewport scrolls
 *  between id="lerp-start" and id="lerp-end"
 *
 */

define(['jquery', 'wdn'], function($, WDN) {
	var imageryUpdate = function() {
		var depth = Math.floor($(window).scrollTop());
		$('.wdn-flipbook').each(function(index, value) {

			var shownfigure       = ':first-of-type',
				$this             = $(this),
				lerpstart_el      = $this.attr('data-lerp-start'),
				lerpend_el        = $this.attr('data-lerp-end'),
				$figures          = $this.children('figure'),
				lerp_start_offset = $(lerpstart_el).offset(),
				lerp_end_offset   = $(lerpend_el).offset();

			var lerp_height = lerp_end_offset.top - lerp_start_offset.top;

			if ((depth > lerp_start_offset.top)
				&& (depth < lerp_end_offset.top)) {
				var frame = Math.ceil((depth - lerp_start_offset.top)/(lerp_height/$figures.length));
				shownfigure = ':nth-of-type('+frame+')';
			} else if (depth > lerp_end_offset.top) {
				shownfigure = ':last-of-type';
			}

			var $shownFigure = $figures.filter(shownfigure);
			$shownFigure.show().end()
				.not($shownFigure).hide();

			if ($this.hasClass('wdn-locked')) {
				var parent        = $this.parent(),
					parent_offset = parent.offset().top,
					parent_height = parent.height(),
					window_height = $(window).height();

				if (depth < parent_offset) {
					// Above locked region
					$this.css({
						position : 'absolute',
						top      : '0',
						bottom   : 'auto'
					});
				} else if ((depth >= parent_offset)
					&& ((depth + window_height) < (parent_height + parent_offset)) ) {
					// Currently viewing locked region
					$this.css({
						position : 'fixed',
						top      : '0'
					});
				} else {
					// Below locked region
					$this.css('position', 'absolute');
					if (window_height < $shownFigure.height()) {
						$this.css({
							top    : 'auto',
							bottom : '0'
						});
					} else {
						var pinned_top = parent_height - window_height;
						$this.css('top', pinned_top+'px');
					}
				}
			}

		});
	};

	var Plugin = {
		initialize : function() {
			WDN.loadCSS(WDN.getTemplateFilePath('css/modules/band_imagery.css'));
			$('.wdn-flipbook').parent().css('position', 'relative');
			$(window).scroll(function() {
					scrollTimeout = setTimeout(imageryUpdate, 50);
				}
			);
		}

	};

	return Plugin;
});
