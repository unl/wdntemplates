WDN.toolbar_webcam = function() {
    var unlwebcam = 'http://www.unl.edu/unlpub/cam/cam1.jpg';
    var rotundawebcam = 'http://www.unl.edu/unlpub/cam/cam2.jpg';
    var NEUwebcam = 'http://www.unl.edu/unlpub/cam/cam3.jpg';
    return {
        initialize : function() {
        },
        display : function() {
        		document.getElementById('webcamuri1').src = unlwebcam;
        		document.getElementById('webcamuri2').src = rotundawebcam;
        		document.getElementById('webcamuri3').src = NEUwebcam;
        }
    };
}();