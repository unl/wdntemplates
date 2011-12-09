/**
 * Fetches the contents of a URL into a div.
 * @param url URL to get contents of.
 * @param id Unique ID of the element to place contents into.
 * @param err [optional] Error message on failure.
 */
function fetchURLInto(url,id,err) {
	WDN.jQuery('#' + id).load(url, function(data, status, jqXHR) {
		if (jqXHR.isRejected()) {
			if (err === undefined) {
				err = 'Error loading results.';
			}
			WDN.jQuery(this).html(err);
		}
	});
};

function rotateImg(imgArray,elemId,secs,i) {
	if (typeof imgArray == "string") {
		if (window[imgArray] === undefined) {
			return false;
		}
		imgArray = window[imgArray];
	}
	
	if (!imgArray.length) {
		return false;
	}
	
	var obj = document.getElementById(elemId);
	if (!obj) {
		return false;
	}

	if (i === undefined) {
		i = Math.floor(Math.random() * imgArray.length);
	}
	if (i >= imgArray.length) {
		i = 0;
	}
	
	if (!!imgArray[i]) {
		try {
			if (imgArray[i][0]) {
				obj.src = imgArray[i][0];
			}
			
			if (imgArray[i][1]) {
				obj.alt = imgArray[i][1];
			}
			
			if (obj.parentNode.href && imgArray[i][2]) {
				obj.parentNode.href = imgArray[i][2];
				if (imgArray[i][3]) {
					obj.parentNode.onclick = function() {
						eval("(" + imgArray[i][3] + ")");
					};
				} else {
					obj.parentNode.onclick = null;
				}
			} else {
				obj.parentNode.href = "#";
			}
		} catch (e) {
			return false;
		}
	}
	
	i++;
	
	if (secs > 0) {
		return setTimeout(function() {
			rotateImg(imgArray, elemId, secs, i);
		}, secs * 1000);
	}
	
	return true;
};

function newRandomPromo(xmluri) {
	WDN.jQuery.get(xmluri, function(data) {
		var xmlObj = data.documentElement;
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
	}, 'xml');
};

function addLoadEvent(func) {
	WDN.jQuery(document).ready(func);
};

function stripe(id) {
	WDN.jQuery('#'+id).addClass('zentable');
	WDN.browserAdjustments();
};
