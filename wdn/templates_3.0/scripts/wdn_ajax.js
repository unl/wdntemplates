(function( jQuery ) {

// Default jsonp settings
jQuery.ajaxSetup({
	proxyUrl: "//ucommsrv.unl.edu/jsonp_proxy/",
	maxProxyLength: 2000
});

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
						xdr.send( ( s.hasContent && s.data ) || null );
//						setTimeout( function() { xdr.send( ( s.hasContent && s.data ) || null )}, 0);
					},
					
					abort: function() {
						xdr.abort();
					}
				};
			
			} else {
				
				// Use the Proxy
				
				var JSONPProxy = function() {
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
									md: origSrc.substr(i * max, max)
								}));
							}
						} else {
							requests.push(origSrc);
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
						
						jqXHR.always(function() {
							// Set callback back to previous value
							window[ jsonpCallback ] = previous;
						});
						
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
						
						xhr.send( ( s.hasContent && s.data ) || null );
						
						var callback = function() {
							if (callback && xhr.readyState === 4) {
								callback = undefined;
								
								xhr.onreadystatechange = jQuery.noop;
								
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