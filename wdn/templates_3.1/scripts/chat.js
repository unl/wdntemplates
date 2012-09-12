WDN.chat = function() {
    return {
        initialize : function() {
            WDN.loadJS(('https:' == document.location.protocol ? 'https://' : 'http://') + "ucommchat.unl.edu/js/chat.php?version=" + WDN.getHTMLVersion());
        }
    };
}();
