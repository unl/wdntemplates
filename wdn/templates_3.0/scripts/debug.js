
var e = document.createElement("script");
e.setAttribute('src', 'wdn.js');
e.setAttribute('type','text/javascript');
document.getElementsByTagName('head').item(0).appendChild(e);


var executeCallback = function() {
    WDN.initializeTemplate();
};

e.onreadystatechange = function() {
    if (e.readyState == "loaded" || e.readyState == "complete"){
        executeCallback();
    }
};
e.onload = executeCallback;
