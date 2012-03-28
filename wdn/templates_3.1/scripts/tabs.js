WDN.tabs = (function() {
	var jq = function(id) {
		return '#' + id.replace(/(:|\.)/g, '\\$1');
	};
	
	var getHashFromLink = function(link) {
		var uri = link.href.split('#');
		
		if (!uri[1]) {
			return false;
		}
		
		var currentPage = window.location.toString().split('#')[0];
		
		if (document.getElementsByTagName('base')[0]) {
			var basehref = document.getElementsByTagName('base')[0].getAttribute('href');
		}
		
		if (basehref) {
			if (currentPage != uri[0] && basehref != uri[0]) {
				return false;
			}
		} else {
			if (currentPage != uri[0]) {
				return false;
			}
		}
		
		return uri[1];
	};
	
	return {
		useHashChange : true,
		
		initialize : function() {
			WDN.log ("tabs JS loaded");

			// Set up the event for when a tab is clicked
			var hashFromTabClick = false,
				$tabsWithSwitch = WDN.jQuery('ul.wdn_tabs').not('.disableSwitching');
			
			$tabsWithSwitch.find('a').click(function() { //do something when a tab is clicked
				var trig = WDN.jQuery(this),
					hash = getHashFromLink(this);
				
				if (!hash) {
					return true;
				}
				
				WDN.tabs.updateInterface(trig);
				
				if (!WDN.tabs.useHashChange) {
					WDN.tabs.displayFromHash(hash);
				} else {
					hashFromTabClick = true;
					if (window.location.hash.replace('#', '') != hash) {
						window.location.hash = hash;
					}
				}
				
				return false;
			});
			
			// Adds spacing if subtabs are present
			if (WDN.jQuery('#maincontent ul.wdn_tabs li ul').length) {
				WDN.jQuery('#maincontent ul.wdn_tabs').css({'margin-bottom':'70px'});
				if (ie7) {
					WDN.jQuery('#maincontent ul.wdn_tabs li ul li').css({'display':'inline'});
				}
			}

			// If we have some tabs setup the hash stuff
			if ($tabsWithSwitch.length) {
				var isValidTabHash = function(hash) {
					var validRE = /^[a-z][\w:\-\.]*$/i;
					return validRE.test(hash);
				};
				var setupFirstHash = function(hash) {
					var ignoreTabs = WDN.jQuery();
					if (hash) {
						ignoreTabs = WDN.jQuery(jq(hash)).closest('.wdn_tabs_content').prev('ul.wdn_tabs');
					}
					
					var tabs = $tabsWithSwitch.not(ignoreTabs);
					
					if (WDN.jQuery('li.selected', tabs).length) {
						var trig = WDN.jQuery('li.selected:first a:first', tabs);
					} else {
						var trig = WDN.jQuery('> li:first a:first', tabs);
					}
					
					trig.each(function() {
						var innerTrig = WDN.jQuery(this);
						var hash = getHashFromLink(this);
						if (!hash || !isValidTabHash(hash)) {
							return;
						}
						WDN.tabs.updateInterface(innerTrig);
						WDN.tabs.displayFromHash(hash);
					});
				};
				
				if (WDN.tabs.useHashChange) {
					var setupHashChange = function() {
						WDN.jQuery(function($) {
							var firstRun = true;
							$(window).unbind('.wdn_tabs').bind('hashchange.wdn_tabs', function(e) {
								var hash = location.hash.replace('#', '');
								if (hash && !isValidTabHash(hash)) {
									return true;
								}
								if (hash != '' && $('.wdn_tabs_content ' + jq(hash)).length) {
									WDN.tabs.displayFromHash(hash, firstRun || !hashFromTabClick);
									if (firstRun) {
										setupFirstHash(hash);
										firstRun = false;
									}
									if (hashFromTabClick) {
										hashFromTabClick = false;
									}
									return false; //consume this hash event
								} else if (firstRun) {
									setupFirstHash();
									firstRun = false;
									return true; //we simulated a hash event (allow others to consume);
								}
							});
							$(window).hashchange();
						});
					};
					if (!WDN.jQuery.fn.hashchange) {
						WDN.loadJS(WDN.getTemplateFilePath('scripts/plugins/hashchange/jQuery.hashchange.1-3.min.js'), setupHashChange);
					} else {
						setupHashChange();
					}
				} else {
					// No hashchange listener, so simulate first run
					var hash = location.hash.replace('#', '');
					if (isValidTabHash(hash) && WDN.jQuery('.wdn_tabs_content ' + jq(hash)).length) {
							WDN.tabs.displayFromHash(hash, true);
					} else {
						hash = '';
					}
					setupFirstHash(hash);
				}
			}
			
			return true;
		},
		
		updateInterface: function(trig) {
			var tabs = trig.closest('ul.wdn_tabs'),
				curr = trig.closest('li').siblings('.selected'),
				sibs = trig.siblings(),
				parentTabs = trig.parents('li');
			
			// Remove any selected tab class
			WDN.jQuery('li.selected', tabs).removeClass('selected');
			
			// Hide any subtabs
			WDN.jQuery('ul', tabs).hide();
			
			// Add the selected class to the tab (and sub-tab)
			parentTabs.addClass('selected');
			
			tabs.css('margin-bottom', '');
			
			// Show any relevant sub-tabs
			if (sibs.length || parentTabs.length > 1) {
				if (!sibs.length) {
					sibs = trig.closest('ul');
				}
				sibs.show();
				
				tabs.css('margin-bottom', (parseInt(tabs.css('margin-bottom'), 10) + sibs.outerHeight(true))  + 'px');
			}
			
			var nsel = trig.closest('li').siblings('.selected');
			trig.trigger('tabchanged', [curr, nsel, tabs]);
		},
		
		displayFromHash: function(hash, forceUpdate) {
			var sel = WDN.jQuery(jq(hash));
			var tabContents = sel.closest('.wdn_tabs_content');
			tabContents.children().hide();
			sel.show().parentsUntil('.wdn_tabs_content').show();
			sel.find('ul.slides').css({'height':'auto'});
			
			if (forceUpdate) {
				var trig = WDN.jQuery('ul.wdn_tabs li a[href$='+jq(hash)+']');
				if (trig.length) {
					WDN.tabs.updateInterface(trig.first());
				}
			}
		}
	};
})();
