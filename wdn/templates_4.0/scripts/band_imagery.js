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
	var Plugin = {
		initialize : function() {
			WDN.loadCSS(WDN.getTemplateFilePath('css/modules/band_imagery.css'));
			$('.wdn-flipbook').parent().css('position', 'relative');
			$(window).scroll(function() {
				var depth = Math.floor($(window).scrollTop());
				$('.wdn-flipbook').each(function(index, value) {

					var shownfigure       = ':first-of-type',
						jQthis            = $(this),
						lerpstart_el      = jQthis.attr('data-lerp-start'),
						lerpend_el        = jQthis.attr('data-lerp-end'),
						frames            = jQthis.children('figure').length,
						lerp_start_offset = $(lerpstart_el).offset(),
						lerp_end_offset   = $(lerpend_el).offset();

					var lerp_height = lerp_end_offset.top - lerp_start_offset.top;

					if ((depth > lerp_start_offset.top)
						&& (depth < lerp_end_offset.top)) {
						var frame = Math.ceil((depth - lerp_start_offset.top)/(lerp_height/frames));
						shownfigure = ':nth-of-type('+frame.toString()+')';
					} else if (depth > lerp_end_offset.top) {
						shownfigure = ':last-of-type';
					}

					jQthis.children('figure'+shownfigure).show();
					jQthis.children('figure:not('+shownfigure+')').hide();

					if (jQthis.hasClass('wdn-locked')) {
						var parent = jQthis.parent();
						var parent_offset = parent.offset().top;
						if (depth < parent_offset) {
							// Above locked region
							jQthis.css('position', 'absolute');
							jQthis.css('top', '0');
							jQthis.css('bottom', 'auto');
						} else if ((depth >= parent_offset)
							&& ((depth+$(window).height()) < (parent.height()+parent_offset)) ) {
							// Currently viewing locked region
							jQthis.css('position', 'fixed');
							jQthis.css('top', '0');
						} else {
							// Below locked region
							jQthis.css('position', 'absolute');
							if ($(window).height() < jQthis.children('figure'+shownfigure).height()) {
								jQthis.css('top', 'auto');
								jQthis.css('bottom', '0');
							} else {
								var pinned_top = parent.height()-$(window).height();
								jQthis.css('top', pinned_top.toString()+'px');
							}
						}
					}

				});
			});
		}
	};

	return Plugin;
});
