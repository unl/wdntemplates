// What should be tracked in Google Analytics
// 
// 1. File downloads: .pdf, .doc., etc... put in the /downloads directory DONE
// 2. Social media share uses: track the clicks. Use event tracking DONE
// 3. External links: track links to outside the domain? put in /external directory DONE
// 4. Video usage tracking by default. Should be incorporated with the skin/video JS file
// 5. Navigation preferences. Which view is being used? Use event tracking DONE
// 6. Usage of the wdn_tools. Use event tracking DONE
// 7. Tab content. Use event tracking? Set up a way for departments to take advantage of this tracking?
// 
// WDN.analytics.callTrackEvent(category, action, optional_label, optional_value)
// WDN.analytics.callTrackPageview('/downloads/'+href);
//
// Department variable 'pageTracker' is available to use in this file.
var _gaq = _gaq || [];
analytics = function() { 
	return {
		//thisURL : String(window.location), //the current page the user is on.
		//rated : false, // whether the user has rated the current page.
		initialize : function() {
			_gaq.push(
				['_setAccount', 'UA-3203435-1'],
				['_setDomainName', '.unl.edu'],
				['_setAllowLinker', true],
				['_setAllowHash', false]
			);
			
			analytics.loadGA();
		},
		
		loadGA : function(){
			_gaq.push(['_trackPageview'],['m._trackPageview']);
			
			(function(){
				var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
				ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
			    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
			})();
			//analytics.setupHTML5tracking.intialize(); In it's current setup, there is too much reliance on WDN. We either need to bring in WDN to mobile or rework all of below for mobile.
		}/*,
		callTrackEvent: function(category, action, label, value) {
			if (value === undefined) {
				value = 0;
			}
			//var wdnSuccess = wdnTracker._trackEvent(category, action, label, value);
			_gaq.push(['_trackEvent', category, action, label, value]);
		},
		
		setupHTML5tracking: function() {
			
			return {
				intialize : function() {
					WDN.loadJS(
						'http://github.com/Modernizr/Modernizr/raw/master/modernizr.js', 
						function(){
							if (!window.Modernizr) {
							    WDN.log('Modernizr object not created.');
							    return;
							}
							
							WDN.analytics.setupHTML5tracking.checkCookie(Modernizr._version);
						}
					);	
				},
				
				checkCookie : function(mdVersion){
					var userAgent = navigator.userAgent.toLowerCase();//grab the broswer User Agent
					uAgent = userAgent.replace(/;/g, ''); //strip out the ';' so as not to bork the cookie
					var __html5 = WDN.getCookie('__html5'); //Previous UNL HTML5 test
					
					if (!__html5) { //We haven't run this test before, so let's do it.
						WDN.log('We have not run this test yet, let us track this browser!');
						WDN.analytics.setupHTML5tracking.setCookie(uAgent, mdVersion);
						return;
					}
					
					var unlHTML5 = __html5.split('|+|');
					//Let's check to see if either the browser or modernizr has changed since the last tracking
					if ((uAgent != unlHTML5[0]) || (mdVersion != unlHTML5[1])){
						WDN.log('We don\'t have a match, let us track this browser!');
						WDN.analytics.setupHTML5tracking.setCookie(uAgent, mdVersion);
					} else { //we have a match and nothing has changed, so do nothing more.
						WDN.log('Already have this browser tracked');
						return;
					}
				},
				
				setCookie : function(uAgent, mdVersion) {
					var name = '__html5';
					var value = uAgent +'|+|'+mdVersion; //combine gaVisitorID and Modernizr version
					WDN.setCookie(name, value, 31556926); //set a cookie for one year
					WDN.analytics.setupHTML5tracking.testBrowser();
				},
				
				testBrowser : function(){
					for (var prop in Modernizr) {
						if (typeof Modernizr[prop] === 'function') continue;
						if (prop == 'inputtypes' || prop == 'input') {
							for (var field in Modernizr[prop]) {
								if (Modernizr[prop][field]){
									//WDN.log(prop + ' ('+field+') ' + Modernizr[prop][field]);
									WDN.analytics.callTrackEvent('HTML5/CSS3 Support', prop + '-('+field+')', '');
								}
							}
						} else {
							if(Modernizr[prop]){
								//WDN.log(prop + ': ' + Modernizr[prop]);
								WDN.analytics.callTrackEvent('HTML5/CSS3 Support', prop, '');
							}
						}
					}
				}
			};
		}()*/
	};
}();
analytics.initialize();