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
		initialize : function() {
			_gaq.push(
				['_setAccount', 'UA-3203435-1'],
				['_setDomainName', '.unl.edu'],
				['_setAllowLinker', true],
				['_setAllowHash', false]
			);
			_gaq.push(
				['m._setAccount', 'UA-3203435-4'],
				['m._setDomainName', '.unl.edu'],
				['m._setAllowLinker', true],
				['m._setAllowHash', false]
			);
			
			analytics.loadGA();
		},
		
		loadGA : function(){
			_gaq.push(['_trackPageview'],['m._trackPageview']);
			_gaq.push(['_trackPageLoadTime'], ['m._trackPageLoadTime']);
			
			(function(){
				var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
				ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
			    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
			})();
		}
	};
}();
analytics.initialize();