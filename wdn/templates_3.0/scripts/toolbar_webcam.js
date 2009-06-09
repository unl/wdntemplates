WDN.toolbar_webcam = function() {
    var unlwebcam = 'http://www.unl.edu/unlpub/cam/cam1.jpg';
    return {
        initialize : function() {
        },
        display : function() {
        		document.getElementById('webcamuri').src = unlwebcam;
        }
    };
}();