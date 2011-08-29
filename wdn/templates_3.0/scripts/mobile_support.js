mobile_support = function() {
	return {
		initialize : function() {
			window.addEventListener('orientationchange', mobile_support.setOrientation, false);
			document.addEventListener('DOMContentLoaded', 
				function(){
					// For our smarter browsers (the ones that are reading this), let's enhance the nav
					mobile_support.enhanceNavigation.initialize();
					mobile_support.fixOrientation(document);
					mobile_support.fixSearch();
					//scroll to the top of content for devices which have the address bar available at top.
					if (window.pageYOffset < 1) {
						window.scrollTo(0, 1);
					}
				},
				false
			);
		},
		
		fixSearch : function(){
			document.getElementById('wdn_search_form').setAttribute('action','http://www1.unl.edu/search/');
			var fs = document.getElementById('wdn_search_form').getElementsByTagName('fieldset')[0];
			mi = document.createElement('input');
			mi.setAttribute('name', 'format');
			mi.setAttribute('value', 'mobile');
			mi.setAttribute('type', 'hidden');
			fs.appendChild(mi);
		},
		
		fixOrientation : function(doc) { //iOS has a bug for scaling when rotating devices. This is a hack to fix the bug. See: https://gist.github.com/901295
			var addEvent = 'addEventListener',
		    type = 'gesturestart',
		    qsa = 'querySelectorAll',
		    scales = [1, 1],
		    meta = qsa in doc ? doc[qsa]('meta[name=viewport]') : [];

			function fix() {
				meta.content = 'width=device-width,minimum-scale=' + scales[0] + ',maximum-scale=' + scales[1];
				doc.removeEventListener(type, fix, true);
			}
	
			if ((meta = meta[meta.length - 1]) && addEvent in doc) {
				fix();
				scales = [.25, 1.6];
				doc[addEvent](type, fix, true);
			}
		},
		
		enhanceNavigation: function(){
			return {
				initialize : function(){
					navigation = document.getElementById("navigation");
					primaryNav = navigation.getElementsByTagName('ul')[0];
					if(primaryNav == undefined){
						navigation.className = 'disabled';
						return;
					}
					secondaryNavs = primaryNav.getElementsByTagName('ul');
					//Bind the click/tap to the navigation bar to present user with navigation and ability to close navigation.
					navigation.onclick = function() {
						mobile_support.enhanceNavigation.showPrimary(navigation.getElementsByTagName('ul')[0]);
					};
					primaryNavs = navigation.getElementsByTagName('ul')[0].children;
					var i = 0;
					for(i=0;i<=primaryNavs.length;i++){
						if(primaryNavs[i] != undefined){
							primaryNavs[i].onclick = function(){
								event.stopPropagation();
								mobile_support.enhanceNavigation.showSecondary(this);
							};
							if((primaryNavs[i].getElementsByTagName('ul')).length > 0){
								primaryNavs[i].className = 'hasSecondary';
							}
						}
					};
				},
				
				showPrimary : function(primaryNav){
					primaryNav = primaryNav;
					primaryNav.style.left = 0;
					mobile_support.enhanceNavigation.setupNavNav();
				},
				
				showSecondary : function(secondaryNav){
					secondarySiblings = secondaryNav.parentNode.children;
					var i = 0;
					for(i=0;i<=secondarySiblings.length;i++){
						if(secondarySiblings[i] != undefined && secondarySiblings[i].getElementsByTagName('ul')[0] != undefined) {
							secondarySiblings[i].getElementsByTagName('ul')[0].style.left = '100%';
						}
					}
					secondaryNav.getElementsByTagName('ul')[0].style.left = 0;
					navNav.className = 'secondary';
				},
				
				setupNavNav : function() {
					navNav = document.createElement('a');
					navNav.setAttribute('id', 'navNav');
					navNav.innerHTML = 'Back';
					navNav.className = 'primary';
					document.getElementById('wdn_navigation_wrapper').insertBefore(navNav, navigation);
					navNav.onclick = function(){
						mobile_support.enhanceNavigation.traverseNavigation(navNav);
					};
				},
				
				traverseNavigation : function() {
					if (navNav.className == 'primary') { //we're showing the primary nav, so close it
						primaryNav.style.left = '100%';
						navNav.parentNode.removeChild(navNav);
					} else { // we're showing the secondary nav, close it and trigger primary
						var i = 0;
						for(i=0;i<=secondaryNavs.length;i++){
							if(secondaryNavs[i] != undefined){
								secondaryNavs[i].style.left = '100%';
							}
						};
						navNav.className = 'primary';
					}
				}
			};
		}()
	};
}();
mobile_support.initialize();