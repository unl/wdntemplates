mobile_support = function() {
	return {
		initialize : function() {
			window.addEventListener('orientationchange', mobile_support.setOrientation, false);
			document.addEventListener('DOMContentLoaded', 
				function(){
					mobile_support.setOrientation();
					// For our smarter browsers (the ones that are reading this), let's enhance the nav
					mobile_support.enhanceNavigation.initialize();
				},
				false
			);
		},
		
		setOrientation : function() { //add class name to html for styling purposes.
			var orient = Math.abs(window.orientation) === 90 ? 'landscape' : 'portrait';
			document.getElementsByTagName('html')[0].setAttribute("class", orient);
		},
		
		enhanceNavigation: function(){
			return {
				initialize : function(){
					navigation = document.getElementById("navigation");
					navigation.onclick = function() {
						mobile_support.enhanceNavigation.showPrimary(navigation.getElementsByTagName('ul')[0]);
					};
					primaryNav = navigation.getElementsByTagName('ul')[0];
					secondaryNavs = primaryNav.getElementsByTagName('ul');
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