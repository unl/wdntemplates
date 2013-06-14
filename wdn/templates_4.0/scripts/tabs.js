define(['jquery', 'wdn', 'require'], function($, WDN, require) {
	var 
		useHashChange = true,
		
		hashPlugin = 'plugins/hashchange/jquery.hashchange.min',
		
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
			$('li.' + selected, tabs).removeClass(selected);
			
			// Hide any subtabs
			$('ul', tabs).hide();
			
			// Add the selected class to the tab (and sub-tab)
			parentTabs.addClass(selected);
			
			tabs.css('margin-bottom', '');
			
			// Show any relevant sub-tabs
			if (sibs.length || parentTabs.length > 1) {
				if (!sibs.length) {
					sibs = trig.closest('ul');
				}
				sibs.show();
				
				tabs.css('margin-bottom', (parseInt(tabs.css('margin-bottom'), 10) + sibs.outerHeight(true))  + 'px');
			}
			
			nsel = trig.closest('li').siblings('.' + selected);
			trig.trigger('tabchanged', [curr, nsel, tabs]);
		},
		
		firstTrig;
	
	var Plugin = {
		initialize : function() {
			WDN.log("tabs JS loaded");
			
			if (WDN.getPluginParam('tabs', 'useHashChange') === false) {
				useHashChange = false;
			}
			
			// Set up the event for when a tab is clicked
			var hashFromTabClick = false,
				$tabsWithSwitch = $(tabSelector).not('.disableSwitching');
			
			$tabsWithSwitch.find('a').click(function() { //do something when a tab is clicked
				var trig = $(this),
					hash = getHashFromLink(this);
				
				if (!hash) {
					return true;
				}
				
				updateInterface(trig);
				
				if (!useHashChange) {
					WDN.tabs.displayFromHash(hash);
				} else {
					hashFromTabClick = true;
					if (getCleanHash() != hash) {
						window.location.hash = hash;
					}
				}
				
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
						
						var tabs = $tabsWithSwitch.not(ignoreTabs),
							selPrefix = 'li.selected';
						
						if (!firstTrig) {
							if ($(selPrefix, tabs).length) {
								selPrefix = '> li';
							}
							firstTrig = $(selPrefix + ':first a:first', tabs);
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
						WDN.loadJQuery(function() {
							require([hashPlugin], setupHashChange);
						});
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
			
			return true;
		},
		
		displayFromHash: function(hash, forceUpdate) {
			var sel = $(jq(hash)),
				tabContents = sel.closest(contentSelector);
			tabContents.children().hide();
			sel.show().parentsUntil(contentSelector).show();
			sel.find('ul.slides').css({'height':'auto'});
			
			if (forceUpdate) {
				var trig = $(tabSelector + ' li a[href$='+jq(hash)+']');
				if (trig.length) {
					updateInterface(trig.first());
					trig.get(0).scrollIntoView();
				}
			}
		}
	};
	
	return Plugin;
});
