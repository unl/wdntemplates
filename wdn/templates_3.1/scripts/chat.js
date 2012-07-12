WDN.chat = function() {
    return {
        initialize : function() {
            WDN.loadJS("http://ucommchat.unl.edu/js/chat.php?version=" + WDN.getHTMLVersion());
        }
    };
}();
