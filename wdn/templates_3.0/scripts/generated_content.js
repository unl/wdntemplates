WDN.generated_content = (function() {
	return {
		initialize : function() {
			var mimeAfter = ('a.external a.map a.email a.vcard a.pdf a.audio a.image a.document a.globe a.html a.video a.calendar a.clustan a.presentation a.spreadsheet a.zip a.feed a.script a.print ' + 
				'a[href$=".mov"] a[href$=".wmv"] a[href$=".mp4"] a[href$=".m4v"] a[href$=".zip"] a[href*=".doc"] a[href*=".ppt"] a[href*=".pps"] a[href*=".xls"] a[href$=".pdf"] a[href^="mailto:"] a[href^="http://maps.google.com"] ' +
				'a.mail-message-new a.text-vcard a.application-pdf a.audio-x-generic a.image-x-generic a.text-html a.text-x-script a.video-x-generic a.x-office-calendar a.x-office-document a.x-office-document-template a.x-office-presentation ' +
				'a.x-office-presentation-template a.x-office-spreadsheet a.x-office-spreadsheet-template a.application-msword a.application-vnd-ms-excel a.application-vnd-ms-powerpoint a.application-zip a.application-map').split(' ');
			
			WDN.loadJQuery(function() {
				
				// after-fix for mime
				for (var i = 0; i < mimeAfter.length; i++) {
					WDN.jQuery(mimeAfter[i]).each(function() {
						var $this = WDN.jQuery(this);
						if (!$this.children('.after-fix').length) {
							$this.append('<span class="after-fix"/>');
						}
					});
				}
			});
		}
	};
})();
