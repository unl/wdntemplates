/**
 * Fetches the contents of a URL into a div.
 * @param url URL to get contents of.
 * @param id Unique ID of the element to place contents into.
 * @param err [optional] Error message on failure.
 */
function fetchURLInto(url,id,err) {
	
	WDN.get(url,null,function(data, textStatus){
		
		if (textStatus=='success') {
			document.getElementById(id).innerHTML = data;
		} else {
			if (undefined === err) {
				document.getElementById(id).innerHTML = 'Error loading results.';
			} else {
				document.getElementById(id).innerHTML = err;
			}
		}
	}

	);
}

function rotateImg(imgArray_str,elementId_str,secs_int){
	var imgArray;
	if (typeof imgArray_str == "string") {
		try {
			imgArray = eval("(" + imgArray_str + ")");
		} catch (e) {
			return;
		}
	} else if (imgArray_str instanceof Array) {
		imgArray = imgArray_str;
	} else {
		return
	}
	
	if (!imgArray.length) {
		return;
	}
	
	var Rotator = function(aImgs, sElemId, iSecs) {
		this.imgArray = aImgs;
		this.timeout  = iSecs;
		this.elemId   = sElemId;
		
		this.idx = Math.floor(this.imgArray.length * Math.random());
		
		this.rotate();
	};
	Rotator.prototype.rotate = function() {
		var el = WDN.jQuery('#' + this.elemId);
		
		if (el.length) {
			try {
				el.attr({ 
					src: this.imgArray[this.idx][0],
					alt: this.imgArray[this.idx][1]
				});
			} catch (e) {
				return;
			}
			
			var link = el.parent("a");
			var href = this.imgArray[this.idx][2];
			if (this.imgArray[this.idx][2]) {
				if (!link.length) {
					link = WDN.jQuery("<a>");
					el.wrap(link);
				}
				link.attr("href", href);
				
				if (this.imgArray[this.idx][3]) {
					var onclick = eval("(" + this.imgArray[this.idx][3] + ")");
					if (typeof onclick == "function") {
						el.click(onclick);
					}
				}
			} else if (link.length) {
				link.attr("href", "#");
			}
			
			this.idx++;
			if (this.idx >= this.imgArray.length) {
				this.idx = 0;
			}
			
			if (this.timeout > 0 && this.imgArray.length > 1) {
				var self = this;
				setTimeout(function() {
					self.rotate();
				}, this.timeout * 1000);
			}
		}
	};
	
	var inst = new Rotator(imgArray, elementId_str, secs_int);
	
	return true;
}

function newRandomPromo(xmluri){
	var promoContent = new WDN.proxy_xmlhttp();
	promoContent.open("GET", xmluri, true);
	promoContent.onreadystatechange = function(){
		if (promoContent.readyState == 4) {
			if (promoContent.status == 200) {
				var xmlObj = promoContent.responseXML.documentElement;
				var promoNum = xmlObj.getElementsByTagName('promo').length;	
				//generates random number
				var aryId=Math.floor(Math.random()*promoNum);
				
				//pull promo data
				var contentContainer = xmlObj.getElementsByTagName('contentContainer')[0].childNodes[0].nodeValue;
				var promoTitle = xmlObj.getElementsByTagName('promo')[aryId].getAttribute("id");
				var promoMediaType = xmlObj.getElementsByTagName('promo')[aryId].getElementsByTagName('media')[0].getAttribute("type");
				var promoText = ' ';
				try {
					var promoMediaURL = xmlObj.getElementsByTagName('promo')[aryId].getElementsByTagName('media')[0].childNodes[0].nodeValue;
					promoText = xmlObj.getElementsByTagName('promo')[aryId].getElementsByTagName('text')[0].childNodes[0].nodeValue;
				} catch(e) {
					promoText = ' ';
				}
				var promoLink = xmlObj.getElementsByTagName('promo')[aryId].getElementsByTagName('link')[0].childNodes[0].nodeValue;
				
				//different mime type embed
				if (promoMediaType == 'image') {
					document.getElementById(contentContainer).innerHTML = '<a class="imagelink" href="' + promoLink + '" title="' + promoTitle + '" /><img src="' + promoMediaURL + '" alt="promo" class="frame" /></a>\n<p>' + promoText + '</p>\n';
				} else if (promoMediaType == 'flash') {
					document.getElementById(contentContainer).innerHTML = '<div class="image_small_short">\n<object width="210" height="80" wmode="opaque"><param name="movie" value="' + promoMediaURL + '"><embed src="' + promoMediaURL + '" width="210" height="80"></embed></object>\n</div>\n<p>' + promoText +'</p>\n';
				}
			} else {
				// Error loading file!
			}
		}
		promoContent = new XMLHTTP();
	};
	promoContent.send(null);
}

function addLoadEvent(func){
	WDN.jQuery(document).ready(func);
}

var wraphandler = {

	addEvent: function( obj, type, fn ) {
		if ( obj.attachEvent ) {
			obj['e'+type+fn] = fn;
			obj[type+fn] = function(){obj['e'+type+fn]( window.event );};
			obj.attachEvent( 'on'+type, obj[type+fn] );
		} else {
			obj.addEventListener( type, fn, false );
		}
	}

};

var XMLHTTP=WDN.proxy_xmlhttp;

 function stripe(id) {
	 WDN.jQuery('#'+id).addClass('zentable');
	 WDN.browserAdjustments();
  }

