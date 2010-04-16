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
	});
};

/*
 * set up a promotional image rotator
 * @param imageArrayVariableName {string} the name of the variable that contains the image array
 *        (has to accept a string for backward compatibility)
 * @param elementID {string} the ID of the IMG element to use
 * @param rotationDelay {number} the amount of time before the image is swapped in seconds
 * @param OPTIONAL currentImage {number} the index of the element initially displayed, defaults to 0
 * 
 */
function rotateImg (imageArrayVariableName, elementID, rotationDelay, currentImage) {
	var imgArray = this[imageArrayVariableName],
	
		element = document.getElementById(elementID),
		
		arrayLength = imgArray.length;
	
	if (!imgArray || !element) {
		return false; 
	}
	
	// randomly select a starting image if not supplied
	if (!currentImage) {
		var currentImage = Math.floor(Math.random() * arrayLength);
	}
	
	// the function that will be called to change the image every x seconds
	function loop () {
		var imageData = imgArray[currentImage];
		
		element.src = imageData[0];
		element.alt = imageData[1];
		element.parentNode.href = imageData[2] || "#";
		if (imageData[3]) {
			element.parentNode.onclick = function () {
				return eval("(" + imageData[3] + ")");
			};
		}
		
		if (currentImage++ >= arrayLength - 1) {
			currentImage = 0;
		}
	};
	
	// run once to set the initial image
	loop();
	
	// if we only have one image there is no need to loop
	if (arrayLength < 2) {
		return false;
	}
	
	// start the loop
	return setInterval(loop, rotationDelay * 1000);
};

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
};

function addLoadEvent(func){
	WDN.jQuery(document).ready(func);
};

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
 };

