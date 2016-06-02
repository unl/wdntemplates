define(['jquery', 'wdn', 'require'], function($, WDN, require) {
	var
		useHashChange = true,

		hashPlugin = 'plugins/hashchange/jquery.hashchange',

		tabSelector = 'ul.wdn_tabs',

		contentSelector = '.wdn_tabs_content',

		selected = 'selected',

		validRE = /^[a-z][\w:\-\.]*$/i,

		jq = function(id) {
			return '#' + id.replace(/(:|\.)/g, '\\$1');
		},

		getHashFromLink = function(link) {
			var uri = link.href.split('#');

			if (!uri[1]) {
				return false;
			}

			var currentPage = window.location.href.split('#')[0],
				base = document.getElementsByTagName('base')[0];

			if (currentPage !== uri[0] && base && base.href !== uri[0]) {
				return false;
			}

			return uri[1];
		},

		getCleanHash = function() {
			return window.location.hash.replace('#', '');
		},

		updateInterface = function(trig) {
			var tabs = trig.closest(tabSelector),
				curr = trig.closest('li').siblings('.' + selected),
				sibs = trig.siblings(),
				parentTabs = trig.parents('li'),
				nsel;

			// Remove any selected tab class
			$('li.' + selected, tabs).find('a').attr('tabindex', '-1').attr('aria-selected', 'false');
			$('li.' + selected, tabs).removeClass(selected);

			// Hide any subtabs
			$('ul', tabs).hide();

			// Add the selected class to the tab (and sub-tab)
			parentTabs.addClass(selected);
			parentTabs.find('a').attr('tabindex', '0').attr('aria-selected', 'true');

			// Show any relevant sub-tabs
			if (sibs.length || parentTabs.length > 1) {
				if (!sibs.length) {
					sibs = trig.closest('ul');
				}
				sibs.show();
			}

			nsel = trig.closest('li').siblings('.' + selected);
			trig.trigger('tabchanged', [curr, nsel, tabs]);
		},
		
		setupA11y = function ($tabsWithSwitch) {
			$tabsWithSwitch.attr('role', 'tablist');

			//Use arrow keys to focus tabs (standard tab interaction)
			$tabsWithSwitch.on('keydown', function(event){
				var key = event.keyCode;
				var $tab = $(event.target);
				var $tabContainer = $($tab.parent());
				var target = false;

				//Check if arrows were pressed
				if (key >= 37 && key <= 40) {
					if (key == 37 || key == 38) {
						//Left or up arrow
						target = $tabContainer.prev('li');
					} else {
						//right or down arrow
						target = $tabContainer.next('li');
					}

					$(target).find('a').click();
					event.preventDefault();
				}
			});

			var $tabs = $($tabsWithSwitch.find('a'));

			$tabs.each(function() {
				var $tab = $(this);

				//Get the panel for this tab
				var $panel = $('#'+getHashFromLink(this));

				//If this tab doesn't have an id, give it one because we will need it later
				if ('undefined' === typeof $tab.attr('id')) {
					$tab.attr('id', 'wdn-tab-for-'+$panel.attr('id'));
				}

				//The parent <li> should not be read as a list item
				$tab.parent('li').attr('role', 'presentation');

				//Make sure that this <a> is read as a tab
				$tab.attr('role', 'tab');

				//Default to not selected
				$tab.attr('aria-selected', 'false');

				//Tell the tab that it controls this panel
				$tab.attr('aria-controls', $panel.attr('id'));
				
				//Only make tabs pragmatically focusable by default
				$tab.attr('tabindex', '-1');

				//Tell the panel that it is a panel
				$panel.attr('role', 'tabpanel');

				//Tell the panel that is is labeled by the tab
				$panel.attr('aria-labelledby', $tab.attr('id'));
			});
		},

		firstTrig;

	var Plugin = {
		initialize : function() {
			$(function() {
				if (WDN.getPluginParam('tabs', 'useHashChange') === false) {
					useHashChange = false;
				}

				// Set up the event for when a tab is clicked
				var hashFromTabClick = false,
					$tabsWithSwitch = $(tabSelector).not('.disableSwitching');
				
				setupA11y($tabsWithSwitch);

				$tabsWithSwitch.on('click', 'a', function(ev) { //do something when a tab is clicked
					var trig = $(this),
						hash = getHashFromLink(this);

					if (!hash) {
						return true;
					}

					updateInterface(trig);

					if (!useHashChange) {
						Plugin.displayFromHash(hash);
					} else {
						hashFromTabClick = true;
						if (getCleanHash() != hash) {
							window.location.hash = hash;
						}
					}

					//(a11y) Prevent focus from leaving the tab so that arrow nav still works
					ev.target.focus();
					ev.preventDefault();
					
					return false;
				});

				// If we have some tabs setup the hash stuff
				if ($tabsWithSwitch.length) {
					var
						isValidTabHash = function(hash) {
							return validRE.test(hash);
						},
						isTabExists = function(hash) {
							return isValidTabHash(hash) && $(contentSelector + ' ' + jq(hash)).length;
						},
						setupFirstHash = function(hash) {
							var ignoreTabs = $();
							if (hash) {
								ignoreTabs = $(jq(hash)).closest(contentSelector).prev(tabSelector);
							}

							var tabs = $tabsWithSwitch.not(ignoreTabs);

							if (!firstTrig) {
								firstTrig = [];
								tabs.each(function() {
									var selPrefix = 'li.selected';

									if (!$(selPrefix, this).length) {
										selPrefix = '> li';
									}
									firstTrig.push($(selPrefix + ':first a:first', this)[0]);
								});
								firstTrig = $(firstTrig);
							}

							firstTrig.each(function() {
								var innerTrig = $(this);
								var hash = getHashFromLink(this);
								if (!hash || !isValidTabHash(hash)) {
									return;
								}
								updateInterface(innerTrig);
								Plugin.displayFromHash(hash);
							});
						};

					if (useHashChange) {
						var setupHashChange = function() {
							var firstRun = true;
							$(window).off('.wdn_tabs').on('hashchange.wdn_tabs', function() {
								var hash = getCleanHash();
								if (hash && !isValidTabHash(hash)) {
									return true;
								}

								if (isTabExists(hash)) {
									Plugin.displayFromHash(hash, firstRun || !hashFromTabClick);

									if (firstRun) {
										setupFirstHash(hash);
										firstRun = false;
									}
									if (hashFromTabClick) {
										hashFromTabClick = false;
									}
									return false; //consume this hash event
								} else if (firstRun || hash === '') {
									setupFirstHash();
									firstRun = false;
									return true; //we simulated a hash event (allow others to consume);
								}
							});
							$(window).hashchange();
						};

						if (!$.fn.hashchange) {
							require([hashPlugin], setupHashChange);
						} else {
							setupHashChange();
						}
					} else {
						// No hashchange listener, so simulate first run
						var hash = getCleanHash();
						if (isTabExists(hash)) {
							Plugin.displayFromHash(hash, true);
						} else {
							hash = '';
						}
						setupFirstHash(hash);
					}
				}
			});
		},

		displayFromHash: function(hash, forceUpdate) {
			var sel = $(jq(hash)),
				tabContents = sel.closest(contentSelector);
			tabContents.children().hide();
			sel.show().parentsUntil(contentSelector).show();
			sel.find('ul.slides').css({'height':'auto'});

			if (forceUpdate) {
				var trig = $(tabSelector + ' li a[href$="'+jq(hash)+'"]');
				if (trig.length) {
					updateInterface(trig.first());
					trig.get(0).scrollIntoView();
				}
			}
		}
	};

	return Plugin;
});
