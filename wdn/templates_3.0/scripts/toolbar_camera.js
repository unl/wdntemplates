WDN.toolbar_webcam = function() {
    var unlwebcam = 'http://www.unl.edu/unlpub/cam/cam1.jpg';
    var rotundawebcam = 'http://www.unl.edu/unlpub/cam/cam2.jpg';
    var NEUwebcam = 'http://www.unl.edu/unlpub/cam/cam3.jpg';
    var initialized = false;
    return {
        initialize : function() {
	    	if (initialized) {
				return true;
			}
    		jQuery('#toolbarcontent').append('<div id="cameracontent"><div class="col"><h3>Nebraska Union Plaza</h3><img class="frame" src="http://www.unl.edu/unlpub/cam/cam1.jpg" alt="Plaze Cam" id="webcamuri1" /></div><div class="col"><h3>Nebraska Union Rotunda</h3><img class="frame" src="http://www.unl.edu/unlpub/cam/cam2.jpg" alt="Rotunda Cam" id="webcamuri2" /></div><div class="col"><h3>Nebraska East Union</h3><img class="frame" src="http://www.unl.edu/unlpub/cam/cam3.jpg" alt="East Union" id="webcamuri3" /></div></div>');
    		initialized = true;
        },
        display : function() {
    		document.getElementById('webcamuri1').src = unlwebcam;
    		document.getElementById('webcamuri2').src = rotundawebcam;
    		document.getElementById('webcamuri3').src = NEUwebcam;
        }
    };
}();
WDN.toolbar_camera = WDN.toolbar_webcam;