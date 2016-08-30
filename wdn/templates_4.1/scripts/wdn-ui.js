define(['jquery', 'modernizr'], function($, Modernizr) {
	"use strict";

	var initd = false;
	var dropdownButtonClass = 'wdn-dropdown-widget-button';
	var dropdownContentClass = 'wdn-dropdown-widget-content';

	var closeDropDown = function(selector) {
		$.each($(selector), function(index, element) {
			var $element = $(element);
			var container_id = $element.attr('aria-controls');
			var $container = $('#'+container_id);

			if ($element.hasClass('visible-at-full-nav') && isFullNav()) {
				$container.attr('aria-hidden', false);
			} else {
				$container.attr('aria-hidden', true);
			}

			if ('true' == $element.attr('aria-pressed')) {
				$element.attr('aria-pressed', false);
			}
		});
	};

	var isFullNav = function() {
		return Modernizr.mq('(min-width: 700px)') || !Modernizr.mq('only all');
	};

	return {
		initialize : function () {

			if (initd) {
				//Don't initialize multiple times
				return;
			}

			// Safari uses an invalid attribute for setting pinned tab color, set here to avoid HTML validation errors
			// https://developer.apple.com/library/ios/documentation/AppleApplications/Reference/SafariWebContent/pinnedTabs/pinnedTabs.html
			$('link[rel="mask-icon"]').attr('color', '#d00000');

			this.setUpDropDownWidget('.'+dropdownButtonClass);

			//Close search on escape
			$(document).on('keydown', function(e) {
				if (e.keyCode === 27) {
					//Close on escape
					closeDropDown('.'+dropdownButtonClass);
				}
			});

			//listen for clicks on the document and close dropdowns if they don't come from a dropdown
			$(document).on('click', function(e) {
				//Determine if we need to do anything with our dropdown
				var $control = $(e.target);

				//Try to get the control element
				if ($control.parent('.'+dropdownButtonClass).length) {
					$control = $control.parent('.'+dropdownButtonClass).first();
				}

				if ($control.hasClass(dropdownButtonClass)) {
					var container_id = $control.attr('aria-controls');
					var $container = $('#' + container_id);

					var isPressed = $control.attr('aria-pressed');
					if ('true' == isPressed) {
						$container.attr('aria-hidden', 'true');
						$control.attr('aria-pressed', 'false');
					} else {
						$container.attr('aria-hidden', 'false');
						$control.attr('aria-pressed', 'true');
						$container.attr('tabindex', '-1').focus();
					}

					//Close other widgets
					closeDropDown($('.'+dropdownButtonClass).not($control));
				}

				//close all dropdown widgets
				if (!$('.'+dropdownContentClass).find(e.target).length) {
					closeDropDown('.'+dropdownButtonClass);
				}
			});

			$(window).resize(function() {
				$('.visible-at-full-nav').each(function(index, element) {
					var container_id = $(element).attr('aria-controls');
					var $container = $('#'+container_id);

					if (isFullNav()) {
						$container.attr('aria-hidden', false);
					} else {
						$container.attr('aria-hidden', true);
					}
				});
			});

			initd = true;
		},

		/**
		 * Set up new dropdown widget(s). The selector should point to the input that controls the content drop-down.
		 *
		 * @param selector
		 */
		setUpDropDownWidget : function(selector) {
			//Set up the initial state for the widget
			$(selector).each(function(index, button) {
				//Mark this control as having a popup
				var $button = $(button);

				$button.attr('aria-pressed', false);
				$button.attr('aria-haspopup', true);

				//Get the dropdown-container for this control.
				var container_id = $button.attr('aria-controls');
				var $container = $('#'+container_id);

				//Mark it as hidden
				$container.attr('aria-hidden', true);
				if ($button.hasClass('visible-at-full-nav') && isFullNav()) {
					$container.attr('aria-hidden', false);
				}
			});
		}
	};
});
