/**
 * Fetches the contents of a URL into a div.
 * @param url URL to get contents of.
 * @param id Unique ID of the element to place contents into.
 * @param err [optional] Error message on failure.
 */
function fetchURLInto(url,id,err) {
	var xreq = new WDN.proxy_xmlhttp();
	xreq.open("GET", url, true);
	xreq.onreadystatechange = function() 
	{
		try {
			if (xreq.readyState == 4) {
				if (xreq.status == 200) {
					document.getElementById(id).innerHTML = xreq.responseText;
				} else {
					if (undefined == err) {
						document.getElementById(id).innerHTML = 'Error loading results.';
					} else {
						document.getElementById(id).innerHTML = err;
					}
				}
			}
			xreq = new WDN.proxy_xmlhttp();
		} catch(e) {}
	}
	xreq.send(null);
}

function rotateImg(imgArray_str,elementId_str,secs_int,thisNum_int){
	function showIt() {
		try {
			
			if(obj.src!=null && eval(imgArray_str+"["+thisNum_int+"][0]")!=null)
				obj.src=eval(imgArray_str+"["+thisNum_int+"][0]");
			if(obj.alt!=null && eval(imgArray_str+"["+thisNum_int+"][1]")!=null)
				obj.alt=eval(imgArray_str+"["+thisNum_int+"][1]");
			if(obj.parentNode.href!=null && eval(imgArray_str+"["+thisNum_int+"][2]")!=null) {
				obj.parentNode.href=eval(imgArray_str+"["+thisNum_int+"][2]");
				if(eval(imgArray_str+"["+thisNum_int+"][3]")!=null) {
					var clickEvent = eval(imgArray_str+"["+thisNum_int+"][3]");
					obj.parentNode.onclick=function() {eval(clickEvent);}
				}
				else
					obj.parentNode.onclick=null;
			}
			else
				obj.parentNode.href='#';
		} catch(e) {}
	}
	
	if(thisNum_int==null)
		thisNum_int=Math.floor(Math.random()*eval(imgArray_str+".length"));
	if(thisNum_int >= eval(imgArray_str+".length"))
		thisNum_int = 0;
	if(eval(imgArray_str+"["+thisNum_int+"]")!=null){
		// Try and set img
		var obj = MM_findObj(elementId_str);
		
		showIt();
	}
	thisNum_int++;
	if(secs_int>0) {
		return setTimeout("rotateImg('"+imgArray_str+"','"+elementId_str+"',"+secs_int+","+thisNum_int+")",secs_int*1000);
	} else {
		return true;
	}
}

function MM_findObj(n, d) { //v4.01
	  var p,i,x;  if(!d) d=document; if((p=n.indexOf("?"))>0&&parent.frames.length) {
	    d=parent.frames[n.substring(p+1)].document; n=n.substring(0,p);}
	  if(!(x=d[n])&&d.all) x=d.all[n]; for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
	  for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=MM_findObj(n,d.layers[i].document);
	  if(!x && d.getElementById) x=d.getElementById(n); return x;
	}

function newRandomPromo(xmluri){
	var promoContent = new XMLHTTP();
	promoContent.open("GET", xmluri, true);
	promoContent.onreadystatechange = function(){
		if (promoContent.readyState == 4) {
			if (promoContent.status == 200) {
				var xmlObj = promoContent.responseXML.documentElement;
				var promoNum = xmlObj.getElementsByTagName('promo').length;	
				//generates random number
				var aryId=Math.floor(Math.random()*promoNum)
				
				//pull promo data
				var contentContainer = xmlObj.getElementsByTagName('contentContainer')[0].childNodes[0].nodeValue;
				var promoTitle = xmlObj.getElementsByTagName('promo')[aryId].getAttribute("id");
				var promoMediaType = xmlObj.getElementsByTagName('promo')[aryId].getElementsByTagName('media')[0].getAttribute("type");
				try{
					var promoMediaURL = xmlObj.getElementsByTagName('promo')[aryId].getElementsByTagName('media')[0].childNodes[0].nodeValue;
					var promoText = xmlObj.getElementsByTagName('promo')[aryId].getElementsByTagName('text')[0].childNodes[0].nodeValue;
				}catch(e){
					var promoText = ' ';
				}										
				var promoLink = xmlObj.getElementsByTagName('promo')[aryId].getElementsByTagName('link')[0].childNodes[0].nodeValue;
				
				//different mime type embed
				if (promoMediaType == 'image') {
					document.getElementById(contentContainer).innerHTML = '<div class="image_small_short">\n<a class="imagelink" href="' + promoLink + '" title="' + promoTitle + '" /><img src="' + promoMediaURL + '" alt="promo" /></a>\n</div>\n' + promoText;
				} else if (promoMediaType == 'flash') {
					document.getElementById(contentContainer).innerHTML = '<div class="image_small_short">\n<object width="210" height="80" wmode="opaque"><param name="movie" value="' + promoMediaURL + '"><embed src="' + promoMediaURL + '" width="210" height="80"></embed></object>\n</div>' + promoText;
				}
			} else {
				// Error loading file!
			}
		}
		promoContent = new XMLHTTP();
 	}
	promoContent.send(null);	
}

function addLoadEvent(func){var oldonload=window.onload;if(typeof window.onload!='function'){window.onload=func;}else{window.onload=function(){if(oldonload){oldonload();}
func();}}}

var XMLHTTP=WDN.proxy_xmlhttp;