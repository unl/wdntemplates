mobile_support = function() {
	return {
		initialize : function() {
			window.addEventListener('orientationchange', mobile_support.setOrientation, false);
			mobile_support.setOrientation();
		},
		
		setOrientation : function() { //add class name to body for styling purposes.
			var orient = Math.abs(window.orientation) === 90 ? 'landscape' : 'portrait';
			document.getElementsByTagName('html')[0].setAttribute("class", orient);
		}
	};
}();
mobile_support.initialize();