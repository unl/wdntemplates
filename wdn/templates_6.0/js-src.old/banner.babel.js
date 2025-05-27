// WDN Notice Banner Display
function displayUNLNoticeBanner() {
    var bannerEnabled = true;
    if (bannerEnabled) {
        var messageContent = false;
        var messageSessionKey = 'UNLNoticeMessage';
        var sessionContent = sessionStorage.getItem(messageSessionKey);

        // clear saved message every fifteen minutes
        setInterval(function(){ sessionStorage.removeItem(messageSessionKey); }, (15 * 60 * 1000) );

        if (sessionContent) {
            messageContent = sessionContent;
            displayUNLNoticeBannerMessage(messageContent);
        } else {
            var xhr = new XMLHttpRequest();
            var bannerContentURL = 'https://its-unl-cms-prd-s3.s3.amazonaws.com/wdn-message.html';
            xhr.open('GET', bannerContentURL);
            xhr.send(null);
            xhr.onload = function(e) {
                if (xhr.status === 200) {
                    messageContent = xhr.responseText;
                    sessionStorage.setItem(messageSessionKey, messageContent);
                    displayUNLNoticeBannerMessage(messageContent);
                }
            }
        }
    }

    function displayUNLNoticeBannerMessage(messageContent) {
        if (messageContent) {
            var skipNav = document.getElementById('dcf-skip-nav');
            var banner = document.createElement('div');
            banner.setAttribute('role', 'navigation');
            banner.classList.add('dcf-d-none@print');
            banner.innerHTML = messageContent;
            if (skipNav) {
                skipNav.parentNode.insertBefore(banner, skipNav.nextSibling);
            } else {
                document.body.prepend(banner);
            }
        }
    }
}
displayUNLNoticeBanner();
