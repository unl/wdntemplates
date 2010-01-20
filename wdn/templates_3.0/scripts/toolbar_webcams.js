WDN.toolbar_webcams = function() {
    var unlwebcam = 'http://www.unl.edu/unlpub/cam/cam1.jpg';
    var rotundawebcam = 'http://www.unl.edu/unlpub/cam/cam2.jpg';
    var NEUwebcam = 'http://www.unl.edu/unlpub/cam/cam3.jpg';
    return {
        initialize : function() {

        },
        setupToolContent : function() {
        	return '<div class="col left"><h3>Nebraska Union Plaza <a href="http://www.unl.edu/unlpub/cam/cam1.shtml" class="external">(live view)</a></h3><img class="frame" src="http://www.unl.edu/unlpub/cam/cam1.jpg" alt="Plaze Cam" id="webcamuri1" /></div><div class="col middle"><h3>Nebraska Union Rotunda <a href="http://www.unl.edu/unlpub/cam/cam2.shtml" class="external">(live view)</a></h3><img class="frame" src="http://www.unl.edu/unlpub/cam/cam2.jpg" alt="Rotunda Cam" id="webcamuri2" /></div><div class="col right"><h3>Nebraska East Union <a href="http://www.unl.edu/unlpub/cam/cam3.shtml" class="external">(live view)</a></h3><img class="frame" src="http://www.unl.edu/unlpub/cam/cam3.jpg" alt="East Union" id="webcamuri3" /></div>';
        },
        display : function() {
    		document.getElementById('webcamuri1').src = unlwebcam;
    		document.getElementById('webcamuri2').src = rotundawebcam;
    		document.getElementById('webcamuri3').src = NEUwebcam;
        }
    };
}();