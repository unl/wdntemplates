/* The getProxyClass returns the constructor for an object based on
 * the XMLHTTP class initially developed by Alex Serebryakov (#0.9.1)
 * from www.ajaxextended.com (dead) and now extended at 
 * https://github.com/coolaj86/ajax-extended/
 */

(function( jQuery ) {
	
// Default proxy settings
jQuery.ajaxSetup({
	proxyUrl: "//ucommsrv.unl.edu/jsonp_proxy/",
	maxProxyLength: 2000,
	proxyKey: "c3dfb553c7a870a52fc4e3ba7c223a4f"
}); 

var getProxyClass = function( s, jqXHR ) {
	return function() {
		// public members
		this.status = null;
		this.statusText = null;
		this.responseText = null;
		this.readyState = 0;
		
		this.onreadystatechange = this.onerror = this.onload = jQuery.noop;
		
		// private members
		var _reqHeaders = {},
			_method, _url, _async,
			_user, _password,
			_respHeaders = {},
			_scripts = [];
		
		// private methods
		var _setReadyState = function(state) {
			this.readyState = state;
			if (this.onreadystatechange) {
				this.onreadystatechange();
			}
			if (state == 4) {
				this.onload();
			}
		};
		
		var _destroyScripts = function() {
			for (var i = 0; i < _scripts.length; i++) {
				_scripts[ i ].onload = _scripts[ i ].onreadystatechange = null;
				if ( _scripts[ i ].parentNode ) {
					_scripts[ i ].parentNode.removeChild(_scripts[ i ]);
				}
			}
			
			_scripts = [];
		};
		
		// public methods
		this.open = function(method, url, async, user, password) {
			if (!method) {
				throw "Missing AJAX method";
			}
			_method = method;
			
			if (!url) {
				throw "Missing AJAX url";
			}
			
			if (!/^\/\//.test(s.proxyUrl)) {
				if (url.substr(0,5) !== s.proxyUrl.substr(0, 5)) {
					throw "Given proxy doesn't support requests to requested URI scheme";
				}
			}
			_url = url;
			
			_user = user;
			_password = password;
			
			_setReadyState.call(this, 1);
		};
		this.openRequest = function(method, url, async, user, password) {
			this.open(method, url, async, user, password);
		};
		this.getResponseHeader = function(name) {
			for (var i in _respHeaders) {
				if (i.toLowerCase() == name.toLowerCase()) {
					return _respHeaders[i];
				}
			}
			return null;
		};
		this.getAllResponseHeaders = function() {
			var result = [];
			for (var i in _respHeaders) {
				result.push(i + ": " + _respHeaders[i]);
			}
			
			if (result.length) {
				return result.join("\r\n");
			}
			
			return null;
		};
		this.setRequestHeader = function(name, value) {
			for (var i in _reqHeaders) {
				if (i.toLowerCase() == name.toLowerCase()) {
					_reqHeaders[i] = value;
					return;
				}
			}
			
			_reqHeaders[name] = value;
		};
		this.send = function(body) {
			var responseContainer,
				jsonpCallback = s.jsonpCallback =
					jQuery.isFunction( s.jsonpCallback ) ? s.jsonpCallback() : s.jsonpCallback,
				previous = window [ jsonpCallback ];
				
			var req = {
					m: _method,
					u: _url,
					h: _reqHeaders,
					c: jsonpCallback
				}, 
				script, __self = this,
				head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement,
				i, requests = [], max = s.maxProxyLength, total = 1;

			if (body) {
				req.d = body;
			}
			if (_user || _password) {
				req.au = _user || "";
				req.ap = _password || "";
			}
			var origSrc = jQuery.param(req);
			if (max > 0) {
				total = Math.ceil(origSrc.length / max);
			}
			
			if (total > 1) {
				for (var i = 0; i < total; i++) {
					request.push(jQuery.param({
						mp: total,
						mo: i,
						c: jsonpCallback,
						md: origSrc.substr(i * max, max),
						k: s.proxyKey
					}));
				}
			} else {
				requests.push(origSrc + '&k=' + s.proxyKey);
			}
			
			// Install callback
			window[ jsonpCallback ] = function( response ) {
				_respHeaders = response.responseHeaders;
				__self.status = response.status;
				__self.statusText = response.statusText;
				__self.responseText = response.responseText;
				
				_destroyScripts.call(__self);
				_setReadyState.call(__self, 4);
			};
			
			var alwaysFunc = function() {
				// Set callback back to previous value
				window[ jsonpCallback ] = previous;
			};
			
			if (jqXHR) {
				jqXHR.always(alwaysFunc);
			} else {
				var prevOnError = this.onerror, prevOnLoad = this.onload;
				this.onerror = function() {
					alwaysFunc();
					prevOnError.call(this);
				};
				this.onload = function() {
					alwaysFunc();
					prevOnLoad.call(this);
				};
			}
			
			for (i = 0; i < requests.length; i++) {
				script = document.createElement( "script" );
				
				script.type = "text/javascript";
				
				if (_async) {
					script.async = "async";
				}
				
				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}
				
				script.src = s.proxyUrl + '?' + requests[i];
				
				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function() {
					if ( !script.readyState || /loaded|complete/.test( script.readyState ) ) {
						var i = jQuery.inArray(script, _scripts);
						if (i >= 0) {
							_scripts.splice(i, 1);
						}
						
						script = undefined;
						if (_scripts.length == 0 && __self.readyState != 4) {
							__self.onerror();
						}
					}
				};
				// Use insertBefore instead of appendChild  to circumvent an IE6 bug.
				// This arises when a base node is used (#2709 and #4378).
				head.insertBefore( script, head.firstChild );
				_scripts.push( script );
			}
		};
		
		this.abort = function() {
			_destroyScripts.call(this);
		};
	};
};

// Do we really need to expose the proxy object?
/*
window[ 'XMLHTTP' ] = WDN.proxy_xmlhttp = function() {
	var proxy = getProxyClass(jQuery.ajaxSettings);
	
	// Give a deprecation notice
	if ("console" in window && "warn" in console) {
		console.warn("DEPRECATION WARNING - Direct use of the proxy object is deprecated. Please use the jQuery AJAX methods.");
	}
	
	return proxy.call(this);
};
*/

if ( jQuery.support.ajax ) {
	
	jQuery.ajaxTransport(function( s, originalOptions, jqXHR ) {
		if ( s.crossDomain && !jQuery.support.cors && !s.isLocal ) {
			 
			// Cross domain for IE
			if ( window.XDomainRequest ) {

				// Get a new XDomainRequest
				var xdr = new XDomainRequest();
				
				return {
					send: function( _, complete ) {

						if ( s.timeout ) {
							xdr.timeout = s.timeout;
						}
						
						// Apply custom fields if provided
						if ( s.xhrFields ) {
							for ( i in s.xhrFields ) {
								xdr[ i ] = s.xhrFields[ i ];
							}
							
							if ( !s.xhrFields.onprogress ) {
								xdr.onprogress = jQuery.noop;
							}
						}
						
						xdr.onerror = function() {
							complete( -1, "XDomainRequest Error" );
						};
						
						xdr.ontimeout = function() {
							complete( 0, "XDomainRequest Timeout" );
						};
						
						xdr.onload = function() {
							complete( 200, "success", {text: xdr.responseText} );
						};
						
						xdr.open( s.type, s.url );
						
						// Do send the request
						// This may raise an exception which is actually
						// handled in jQuery.ajax (so no try/catch here)
//						xdr.send( ( s.hasContent && s.data ) || null );
						// Workaround for IE 9 issue load
						setTimeout( function() {
							xdr.send( ( s.hasContent && s.data ) || null );
						}, 0);
					},
					
					abort: function() {
						xdr.abort();
					}
				};
			
			} else {
				
				// Use the Proxy
				var JSONPProxy = getProxyClass( s, jqXHR );
				
				return {
					send: function( headers, complete ) {
						var xhr = new JSONPProxy();
						
						if ( s.username ) {
							xhr.open( s.type, s.url, s.async, s.username, s.password );
						} else {
							xhr.open( s.type, s.url, s.async );
						}
						
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
						
						xhr.onerror = function() {
							complete( -1, "Proxy Error, callback not called");
						};
						
						xhr.send( ( s.hasContent && s.data ) || null );
						
						var callback = function() {
							if (callback && xhr.readyState === 4) {
								callback = undefined;
								
								xhr.onerror = xhr.onreadystatechange = jQuery.noop;
								
								complete(xhr.status, xhr.statusText, { text: xhr.responseText }, xhr.getAllResponseHeaders());
							}
						};
						
						if (xhr.readyState === 4) {
							callback();
						} else {
							xhr.onreadystatechange = callback;
						}
					},
					
					abort: function( headers, complete ) {
						xhr.abort();
					}
				};
				
			}
			
		}
	});
}
	
})( WDN.jQuery );