// WDN Notice Banner Display
function displayWDNNoticeBanner() {
    var bannerEnabled = true;
    if (bannerEnabled) {
        var messageContent = false;
        var messageSessionKey = 'wndNoticeMessage';
        var sessionContent = sessionStorage.getItem(messageSessionKey);

        // clear saved message every five minutes
        setInterval(function(){ sessionStorage.removeItem(messageSessionKey); }, 300000);

        if (sessionContent) {
            messageContent = sessionContent;
            displayWDNNoticeBannerMessage(messageContent);
        } else {
            var xhr = new XMLHttpRequest();
            var bannerContentURL = 'https://its-unl-cms-prd-s3.s3.amazonaws.com/wdn-message.html';
            xhr.open('GET', bannerContentURL);
            xhr.send(null);
            xhr.onload = function(e) {
                if (xhr.status === 200) {
                    messageContent = xhr.responseText;
                    sessionStorage.setItem(messageSessionKey, messageContent);
                    displayWDNNoticeBannerMessage(messageContent);
                }
            }
        }
    }

    function displayWDNNoticeBannerMessage(messageContent) {
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
displayWDNNoticeBanner();
