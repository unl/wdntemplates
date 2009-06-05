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