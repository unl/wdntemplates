/*!
 * jQuery JavaScript Library v1.4.4
 * http://jquery.com/
 *
 * Copyright 2010, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 * Copyright 2010, The Dojo Foundation
 * Released under the MIT, BSD, and GPL Licenses.
 *
 * Date: Thu Nov 11 19:04:53 2010 -0500
 */
(function( window, undefined ) {

// Use the correct document accordingly with window argument (sandbox)
var document = window.document;
var jQuery = (function() {

// Define a local copy of jQuery
var jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context );
	},

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// A simple way to check for HTML strings or ID strings
	// (both of which we optimize for)
	quickExpr = /^(?:[^<]*(<[\w\W]+>)[^>]*$|#([\w\-]+)$)/,

	// Is it a simple selector
	isSimple = /^.[^:#\[\.,]*$/,

	// Check if a string has a non-whitespace character in it
	rnotwhite = /\S/,
	rwhite = /\s/,

	// Used for trimming whitespace
	trimLeft = /^\s+/,
	trimRight = /\s+$/,

	// Check for non-word characters
	rnonword = /\W/,

	// Check for digits
	rdigit = /\d/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,

	// Useragent RegExp
	rwebkit = /(webkit)[ \/]([\w.]+)/,
	ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
	rmsie = /(msie) ([\w.]+)/,
	rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/,

	// Keep a UserAgent string for use with jQuery.browser
	userAgent = navigator.userAgent,

	// For matching the engine and version of the browser
	browserMatch,
	
	// Has the ready events already been bound?
	readyBound = false,
	
	// The functions to execute on DOM ready
	readyList = [],

	// The ready event handler
	DOMContentLoaded,

	// Save a reference to some core methods
	toString = Object.prototype.toString,
	hasOwn = Object.prototype.hasOwnProperty,
	push = Array.prototype.push,
	slice = Array.prototype.slice,
	trim = String.prototype.trim,
	indexOf = Array.prototype.indexOf,
	
	// [[Class]] -> type pairs
	class2type = {};

jQuery.fn = jQuery.prototype = {
	init: function( selector, context ) {
		var match, elem, ret, doc;

		// Handle $(""), $(null), or $(undefined)
		if ( !selector ) {
			return this;
		}

		// Handle $(DOMElement)
		if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;
		}
		
		// The body element only exists once, optimize finding it
		if ( selector === "body" && !context && document.body ) {
			this.context = document;
			this[0] = document.body;
			this.selector = "body";
			this.length = 1;
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			// Are we dealing with HTML string or an ID?
			match = quickExpr.exec( selector );

			// Verify a match, and that no context was specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					doc = (context ? context.ownerDocument || context : document);

					// If a single string is passed in and it's a single tag
					// just do a createElement and skip the rest
					ret = rsingleTag.exec( selector );

					if ( ret ) {
						if ( jQuery.isPlainObject( context ) ) {
							selector = [ document.createElement( ret[1] ) ];
							jQuery.fn.attr.call( selector, context, true );

						} else {
							selector = [ doc.createElement( ret[1] ) ];
						}

					} else {
						ret = jQuery.buildFragment( [ match[1] ], [ doc ] );
						selector = (ret.cacheable ? ret.fragment.cloneNode(true) : ret.fragment).childNodes;
					}
					
					return jQuery.merge( this, selector );
					
				// HANDLE: $("#id")
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $("TAG")
			} else if ( !context && !rnonword.test( selector ) ) {
				this.selector = selector;
				this.context = document;
				selector = document.getElementsByTagName( selector );
				return jQuery.merge( this, selector );

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return (context || rootjQuery).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return jQuery( context ).find( selector );
			}

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if (selector.selector !== undefined) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The current version of jQuery being used
	jquery: "1.4.4",

	// The default length of a jQuery object is 0
	length: 0,

	// The number of elements contained in the matched element set
	size: function() {
		return this.length;
	},

	toArray: function() {
		return slice.call( this, 0 );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this.slice(num)[ 0 ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems, name, selector ) {
		// Build a new jQuery matched element set
		var ret = jQuery();

		if ( jQuery.isArray( elems ) ) {
			push.apply( ret, elems );
		
		} else {
			jQuery.merge( ret, elems );
		}

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		ret.context = this.context;

		if ( name === "find" ) {
			ret.selector = this.selector + (this.selector ? " " : "") + selector;
		} else if ( name ) {
			ret.selector = this.selector + "." + name + "(" + selector + ")";
		}

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},
	
	ready: function( fn ) {
		// Attach the listeners
		jQuery.bindReady();

		// If the DOM is already ready
		if ( jQuery.isReady ) {
			// Execute the function immediately
			fn.call( document, jQuery );

		// Otherwise, remember the function for later
		} else if ( readyList ) {
			// Add the function to the wait list
			readyList.push( fn );
		}

		return this;
	},
	
	eq: function( i ) {
		return i === -1 ?
			this.slice( i ) :
			this.slice( i, +i + 1 );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ),
			"slice", slice.call(arguments).join(",") );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},
	
	end: function() {
		return this.prevObject || jQuery(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	 var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	noConflict: function( deep ) {
		window.$ = _$;

		if ( deep ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},
	
	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,
	
	// Handle when the DOM is ready
	ready: function( wait ) {
		// A third-party is pushing the ready event forwards
		if ( wait === true ) {
			jQuery.readyWait--;
		}

		// Make sure that the DOM is not already loaded
		if ( !jQuery.readyWait || (wait !== true && !jQuery.isReady) ) {
			// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
			if ( !document.body ) {
				return setTimeout( jQuery.ready, 1 );
			}

			// Remember that the DOM is ready
			jQuery.isReady = true;

			// If a normal DOM Ready event fired, decrement, and wait if need be
			if ( wait !== true && --jQuery.readyWait > 0 ) {
				return;
			}

			// If there are functions bound, to execute
			if ( readyList ) {
				// Execute all of them
				var fn,
					i = 0,
					ready = readyList;

				// Reset the list of functions
				readyList = null;

				while ( (fn = ready[ i++ ]) ) {
					fn.call( document, jQuery );
				}

				// Trigger any bound ready events
				if ( jQuery.fn.trigger ) {
					jQuery( document ).trigger( "ready" ).unbind( "ready" );
				}
			}
		}
	},
	
	bindReady: function() {
		if ( readyBound ) {
			return;
		}

		readyBound = true;

		// Catch cases where $(document).ready() is called after the
		// browser event has already occurred.
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			return setTimeout( jQuery.ready, 1 );
		}

		// Mozilla, Opera and webkit nightlies currently support this event
		if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );
			
			// A fallback to window.onload, that will always work
			window.addEventListener( "load", jQuery.ready, false );

		// If IE event model is used
		} else if ( document.attachEvent ) {
			// ensure firing before onload,
			// maybe late but safe also for iframes
			document.attachEvent("onreadystatechange", DOMContentLoaded);
			
			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", jQuery.ready );

			// If IE and not a frame
			// continually check to see if the document is ready
			var toplevel = false;

			try {
				toplevel = window.frameElement == null;
			} catch(e) {}

			if ( document.documentElement.doScroll && toplevel ) {
				doScrollCheck();
			}
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	// A crude way of determining if an object is a window
	isWindow: function( obj ) {
		return obj && typeof obj === "object" && "setInterval" in obj;
	},

	isNaN: function( obj ) {
		return obj == null || !rdigit.test( obj ) || isNaN( obj );
	},

	type: function( obj ) {
		return obj == null ?
			String( obj ) :
			class2type[ toString.call(obj) ] || "object";
	},

	isPlainObject: function( obj ) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}
		
		// Not own constructor property must be Object
		if ( obj.constructor &&
			!hasOwn.call(obj, "constructor") &&
			!hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
			return false;
		}
		
		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
	
		var key;
		for ( key in obj ) {}
		
		return key === undefined || hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		for ( var name in obj ) {
			return false;
		}
		return true;
	},
	
	error: function( msg ) {
		throw msg;
	},
	
	parseJSON: function( data ) {
		if ( typeof data !== "string" || !data ) {
			return null;
		}

		// Make sure leading/trailing whitespace is removed (IE can't handle it)
		data = jQuery.trim( data );
		
		// Make sure the incoming data is actual JSON
		// Logic borrowed from http://json.org/json2.js
		if ( rvalidchars.test(data.replace(rvalidescape, "@")
			.replace(rvalidtokens, "]")
			.replace(rvalidbraces, "")) ) {

			// Try to use the native JSON parser first
			return window.JSON && window.JSON.parse ?
				window.JSON.parse( data ) :
				(new Function("return " + data))();

		} else {
			jQuery.error( "Invalid JSON: " + data );
		}
	},

	noop: function() {},

	// Evalulates a script in a global context
	globalEval: function( data ) {
		if ( data && rnotwhite.test(data) ) {
			// Inspired by code by Andrea Giammarchi
			// http://webreflection.blogspot.com/2007/08/global-scope-evaluation-and-dom.html
			var head = document.getElementsByTagName("head")[0] || document.documentElement,
				script = document.createElement("script");

			script.type = "text/javascript";

			if ( jQuery.support.scriptEval ) {
				script.appendChild( document.createTextNode( data ) );
			} else {
				script.text = data;
			}

			// Use insertBefore instead of appendChild to circumvent an IE6 bug.
			// This arises when a base node is used (#2709).
			head.insertBefore( script, head.firstChild );
			head.removeChild( script );
		}
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
	},

	// args is for internal usage only
	each: function( object, callback, args ) {
		var name, i = 0,
			length = object.length,
			isObj = length === undefined || jQuery.isFunction(object);

		if ( args ) {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.apply( object[ name ], args ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.apply( object[ i++ ], args ) === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.call( object[ name ], name, object[ name ] ) === false ) {
						break;
					}
				}
			} else {
				for ( var value = object[0];
					i < length && callback.call( value, i, value ) !== false; value = object[++i] ) {}
			}
		}

		return object;
	},

	// Use native String.trim function wherever possible
	trim: trim ?
		function( text ) {
			return text == null ?
				"" :
				trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				text.toString().replace( trimLeft, "" ).replace( trimRight, "" );
		},

	// results is for internal usage only
	makeArray: function( array, results ) {
		var ret = results || [];

		if ( array != null ) {
			// The window, strings (and functions) also have 'length'
			// The extra typeof function check is to prevent crashes
			// in Safari 2 (See: #3039)
			// Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
			var type = jQuery.type(array);

			if ( array.length == null || type === "string" || type === "function" || type === "regexp" || jQuery.isWindow( array ) ) {
				push.call( ret, array );
			} else {
				jQuery.merge( ret, array );
			}
		}

		return ret;
	},

	inArray: function( elem, array ) {
		if ( array.indexOf ) {
			return array.indexOf( elem );
		}

		for ( var i = 0, length = array.length; i < length; i++ ) {
			if ( array[ i ] === elem ) {
				return i;
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var i = first.length,
			j = 0;

		if ( typeof second.length === "number" ) {
			for ( var l = second.length; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		
		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var ret = [], retVal;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( var i = 0, length = elems.length; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var ret = [], value;

		// Go through the array, translating each of the items to their
		// new value (or values).
		for ( var i = 0, length = elems.length; i < length; i++ ) {
			value = callback( elems[ i ], i, arg );

			if ( value != null ) {
				ret[ ret.length ] = value;
			}
		}

		return ret.concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	proxy: function( fn, proxy, thisObject ) {
		if ( arguments.length === 2 ) {
			if ( typeof proxy === "string" ) {
				thisObject = fn;
				fn = thisObject[ proxy ];
				proxy = undefined;

			} else if ( proxy && !jQuery.isFunction( proxy ) ) {
				thisObject = proxy;
				proxy = undefined;
			}
		}

		if ( !proxy && fn ) {
			proxy = function() {
				return fn.apply( thisObject || this, arguments );
			};
		}

		// Set the guid of unique handler to the same of original handler, so it can be removed
		if ( fn ) {
			proxy.guid = fn.guid = fn.guid || proxy.guid || jQuery.guid++;
		}

		// So proxy can be declared as an argument
		return proxy;
	},

	// Mutifunctional method to get and set values to a collection
	// The value/s can be optionally by executed if its a function
	access: function( elems, key, value, exec, fn, pass ) {
		var length = elems.length;
	
		// Setting many attributes
		if ( typeof key === "object" ) {
			for ( var k in key ) {
				jQuery.access( elems, k, key[k], exec, fn, value );
			}
			return elems;
		}
	
		// Setting one attribute
		if ( value !== undefined ) {
			// Optionally, function values get executed if exec is true
			exec = !pass && exec && jQuery.isFunction(value);
		
			for ( var i = 0; i < length; i++ ) {
				fn( elems[i], key, exec ? value.call( elems[i], i, fn( elems[i], key ) ) : value, pass );
			}
		
			return elems;
		}
	
		// Getting an attribute
		return length ? fn( elems[0], key ) : undefined;
	},

	now: function() {
		return (new Date()).getTime();
	},

	// Use of jQuery.browser is frowned upon.
	// More details: http://docs.jquery.com/Utilities/jQuery.browser
	uaMatch: function( ua ) {
		ua = ua.toLowerCase();

		var match = rwebkit.exec( ua ) ||
			ropera.exec( ua ) ||
			rmsie.exec( ua ) ||
			ua.indexOf("compatible") < 0 && rmozilla.exec( ua ) ||
			[];

		return { browser: match[1] || "", version: match[2] || "0" };
	},

	browser: {}
});

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

browserMatch = jQuery.uaMatch( userAgent );
if ( browserMatch.browser ) {
	jQuery.browser[ browserMatch.browser ] = true;
	jQuery.browser.version = browserMatch.version;
}

// Deprecated, use jQuery.browser.webkit instead
if ( jQuery.browser.webkit ) {
	jQuery.browser.safari = true;
}

if ( indexOf ) {
	jQuery.inArray = function( elem, array ) {
		return indexOf.call( array, elem );
	};
}

// Verify that \s matches non-breaking spaces
// (IE fails on this test)
if ( !rwhite.test( "\xA0" ) ) {
	trimLeft = /^[\s\xA0]+/;
	trimRight = /[\s\xA0]+$/;
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);

// Cleanup functions for the document ready method
if ( document.addEventListener ) {
	DOMContentLoaded = function() {
		document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
		jQuery.ready();
	};

} else if ( document.attachEvent ) {
	DOMContentLoaded = function() {
		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( document.readyState === "complete" ) {
			document.detachEvent( "onreadystatechange", DOMContentLoaded );
			jQuery.ready();
		}
	};
}

// The DOM ready check for Internet Explorer
function doScrollCheck() {
	if ( jQuery.isReady ) {
		return;
	}

	try {
		// If IE is used, use the trick by Diego Perini
		// http://javascript.nwbox.com/IEContentLoaded/
		document.documentElement.doScroll("left");
	} catch(e) {
		setTimeout( doScrollCheck, 1 );
		return;
	}

	// and execute any waiting functions
	jQuery.ready();
}

// Expose jQuery to the global object
return (window.jQuery = window.$ = jQuery);

})();


(function() {

	jQuery.support = {};

	var root = document.documentElement,
		script = document.createElement("script"),
		div = document.createElement("div"),
		id = "script" + jQuery.now();

	div.style.display = "none";
	div.innerHTML = "   <link/><table></table><a href='/a' style='color:red;float:left;opacity:.55;'>a</a><input type='checkbox'/>";

	var all = div.getElementsByTagName("*"),
		a = div.getElementsByTagName("a")[0],
		select = document.createElement("select"),
		opt = select.appendChild( document.createElement("option") );

	// Can't get basic test support
	if ( !all || !all.length || !a ) {
		return;
	}

	jQuery.support = {
		// IE strips leading whitespace when .innerHTML is used
		leadingWhitespace: div.firstChild.nodeType === 3,

		// Make sure that tbody elements aren't automatically inserted
		// IE will insert them into empty tables
		tbody: !div.getElementsByTagName("tbody").length,

		// Make sure that link elements get serialized correctly by innerHTML
		// This requires a wrapper element in IE
		htmlSerialize: !!div.getElementsByTagName("link").length,

		// Get the style information from getAttribute
		// (IE uses .cssText insted)
		style: /red/.test( a.getAttribute("style") ),

		// Make sure that URLs aren't manipulated
		// (IE normalizes it by default)
		hrefNormalized: a.getAttribute("href") === "/a",

		// Make sure that element opacity exists
		// (IE uses filter instead)
		// Use a regex to work around a WebKit issue. See #5145
		opacity: /^0.55$/.test( a.style.opacity ),

		// Verify style float existence
		// (IE uses styleFloat instead of cssFloat)
		cssFloat: !!a.style.cssFloat,

		// Make sure that if no value is specified for a checkbox
		// that it defaults to "on".
		// (WebKit defaults to "" instead)
		checkOn: div.getElementsByTagName("input")[0].value === "on",

		// Make sure that a selected-by-default option has a working selected property.
		// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
		optSelected: opt.selected,

		// Will be defined later
		deleteExpando: true,
		optDisabled: false,
		checkClone: false,
		scriptEval: false,
		noCloneEvent: true,
		boxModel: null,
		inlineBlockNeedsLayout: false,
		shrinkWrapBlocks: false,
		reliableHiddenOffsets: true
	};

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as diabled)
	select.disabled = true;
	jQuery.support.optDisabled = !opt.disabled;

	script.type = "text/javascript";
	try {
		script.appendChild( document.createTextNode( "window." + id + "=1;" ) );
	} catch(e) {}

	root.insertBefore( script, root.firstChild );

	// Make sure that the execution of code works by injecting a script
	// tag with appendChild/createTextNode
	// (IE doesn't support this, fails, and uses .text instead)
	if ( window[ id ] ) {
		jQuery.support.scriptEval = true;
		delete window[ id ];
	}

	// Test to see if it's possible to delete an expando from an element
	// Fails in Internet Explorer
	try {
		delete script.test;

	} catch(e) {
		jQuery.support.deleteExpando = false;
	}

	root.removeChild( script );

	if ( div.attachEvent && div.fireEvent ) {
		div.attachEvent("onclick", function click() {
			// Cloning a node shouldn't copy over any
			// bound event handlers (IE does this)
			jQuery.support.noCloneEvent = false;
			div.detachEvent("onclick", click);
		});
		div.cloneNode(true).fireEvent("onclick");
	}

	div = document.createElement("div");
	div.innerHTML = "<input type='radio' name='radiotest' checked='checked'/>";

	var fragment = document.createDocumentFragment();
	fragment.appendChild( div.firstChild );

	// WebKit doesn't clone checked state correctly in fragments
	jQuery.support.checkClone = fragment.cloneNode(true).cloneNode(true).lastChild.checked;

	// Figure out if the W3C box model works as expected
	// document.body must exist before we can do this
	jQuery(function() {
		var div = document.createElement("div");
		div.style.width = div.style.paddingLeft = "1px";

		document.body.appendChild( div );
		jQuery.boxModel = jQuery.support.boxModel = div.offsetWidth === 2;

		if ( "zoom" in div.style ) {
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			// (IE < 8 does this)
			div.style.display = "inline";
			div.style.zoom = 1;
			jQuery.support.inlineBlockNeedsLayout = div.offsetWidth === 2;

			// Check if elements with layout shrink-wrap their children
			// (IE 6 does this)
			div.style.display = "";
			div.innerHTML = "<div style='width:4px;'></div>";
			jQuery.support.shrinkWrapBlocks = div.offsetWidth !== 2;
		}

		div.innerHTML = "<table><tr><td style='padding:0;display:none'></td><td>t</td></tr></table>";
		var tds = div.getElementsByTagName("td");

		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		// (only IE 8 fails this test)
		jQuery.support.reliableHiddenOffsets = tds[0].offsetHeight === 0;

		tds[0].style.display = "";
		tds[1].style.display = "none";

		// Check if empty table cells still have offsetWidth/Height
		// (IE < 8 fail this test)
		jQuery.support.reliableHiddenOffsets = jQuery.support.reliableHiddenOffsets && tds[0].offsetHeight === 0;
		div.innerHTML = "";

		document.body.removeChild( div ).style.display = "none";
		div = tds = null;
	});

	// Technique from Juriy Zaytsev
	// http://thinkweb2.com/projects/prototype/detecting-event-support-without-browser-sniffing/
	var eventSupported = function( eventName ) {
		var el = document.createElement("div");
		eventName = "on" + eventName;

		var isSupported = (eventName in el);
		if ( !isSupported ) {
			el.setAttribute(eventName, "return;");
			isSupported = typeof el[eventName] === "function";
		}
		el = null;

		return isSupported;
	};

	jQuery.support.submitBubbles = eventSupported("submit");
	jQuery.support.changeBubbles = eventSupported("change");

	// release memory in IE
	root = script = div = all = a = null;
})();



var windowData = {},
	rbrace = /^(?:\{.*\}|\[.*\])$/;

jQuery.extend({
	cache: {},

	// Please use with caution
	uuid: 0,

	// Unique for each copy of jQuery on the page	
	expando: "jQuery" + jQuery.now(),

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
		"applet": true
	},

	data: function( elem, name, data ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		elem = elem == window ?
			windowData :
			elem;

		var isNode = elem.nodeType,
			id = isNode ? elem[ jQuery.expando ] : null,
			cache = jQuery.cache, thisCache;

		if ( isNode && !id && typeof name === "string" && data === undefined ) {
			return;
		}

		// Get the data from the object directly
		if ( !isNode ) {
			cache = elem;

		// Compute a unique ID for the element
		} else if ( !id ) {
			elem[ jQuery.expando ] = id = ++jQuery.uuid;
		}

		// Avoid generating a new cache unless none exists and we
		// want to manipulate it.
		if ( typeof name === "object" ) {
			if ( isNode ) {
				cache[ id ] = jQuery.extend(cache[ id ], name);

			} else {
				jQuery.extend( cache, name );
			}

		} else if ( isNode && !cache[ id ] ) {
			cache[ id ] = {};
		}

		thisCache = isNode ? cache[ id ] : cache;

		// Prevent overriding the named cache with undefined values
		if ( data !== undefined ) {
			thisCache[ name ] = data;
		}

		return typeof name === "string" ? thisCache[ name ] : thisCache;
	},

	removeData: function( elem, name ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		elem = elem == window ?
			windowData :
			elem;

		var isNode = elem.nodeType,
			id = isNode ? elem[ jQuery.expando ] : elem,
			cache = jQuery.cache,
			thisCache = isNode ? cache[ id ] : id;

		// If we want to remove a specific section of the element's data
		if ( name ) {
			if ( thisCache ) {
				// Remove the section of cache data
				delete thisCache[ name ];

				// If we've removed all the data, remove the element's cache
				if ( isNode && jQuery.isEmptyObject(thisCache) ) {
					jQuery.removeData( elem );
				}
			}

		// Otherwise, we want to remove all of the element's data
		} else {
			if ( isNode && jQuery.support.deleteExpando ) {
				delete elem[ jQuery.expando ];

			} else if ( elem.removeAttribute ) {
				elem.removeAttribute( jQuery.expando );

			// Completely remove the data cache
			} else if ( isNode ) {
				delete cache[ id ];

			// Remove all fields from the object
			} else {
				for ( var n in elem ) {
					delete elem[ n ];
				}
			}
		}
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		if ( elem.nodeName ) {
			var match = jQuery.noData[ elem.nodeName.toLowerCase() ];

			if ( match ) {
				return !(match === true || elem.getAttribute("classid") !== match);
			}
		}

		return true;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var data = null;

		if ( typeof key === "undefined" ) {
			if ( this.length ) {
				var attr = this[0].attributes, name;
				data = jQuery.data( this[0] );

				for ( var i = 0, l = attr.length; i < l; i++ ) {
					name = attr[i].name;

					if ( name.indexOf( "data-" ) === 0 ) {
						name = name.substr( 5 );
						dataAttr( this[0], name, data[ name ] );
					}
				}
			}

			return data;

		} else if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		var parts = key.split(".");
		parts[1] = parts[1] ? "." + parts[1] : "";

		if ( value === undefined ) {
			data = this.triggerHandler("getData" + parts[1] + "!", [parts[0]]);

			// Try to fetch any internally stored data first
			if ( data === undefined && this.length ) {
				data = jQuery.data( this[0], key );
				data = dataAttr( this[0], key, data );
			}

			return data === undefined && parts[1] ?
				this.data( parts[0] ) :
				data;

		} else {
			return this.each(function() {
				var $this = jQuery( this ),
					args = [ parts[0], value ];

				$this.triggerHandler( "setData" + parts[1] + "!", args );
				jQuery.data( this, key, value );
				$this.triggerHandler( "changeData" + parts[1] + "!", args );
			});
		}
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		data = elem.getAttribute( "data-" + key );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
				data === "false" ? false :
				data === "null" ? null :
				!jQuery.isNaN( data ) ? parseFloat( data ) :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}




jQuery.extend({
	queue: function( elem, type, data ) {
		if ( !elem ) {
			return;
		}

		type = (type || "fx") + "queue";
		var q = jQuery.data( elem, type );

		// Speed up dequeue by getting out quickly if this is just a lookup
		if ( !data ) {
			return q || [];
		}

		if ( !q || jQuery.isArray(data) ) {
			q = jQuery.data( elem, type, jQuery.makeArray(data) );

		} else {
			q.push( data );
		}

		return q;
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			fn = queue.shift();

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
		}

		if ( fn ) {
			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift("inprogress");
			}

			fn.call(elem, function() {
				jQuery.dequeue(elem, type);
			});
		}
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
		}

		if ( data === undefined ) {
			return jQuery.queue( this[0], type );
		}
		return this.each(function( i ) {
			var queue = jQuery.queue( this, type, data );

			if ( type === "fx" && queue[0] !== "inprogress" ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},

	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
		type = type || "fx";

		return this.queue( type, function() {
			var elem = this;
			setTimeout(function() {
				jQuery.dequeue( elem, type );
			}, time );
		});
	},

	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	}
});




var rclass = /[\n\t]/g,
	rspaces = /\s+/,
	rreturn = /\r/g,
	rspecialurl = /^(?:href|src|style)$/,
	rtype = /^(?:button|input)$/i,
	rfocusable = /^(?:button|input|object|select|textarea)$/i,
	rclickable = /^a(?:rea)?$/i,
	rradiocheck = /^(?:radio|checkbox)$/i;

jQuery.props = {
	"for": "htmlFor",
	"class": "className",
	readonly: "readOnly",
	maxlength: "maxLength",
	cellspacing: "cellSpacing",
	rowspan: "rowSpan",
	colspan: "colSpan",
	tabindex: "tabIndex",
	usemap: "useMap",
	frameborder: "frameBorder"
};

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, name, value, true, jQuery.attr );
	},

	removeAttr: function( name, fn ) {
		return this.each(function(){
			jQuery.attr( this, name, "" );
			if ( this.nodeType === 1 ) {
				this.removeAttribute( name );
			}
		});
	},

	addClass: function( value ) {
		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				self.addClass( value.call(this, i, self.attr("class")) );
			});
		}

		if ( value && typeof value === "string" ) {
			var classNames = (value || "").split( rspaces );

			for ( var i = 0, l = this.length; i < l; i++ ) {
				var elem = this[i];

				if ( elem.nodeType === 1 ) {
					if ( !elem.className ) {
						elem.className = value;

					} else {
						var className = " " + elem.className + " ",
							setClass = elem.className;

						for ( var c = 0, cl = classNames.length; c < cl; c++ ) {
							if ( className.indexOf( " " + classNames[c] + " " ) < 0 ) {
								setClass += " " + classNames[c];
							}
						}
						elem.className = jQuery.trim( setClass );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				self.removeClass( value.call(this, i, self.attr("class")) );
			});
		}

		if ( (value && typeof value === "string") || value === undefined ) {
			var classNames = (value || "").split( rspaces );

			for ( var i = 0, l = this.length; i < l; i++ ) {
				var elem = this[i];

				if ( elem.nodeType === 1 && elem.className ) {
					if ( value ) {
						var className = (" " + elem.className + " ").replace(rclass, " ");
						for ( var c = 0, cl = classNames.length; c < cl; c++ ) {
							className = className.replace(" " + classNames[c] + " ", " ");
						}
						elem.className = jQuery.trim( className );

					} else {
						elem.className = "";
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isBool = typeof stateVal === "boolean";

		if ( jQuery.isFunction( value ) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				self.toggleClass( value.call(this, i, self.attr("class"), stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					state = stateVal,
					classNames = value.split( rspaces );

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space seperated list
					state = isBool ? state : !self.hasClass( className );
					self[ state ? "addClass" : "removeClass" ]( className );
				}

			} else if ( type === "undefined" || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery.data( this, "__className__", this.className );
				}

				// toggle whole className
				this.className = this.className || value === false ? "" : jQuery.data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ";
		for ( var i = 0, l = this.length; i < l; i++ ) {
			if ( (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) > -1 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		if ( !arguments.length ) {
			var elem = this[0];

			if ( elem ) {
				if ( jQuery.nodeName( elem, "option" ) ) {
					// attributes.value is undefined in Blackberry 4.7 but
					// uses .value. See #6932
					var val = elem.attributes.value;
					return !val || val.specified ? elem.value : elem.text;
				}

				// We need to handle select boxes special
				if ( jQuery.nodeName( elem, "select" ) ) {
					var index = elem.selectedIndex,
						values = [],
						options = elem.options,
						one = elem.type === "select-one";

					// Nothing was selected
					if ( index < 0 ) {
						return null;
					}

					// Loop through all the selected options
					for ( var i = one ? index : 0, max = one ? index + 1 : options.length; i < max; i++ ) {
						var option = options[ i ];

						// Don't return options that are disabled or in a disabled optgroup
						if ( option.selected && (jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) && 
								(!option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" )) ) {

							// Get the specific value for the option
							value = jQuery(option).val();

							// We don't need an array for one selects
							if ( one ) {
								return value;
							}

							// Multi-Selects return an array
							values.push( value );
						}
					}

					return values;
				}

				// Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
				if ( rradiocheck.test( elem.type ) && !jQuery.support.checkOn ) {
					return elem.getAttribute("value") === null ? "on" : elem.value;
				}
				

				// Everything else, we just grab the value
				return (elem.value || "").replace(rreturn, "");

			}

			return undefined;
		}

		var isFunction = jQuery.isFunction(value);

		return this.each(function(i) {
			var self = jQuery(this), val = value;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call(this, i, self.val());
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray(val) ) {
				val = jQuery.map(val, function (value) {
					return value == null ? "" : value + "";
				});
			}

			if ( jQuery.isArray(val) && rradiocheck.test( this.type ) ) {
				this.checked = jQuery.inArray( self.val(), val ) >= 0;

			} else if ( jQuery.nodeName( this, "select" ) ) {
				var values = jQuery.makeArray(val);

				jQuery( "option", this ).each(function() {
					this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
				});

				if ( !values.length ) {
					this.selectedIndex = -1;
				}

			} else {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	attrFn: {
		val: true,
		css: true,
		html: true,
		text: true,
		data: true,
		width: true,
		height: true,
		offset: true
	},
		
	attr: function( elem, name, value, pass ) {
		// don't set attributes on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 ) {
			return undefined;
		}

		if ( pass && name in jQuery.attrFn ) {
			return jQuery(elem)[name](value);
		}

		var notxml = elem.nodeType !== 1 || !jQuery.isXMLDoc( elem ),
			// Whether we are setting (or getting)
			set = value !== undefined;

		// Try to normalize/fix the name
		name = notxml && jQuery.props[ name ] || name;

		// These attributes require special treatment
		var special = rspecialurl.test( name );

		// Safari mis-reports the default selected property of an option
		// Accessing the parent's selectedIndex property fixes it
		if ( name === "selected" && !jQuery.support.optSelected ) {
			var parent = elem.parentNode;
			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}

		// If applicable, access the attribute via the DOM 0 way
		// 'in' checks fail in Blackberry 4.7 #6931
		if ( (name in elem || elem[ name ] !== undefined) && notxml && !special ) {
			if ( set ) {
				// We can't allow the type property to be changed (since it causes problems in IE)
				if ( name === "type" && rtype.test( elem.nodeName ) && elem.parentNode ) {
					jQuery.error( "type property can't be changed" );
				}

				if ( value === null ) {
					if ( elem.nodeType === 1 ) {
						elem.removeAttribute( name );
					}

				} else {
					elem[ name ] = value;
				}
			}

			// browsers index elements by id/name on forms, give priority to attributes.
			if ( jQuery.nodeName( elem, "form" ) && elem.getAttributeNode(name) ) {
				return elem.getAttributeNode( name ).nodeValue;
			}

			// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
			// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
			if ( name === "tabIndex" ) {
				var attributeNode = elem.getAttributeNode( "tabIndex" );

				return attributeNode && attributeNode.specified ?
					attributeNode.value :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						undefined;
			}

			return elem[ name ];
		}

		if ( !jQuery.support.style && notxml && name === "style" ) {
			if ( set ) {
				elem.style.cssText = "" + value;
			}

			return elem.style.cssText;
		}

		if ( set ) {
			// convert the value to a string (all browsers do this but IE) see #1070
			elem.setAttribute( name, "" + value );
		}

		// Ensure that missing attributes return undefined
		// Blackberry 4.7 returns "" from getAttribute #6938
		if ( !elem.attributes[ name ] && (elem.hasAttribute && !elem.hasAttribute( name )) ) {
			return undefined;
		}

		var attr = !jQuery.support.hrefNormalized && notxml && special ?
				// Some attributes require a special call on IE
				elem.getAttribute( name, 2 ) :
				elem.getAttribute( name );

		// Non-existent attributes return null, we normalize to undefined
		return attr === null ? undefined : attr;
	}
});




var rnamespaces = /\.(.*)$/,
	rformElems = /^(?:textarea|input|select)$/i,
	rperiod = /\./g,
	rspace = / /g,
	rescape = /[^\w\s.|`]/g,
	fcleanup = function( nm ) {
		return nm.replace(rescape, "\\$&");
	},
	focusCounts = { focusin: 0, focusout: 0 };

/*
 * A number of helper functions used for managing events.
 * Many of the ideas behind this code originated from
 * Dean Edwards' addEvent library.
 */
jQuery.event = {

	// Bind an event to an element
	// Original by Dean Edwards
	add: function( elem, types, handler, data ) {
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// For whatever reason, IE has trouble passing the window object
		// around, causing it to be cloned in the process
		if ( jQuery.isWindow( elem ) && ( elem !== window && !elem.frameElement ) ) {
			elem = window;
		}

		if ( handler === false ) {
			handler = returnFalse;
		} else if ( !handler ) {
			// Fixes bug #7229. Fix recommended by jdalton
		  return;
		}

		var handleObjIn, handleObj;

		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
		}

		// Make sure that the function being executed has a unique ID
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure
		var elemData = jQuery.data( elem );

		// If no elemData is found then we must be trying to bind to one of the
		// banned noData elements
		if ( !elemData ) {
			return;
		}

		// Use a key less likely to result in collisions for plain JS objects.
		// Fixes bug #7150.
		var eventKey = elem.nodeType ? "events" : "__events__",
			events = elemData[ eventKey ],
			eventHandle = elemData.handle;
			
		if ( typeof events === "function" ) {
			// On plain objects events is a fn that holds the the data
			// which prevents this data from being JSON serialized
			// the function does not need to be called, it just contains the data
			eventHandle = events.handle;
			events = events.events;

		} else if ( !events ) {
			if ( !elem.nodeType ) {
				// On plain objects, create a fn that acts as the holder
				// of the values to avoid JSON serialization of event data
				elemData[ eventKey ] = elemData = function(){};
			}

			elemData.events = events = {};
		}

		if ( !eventHandle ) {
			elemData.handle = eventHandle = function() {
				// Handle the second event of a trigger and when
				// an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && !jQuery.event.triggered ?
					jQuery.event.handle.apply( eventHandle.elem, arguments ) :
					undefined;
			};
		}

		// Add elem as a property of the handle function
		// This is to prevent a memory leak with non-native events in IE.
		eventHandle.elem = elem;

		// Handle multiple events separated by a space
		// jQuery(...).bind("mouseover mouseout", fn);
		types = types.split(" ");

		var type, i = 0, namespaces;

		while ( (type = types[ i++ ]) ) {
			handleObj = handleObjIn ?
				jQuery.extend({}, handleObjIn) :
				{ handler: handler, data: data };

			// Namespaced event handlers
			if ( type.indexOf(".") > -1 ) {
				namespaces = type.split(".");
				type = namespaces.shift();
				handleObj.namespace = namespaces.slice(0).sort().join(".");

			} else {
				namespaces = [];
				handleObj.namespace = "";
			}

			handleObj.type = type;
			if ( !handleObj.guid ) {
				handleObj.guid = handler.guid;
			}

			// Get the current list of functions bound to this event
			var handlers = events[ type ],
				special = jQuery.event.special[ type ] || {};

			// Init the event handler queue
			if ( !handlers ) {
				handlers = events[ type ] = [];

				// Check for a special event handler
				// Only use addEventListener/attachEvent if the special
				// events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}
			
			if ( special.add ) { 
				special.add.call( elem, handleObj ); 

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add the function to the element's handler list
			handlers.push( handleObj );

			// Keep track of which events have been used, for global triggering
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	global: {},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, pos ) {
		// don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		if ( handler === false ) {
			handler = returnFalse;
		}

		var ret, type, fn, j, i = 0, all, namespaces, namespace, special, eventType, handleObj, origType,
			eventKey = elem.nodeType ? "events" : "__events__",
			elemData = jQuery.data( elem ),
			events = elemData && elemData[ eventKey ];

		if ( !elemData || !events ) {
			return;
		}
		
		if ( typeof events === "function" ) {
			elemData = events;
			events = events.events;
		}

		// types is actually an event object here
		if ( types && types.type ) {
			handler = types.handler;
			types = types.type;
		}

		// Unbind all events for the element
		if ( !types || typeof types === "string" && types.charAt(0) === "." ) {
			types = types || "";

			for ( type in events ) {
				jQuery.event.remove( elem, type + types );
			}

			return;
		}

		// Handle multiple events separated by a space
		// jQuery(...).unbind("mouseover mouseout", fn);
		types = types.split(" ");

		while ( (type = types[ i++ ]) ) {
			origType = type;
			handleObj = null;
			all = type.indexOf(".") < 0;
			namespaces = [];

			if ( !all ) {
				// Namespaced event handlers
				namespaces = type.split(".");
				type = namespaces.shift();

				namespace = new RegExp("(^|\\.)" + 
					jQuery.map( namespaces.slice(0).sort(), fcleanup ).join("\\.(?:.*\\.)?") + "(\\.|$)");
			}

			eventType = events[ type ];

			if ( !eventType ) {
				continue;
			}

			if ( !handler ) {
				for ( j = 0; j < eventType.length; j++ ) {
					handleObj = eventType[ j ];

					if ( all || namespace.test( handleObj.namespace ) ) {
						jQuery.event.remove( elem, origType, handleObj.handler, j );
						eventType.splice( j--, 1 );
					}
				}

				continue;
			}

			special = jQuery.event.special[ type ] || {};

			for ( j = pos || 0; j < eventType.length; j++ ) {
				handleObj = eventType[ j ];

				if ( handler.guid === handleObj.guid ) {
					// remove the given handler for the given type
					if ( all || namespace.test( handleObj.namespace ) ) {
						if ( pos == null ) {
							eventType.splice( j--, 1 );
						}

						if ( special.remove ) {
							special.remove.call( elem, handleObj );
						}
					}

					if ( pos != null ) {
						break;
					}
				}
			}

			// remove generic event handler if no more handlers exist
			if ( eventType.length === 0 || pos != null && eventType.length === 1 ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				ret = null;
				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			var handle = elemData.handle;
			if ( handle ) {
				handle.elem = null;
			}

			delete elemData.events;
			delete elemData.handle;

			if ( typeof elemData === "function" ) {
				jQuery.removeData( elem, eventKey );

			} else if ( jQuery.isEmptyObject( elemData ) ) {
				jQuery.removeData( elem );
			}
		}
	},

	// bubbling is internal
	trigger: function( event, data, elem /*, bubbling */ ) {
		// Event object or event type
		var type = event.type || event,
			bubbling = arguments[3];

		if ( !bubbling ) {
			event = typeof event === "object" ?
				// jQuery.Event object
				event[ jQuery.expando ] ? event :
				// Object literal
				jQuery.extend( jQuery.Event(type), event ) :
				// Just the event type (string)
				jQuery.Event(type);

			if ( type.indexOf("!") >= 0 ) {
				event.type = type = type.slice(0, -1);
				event.exclusive = true;
			}

			// Handle a global trigger
			if ( !elem ) {
				// Don't bubble custom events when global (to avoid too much overhead)
				event.stopPropagation();

				// Only trigger if we've ever bound an event for it
				if ( jQuery.event.global[ type ] ) {
					jQuery.each( jQuery.cache, function() {
						if ( this.events && this.events[type] ) {
							jQuery.event.trigger( event, data, this.handle.elem );
						}
					});
				}
			}

			// Handle triggering a single element

			// don't do events on text and comment nodes
			if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 ) {
				return undefined;
			}

			// Clean up in case it is reused
			event.result = undefined;
			event.target = elem;

			// Clone the incoming data, if any
			data = jQuery.makeArray( data );
			data.unshift( event );
		}

		event.currentTarget = elem;

		// Trigger the event, it is assumed that "handle" is a function
		var handle = elem.nodeType ?
			jQuery.data( elem, "handle" ) :
			(jQuery.data( elem, "__events__" ) || {}).handle;

		if ( handle ) {
			handle.apply( elem, data );
		}

		var parent = elem.parentNode || elem.ownerDocument;

		// Trigger an inline bound script
		try {
			if ( !(elem && elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()]) ) {
				if ( elem[ "on" + type ] && elem[ "on" + type ].apply( elem, data ) === false ) {
					event.result = false;
					event.preventDefault();
				}
			}

		// prevent IE from throwing an error for some elements with some event types, see #3533
		} catch (inlineError) {}

		if ( !event.isPropagationStopped() && parent ) {
			jQuery.event.trigger( event, data, parent, true );

		} else if ( !event.isDefaultPrevented() ) {
			var old,
				target = event.target,
				targetType = type.replace( rnamespaces, "" ),
				isClick = jQuery.nodeName( target, "a" ) && targetType === "click",
				special = jQuery.event.special[ targetType ] || {};

			if ( (!special._default || special._default.call( elem, event ) === false) && 
				!isClick && !(target && target.nodeName && jQuery.noData[target.nodeName.toLowerCase()]) ) {

				try {
					if ( target[ targetType ] ) {
						// Make sure that we don't accidentally re-trigger the onFOO events
						old = target[ "on" + targetType ];

						if ( old ) {
							target[ "on" + targetType ] = null;
						}

						jQuery.event.triggered = true;
						target[ targetType ]();
					}

				// prevent IE from throwing an error for some elements with some event types, see #3533
				} catch (triggerError) {}

				if ( old ) {
					target[ "on" + targetType ] = old;
				}

				jQuery.event.triggered = false;
			}
		}
	},

	handle: function( event ) {
		var all, handlers, namespaces, namespace_re, events,
			namespace_sort = [],
			args = jQuery.makeArray( arguments );

		event = args[0] = jQuery.event.fix( event || window.event );
		event.currentTarget = this;

		// Namespaced event handlers
		all = event.type.indexOf(".") < 0 && !event.exclusive;

		if ( !all ) {
			namespaces = event.type.split(".");
			event.type = namespaces.shift();
			namespace_sort = namespaces.slice(0).sort();
			namespace_re = new RegExp("(^|\\.)" + namespace_sort.join("\\.(?:.*\\.)?") + "(\\.|$)");
		}

		event.namespace = event.namespace || namespace_sort.join(".");

		events = jQuery.data(this, this.nodeType ? "events" : "__events__");

		if ( typeof events === "function" ) {
			events = events.events;
		}

		handlers = (events || {})[ event.type ];

		if ( events && handlers ) {
			// Clone the handlers to prevent manipulation
			handlers = handlers.slice(0);

			for ( var j = 0, l = handlers.length; j < l; j++ ) {
				var handleObj = handlers[ j ];

				// Filter the functions by class
				if ( all || namespace_re.test( handleObj.namespace ) ) {
					// Pass in a reference to the handler function itself
					// So that we can later remove it
					event.handler = handleObj.handler;
					event.data = handleObj.data;
					event.handleObj = handleObj;
	
					var ret = handleObj.handler.apply( this, args );

					if ( ret !== undefined ) {
						event.result = ret;
						if ( ret === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}

					if ( event.isImmediatePropagationStopped() ) {
						break;
					}
				}
			}
		}

		return event.result;
	},

	props: "altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode layerX layerY metaKey newValue offsetX offsetY pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" "),

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// store a copy of the original event object
		// and "clone" to set read-only properties
		var originalEvent = event;
		event = jQuery.Event( originalEvent );

		for ( var i = this.props.length, prop; i; ) {
			prop = this.props[ --i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Fix target property, if necessary
		if ( !event.target ) {
			// Fixes #1925 where srcElement might not be defined either
			event.target = event.srcElement || document;
		}

		// check if target is a textnode (safari)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Add relatedTarget, if necessary
		if ( !event.relatedTarget && event.fromElement ) {
			event.relatedTarget = event.fromElement === event.target ? event.toElement : event.fromElement;
		}

		// Calculate pageX/Y if missing and clientX/Y available
		if ( event.pageX == null && event.clientX != null ) {
			var doc = document.documentElement,
				body = document.body;

			event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
			event.pageY = event.clientY + (doc && doc.scrollTop  || body && body.scrollTop  || 0) - (doc && doc.clientTop  || body && body.clientTop  || 0);
		}

		// Add which for key events
		if ( event.which == null && (event.charCode != null || event.keyCode != null) ) {
			event.which = event.charCode != null ? event.charCode : event.keyCode;
		}

		// Add metaKey to non-Mac browsers (use ctrl for PC's and Meta for Macs)
		if ( !event.metaKey && event.ctrlKey ) {
			event.metaKey = event.ctrlKey;
		}

		// Add which for click: 1 === left; 2 === middle; 3 === right
		// Note: button is not normalized, so don't use it
		if ( !event.which && event.button !== undefined ) {
			event.which = (event.button & 1 ? 1 : ( event.button & 2 ? 3 : ( event.button & 4 ? 2 : 0 ) ));
		}

		return event;
	},

	// Deprecated, use jQuery.guid instead
	guid: 1E8,

	// Deprecated, use jQuery.proxy instead
	proxy: jQuery.proxy,

	special: {
		ready: {
			// Make sure the ready event is setup
			setup: jQuery.bindReady,
			teardown: jQuery.noop
		},

		live: {
			add: function( handleObj ) {
				jQuery.event.add( this,
					liveConvert( handleObj.origType, handleObj.selector ),
					jQuery.extend({}, handleObj, {handler: liveHandler, guid: handleObj.handler.guid}) ); 
			},

			remove: function( handleObj ) {
				jQuery.event.remove( this, liveConvert( handleObj.origType, handleObj.selector ), handleObj );
			}
		},

		beforeunload: {
			setup: function( data, namespaces, eventHandle ) {
				// We only want to do this special case on windows
				if ( jQuery.isWindow( this ) ) {
					this.onbeforeunload = eventHandle;
				}
			},

			teardown: function( namespaces, eventHandle ) {
				if ( this.onbeforeunload === eventHandle ) {
					this.onbeforeunload = null;
				}
			}
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} : 
	function( elem, type, handle ) {
		if ( elem.detachEvent ) {
			elem.detachEvent( "on" + type, handle );
		}
	};

jQuery.Event = function( src ) {
	// Allow instantiation without the 'new' keyword
	if ( !this.preventDefault ) {
		return new jQuery.Event( src );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;
	// Event type
	} else {
		this.type = src;
	}

	// timeStamp is buggy for some events on Firefox(#3843)
	// So we won't rely on the native value
	this.timeStamp = jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

function returnFalse() {
	return false;
}
function returnTrue() {
	return true;
}

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	preventDefault: function() {
		this.isDefaultPrevented = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}
		
		// if preventDefault exists run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// otherwise set the returnValue property of the original event to false (IE)
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		this.isPropagationStopped = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}
		// if stopPropagation exists run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}
		// otherwise set the cancelBubble property of the original event to true (IE)
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	},
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse
};

// Checks if an event happened on an element within another element
// Used in jQuery.event.special.mouseenter and mouseleave handlers
var withinElement = function( event ) {
	// Check if mouse(over|out) are still within the same parent element
	var parent = event.relatedTarget;

	// Firefox sometimes assigns relatedTarget a XUL element
	// which we cannot access the parentNode property of
	try {
		// Traverse up the tree
		while ( parent && parent !== this ) {
			parent = parent.parentNode;
		}

		if ( parent !== this ) {
			// set the correct event type
			event.type = event.data;

			// handle event if we actually just moused on to a non sub-element
			jQuery.event.handle.apply( this, arguments );
		}

	// assuming we've left the element since we most likely mousedover a xul element
	} catch(e) { }
},

// In case of event delegation, we only need to rename the event.type,
// liveHandler will take care of the rest.
delegate = function( event ) {
	event.type = event.data;
	jQuery.event.handle.apply( this, arguments );
};

// Create mouseenter and mouseleave events
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		setup: function( data ) {
			jQuery.event.add( this, fix, data && data.selector ? delegate : withinElement, orig );
		},
		teardown: function( data ) {
			jQuery.event.remove( this, fix, data && data.selector ? delegate : withinElement );
		}
	};
});

// submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function( data, namespaces ) {
			if ( this.nodeName.toLowerCase() !== "form" ) {
				jQuery.event.add(this, "click.specialSubmit", function( e ) {
					var elem = e.target,
						type = elem.type;

					if ( (type === "submit" || type === "image") && jQuery( elem ).closest("form").length ) {
						e.liveFired = undefined;
						return trigger( "submit", this, arguments );
					}
				});
	 
				jQuery.event.add(this, "keypress.specialSubmit", function( e ) {
					var elem = e.target,
						type = elem.type;

					if ( (type === "text" || type === "password") && jQuery( elem ).closest("form").length && e.keyCode === 13 ) {
						e.liveFired = undefined;
						return trigger( "submit", this, arguments );
					}
				});

			} else {
				return false;
			}
		},

		teardown: function( namespaces ) {
			jQuery.event.remove( this, ".specialSubmit" );
		}
	};

}

// change delegation, happens here so we have bind.
if ( !jQuery.support.changeBubbles ) {

	var changeFilters,

	getVal = function( elem ) {
		var type = elem.type, val = elem.value;

		if ( type === "radio" || type === "checkbox" ) {
			val = elem.checked;

		} else if ( type === "select-multiple" ) {
			val = elem.selectedIndex > -1 ?
				jQuery.map( elem.options, function( elem ) {
					return elem.selected;
				}).join("-") :
				"";

		} else if ( elem.nodeName.toLowerCase() === "select" ) {
			val = elem.selectedIndex;
		}

		return val;
	},

	testChange = function testChange( e ) {
		var elem = e.target, data, val;

		if ( !rformElems.test( elem.nodeName ) || elem.readOnly ) {
			return;
		}

		data = jQuery.data( elem, "_change_data" );
		val = getVal(elem);

		// the current data will be also retrieved by beforeactivate
		if ( e.type !== "focusout" || elem.type !== "radio" ) {
			jQuery.data( elem, "_change_data", val );
		}
		
		if ( data === undefined || val === data ) {
			return;
		}

		if ( data != null || val ) {
			e.type = "change";
			e.liveFired = undefined;
			return jQuery.event.trigger( e, arguments[1], elem );
		}
	};

	jQuery.event.special.change = {
		filters: {
			focusout: testChange, 

			beforedeactivate: testChange,

			click: function( e ) {
				var elem = e.target, type = elem.type;

				if ( type === "radio" || type === "checkbox" || elem.nodeName.toLowerCase() === "select" ) {
					return testChange.call( this, e );
				}
			},

			// Change has to be called before submit
			// Keydown will be called before keypress, which is used in submit-event delegation
			keydown: function( e ) {
				var elem = e.target, type = elem.type;

				if ( (e.keyCode === 13 && elem.nodeName.toLowerCase() !== "textarea") ||
					(e.keyCode === 32 && (type === "checkbox" || type === "radio")) ||
					type === "select-multiple" ) {
					return testChange.call( this, e );
				}
			},

			// Beforeactivate happens also before the previous element is blurred
			// with this event you can't trigger a change event, but you can store
			// information
			beforeactivate: function( e ) {
				var elem = e.target;
				jQuery.data( elem, "_change_data", getVal(elem) );
			}
		},

		setup: function( data, namespaces ) {
			if ( this.type === "file" ) {
				return false;
			}

			for ( var type in changeFilters ) {
				jQuery.event.add( this, type + ".specialChange", changeFilters[type] );
			}

			return rformElems.test( this.nodeName );
		},

		teardown: function( namespaces ) {
			jQuery.event.remove( this, ".specialChange" );

			return rformElems.test( this.nodeName );
		}
	};

	changeFilters = jQuery.event.special.change.filters;

	// Handle when the input is .focus()'d
	changeFilters.focus = changeFilters.beforeactivate;
}

function trigger( type, elem, args ) {
	args[0].type = type;
	return jQuery.event.handle.apply( elem, args );
}

// Create "bubbling" focus and blur events
if ( document.addEventListener ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {
		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( focusCounts[fix]++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			}, 
			teardown: function() { 
				if ( --focusCounts[fix] === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};

		function handler( e ) { 
			e = jQuery.event.fix( e );
			e.type = fix;
			return jQuery.event.trigger( e, null, e.target );
		}
	});
}

jQuery.each(["bind", "one"], function( i, name ) {
	jQuery.fn[ name ] = function( type, data, fn ) {
		// Handle object literals
		if ( typeof type === "object" ) {
			for ( var key in type ) {
				this[ name ](key, data, type[key], fn);
			}
			return this;
		}
		
		if ( jQuery.isFunction( data ) || data === false ) {
			fn = data;
			data = undefined;
		}

		var handler = name === "one" ? jQuery.proxy( fn, function( event ) {
			jQuery( this ).unbind( event, handler );
			return fn.apply( this, arguments );
		}) : fn;

		if ( type === "unload" && name !== "one" ) {
			this.one( type, data, fn );

		} else {
			for ( var i = 0, l = this.length; i < l; i++ ) {
				jQuery.event.add( this[i], type, handler, data );
			}
		}

		return this;
	};
});

jQuery.fn.extend({
	unbind: function( type, fn ) {
		// Handle object literals
		if ( typeof type === "object" && !type.preventDefault ) {
			for ( var key in type ) {
				this.unbind(key, type[key]);
			}

		} else {
			for ( var i = 0, l = this.length; i < l; i++ ) {
				jQuery.event.remove( this[i], type, fn );
			}
		}

		return this;
	},
	
	delegate: function( selector, types, data, fn ) {
		return this.live( types, data, fn, selector );
	},
	
	undelegate: function( selector, types, fn ) {
		if ( arguments.length === 0 ) {
				return this.unbind( "live" );
		
		} else {
			return this.die( types, null, fn, selector );
		}
	},
	
	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},

	triggerHandler: function( type, data ) {
		if ( this[0] ) {
			var event = jQuery.Event( type );
			event.preventDefault();
			event.stopPropagation();
			jQuery.event.trigger( event, data, this[0] );
			return event.result;
		}
	},

	toggle: function( fn ) {
		// Save reference to arguments for access in closure
		var args = arguments,
			i = 1;

		// link all the functions, so any of them can unbind this click handler
		while ( i < args.length ) {
			jQuery.proxy( fn, args[ i++ ] );
		}

		return this.click( jQuery.proxy( fn, function( event ) {
			// Figure out which function to execute
			var lastToggle = ( jQuery.data( this, "lastToggle" + fn.guid ) || 0 ) % i;
			jQuery.data( this, "lastToggle" + fn.guid, lastToggle + 1 );

			// Make sure that clicks stop
			event.preventDefault();

			// and execute the function
			return args[ lastToggle ].apply( this, arguments ) || false;
		}));
	},

	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
});

var liveMap = {
	focus: "focusin",
	blur: "focusout",
	mouseenter: "mouseover",
	mouseleave: "mouseout"
};

jQuery.each(["live", "die"], function( i, name ) {
	jQuery.fn[ name ] = function( types, data, fn, origSelector /* Internal Use Only */ ) {
		var type, i = 0, match, namespaces, preType,
			selector = origSelector || this.selector,
			context = origSelector ? this : jQuery( this.context );
		
		if ( typeof types === "object" && !types.preventDefault ) {
			for ( var key in types ) {
				context[ name ]( key, data, types[key], selector );
			}
			
			return this;
		}

		if ( jQuery.isFunction( data ) ) {
			fn = data;
			data = undefined;
		}

		types = (types || "").split(" ");

		while ( (type = types[ i++ ]) != null ) {
			match = rnamespaces.exec( type );
			namespaces = "";

			if ( match )  {
				namespaces = match[0];
				type = type.replace( rnamespaces, "" );
			}

			if ( type === "hover" ) {
				types.push( "mouseenter" + namespaces, "mouseleave" + namespaces );
				continue;
			}

			preType = type;

			if ( type === "focus" || type === "blur" ) {
				types.push( liveMap[ type ] + namespaces );
				type = type + namespaces;

			} else {
				type = (liveMap[ type ] || type) + namespaces;
			}

			if ( name === "live" ) {
				// bind live handler
				for ( var j = 0, l = context.length; j < l; j++ ) {
					jQuery.event.add( context[j], "live." + liveConvert( type, selector ),
						{ data: data, selector: selector, handler: fn, origType: type, origHandler: fn, preType: preType } );
				}

			} else {
				// unbind live handler
				context.unbind( "live." + liveConvert( type, selector ), fn );
			}
		}
		
		return this;
	};
});

function liveHandler( event ) {
	var stop, maxLevel, related, match, handleObj, elem, j, i, l, data, close, namespace, ret,
		elems = [],
		selectors = [],
		events = jQuery.data( this, this.nodeType ? "events" : "__events__" );

	if ( typeof events === "function" ) {
		events = events.events;
	}

	// Make sure we avoid non-left-click bubbling in Firefox (#3861)
	if ( event.liveFired === this || !events || !events.live || event.button && event.type === "click" ) {
		return;
	}
	
	if ( event.namespace ) {
		namespace = new RegExp("(^|\\.)" + event.namespace.split(".").join("\\.(?:.*\\.)?") + "(\\.|$)");
	}

	event.liveFired = this;

	var live = events.live.slice(0);

	for ( j = 0; j < live.length; j++ ) {
		handleObj = live[j];

		if ( handleObj.origType.replace( rnamespaces, "" ) === event.type ) {
			selectors.push( handleObj.selector );

		} else {
			live.splice( j--, 1 );
		}
	}

	match = jQuery( event.target ).closest( selectors, event.currentTarget );

	for ( i = 0, l = match.length; i < l; i++ ) {
		close = match[i];

		for ( j = 0; j < live.length; j++ ) {
			handleObj = live[j];

			if ( close.selector === handleObj.selector && (!namespace || namespace.test( handleObj.namespace )) ) {
				elem = close.elem;
				related = null;

				// Those two events require additional checking
				if ( handleObj.preType === "mouseenter" || handleObj.preType === "mouseleave" ) {
					event.type = handleObj.preType;
					related = jQuery( event.relatedTarget ).closest( handleObj.selector )[0];
				}

				if ( !related || related !== elem ) {
					elems.push({ elem: elem, handleObj: handleObj, level: close.level });
				}
			}
		}
	}

	for ( i = 0, l = elems.length; i < l; i++ ) {
		match = elems[i];

		if ( maxLevel && match.level > maxLevel ) {
			break;
		}

		event.currentTarget = match.elem;
		event.data = match.handleObj.data;
		event.handleObj = match.handleObj;

		ret = match.handleObj.origHandler.apply( match.elem, arguments );

		if ( ret === false || event.isPropagationStopped() ) {
			maxLevel = match.level;

			if ( ret === false ) {
				stop = false;
			}
			if ( event.isImmediatePropagationStopped() ) {
				break;
			}
		}
	}

	return stop;
}

function liveConvert( type, selector ) {
	return (type && type !== "*" ? type + "." : "") + selector.replace(rperiod, "`").replace(rspace, "&");
}

jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		if ( fn == null ) {
			fn = data;
			data = null;
		}

		return arguments.length > 0 ?
			this.bind( name, data, fn ) :
			this.trigger( name );
	};

	if ( jQuery.attrFn ) {
		jQuery.attrFn[ name ] = true;
	}
});

// Prevent memory leaks in IE
// Window isn't included so as not to unbind existing unload events
// More info:
//  - http://isaacschlueter.com/2006/10/msie-memory-leaks/
if ( window.attachEvent && !window.addEventListener ) {
	jQuery(window).bind("unload", function() {
		for ( var id in jQuery.cache ) {
			if ( jQuery.cache[ id ].handle ) {
				// Try/Catch is to handle iframes being unloaded, see #4280
				try {
					jQuery.event.remove( jQuery.cache[ id ].handle.elem );
				} catch(e) {}
			}
		}
	});
}


/*!
 * Sizzle CSS Selector Engine - v1.0
 *  Copyright 2009, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
(function(){

var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
	done = 0,
	toString = Object.prototype.toString,
	hasDuplicate = false,
	baseHasDuplicate = true;

// Here we check if the JavaScript engine is using some sort of
// optimization where it does not always call our comparision
// function. If that is the case, discard the hasDuplicate value.
//   Thus far that includes Google Chrome.
[0, 0].sort(function() {
	baseHasDuplicate = false;
	return 0;
});

var Sizzle = function( selector, context, results, seed ) {
	results = results || [];
	context = context || document;

	var origContext = context;

	if ( context.nodeType !== 1 && context.nodeType !== 9 ) {
		return [];
	}
	
	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	var m, set, checkSet, extra, ret, cur, pop, i,
		prune = true,
		contextXML = Sizzle.isXML( context ),
		parts = [],
		soFar = selector;
	
	// Reset the position of the chunker regexp (start from head)
	do {
		chunker.exec( "" );
		m = chunker.exec( soFar );

		if ( m ) {
			soFar = m[3];
		
			parts.push( m[1] );
		
			if ( m[2] ) {
				extra = m[3];
				break;
			}
		}
	} while ( m );

	if ( parts.length > 1 && origPOS.exec( selector ) ) {

		if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
			set = posProcess( parts[0] + parts[1], context );

		} else {
			set = Expr.relative[ parts[0] ] ?
				[ context ] :
				Sizzle( parts.shift(), context );

			while ( parts.length ) {
				selector = parts.shift();

				if ( Expr.relative[ selector ] ) {
					selector += parts.shift();
				}
				
				set = posProcess( selector, set );
			}
		}

	} else {
		// Take a shortcut and set the context if the root selector is an ID
		// (but not if it'll be faster if the inner selector is an ID)
		if ( !seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
				Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1]) ) {

			ret = Sizzle.find( parts.shift(), context, contextXML );
			context = ret.expr ?
				Sizzle.filter( ret.expr, ret.set )[0] :
				ret.set[0];
		}

		if ( context ) {
			ret = seed ?
				{ expr: parts.pop(), set: makeArray(seed) } :
				Sizzle.find( parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML );

			set = ret.expr ?
				Sizzle.filter( ret.expr, ret.set ) :
				ret.set;

			if ( parts.length > 0 ) {
				checkSet = makeArray( set );

			} else {
				prune = false;
			}

			while ( parts.length ) {
				cur = parts.pop();
				pop = cur;

				if ( !Expr.relative[ cur ] ) {
					cur = "";
				} else {
					pop = parts.pop();
				}

				if ( pop == null ) {
					pop = context;
				}

				Expr.relative[ cur ]( checkSet, pop, contextXML );
			}

		} else {
			checkSet = parts = [];
		}
	}

	if ( !checkSet ) {
		checkSet = set;
	}

	if ( !checkSet ) {
		Sizzle.error( cur || selector );
	}

	if ( toString.call(checkSet) === "[object Array]" ) {
		if ( !prune ) {
			results.push.apply( results, checkSet );

		} else if ( context && context.nodeType === 1 ) {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Sizzle.contains(context, checkSet[i])) ) {
					results.push( set[i] );
				}
			}

		} else {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
					results.push( set[i] );
				}
			}
		}

	} else {
		makeArray( checkSet, results );
	}

	if ( extra ) {
		Sizzle( extra, origContext, results, seed );
		Sizzle.uniqueSort( results );
	}

	return results;
};

Sizzle.uniqueSort = function( results ) {
	if ( sortOrder ) {
		hasDuplicate = baseHasDuplicate;
		results.sort( sortOrder );

		if ( hasDuplicate ) {
			for ( var i = 1; i < results.length; i++ ) {
				if ( results[i] === results[ i - 1 ] ) {
					results.splice( i--, 1 );
				}
			}
		}
	}

	return results;
};

Sizzle.matches = function( expr, set ) {
	return Sizzle( expr, null, null, set );
};

Sizzle.matchesSelector = function( node, expr ) {
	return Sizzle( expr, null, null, [node] ).length > 0;
};

Sizzle.find = function( expr, context, isXML ) {
	var set;

	if ( !expr ) {
		return [];
	}

	for ( var i = 0, l = Expr.order.length; i < l; i++ ) {
		var match,
			type = Expr.order[i];
		
		if ( (match = Expr.leftMatch[ type ].exec( expr )) ) {
			var left = match[1];
			match.splice( 1, 1 );

			if ( left.substr( left.length - 1 ) !== "\\" ) {
				match[1] = (match[1] || "").replace(/\\/g, "");
				set = Expr.find[ type ]( match, context, isXML );

				if ( set != null ) {
					expr = expr.replace( Expr.match[ type ], "" );
					break;
				}
			}
		}
	}

	if ( !set ) {
		set = context.getElementsByTagName( "*" );
	}

	return { set: set, expr: expr };
};

Sizzle.filter = function( expr, set, inplace, not ) {
	var match, anyFound,
		old = expr,
		result = [],
		curLoop = set,
		isXMLFilter = set && set[0] && Sizzle.isXML( set[0] );

	while ( expr && set.length ) {
		for ( var type in Expr.filter ) {
			if ( (match = Expr.leftMatch[ type ].exec( expr )) != null && match[2] ) {
				var found, item,
					filter = Expr.filter[ type ],
					left = match[1];

				anyFound = false;

				match.splice(1,1);

				if ( left.substr( left.length - 1 ) === "\\" ) {
					continue;
				}

				if ( curLoop === result ) {
					result = [];
				}

				if ( Expr.preFilter[ type ] ) {
					match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not, isXMLFilter );

					if ( !match ) {
						anyFound = found = true;

					} else if ( match === true ) {
						continue;
					}
				}

				if ( match ) {
					for ( var i = 0; (item = curLoop[i]) != null; i++ ) {
						if ( item ) {
							found = filter( item, match, i, curLoop );
							var pass = not ^ !!found;

							if ( inplace && found != null ) {
								if ( pass ) {
									anyFound = true;

								} else {
									curLoop[i] = false;
								}

							} else if ( pass ) {
								result.push( item );
								anyFound = true;
							}
						}
					}
				}

				if ( found !== undefined ) {
					if ( !inplace ) {
						curLoop = result;
					}

					expr = expr.replace( Expr.match[ type ], "" );

					if ( !anyFound ) {
						return [];
					}

					break;
				}
			}
		}

		// Improper expression
		if ( expr === old ) {
			if ( anyFound == null ) {
				Sizzle.error( expr );

			} else {
				break;
			}
		}

		old = expr;
	}

	return curLoop;
};

Sizzle.error = function( msg ) {
	throw "Syntax error, unrecognized expression: " + msg;
};

var Expr = Sizzle.selectors = {
	order: [ "ID", "NAME", "TAG" ],

	match: {
		ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
		ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/,
		TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
		CHILD: /:(only|nth|last|first)-child(?:\((even|odd|[\dn+\-]*)\))?/,
		POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
		PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
	},

	leftMatch: {},

	attrMap: {
		"class": "className",
		"for": "htmlFor"
	},

	attrHandle: {
		href: function( elem ) {
			return elem.getAttribute( "href" );
		}
	},

	relative: {
		"+": function(checkSet, part){
			var isPartStr = typeof part === "string",
				isTag = isPartStr && !/\W/.test( part ),
				isPartStrNotTag = isPartStr && !isTag;

			if ( isTag ) {
				part = part.toLowerCase();
			}

			for ( var i = 0, l = checkSet.length, elem; i < l; i++ ) {
				if ( (elem = checkSet[i]) ) {
					while ( (elem = elem.previousSibling) && elem.nodeType !== 1 ) {}

					checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ?
						elem || false :
						elem === part;
				}
			}

			if ( isPartStrNotTag ) {
				Sizzle.filter( part, checkSet, true );
			}
		},

		">": function( checkSet, part ) {
			var elem,
				isPartStr = typeof part === "string",
				i = 0,
				l = checkSet.length;

			if ( isPartStr && !/\W/.test( part ) ) {
				part = part.toLowerCase();

				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						var parent = elem.parentNode;
						checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
					}
				}

			} else {
				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						checkSet[i] = isPartStr ?
							elem.parentNode :
							elem.parentNode === part;
					}
				}

				if ( isPartStr ) {
					Sizzle.filter( part, checkSet, true );
				}
			}
		},

		"": function(checkSet, part, isXML){
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !/\W/.test(part) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "parentNode", part, doneName, checkSet, nodeCheck, isXML );
		},

		"~": function( checkSet, part, isXML ) {
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !/\W/.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "previousSibling", part, doneName, checkSet, nodeCheck, isXML );
		}
	},

	find: {
		ID: function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		},

		NAME: function( match, context ) {
			if ( typeof context.getElementsByName !== "undefined" ) {
				var ret = [],
					results = context.getElementsByName( match[1] );

				for ( var i = 0, l = results.length; i < l; i++ ) {
					if ( results[i].getAttribute("name") === match[1] ) {
						ret.push( results[i] );
					}
				}

				return ret.length === 0 ? null : ret;
			}
		},

		TAG: function( match, context ) {
			return context.getElementsByTagName( match[1] );
		}
	},
	preFilter: {
		CLASS: function( match, curLoop, inplace, result, not, isXML ) {
			match = " " + match[1].replace(/\\/g, "") + " ";

			if ( isXML ) {
				return match;
			}

			for ( var i = 0, elem; (elem = curLoop[i]) != null; i++ ) {
				if ( elem ) {
					if ( not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n]/g, " ").indexOf(match) >= 0) ) {
						if ( !inplace ) {
							result.push( elem );
						}

					} else if ( inplace ) {
						curLoop[i] = false;
					}
				}
			}

			return false;
		},

		ID: function( match ) {
			return match[1].replace(/\\/g, "");
		},

		TAG: function( match, curLoop ) {
			return match[1].toLowerCase();
		},

		CHILD: function( match ) {
			if ( match[1] === "nth" ) {
				// parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
				var test = /(-?)(\d*)n((?:\+|-)?\d*)/.exec(
					match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
					!/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

				// calculate the numbers (first)n+(last) including if they are negative
				match[2] = (test[1] + (test[2] || 1)) - 0;
				match[3] = test[3] - 0;
			}

			// TODO: Move to normal caching system
			match[0] = done++;

			return match;
		},

		ATTR: function( match, curLoop, inplace, result, not, isXML ) {
			var name = match[1].replace(/\\/g, "");
			
			if ( !isXML && Expr.attrMap[name] ) {
				match[1] = Expr.attrMap[name];
			}

			if ( match[2] === "~=" ) {
				match[4] = " " + match[4] + " ";
			}

			return match;
		},

		PSEUDO: function( match, curLoop, inplace, result, not ) {
			if ( match[1] === "not" ) {
				// If we're dealing with a complex expression, or a simple one
				if ( ( chunker.exec(match[3]) || "" ).length > 1 || /^\w/.test(match[3]) ) {
					match[3] = Sizzle(match[3], null, null, curLoop);

				} else {
					var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);

					if ( !inplace ) {
						result.push.apply( result, ret );
					}

					return false;
				}

			} else if ( Expr.match.POS.test( match[0] ) || Expr.match.CHILD.test( match[0] ) ) {
				return true;
			}
			
			return match;
		},

		POS: function( match ) {
			match.unshift( true );

			return match;
		}
	},
	
	filters: {
		enabled: function( elem ) {
			return elem.disabled === false && elem.type !== "hidden";
		},

		disabled: function( elem ) {
			return elem.disabled === true;
		},

		checked: function( elem ) {
			return elem.checked === true;
		},
		
		selected: function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			elem.parentNode.selectedIndex;
			
			return elem.selected === true;
		},

		parent: function( elem ) {
			return !!elem.firstChild;
		},

		empty: function( elem ) {
			return !elem.firstChild;
		},

		has: function( elem, i, match ) {
			return !!Sizzle( match[3], elem ).length;
		},

		header: function( elem ) {
			return (/h\d/i).test( elem.nodeName );
		},

		text: function( elem ) {
			return "text" === elem.type;
		},
		radio: function( elem ) {
			return "radio" === elem.type;
		},

		checkbox: function( elem ) {
			return "checkbox" === elem.type;
		},

		file: function( elem ) {
			return "file" === elem.type;
		},
		password: function( elem ) {
			return "password" === elem.type;
		},

		submit: function( elem ) {
			return "submit" === elem.type;
		},

		image: function( elem ) {
			return "image" === elem.type;
		},

		reset: function( elem ) {
			return "reset" === elem.type;
		},

		button: function( elem ) {
			return "button" === elem.type || elem.nodeName.toLowerCase() === "button";
		},

		input: function( elem ) {
			return (/input|select|textarea|button/i).test( elem.nodeName );
		}
	},
	setFilters: {
		first: function( elem, i ) {
			return i === 0;
		},

		last: function( elem, i, match, array ) {
			return i === array.length - 1;
		},

		even: function( elem, i ) {
			return i % 2 === 0;
		},

		odd: function( elem, i ) {
			return i % 2 === 1;
		},

		lt: function( elem, i, match ) {
			return i < match[3] - 0;
		},

		gt: function( elem, i, match ) {
			return i > match[3] - 0;
		},

		nth: function( elem, i, match ) {
			return match[3] - 0 === i;
		},

		eq: function( elem, i, match ) {
			return match[3] - 0 === i;
		}
	},
	filter: {
		PSEUDO: function( elem, match, i, array ) {
			var name = match[1],
				filter = Expr.filters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );

			} else if ( name === "contains" ) {
				return (elem.textContent || elem.innerText || Sizzle.getText([ elem ]) || "").indexOf(match[3]) >= 0;

			} else if ( name === "not" ) {
				var not = match[3];

				for ( var j = 0, l = not.length; j < l; j++ ) {
					if ( not[j] === elem ) {
						return false;
					}
				}

				return true;

			} else {
				Sizzle.error( "Syntax error, unrecognized expression: " + name );
			}
		},

		CHILD: function( elem, match ) {
			var type = match[1],
				node = elem;

			switch ( type ) {
				case "only":
				case "first":
					while ( (node = node.previousSibling) )	 {
						if ( node.nodeType === 1 ) { 
							return false; 
						}
					}

					if ( type === "first" ) { 
						return true; 
					}

					node = elem;

				case "last":
					while ( (node = node.nextSibling) )	 {
						if ( node.nodeType === 1 ) { 
							return false; 
						}
					}

					return true;

				case "nth":
					var first = match[2],
						last = match[3];

					if ( first === 1 && last === 0 ) {
						return true;
					}
					
					var doneName = match[0],
						parent = elem.parentNode;
	
					if ( parent && (parent.sizcache !== doneName || !elem.nodeIndex) ) {
						var count = 0;
						
						for ( node = parent.firstChild; node; node = node.nextSibling ) {
							if ( node.nodeType === 1 ) {
								node.nodeIndex = ++count;
							}
						} 

						parent.sizcache = doneName;
					}
					
					var diff = elem.nodeIndex - last;

					if ( first === 0 ) {
						return diff === 0;

					} else {
						return ( diff % first === 0 && diff / first >= 0 );
					}
			}
		},

		ID: function( elem, match ) {
			return elem.nodeType === 1 && elem.getAttribute("id") === match;
		},

		TAG: function( elem, match ) {
			return (match === "*" && elem.nodeType === 1) || elem.nodeName.toLowerCase() === match;
		},
		
		CLASS: function( elem, match ) {
			return (" " + (elem.className || elem.getAttribute("class")) + " ")
				.indexOf( match ) > -1;
		},

		ATTR: function( elem, match ) {
			var name = match[1],
				result = Expr.attrHandle[ name ] ?
					Expr.attrHandle[ name ]( elem ) :
					elem[ name ] != null ?
						elem[ name ] :
						elem.getAttribute( name ),
				value = result + "",
				type = match[2],
				check = match[4];

			return result == null ?
				type === "!=" :
				type === "=" ?
				value === check :
				type === "*=" ?
				value.indexOf(check) >= 0 :
				type === "~=" ?
				(" " + value + " ").indexOf(check) >= 0 :
				!check ?
				value && result !== false :
				type === "!=" ?
				value !== check :
				type === "^=" ?
				value.indexOf(check) === 0 :
				type === "$=" ?
				value.substr(value.length - check.length) === check :
				type === "|=" ?
				value === check || value.substr(0, check.length + 1) === check + "-" :
				false;
		},

		POS: function( elem, match, i, array ) {
			var name = match[2],
				filter = Expr.setFilters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );
			}
		}
	}
};

var origPOS = Expr.match.POS,
	fescape = function(all, num){
		return "\\" + (num - 0 + 1);
	};

for ( var type in Expr.match ) {
	Expr.match[ type ] = new RegExp( Expr.match[ type ].source + (/(?![^\[]*\])(?![^\(]*\))/.source) );
	Expr.leftMatch[ type ] = new RegExp( /(^(?:.|\r|\n)*?)/.source + Expr.match[ type ].source.replace(/\\(\d+)/g, fescape) );
}

var makeArray = function( array, results ) {
	array = Array.prototype.slice.call( array, 0 );

	if ( results ) {
		results.push.apply( results, array );
		return results;
	}
	
	return array;
};

// Perform a simple check to determine if the browser is capable of
// converting a NodeList to an array using builtin methods.
// Also verifies that the returned array holds DOM nodes
// (which is not the case in the Blackberry browser)
try {
	Array.prototype.slice.call( document.documentElement.childNodes, 0 )[0].nodeType;

// Provide a fallback method if it does not work
} catch( e ) {
	makeArray = function( array, results ) {
		var i = 0,
			ret = results || [];

		if ( toString.call(array) === "[object Array]" ) {
			Array.prototype.push.apply( ret, array );

		} else {
			if ( typeof array.length === "number" ) {
				for ( var l = array.length; i < l; i++ ) {
					ret.push( array[i] );
				}

			} else {
				for ( ; array[i]; i++ ) {
					ret.push( array[i] );
				}
			}
		}

		return ret;
	};
}

var sortOrder, siblingCheck;

if ( document.documentElement.compareDocumentPosition ) {
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		if ( !a.compareDocumentPosition || !b.compareDocumentPosition ) {
			return a.compareDocumentPosition ? -1 : 1;
		}

		return a.compareDocumentPosition(b) & 4 ? -1 : 1;
	};

} else {
	sortOrder = function( a, b ) {
		var al, bl,
			ap = [],
			bp = [],
			aup = a.parentNode,
			bup = b.parentNode,
			cur = aup;

		// The nodes are identical, we can exit early
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// If the nodes are siblings (or identical) we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );

		// If no parents were found then the nodes are disconnected
		} else if ( !aup ) {
			return -1;

		} else if ( !bup ) {
			return 1;
		}

		// Otherwise they're somewhere else in the tree so we need
		// to build up a full list of the parentNodes for comparison
		while ( cur ) {
			ap.unshift( cur );
			cur = cur.parentNode;
		}

		cur = bup;

		while ( cur ) {
			bp.unshift( cur );
			cur = cur.parentNode;
		}

		al = ap.length;
		bl = bp.length;

		// Start walking down the tree looking for a discrepancy
		for ( var i = 0; i < al && i < bl; i++ ) {
			if ( ap[i] !== bp[i] ) {
				return siblingCheck( ap[i], bp[i] );
			}
		}

		// We ended someplace up the tree so do a sibling check
		return i === al ?
			siblingCheck( a, bp[i], -1 ) :
			siblingCheck( ap[i], b, 1 );
	};

	siblingCheck = function( a, b, ret ) {
		if ( a === b ) {
			return ret;
		}

		var cur = a.nextSibling;

		while ( cur ) {
			if ( cur === b ) {
				return -1;
			}

			cur = cur.nextSibling;
		}

		return 1;
	};
}

// Utility function for retreiving the text value of an array of DOM nodes
Sizzle.getText = function( elems ) {
	var ret = "", elem;

	for ( var i = 0; elems[i]; i++ ) {
		elem = elems[i];

		// Get the text from text nodes and CDATA nodes
		if ( elem.nodeType === 3 || elem.nodeType === 4 ) {
			ret += elem.nodeValue;

		// Traverse everything else, except comment nodes
		} else if ( elem.nodeType !== 8 ) {
			ret += Sizzle.getText( elem.childNodes );
		}
	}

	return ret;
};

// Check to see if the browser returns elements by name when
// querying by getElementById (and provide a workaround)
(function(){
	// We're going to inject a fake input element with a specified name
	var form = document.createElement("div"),
		id = "script" + (new Date()).getTime(),
		root = document.documentElement;

	form.innerHTML = "<a name='" + id + "'/>";

	// Inject it into the root element, check its status, and remove it quickly
	root.insertBefore( form, root.firstChild );

	// The workaround has to do additional checks after a getElementById
	// Which slows things down for other browsers (hence the branching)
	if ( document.getElementById( id ) ) {
		Expr.find.ID = function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);

				return m ?
					m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ?
						[m] :
						undefined :
					[];
			}
		};

		Expr.filter.ID = function( elem, match ) {
			var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");

			return elem.nodeType === 1 && node && node.nodeValue === match;
		};
	}

	root.removeChild( form );

	// release memory in IE
	root = form = null;
})();

(function(){
	// Check to see if the browser returns only elements
	// when doing getElementsByTagName("*")

	// Create a fake element
	var div = document.createElement("div");
	div.appendChild( document.createComment("") );

	// Make sure no comments are found
	if ( div.getElementsByTagName("*").length > 0 ) {
		Expr.find.TAG = function( match, context ) {
			var results = context.getElementsByTagName( match[1] );

			// Filter out possible comments
			if ( match[1] === "*" ) {
				var tmp = [];

				for ( var i = 0; results[i]; i++ ) {
					if ( results[i].nodeType === 1 ) {
						tmp.push( results[i] );
					}
				}

				results = tmp;
			}

			return results;
		};
	}

	// Check to see if an attribute returns normalized href attributes
	div.innerHTML = "<a href='#'></a>";

	if ( div.firstChild && typeof div.firstChild.getAttribute !== "undefined" &&
			div.firstChild.getAttribute("href") !== "#" ) {

		Expr.attrHandle.href = function( elem ) {
			return elem.getAttribute( "href", 2 );
		};
	}

	// release memory in IE
	div = null;
})();

if ( document.querySelectorAll ) {
	(function(){
		var oldSizzle = Sizzle,
			div = document.createElement("div"),
			id = "__sizzle__";

		div.innerHTML = "<p class='TEST'></p>";

		// Safari can't handle uppercase or unicode characters when
		// in quirks mode.
		if ( div.querySelectorAll && div.querySelectorAll(".TEST").length === 0 ) {
			return;
		}
	
		Sizzle = function( query, context, extra, seed ) {
			context = context || document;

			// Make sure that attribute selectors are quoted
			query = query.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");

			// Only use querySelectorAll on non-XML documents
			// (ID selectors don't work in non-HTML documents)
			if ( !seed && !Sizzle.isXML(context) ) {
				if ( context.nodeType === 9 ) {
					try {
						return makeArray( context.querySelectorAll(query), extra );
					} catch(qsaError) {}

				// qSA works strangely on Element-rooted queries
				// We can work around this by specifying an extra ID on the root
				// and working up from there (Thanks to Andrew Dupont for the technique)
				// IE 8 doesn't work on object elements
				} else if ( context.nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
					var old = context.getAttribute( "id" ),
						nid = old || id;

					if ( !old ) {
						context.setAttribute( "id", nid );
					}

					try {
						return makeArray( context.querySelectorAll( "#" + nid + " " + query ), extra );

					} catch(pseudoError) {
					} finally {
						if ( !old ) {
							context.removeAttribute( "id" );
						}
					}
				}
			}
		
			return oldSizzle(query, context, extra, seed);
		};

		for ( var prop in oldSizzle ) {
			Sizzle[ prop ] = oldSizzle[ prop ];
		}

		// release memory in IE
		div = null;
	})();
}

(function(){
	var html = document.documentElement,
		matches = html.matchesSelector || html.mozMatchesSelector || html.webkitMatchesSelector || html.msMatchesSelector,
		pseudoWorks = false;

	try {
		// This should fail with an exception
		// Gecko does not error, returns false instead
		matches.call( document.documentElement, "[test!='']:sizzle" );
	
	} catch( pseudoError ) {
		pseudoWorks = true;
	}

	if ( matches ) {
		Sizzle.matchesSelector = function( node, expr ) {
			// Make sure that attribute selectors are quoted
			expr = expr.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");

			if ( !Sizzle.isXML( node ) ) {
				try { 
					if ( pseudoWorks || !Expr.match.PSEUDO.test( expr ) && !/!=/.test( expr ) ) {
						return matches.call( node, expr );
					}
				} catch(e) {}
			}

			return Sizzle(expr, null, null, [node]).length > 0;
		};
	}
})();

(function(){
	var div = document.createElement("div");

	div.innerHTML = "<div class='test e'></div><div class='test'></div>";

	// Opera can't find a second classname (in 9.6)
	// Also, make sure that getElementsByClassName actually exists
	if ( !div.getElementsByClassName || div.getElementsByClassName("e").length === 0 ) {
		return;
	}

	// Safari caches class attributes, doesn't catch changes (in 3.2)
	div.lastChild.className = "e";

	if ( div.getElementsByClassName("e").length === 1 ) {
		return;
	}
	
	Expr.order.splice(1, 0, "CLASS");
	Expr.find.CLASS = function( match, context, isXML ) {
		if ( typeof context.getElementsByClassName !== "undefined" && !isXML ) {
			return context.getElementsByClassName(match[1]);
		}
	};

	// release memory in IE
	div = null;
})();

function dirNodeCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;

			elem = elem[dir];

			while ( elem ) {
				if ( elem.sizcache === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 && !isXML ){
					elem.sizcache = doneName;
					elem.sizset = i;
				}

				if ( elem.nodeName.toLowerCase() === cur ) {
					match = elem;
					break;
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

function dirCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;
			
			elem = elem[dir];

			while ( elem ) {
				if ( elem.sizcache === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 ) {
					if ( !isXML ) {
						elem.sizcache = doneName;
						elem.sizset = i;
					}

					if ( typeof cur !== "string" ) {
						if ( elem === cur ) {
							match = true;
							break;
						}

					} else if ( Sizzle.filter( cur, [elem] ).length > 0 ) {
						match = elem;
						break;
					}
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

if ( document.documentElement.contains ) {
	Sizzle.contains = function( a, b ) {
		return a !== b && (a.contains ? a.contains(b) : true);
	};

} else if ( document.documentElement.compareDocumentPosition ) {
	Sizzle.contains = function( a, b ) {
		return !!(a.compareDocumentPosition(b) & 16);
	};

} else {
	Sizzle.contains = function() {
		return false;
	};
}

Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833) 
	var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;

	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

var posProcess = function( selector, context ) {
	var match,
		tmpSet = [],
		later = "",
		root = context.nodeType ? [context] : context;

	// Position selectors must be done after the filter
	// And so must :not(positional) so we move all PSEUDOs to the end
	while ( (match = Expr.match.PSEUDO.exec( selector )) ) {
		later += match[0];
		selector = selector.replace( Expr.match.PSEUDO, "" );
	}

	selector = Expr.relative[selector] ? selector + "*" : selector;

	for ( var i = 0, l = root.length; i < l; i++ ) {
		Sizzle( selector, root[i], tmpSet );
	}

	return Sizzle.filter( later, tmpSet );
};

// EXPOSE
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.filters;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})();


var runtil = /Until$/,
	rparentsprev = /^(?:parents|prevUntil|prevAll)/,
	// Note: This RegExp should be improved, or likely pulled from Sizzle
	rmultiselector = /,/,
	isSimple = /^.[^:#\[\.,]*$/,
	slice = Array.prototype.slice,
	POS = jQuery.expr.match.POS;

jQuery.fn.extend({
	find: function( selector ) {
		var ret = this.pushStack( "", "find", selector ),
			length = 0;

		for ( var i = 0, l = this.length; i < l; i++ ) {
			length = ret.length;
			jQuery.find( selector, this[i], ret );

			if ( i > 0 ) {
				// Make sure that the results are unique
				for ( var n = length; n < ret.length; n++ ) {
					for ( var r = 0; r < length; r++ ) {
						if ( ret[r] === ret[n] ) {
							ret.splice(n--, 1);
							break;
						}
					}
				}
			}
		}

		return ret;
	},

	has: function( target ) {
		var targets = jQuery( target );
		return this.filter(function() {
			for ( var i = 0, l = targets.length; i < l; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector, false), "not", selector);
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector, true), "filter", selector );
	},
	
	is: function( selector ) {
		return !!selector && jQuery.filter( selector, this ).length > 0;
	},

	closest: function( selectors, context ) {
		var ret = [], i, l, cur = this[0];

		if ( jQuery.isArray( selectors ) ) {
			var match, selector,
				matches = {},
				level = 1;

			if ( cur && selectors.length ) {
				for ( i = 0, l = selectors.length; i < l; i++ ) {
					selector = selectors[i];

					if ( !matches[selector] ) {
						matches[selector] = jQuery.expr.match.POS.test( selector ) ? 
							jQuery( selector, context || this.context ) :
							selector;
					}
				}

				while ( cur && cur.ownerDocument && cur !== context ) {
					for ( selector in matches ) {
						match = matches[selector];

						if ( match.jquery ? match.index(cur) > -1 : jQuery(cur).is(match) ) {
							ret.push({ selector: selector, elem: cur, level: level });
						}
					}

					cur = cur.parentNode;
					level++;
				}
			}

			return ret;
		}

		var pos = POS.test( selectors ) ? 
			jQuery( selectors, context || this.context ) : null;

		for ( i = 0, l = this.length; i < l; i++ ) {
			cur = this[i];

			while ( cur ) {
				if ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ) {
					ret.push( cur );
					break;

				} else {
					cur = cur.parentNode;
					if ( !cur || !cur.ownerDocument || cur === context ) {
						break;
					}
				}
			}
		}

		ret = ret.length > 1 ? jQuery.unique(ret) : ret;
		
		return this.pushStack( ret, "closest", selectors );
	},
	
	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {
		if ( !elem || typeof elem === "string" ) {
			return jQuery.inArray( this[0],
				// If it receives a string, the selector is used
				// If it receives nothing, the siblings are used
				elem ? jQuery( elem ) : this.parent().children() );
		}
		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context || this.context ) :
				jQuery.makeArray( selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( isDisconnected( set[0] ) || isDisconnected( all[0] ) ?
			all :
			jQuery.unique( all ) );
	},

	andSelf: function() {
		return this.add( this.prevObject );
	}
});

// A painfully simple check to see if an element is disconnected
// from a document (should be improved, where feasible).
function isDisconnected( node ) {
	return !node || !node.parentNode || node.parentNode.nodeType === 11;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return jQuery.nth( elem, 2, "nextSibling" );
	},
	prev: function( elem ) {
		return jQuery.nth( elem, 2, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( elem.parentNode.firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.makeArray( elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );
		
		if ( !runtil.test( name ) ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		ret = this.length > 1 ? jQuery.unique( ret ) : ret;

		if ( (this.length > 1 || rmultiselector.test( selector )) && rparentsprev.test( name ) ) {
			ret = ret.reverse();
		}

		return this.pushStack( ret, name, slice.call(arguments).join(",") );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 ?
			jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] :
			jQuery.find.matches(expr, elems);
	},
	
	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	nth: function( cur, result, dir, elem ) {
		result = result || 1;
		var num = 0;

		for ( ; cur; cur = cur[dir] ) {
			if ( cur.nodeType === 1 && ++num === result ) {
				break;
			}
		}

		return cur;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, keep ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep(elements, function( elem, i ) {
			var retVal = !!qualifier.call( elem, i, elem );
			return retVal === keep;
		});

	} else if ( qualifier.nodeType ) {
		return jQuery.grep(elements, function( elem, i ) {
			return (elem === qualifier) === keep;
		});

	} else if ( typeof qualifier === "string" ) {
		var filtered = jQuery.grep(elements, function( elem ) {
			return elem.nodeType === 1;
		});

		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter(qualifier, filtered, !keep);
		} else {
			qualifier = jQuery.filter( qualifier, filtered );
		}
	}

	return jQuery.grep(elements, function( elem, i ) {
		return (jQuery.inArray( elem, qualifier ) >= 0) === keep;
	});
}




var rinlinejQuery = / jQuery\d+="(?:\d+|null)"/g,
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnocache = /<(?:script|object|embed|option|style)/i,
	// checked="checked" or checked (html5)
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	raction = /\=([^="'>\s]+\/)>/g,
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		area: [ 1, "<map>", "</map>" ],
		_default: [ 0, "", "" ]
	};

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// IE can't serialize <link> and <script> tags normally
if ( !jQuery.support.htmlSerialize ) {
	wrapMap._default = [ 1, "div<div>", "</div>" ];
}

jQuery.fn.extend({
	text: function( text ) {
		if ( jQuery.isFunction(text) ) {
			return this.each(function(i) {
				var self = jQuery( this );

				self.text( text.call(this, i, self.text()) );
			});
		}

		if ( typeof text !== "object" && text !== undefined ) {
			return this.empty().append( (this[0] && this[0].ownerDocument || document).createTextNode( text ) );
		}

		return jQuery.text( this );
	},

	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append(this);
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		return this.each(function() {
			jQuery( this ).wrapAll( html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	},

	append: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 ) {
				this.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 ) {
				this.insertBefore( elem, this.firstChild );
			}
		});
	},

	before: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this );
			});
		} else if ( arguments.length ) {
			var set = jQuery(arguments[0]);
			set.push.apply( set, this.toArray() );
			return this.pushStack( set, "before", arguments );
		}
	},

	after: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			});
		} else if ( arguments.length ) {
			var set = this.pushStack( this, "after", arguments );
			set.push.apply( set, jQuery(arguments[0]).toArray() );
			return set;
		}
	},
	
	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
			if ( !selector || jQuery.filter( selector, [ elem ] ).length ) {
				if ( !keepData && elem.nodeType === 1 ) {
					jQuery.cleanData( elem.getElementsByTagName("*") );
					jQuery.cleanData( [ elem ] );
				}

				if ( elem.parentNode ) {
					 elem.parentNode.removeChild( elem );
				}
			}
		}
		
		return this;
	},

	empty: function() {
		for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( elem.getElementsByTagName("*") );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}
		}
		
		return this;
	},

	clone: function( events ) {
		// Do the clone
		var ret = this.map(function() {
			if ( !jQuery.support.noCloneEvent && !jQuery.isXMLDoc(this) ) {
				// IE copies events bound via attachEvent when
				// using cloneNode. Calling detachEvent on the
				// clone will also remove the events from the orignal
				// In order to get around this, we use innerHTML.
				// Unfortunately, this means some modifications to
				// attributes in IE that are actually only stored
				// as properties will not be copied (such as the
				// the name attribute on an input).
				var html = this.outerHTML,
					ownerDocument = this.ownerDocument;

				if ( !html ) {
					var div = ownerDocument.createElement("div");
					div.appendChild( this.cloneNode(true) );
					html = div.innerHTML;
				}

				return jQuery.clean([html.replace(rinlinejQuery, "")
					// Handle the case in IE 8 where action=/test/> self-closes a tag
					.replace(raction, '="$1">')
					.replace(rleadingWhitespace, "")], ownerDocument)[0];
			} else {
				return this.cloneNode(true);
			}
		});

		// Copy the events from the original to the clone
		if ( events === true ) {
			cloneCopyEvent( this, ret );
			cloneCopyEvent( this.find("*"), ret.find("*") );
		}

		// Return the cloned set
		return ret;
	},

	html: function( value ) {
		if ( value === undefined ) {
			return this[0] && this[0].nodeType === 1 ?
				this[0].innerHTML.replace(rinlinejQuery, "") :
				null;

		// See if we can take a shortcut and just use innerHTML
		} else if ( typeof value === "string" && !rnocache.test( value ) &&
			(jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value )) &&
			!wrapMap[ (rtagName.exec( value ) || ["", ""])[1].toLowerCase() ] ) {

			value = value.replace(rxhtmlTag, "<$1></$2>");

			try {
				for ( var i = 0, l = this.length; i < l; i++ ) {
					// Remove element nodes and prevent memory leaks
					if ( this[i].nodeType === 1 ) {
						jQuery.cleanData( this[i].getElementsByTagName("*") );
						this[i].innerHTML = value;
					}
				}

			// If using innerHTML throws an exception, use the fallback method
			} catch(e) {
				this.empty().append( value );
			}

		} else if ( jQuery.isFunction( value ) ) {
			this.each(function(i){
				var self = jQuery( this );

				self.html( value.call(this, i, self.html()) );
			});

		} else {
			this.empty().append( value );
		}

		return this;
	},

	replaceWith: function( value ) {
		if ( this[0] && this[0].parentNode ) {
			// Make sure that the elements are removed from the DOM before they are inserted
			// this can help fix replacing a parent with child elements
			if ( jQuery.isFunction( value ) ) {
				return this.each(function(i) {
					var self = jQuery(this), old = self.html();
					self.replaceWith( value.call( this, i, old ) );
				});
			}

			if ( typeof value !== "string" ) {
				value = jQuery( value ).detach();
			}

			return this.each(function() {
				var next = this.nextSibling,
					parent = this.parentNode;

				jQuery( this ).remove();

				if ( next ) {
					jQuery(next).before( value );
				} else {
					jQuery(parent).append( value );
				}
			});
		} else {
			return this.pushStack( jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value );
		}
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, table, callback ) {
		var results, first, fragment, parent,
			value = args[0],
			scripts = [];

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( !jQuery.support.checkClone && arguments.length === 3 && typeof value === "string" && rchecked.test( value ) ) {
			return this.each(function() {
				jQuery(this).domManip( args, table, callback, true );
			});
		}

		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				args[0] = value.call(this, i, table ? self.html() : undefined);
				self.domManip( args, table, callback );
			});
		}

		if ( this[0] ) {
			parent = value && value.parentNode;

			// If we're in a fragment, just use that instead of building a new one
			if ( jQuery.support.parentNode && parent && parent.nodeType === 11 && parent.childNodes.length === this.length ) {
				results = { fragment: parent };

			} else {
				results = jQuery.buildFragment( args, this, scripts );
			}
			
			fragment = results.fragment;
			
			if ( fragment.childNodes.length === 1 ) {
				first = fragment = fragment.firstChild;
			} else {
				first = fragment.firstChild;
			}

			if ( first ) {
				table = table && jQuery.nodeName( first, "tr" );

				for ( var i = 0, l = this.length; i < l; i++ ) {
					callback.call(
						table ?
							root(this[i], first) :
							this[i],
						i > 0 || results.cacheable || this.length > 1  ?
							fragment.cloneNode(true) :
							fragment
					);
				}
			}

			if ( scripts.length ) {
				jQuery.each( scripts, evalScript );
			}
		}

		return this;
	}
});

function root( elem, cur ) {
	return jQuery.nodeName(elem, "table") ?
		(elem.getElementsByTagName("tbody")[0] ||
		elem.appendChild(elem.ownerDocument.createElement("tbody"))) :
		elem;
}

function cloneCopyEvent(orig, ret) {
	var i = 0;

	ret.each(function() {
		if ( this.nodeName !== (orig[i] && orig[i].nodeName) ) {
			return;
		}

		var oldData = jQuery.data( orig[i++] ),
			curData = jQuery.data( this, oldData ),
			events = oldData && oldData.events;

		if ( events ) {
			delete curData.handle;
			curData.events = {};

			for ( var type in events ) {
				for ( var handler in events[ type ] ) {
					jQuery.event.add( this, type, events[ type ][ handler ], events[ type ][ handler ].data );
				}
			}
		}
	});
}

jQuery.buildFragment = function( args, nodes, scripts ) {
	var fragment, cacheable, cacheresults,
		doc = (nodes && nodes[0] ? nodes[0].ownerDocument || nodes[0] : document);

	// Only cache "small" (1/2 KB) strings that are associated with the main document
	// Cloning options loses the selected state, so don't cache them
	// IE 6 doesn't like it when you put <object> or <embed> elements in a fragment
	// Also, WebKit does not clone 'checked' attributes on cloneNode, so don't cache
	if ( args.length === 1 && typeof args[0] === "string" && args[0].length < 512 && doc === document &&
		!rnocache.test( args[0] ) && (jQuery.support.checkClone || !rchecked.test( args[0] )) ) {

		cacheable = true;
		cacheresults = jQuery.fragments[ args[0] ];
		if ( cacheresults ) {
			if ( cacheresults !== 1 ) {
				fragment = cacheresults;
			}
		}
	}

	if ( !fragment ) {
		fragment = doc.createDocumentFragment();
		jQuery.clean( args, doc, fragment, scripts );
	}

	if ( cacheable ) {
		jQuery.fragments[ args[0] ] = cacheresults ? fragment : 1;
	}

	return { fragment: fragment, cacheable: cacheable };
};

jQuery.fragments = {};

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var ret = [],
			insert = jQuery( selector ),
			parent = this.length === 1 && this[0].parentNode;
		
		if ( parent && parent.nodeType === 11 && parent.childNodes.length === 1 && insert.length === 1 ) {
			insert[ original ]( this[0] );
			return this;
			
		} else {
			for ( var i = 0, l = insert.length; i < l; i++ ) {
				var elems = (i > 0 ? this.clone(true) : this).get();
				jQuery( insert[i] )[ original ]( elems );
				ret = ret.concat( elems );
			}
		
			return this.pushStack( ret, name, insert.selector );
		}
	};
});

jQuery.extend({
	clean: function( elems, context, fragment, scripts ) {
		context = context || document;

		// !context.createElement fails in IE with an error but returns typeof 'object'
		if ( typeof context.createElement === "undefined" ) {
			context = context.ownerDocument || context[0] && context[0].ownerDocument || document;
		}

		var ret = [];

		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			if ( typeof elem === "number" ) {
				elem += "";
			}

			if ( !elem ) {
				continue;
			}

			// Convert html string into DOM nodes
			if ( typeof elem === "string" && !rhtml.test( elem ) ) {
				elem = context.createTextNode( elem );

			} else if ( typeof elem === "string" ) {
				// Fix "XHTML"-style tags in all browsers
				elem = elem.replace(rxhtmlTag, "<$1></$2>");

				// Trim whitespace, otherwise indexOf won't work as expected
				var tag = (rtagName.exec( elem ) || ["", ""])[1].toLowerCase(),
					wrap = wrapMap[ tag ] || wrapMap._default,
					depth = wrap[0],
					div = context.createElement("div");

				// Go to html and back, then peel off extra wrappers
				div.innerHTML = wrap[1] + elem + wrap[2];

				// Move to the right depth
				while ( depth-- ) {
					div = div.lastChild;
				}

				// Remove IE's autoinserted <tbody> from table fragments
				if ( !jQuery.support.tbody ) {

					// String was a <table>, *may* have spurious <tbody>
					var hasBody = rtbody.test(elem),
						tbody = tag === "table" && !hasBody ?
							div.firstChild && div.firstChild.childNodes :

							// String was a bare <thead> or <tfoot>
							wrap[1] === "<table>" && !hasBody ?
								div.childNodes :
								[];

					for ( var j = tbody.length - 1; j >= 0 ; --j ) {
						if ( jQuery.nodeName( tbody[ j ], "tbody" ) && !tbody[ j ].childNodes.length ) {
							tbody[ j ].parentNode.removeChild( tbody[ j ] );
						}
					}

				}

				// IE completely kills leading whitespace when innerHTML is used
				if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
					div.insertBefore( context.createTextNode( rleadingWhitespace.exec(elem)[0] ), div.firstChild );
				}

				elem = div.childNodes;
			}

			if ( elem.nodeType ) {
				ret.push( elem );
			} else {
				ret = jQuery.merge( ret, elem );
			}
		}

		if ( fragment ) {
			for ( i = 0; ret[i]; i++ ) {
				if ( scripts && jQuery.nodeName( ret[i], "script" ) && (!ret[i].type || ret[i].type.toLowerCase() === "text/javascript") ) {
					scripts.push( ret[i].parentNode ? ret[i].parentNode.removeChild( ret[i] ) : ret[i] );
				
				} else {
					if ( ret[i].nodeType === 1 ) {
						ret.splice.apply( ret, [i + 1, 0].concat(jQuery.makeArray(ret[i].getElementsByTagName("script"))) );
					}
					fragment.appendChild( ret[i] );
				}
			}
		}

		return ret;
	},
	
	cleanData: function( elems ) {
		var data, id, cache = jQuery.cache,
			special = jQuery.event.special,
			deleteExpando = jQuery.support.deleteExpando;
		
		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			if ( elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()] ) {
				continue;
			}

			id = elem[ jQuery.expando ];
			
			if ( id ) {
				data = cache[ id ];
				
				if ( data && data.events ) {
					for ( var type in data.events ) {
						if ( special[ type ] ) {
							jQuery.event.remove( elem, type );

						} else {
							jQuery.removeEvent( elem, type, data.handle );
						}
					}
				}
				
				if ( deleteExpando ) {
					delete elem[ jQuery.expando ];

				} else if ( elem.removeAttribute ) {
					elem.removeAttribute( jQuery.expando );
				}
				
				delete cache[ id ];
			}
		}
	}
});

function evalScript( i, elem ) {
	if ( elem.src ) {
		jQuery.ajax({
			url: elem.src,
			async: false,
			dataType: "script"
		});
	} else {
		jQuery.globalEval( elem.text || elem.textContent || elem.innerHTML || "" );
	}

	if ( elem.parentNode ) {
		elem.parentNode.removeChild( elem );
	}
}




var ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity=([^)]*)/,
	rdashAlpha = /-([a-z])/ig,
	rupper = /([A-Z])/g,
	rnumpx = /^-?\d+(?:px)?$/i,
	rnum = /^-?\d/,

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssWidth = [ "Left", "Right" ],
	cssHeight = [ "Top", "Bottom" ],
	curCSS,

	getComputedStyle,
	currentStyle,

	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	};

jQuery.fn.css = function( name, value ) {
	// Setting 'undefined' is a no-op
	if ( arguments.length === 2 && value === undefined ) {
		return this;
	}

	return jQuery.access( this, name, value, true, function( elem, name, value ) {
		return value !== undefined ?
			jQuery.style( elem, name, value ) :
			jQuery.css( elem, name );
	});
};

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity", "opacity" );
					return ret === "" ? "1" : ret;

				} else {
					return elem.style.opacity;
				}
			}
		}
	},

	// Exclude the following css properties to add px
	cssNumber: {
		"zIndex": true,
		"fontWeight": true,
		"opacity": true,
		"zoom": true,
		"lineHeight": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, origName = jQuery.camelCase( name ),
			style = elem.style, hooks = jQuery.cssHooks[ origName ];

		name = jQuery.cssProps[ origName ] || origName;

		// Check if we're setting a value
		if ( value !== undefined ) {
			// Make sure that NaN and null values aren't set. See: #7116
			if ( typeof value === "number" && isNaN( value ) || value == null ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( typeof value === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value )) !== undefined ) {
				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra ) {
		// Make sure that we're working with the right name
		var ret, origName = jQuery.camelCase( name ),
			hooks = jQuery.cssHooks[ origName ];

		name = jQuery.cssProps[ origName ] || origName;

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks && (ret = hooks.get( elem, true, extra )) !== undefined ) {
			return ret;

		// Otherwise, if a way to get the computed value exists, use that
		} else if ( curCSS ) {
			return curCSS( elem, name, origName );
		}
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations
	swap: function( elem, options, callback ) {
		var old = {};

		// Remember the old values, and insert the new ones
		for ( var name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		callback.call( elem );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}
	},

	camelCase: function( string ) {
		return string.replace( rdashAlpha, fcamelCase );
	}
});

// DEPRECATED, Use jQuery.css() instead
jQuery.curCSS = jQuery.css;

jQuery.each(["height", "width"], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			var val;

			if ( computed ) {
				if ( elem.offsetWidth !== 0 ) {
					val = getWH( elem, name, extra );

				} else {
					jQuery.swap( elem, cssShow, function() {
						val = getWH( elem, name, extra );
					});
				}

				if ( val <= 0 ) {
					val = curCSS( elem, name, name );

					if ( val === "0px" && currentStyle ) {
						val = currentStyle( elem, name, name );
					}

					if ( val != null ) {
						// Should return "auto" instead of 0, use 0 for
						// temporary backwards-compat
						return val === "" || val === "auto" ? "0px" : val;
					}
				}

				if ( val < 0 || val == null ) {
					val = elem.style[ name ];

					// Should return "auto" instead of 0, use 0 for
					// temporary backwards-compat
					return val === "" || val === "auto" ? "0px" : val;
				}

				return typeof val === "string" ? val : val + "px";
			}
		},

		set: function( elem, value ) {
			if ( rnumpx.test( value ) ) {
				// ignore negative width and height values #1599
				value = parseFloat(value);

				if ( value >= 0 ) {
					return value + "px";
				}

			} else {
				return value;
			}
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test((computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "") ?
				(parseFloat(RegExp.$1) / 100) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style;

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// Set the alpha filter to set the opacity
			var opacity = jQuery.isNaN(value) ?
				"" :
				"alpha(opacity=" + value * 100 + ")",
				filter = style.filter || "";

			style.filter = ralpha.test(filter) ?
				filter.replace(ralpha, opacity) :
				style.filter + ' ' + opacity;
		}
	};
}

if ( document.defaultView && document.defaultView.getComputedStyle ) {
	getComputedStyle = function( elem, newName, name ) {
		var ret, defaultView, computedStyle;

		name = name.replace( rupper, "-$1" ).toLowerCase();

		if ( !(defaultView = elem.ownerDocument.defaultView) ) {
			return undefined;
		}

		if ( (computedStyle = defaultView.getComputedStyle( elem, null )) ) {
			ret = computedStyle.getPropertyValue( name );
			if ( ret === "" && !jQuery.contains( elem.ownerDocument.documentElement, elem ) ) {
				ret = jQuery.style( elem, name );
			}
		}

		return ret;
	};
}

if ( document.documentElement.currentStyle ) {
	currentStyle = function( elem, name ) {
		var left, rsLeft,
			ret = elem.currentStyle && elem.currentStyle[ name ],
			style = elem.style;

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		if ( !rnumpx.test( ret ) && rnum.test( ret ) ) {
			// Remember the original values
			left = style.left;
			rsLeft = elem.runtimeStyle.left;

			// Put in the new values to get a computed value out
			elem.runtimeStyle.left = elem.currentStyle.left;
			style.left = name === "fontSize" ? "1em" : (ret || 0);
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			elem.runtimeStyle.left = rsLeft;
		}

		return ret === "" ? "auto" : ret;
	};
}

curCSS = getComputedStyle || currentStyle;

function getWH( elem, name, extra ) {
	var which = name === "width" ? cssWidth : cssHeight,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight;

	if ( extra === "border" ) {
		return val;
	}

	jQuery.each( which, function() {
		if ( !extra ) {
			val -= parseFloat(jQuery.css( elem, "padding" + this )) || 0;
		}

		if ( extra === "margin" ) {
			val += parseFloat(jQuery.css( elem, "margin" + this )) || 0;

		} else {
			val -= parseFloat(jQuery.css( elem, "border" + this + "Width" )) || 0;
		}
	});

	return val;
}

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		var width = elem.offsetWidth,
			height = elem.offsetHeight;

		return (width === 0 && height === 0) || (!jQuery.support.reliableHiddenOffsets && (elem.style.display || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}




var jsc = jQuery.now(),
	rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
	rselectTextarea = /^(?:select|textarea)/i,
	rinput = /^(?:color|date|datetime|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
	rnoContent = /^(?:GET|HEAD)$/,
	rbracket = /\[\]$/,
	jsre = /\=\?(&|$)/,
	rquery = /\?/,
	rts = /([?&])_=[^&]*/,
	rurl = /^(\w+:)?\/\/([^\/?#]+)/,
	r20 = /%20/g,
	rhash = /#.*$/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load;

jQuery.fn.extend({
	load: function( url, params, callback ) {
		if ( typeof url !== "string" && _load ) {
			return _load.apply( this, arguments );

		// Don't do a request if no elements are being requested
		} else if ( !this.length ) {
			return this;
		}

		var off = url.indexOf(" ");
		if ( off >= 0 ) {
			var selector = url.slice(off, url.length);
			url = url.slice(0, off);
		}

		// Default to a GET request
		var type = "GET";

		// If the second parameter was provided
		if ( params ) {
			// If it's a function
			if ( jQuery.isFunction( params ) ) {
				// We assume that it's the callback
				callback = params;
				params = null;

			// Otherwise, build a param string
			} else if ( typeof params === "object" ) {
				params = jQuery.param( params, jQuery.ajaxSettings.traditional );
				type = "POST";
			}
		}

		var self = this;

		// Request the remote document
		jQuery.ajax({
			url: url,
			type: type,
			dataType: "html",
			data: params,
			complete: function( res, status ) {
				// If successful, inject the HTML into all the matched elements
				if ( status === "success" || status === "notmodified" ) {
					// See if a selector was specified
					self.html( selector ?
						// Create a dummy div to hold the results
						jQuery("<div>")
							// inject the contents of the document in, removing the scripts
							// to avoid any 'Permission Denied' errors in IE
							.append(res.responseText.replace(rscript, ""))

							// Locate the specified elements
							.find(selector) :

						// If not, just inject the full result
						res.responseText );
				}

				if ( callback ) {
					self.each( callback, [res.responseText, status, res] );
				}
			}
		});

		return this;
	},

	serialize: function() {
		return jQuery.param(this.serializeArray());
	},

	serializeArray: function() {
		return this.map(function() {
			return this.elements ? jQuery.makeArray(this.elements) : this;
		})
		.filter(function() {
			return this.name && !this.disabled &&
				(this.checked || rselectTextarea.test(this.nodeName) ||
					rinput.test(this.type));
		})
		.map(function( i, elem ) {
			var val = jQuery(this).val();

			return val == null ?
				null :
				jQuery.isArray(val) ?
					jQuery.map( val, function( val, i ) {
						return { name: elem.name, value: val };
					}) :
					{ name: elem.name, value: val };
		}).get();
	}
});

// Attach a bunch of functions for handling common AJAX events
jQuery.each( "ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "), function( i, o ) {
	jQuery.fn[o] = function( f ) {
		return this.bind(o, f);
	};
});

jQuery.extend({
	get: function( url, data, callback, type ) {
		// shift arguments if data argument was omited
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = null;
		}

		return jQuery.ajax({
			type: "GET",
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	},

	getScript: function( url, callback ) {
		return jQuery.get(url, null, callback, "script");
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get(url, data, callback, "json");
	},

	post: function( url, data, callback, type ) {
		// shift arguments if data argument was omited
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = {};
		}

		return jQuery.ajax({
			type: "POST",
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	},

	ajaxSetup: function( settings ) {
		jQuery.extend( jQuery.ajaxSettings, settings );
	},

	ajaxSettings: {
		url: location.href,
		global: true,
		type: "GET",
		contentType: "application/x-www-form-urlencoded",
		processData: true,
		async: true,
		/*
		timeout: 0,
		data: null,
		username: null,
		password: null,
		traditional: false,
		*/
		// This function can be overriden by calling jQuery.ajaxSetup
		xhr: function() {
			return new window.XMLHttpRequest();
		},
		accepts: {
			xml: "application/xml, text/xml",
			html: "text/html",
			script: "text/javascript, application/javascript",
			json: "application/json, text/javascript",
			text: "text/plain",
			_default: "*/*"
		}
	},

	ajax: function( origSettings ) {
		var s = jQuery.extend(true, {}, jQuery.ajaxSettings, origSettings),
			jsonp, status, data, type = s.type.toUpperCase(), noContent = rnoContent.test(type);

		s.url = s.url.replace( rhash, "" );

		// Use original (not extended) context object if it was provided
		s.context = origSettings && origSettings.context != null ? origSettings.context : s;

		// convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Handle JSONP Parameter Callbacks
		if ( s.dataType === "jsonp" ) {
			if ( type === "GET" ) {
				if ( !jsre.test( s.url ) ) {
					s.url += (rquery.test( s.url ) ? "&" : "?") + (s.jsonp || "callback") + "=?";
				}
			} else if ( !s.data || !jsre.test(s.data) ) {
				s.data = (s.data ? s.data + "&" : "") + (s.jsonp || "callback") + "=?";
			}
			s.dataType = "json";
		}

		// Build temporary JSONP function
		if ( s.dataType === "json" && (s.data && jsre.test(s.data) || jsre.test(s.url)) ) {
			jsonp = s.jsonpCallback || ("jsonp" + jsc++);

			// Replace the =? sequence both in the query string and the data
			if ( s.data ) {
				s.data = (s.data + "").replace(jsre, "=" + jsonp + "$1");
			}

			s.url = s.url.replace(jsre, "=" + jsonp + "$1");

			// We need to make sure
			// that a JSONP style response is executed properly
			s.dataType = "script";

			// Handle JSONP-style loading
			var customJsonp = window[ jsonp ];

			window[ jsonp ] = function( tmp ) {
				if ( jQuery.isFunction( customJsonp ) ) {
					customJsonp( tmp );

				} else {
					// Garbage collect
					window[ jsonp ] = undefined;

					try {
						delete window[ jsonp ];
					} catch( jsonpError ) {}
				}

				data = tmp;
				jQuery.handleSuccess( s, xhr, status, data );
				jQuery.handleComplete( s, xhr, status, data );
				
				if ( head ) {
					head.removeChild( script );
				}
			};
		}

		if ( s.dataType === "script" && s.cache === null ) {
			s.cache = false;
		}

		if ( s.cache === false && noContent ) {
			var ts = jQuery.now();

			// try replacing _= if it is there
			var ret = s.url.replace(rts, "$1_=" + ts);

			// if nothing was replaced, add timestamp to the end
			s.url = ret + ((ret === s.url) ? (rquery.test(s.url) ? "&" : "?") + "_=" + ts : "");
		}

		// If data is available, append data to url for GET/HEAD requests
		if ( s.data && noContent ) {
			s.url += (rquery.test(s.url) ? "&" : "?") + s.data;
		}

		// Watch for a new set of requests
		if ( s.global && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// Matches an absolute URL, and saves the domain
		var parts = rurl.exec( s.url ),
			remote = parts && (parts[1] && parts[1].toLowerCase() !== location.protocol || parts[2].toLowerCase() !== location.host);

		// If we're requesting a remote document
		// and trying to load JSON or Script with a GET
		if ( s.dataType === "script" && type === "GET" && remote ) {
			var head = document.getElementsByTagName("head")[0] || document.documentElement;
			var script = document.createElement("script");
			if ( s.scriptCharset ) {
				script.charset = s.scriptCharset;
			}
			script.src = s.url;

			// Handle Script loading
			if ( !jsonp ) {
				var done = false;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function() {
					if ( !done && (!this.readyState ||
							this.readyState === "loaded" || this.readyState === "complete") ) {
						done = true;
						jQuery.handleSuccess( s, xhr, status, data );
						jQuery.handleComplete( s, xhr, status, data );

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;
						if ( head && script.parentNode ) {
							head.removeChild( script );
						}
					}
				};
			}

			// Use insertBefore instead of appendChild  to circumvent an IE6 bug.
			// This arises when a base node is used (#2709 and #4378).
			head.insertBefore( script, head.firstChild );

			// We handle everything using the script element injection
			return undefined;
		}

		var requestDone = false;

		// Create the request object
		var xhr = s.xhr();

		if ( !xhr ) {
			return;
		}

		// Open the socket
		// Passing null username, generates a login popup on Opera (#2865)
		if ( s.username ) {
			xhr.open(type, s.url, s.async, s.username, s.password);
		} else {
			xhr.open(type, s.url, s.async);
		}

		// Need an extra try/catch for cross domain requests in Firefox 3
		try {
			// Set content-type if data specified and content-body is valid for this type
			if ( (s.data != null && !noContent) || (origSettings && origSettings.contentType) ) {
				xhr.setRequestHeader("Content-Type", s.contentType);
			}

			// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
			if ( s.ifModified ) {
				if ( jQuery.lastModified[s.url] ) {
					xhr.setRequestHeader("If-Modified-Since", jQuery.lastModified[s.url]);
				}

				if ( jQuery.etag[s.url] ) {
					xhr.setRequestHeader("If-None-Match", jQuery.etag[s.url]);
				}
			}

			// Set header so the called script knows that it's an XMLHttpRequest
			// Only send the header if it's not a remote XHR
			if ( !remote ) {
				xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
			}

			// Set the Accepts header for the server, depending on the dataType
			xhr.setRequestHeader("Accept", s.dataType && s.accepts[ s.dataType ] ?
				s.accepts[ s.dataType ] + ", */*; q=0.01" :
				s.accepts._default );
		} catch( headerError ) {}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && s.beforeSend.call(s.context, xhr, s) === false ) {
			// Handle the global AJAX counter
			if ( s.global && jQuery.active-- === 1 ) {
				jQuery.event.trigger( "ajaxStop" );
			}

			// close opended socket
			xhr.abort();
			return false;
		}

		if ( s.global ) {
			jQuery.triggerGlobal( s, "ajaxSend", [xhr, s] );
		}

		// Wait for a response to come back
		var onreadystatechange = xhr.onreadystatechange = function( isTimeout ) {
			// The request was aborted
			if ( !xhr || xhr.readyState === 0 || isTimeout === "abort" ) {
				// Opera doesn't call onreadystatechange before this point
				// so we simulate the call
				if ( !requestDone ) {
					jQuery.handleComplete( s, xhr, status, data );
				}

				requestDone = true;
				if ( xhr ) {
					xhr.onreadystatechange = jQuery.noop;
				}

			// The transfer is complete and the data is available, or the request timed out
			} else if ( !requestDone && xhr && (xhr.readyState === 4 || isTimeout === "timeout") ) {
				requestDone = true;
				xhr.onreadystatechange = jQuery.noop;

				status = isTimeout === "timeout" ?
					"timeout" :
					!jQuery.httpSuccess( xhr ) ?
						"error" :
						s.ifModified && jQuery.httpNotModified( xhr, s.url ) ?
							"notmodified" :
							"success";

				var errMsg;

				if ( status === "success" ) {
					// Watch for, and catch, XML document parse errors
					try {
						// process the data (runs the xml through httpData regardless of callback)
						data = jQuery.httpData( xhr, s.dataType, s );
					} catch( parserError ) {
						status = "parsererror";
						errMsg = parserError;
					}
				}

				// Make sure that the request was successful or notmodified
				if ( status === "success" || status === "notmodified" ) {
					// JSONP handles its own success callback
					if ( !jsonp ) {
						jQuery.handleSuccess( s, xhr, status, data );
					}
				} else {
					jQuery.handleError( s, xhr, status, errMsg );
				}

				// Fire the complete handlers
				if ( !jsonp ) {
					jQuery.handleComplete( s, xhr, status, data );
				}

				if ( isTimeout === "timeout" ) {
					xhr.abort();
				}

				// Stop memory leaks
				if ( s.async ) {
					xhr = null;
				}
			}
		};

		// Override the abort handler, if we can (IE 6 doesn't allow it, but that's OK)
		// Opera doesn't fire onreadystatechange at all on abort
		try {
			var oldAbort = xhr.abort;
			xhr.abort = function() {
				if ( xhr ) {
					// oldAbort has no call property in IE7 so
					// just do it this way, which works in all
					// browsers
					Function.prototype.call.call( oldAbort, xhr );
				}

				onreadystatechange( "abort" );
			};
		} catch( abortError ) {}

		// Timeout checker
		if ( s.async && s.timeout > 0 ) {
			setTimeout(function() {
				// Check to see if the request is still happening
				if ( xhr && !requestDone ) {
					onreadystatechange( "timeout" );
				}
			}, s.timeout);
		}

		// Send the data
		try {
			xhr.send( noContent || s.data == null ? null : s.data );

		} catch( sendError ) {
			jQuery.handleError( s, xhr, null, sendError );

			// Fire the complete handlers
			jQuery.handleComplete( s, xhr, status, data );
		}

		// firefox 1.5 doesn't fire statechange for sync requests
		if ( !s.async ) {
			onreadystatechange();
		}

		// return XMLHttpRequest to allow aborting the request etc.
		return xhr;
	},

	// Serialize an array of form elements or a set of
	// key/values into a query string
	param: function( a, traditional ) {
		var s = [],
			add = function( key, value ) {
				// If value is a function, invoke it and return its value
				value = jQuery.isFunction(value) ? value() : value;
				s[ s.length ] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
			};
		
		// Set traditional to true for jQuery <= 1.3.2 behavior.
		if ( traditional === undefined ) {
			traditional = jQuery.ajaxSettings.traditional;
		}
		
		// If an array was passed in, assume that it is an array of form elements.
		if ( jQuery.isArray(a) || a.jquery ) {
			// Serialize the form elements
			jQuery.each( a, function() {
				add( this.name, this.value );
			});
			
		} else {
			// If traditional, encode the "old" way (the way 1.3.2 or older
			// did it), otherwise encode params recursively.
			for ( var prefix in a ) {
				buildParams( prefix, a[prefix], traditional, add );
			}
		}

		// Return the resulting serialization
		return s.join("&").replace(r20, "+");
	}
});

function buildParams( prefix, obj, traditional, add ) {
	if ( jQuery.isArray(obj) && obj.length ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// If array item is non-scalar (array or object), encode its
				// numeric index to resolve deserialization ambiguity issues.
				// Note that rack (as of 1.0.0) can't currently deserialize
				// nested arrays properly, and attempting to do so may cause
				// a server error. Possible fixes are to modify rack's
				// deserialization algorithm or to provide an option or flag
				// to force array serialization to be shallow.
				buildParams( prefix + "[" + ( typeof v === "object" || jQuery.isArray(v) ? i : "" ) + "]", v, traditional, add );
			}
		});
			
	} else if ( !traditional && obj != null && typeof obj === "object" ) {
		if ( jQuery.isEmptyObject( obj ) ) {
			add( prefix, "" );

		// Serialize object item.
		} else {
			jQuery.each( obj, function( k, v ) {
				buildParams( prefix + "[" + k + "]", v, traditional, add );
			});
		}
					
	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}

// This is still on the jQuery object... for now
// Want to move this to jQuery.ajax some day
jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	handleError: function( s, xhr, status, e ) {
		// If a local callback was specified, fire it
		if ( s.error ) {
			s.error.call( s.context, xhr, status, e );
		}

		// Fire the global callback
		if ( s.global ) {
			jQuery.triggerGlobal( s, "ajaxError", [xhr, s, e] );
		}
	},

	handleSuccess: function( s, xhr, status, data ) {
		// If a local callback was specified, fire it and pass it the data
		if ( s.success ) {
			s.success.call( s.context, data, status, xhr );
		}

		// Fire the global callback
		if ( s.global ) {
			jQuery.triggerGlobal( s, "ajaxSuccess", [xhr, s] );
		}
	},

	handleComplete: function( s, xhr, status ) {
		// Process result
		if ( s.complete ) {
			s.complete.call( s.context, xhr, status );
		}

		// The request was completed
		if ( s.global ) {
			jQuery.triggerGlobal( s, "ajaxComplete", [xhr, s] );
		}

		// Handle the global AJAX counter
		if ( s.global && jQuery.active-- === 1 ) {
			jQuery.event.trigger( "ajaxStop" );
		}
	},
		
	triggerGlobal: function( s, type, args ) {
		(s.context && s.context.url == null ? jQuery(s.context) : jQuery.event).trigger(type, args);
	},

	// Determines if an XMLHttpRequest was successful or not
	httpSuccess: function( xhr ) {
		try {
			// IE error sometimes returns 1223 when it should be 204 so treat it as success, see #1450
			return !xhr.status && location.protocol === "file:" ||
				xhr.status >= 200 && xhr.status < 300 ||
				xhr.status === 304 || xhr.status === 1223;
		} catch(e) {}

		return false;
	},

	// Determines if an XMLHttpRequest returns NotModified
	httpNotModified: function( xhr, url ) {
		var lastModified = xhr.getResponseHeader("Last-Modified"),
			etag = xhr.getResponseHeader("Etag");

		if ( lastModified ) {
			jQuery.lastModified[url] = lastModified;
		}

		if ( etag ) {
			jQuery.etag[url] = etag;
		}

		return xhr.status === 304;
	},

	httpData: function( xhr, type, s ) {
		var ct = xhr.getResponseHeader("content-type") || "",
			xml = type === "xml" || !type && ct.indexOf("xml") >= 0,
			data = xml ? xhr.responseXML : xhr.responseText;

		if ( xml && data.documentElement.nodeName === "parsererror" ) {
			jQuery.error( "parsererror" );
		}

		// Allow a pre-filtering function to sanitize the response
		// s is checked to keep backwards compatibility
		if ( s && s.dataFilter ) {
			data = s.dataFilter( data, type );
		}

		// The filter can actually parse the response
		if ( typeof data === "string" ) {
			// Get the JavaScript object, if JSON is used.
			if ( type === "json" || !type && ct.indexOf("json") >= 0 ) {
				data = jQuery.parseJSON( data );

			// If the type is "script", eval it in global context
			} else if ( type === "script" || !type && ct.indexOf("javascript") >= 0 ) {
				jQuery.globalEval( data );
			}
		}

		return data;
	}

});

/*
 * Create the request object; Microsoft failed to properly
 * implement the XMLHttpRequest in IE7 (can't request local files),
 * so we use the ActiveXObject when it is available
 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
 * we need a fallback.
 */
if ( window.ActiveXObject ) {
	jQuery.ajaxSettings.xhr = function() {
		if ( window.location.protocol !== "file:" ) {
			try {
				return new window.XMLHttpRequest();
			} catch(xhrError) {}
		}

		try {
			return new window.ActiveXObject("Microsoft.XMLHTTP");
		} catch(activeError) {}
	};
}

// Does this browser support XHR requests?
jQuery.support.ajax = !!jQuery.ajaxSettings.xhr();




var elemdisplay = {},
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = /^([+\-]=)?([\d+.\-]+)(.*)$/,
	timerId,
	fxAttrs = [
		// height animations
		[ "height", "marginTop", "marginBottom", "paddingTop", "paddingBottom" ],
		// width animations
		[ "width", "marginLeft", "marginRight", "paddingLeft", "paddingRight" ],
		// opacity animations
		[ "opacity" ]
	];

jQuery.fn.extend({
	show: function( speed, easing, callback ) {
		var elem, display;

		if ( speed || speed === 0 ) {
			return this.animate( genFx("show", 3), speed, easing, callback);

		} else {
			for ( var i = 0, j = this.length; i < j; i++ ) {
				elem = this[i];
				display = elem.style.display;

				// Reset the inline display of this element to learn if it is
				// being hidden by cascaded rules or not
				if ( !jQuery.data(elem, "olddisplay") && display === "none" ) {
					display = elem.style.display = "";
				}

				// Set elements which have been overridden with display: none
				// in a stylesheet to whatever the default browser style is
				// for such an element
				if ( display === "" && jQuery.css( elem, "display" ) === "none" ) {
					jQuery.data(elem, "olddisplay", defaultDisplay(elem.nodeName));
				}
			}

			// Set the display of most of the elements in a second loop
			// to avoid the constant reflow
			for ( i = 0; i < j; i++ ) {
				elem = this[i];
				display = elem.style.display;

				if ( display === "" || display === "none" ) {
					elem.style.display = jQuery.data(elem, "olddisplay") || "";
				}
			}

			return this;
		}
	},

	hide: function( speed, easing, callback ) {
		if ( speed || speed === 0 ) {
			return this.animate( genFx("hide", 3), speed, easing, callback);

		} else {
			for ( var i = 0, j = this.length; i < j; i++ ) {
				var display = jQuery.css( this[i], "display" );

				if ( display !== "none" ) {
					jQuery.data( this[i], "olddisplay", display );
				}
			}

			// Set the display of the elements in a second loop
			// to avoid the constant reflow
			for ( i = 0; i < j; i++ ) {
				this[i].style.display = "none";
			}

			return this;
		}
	},

	// Save the old toggle function
	_toggle: jQuery.fn.toggle,

	toggle: function( fn, fn2, callback ) {
		var bool = typeof fn === "boolean";

		if ( jQuery.isFunction(fn) && jQuery.isFunction(fn2) ) {
			this._toggle.apply( this, arguments );

		} else if ( fn == null || bool ) {
			this.each(function() {
				var state = bool ? fn : jQuery(this).is(":hidden");
				jQuery(this)[ state ? "show" : "hide" ]();
			});

		} else {
			this.animate(genFx("toggle", 3), fn, fn2, callback);
		}

		return this;
	},

	fadeTo: function( speed, to, easing, callback ) {
		return this.filter(":hidden").css("opacity", 0).show().end()
					.animate({opacity: to}, speed, easing, callback);
	},

	animate: function( prop, speed, easing, callback ) {
		var optall = jQuery.speed(speed, easing, callback);

		if ( jQuery.isEmptyObject( prop ) ) {
			return this.each( optall.complete );
		}

		return this[ optall.queue === false ? "each" : "queue" ](function() {
			// XXX 'this' does not always have a nodeName when running the
			// test suite

			var opt = jQuery.extend({}, optall), p,
				isElement = this.nodeType === 1,
				hidden = isElement && jQuery(this).is(":hidden"),
				self = this;

			for ( p in prop ) {
				var name = jQuery.camelCase( p );

				if ( p !== name ) {
					prop[ name ] = prop[ p ];
					delete prop[ p ];
					p = name;
				}

				if ( prop[p] === "hide" && hidden || prop[p] === "show" && !hidden ) {
					return opt.complete.call(this);
				}

				if ( isElement && ( p === "height" || p === "width" ) ) {
					// Make sure that nothing sneaks out
					// Record all 3 overflow attributes because IE does not
					// change the overflow attribute when overflowX and
					// overflowY are set to the same value
					opt.overflow = [ this.style.overflow, this.style.overflowX, this.style.overflowY ];

					// Set display property to inline-block for height/width
					// animations on inline elements that are having width/height
					// animated
					if ( jQuery.css( this, "display" ) === "inline" &&
							jQuery.css( this, "float" ) === "none" ) {
						if ( !jQuery.support.inlineBlockNeedsLayout ) {
							this.style.display = "inline-block";

						} else {
							var display = defaultDisplay(this.nodeName);

							// inline-level elements accept inline-block;
							// block-level elements need to be inline with layout
							if ( display === "inline" ) {
								this.style.display = "inline-block";

							} else {
								this.style.display = "inline";
								this.style.zoom = 1;
							}
						}
					}
				}

				if ( jQuery.isArray( prop[p] ) ) {
					// Create (if needed) and add to specialEasing
					(opt.specialEasing = opt.specialEasing || {})[p] = prop[p][1];
					prop[p] = prop[p][0];
				}
			}

			if ( opt.overflow != null ) {
				this.style.overflow = "hidden";
			}

			opt.curAnim = jQuery.extend({}, prop);

			jQuery.each( prop, function( name, val ) {
				var e = new jQuery.fx( self, opt, name );

				if ( rfxtypes.test(val) ) {
					e[ val === "toggle" ? hidden ? "show" : "hide" : val ]( prop );

				} else {
					var parts = rfxnum.exec(val),
						start = e.cur() || 0;

					if ( parts ) {
						var end = parseFloat( parts[2] ),
							unit = parts[3] || "px";

						// We need to compute starting value
						if ( unit !== "px" ) {
							jQuery.style( self, name, (end || 1) + unit);
							start = ((end || 1) / e.cur()) * start;
							jQuery.style( self, name, start + unit);
						}

						// If a +=/-= token was provided, we're doing a relative animation
						if ( parts[1] ) {
							end = ((parts[1] === "-=" ? -1 : 1) * end) + start;
						}

						e.custom( start, end, unit );

					} else {
						e.custom( start, val, "" );
					}
				}
			});

			// For JS strict compliance
			return true;
		});
	},

	stop: function( clearQueue, gotoEnd ) {
		var timers = jQuery.timers;

		if ( clearQueue ) {
			this.queue([]);
		}

		this.each(function() {
			// go in reverse order so anything added to the queue during the loop is ignored
			for ( var i = timers.length - 1; i >= 0; i-- ) {
				if ( timers[i].elem === this ) {
					if (gotoEnd) {
						// force the next step to be the last
						timers[i](true);
					}

					timers.splice(i, 1);
				}
			}
		});

		// start the next in the queue if the last step wasn't forced
		if ( !gotoEnd ) {
			this.dequeue();
		}

		return this;
	}

});

function genFx( type, num ) {
	var obj = {};

	jQuery.each( fxAttrs.concat.apply([], fxAttrs.slice(0,num)), function() {
		obj[ this ] = type;
	});

	return obj;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show", 1),
	slideUp: genFx("hide", 1),
	slideToggle: genFx("toggle", 1),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.extend({
	speed: function( speed, easing, fn ) {
		var opt = speed && typeof speed === "object" ? jQuery.extend({}, speed) : {
			complete: fn || !fn && easing ||
				jQuery.isFunction( speed ) && speed,
			duration: speed,
			easing: fn && easing || easing && !jQuery.isFunction(easing) && easing
		};

		opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
			opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[opt.duration] : jQuery.fx.speeds._default;

		// Queueing
		opt.old = opt.complete;
		opt.complete = function() {
			if ( opt.queue !== false ) {
				jQuery(this).dequeue();
			}
			if ( jQuery.isFunction( opt.old ) ) {
				opt.old.call( this );
			}
		};

		return opt;
	},

	easing: {
		linear: function( p, n, firstNum, diff ) {
			return firstNum + diff * p;
		},
		swing: function( p, n, firstNum, diff ) {
			return ((-Math.cos(p*Math.PI)/2) + 0.5) * diff + firstNum;
		}
	},

	timers: [],

	fx: function( elem, options, prop ) {
		this.options = options;
		this.elem = elem;
		this.prop = prop;

		if ( !options.orig ) {
			options.orig = {};
		}
	}

});

jQuery.fx.prototype = {
	// Simple function for setting a style value
	update: function() {
		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		(jQuery.fx.step[this.prop] || jQuery.fx.step._default)( this );
	},

	// Get the current size
	cur: function() {
		if ( this.elem[this.prop] != null && (!this.elem.style || this.elem.style[this.prop] == null) ) {
			return this.elem[ this.prop ];
		}

		var r = parseFloat( jQuery.css( this.elem, this.prop ) );
		return r && r > -10000 ? r : 0;
	},

	// Start an animation from one number to another
	custom: function( from, to, unit ) {
		var self = this,
			fx = jQuery.fx;

		this.startTime = jQuery.now();
		this.start = from;
		this.end = to;
		this.unit = unit || this.unit || "px";
		this.now = this.start;
		this.pos = this.state = 0;

		function t( gotoEnd ) {
			return self.step(gotoEnd);
		}

		t.elem = this.elem;

		if ( t() && jQuery.timers.push(t) && !timerId ) {
			timerId = setInterval(fx.tick, fx.interval);
		}
	},

	// Simple 'show' function
	show: function() {
		// Remember where we started, so that we can go back to it later
		this.options.orig[this.prop] = jQuery.style( this.elem, this.prop );
		this.options.show = true;

		// Begin the animation
		// Make sure that we start at a small width/height to avoid any
		// flash of content
		this.custom(this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur());

		// Start by showing the element
		jQuery( this.elem ).show();
	},

	// Simple 'hide' function
	hide: function() {
		// Remember where we started, so that we can go back to it later
		this.options.orig[this.prop] = jQuery.style( this.elem, this.prop );
		this.options.hide = true;

		// Begin the animation
		this.custom(this.cur(), 0);
	},

	// Each step of an animation
	step: function( gotoEnd ) {
		var t = jQuery.now(), done = true;

		if ( gotoEnd || t >= this.options.duration + this.startTime ) {
			this.now = this.end;
			this.pos = this.state = 1;
			this.update();

			this.options.curAnim[ this.prop ] = true;

			for ( var i in this.options.curAnim ) {
				if ( this.options.curAnim[i] !== true ) {
					done = false;
				}
			}

			if ( done ) {
				// Reset the overflow
				if ( this.options.overflow != null && !jQuery.support.shrinkWrapBlocks ) {
					var elem = this.elem,
						options = this.options;

					jQuery.each( [ "", "X", "Y" ], function (index, value) {
						elem.style[ "overflow" + value ] = options.overflow[index];
					} );
				}

				// Hide the element if the "hide" operation was done
				if ( this.options.hide ) {
					jQuery(this.elem).hide();
				}

				// Reset the properties, if the item has been hidden or shown
				if ( this.options.hide || this.options.show ) {
					for ( var p in this.options.curAnim ) {
						jQuery.style( this.elem, p, this.options.orig[p] );
					}
				}

				// Execute the complete function
				this.options.complete.call( this.elem );
			}

			return false;

		} else {
			var n = t - this.startTime;
			this.state = n / this.options.duration;

			// Perform the easing function, defaults to swing
			var specialEasing = this.options.specialEasing && this.options.specialEasing[this.prop];
			var defaultEasing = this.options.easing || (jQuery.easing.swing ? "swing" : "linear");
			this.pos = jQuery.easing[specialEasing || defaultEasing](this.state, n, 0, 1, this.options.duration);
			this.now = this.start + ((this.end - this.start) * this.pos);

			// Perform the next step of the animation
			this.update();
		}

		return true;
	}
};

jQuery.extend( jQuery.fx, {
	tick: function() {
		var timers = jQuery.timers;

		for ( var i = 0; i < timers.length; i++ ) {
			if ( !timers[i]() ) {
				timers.splice(i--, 1);
			}
		}

		if ( !timers.length ) {
			jQuery.fx.stop();
		}
	},

	interval: 13,

	stop: function() {
		clearInterval( timerId );
		timerId = null;
	},

	speeds: {
		slow: 600,
		fast: 200,
		// Default speed
		_default: 400
	},

	step: {
		opacity: function( fx ) {
			jQuery.style( fx.elem, "opacity", fx.now );
		},

		_default: function( fx ) {
			if ( fx.elem.style && fx.elem.style[ fx.prop ] != null ) {
				fx.elem.style[ fx.prop ] = (fx.prop === "width" || fx.prop === "height" ? Math.max(0, fx.now) : fx.now) + fx.unit;
			} else {
				fx.elem[ fx.prop ] = fx.now;
			}
		}
	}
});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}

function defaultDisplay( nodeName ) {
	if ( !elemdisplay[ nodeName ] ) {
		var elem = jQuery("<" + nodeName + ">").appendTo("body"),
			display = elem.css("display");

		elem.remove();

		if ( display === "none" || display === "" ) {
			display = "block";
		}

		elemdisplay[ nodeName ] = display;
	}

	return elemdisplay[ nodeName ];
}




var rtable = /^t(?:able|d|h)$/i,
	rroot = /^(?:body|html)$/i;

if ( "getBoundingClientRect" in document.documentElement ) {
	jQuery.fn.offset = function( options ) {
		var elem = this[0], box;

		if ( options ) { 
			return this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
		}

		if ( !elem || !elem.ownerDocument ) {
			return null;
		}

		if ( elem === elem.ownerDocument.body ) {
			return jQuery.offset.bodyOffset( elem );
		}

		try {
			box = elem.getBoundingClientRect();
		} catch(e) {}

		var doc = elem.ownerDocument,
			docElem = doc.documentElement;

		// Make sure we're not dealing with a disconnected DOM node
		if ( !box || !jQuery.contains( docElem, elem ) ) {
			return box || { top: 0, left: 0 };
		}

		var body = doc.body,
			win = getWindow(doc),
			clientTop  = docElem.clientTop  || body.clientTop  || 0,
			clientLeft = docElem.clientLeft || body.clientLeft || 0,
			scrollTop  = (win.pageYOffset || jQuery.support.boxModel && docElem.scrollTop  || body.scrollTop ),
			scrollLeft = (win.pageXOffset || jQuery.support.boxModel && docElem.scrollLeft || body.scrollLeft),
			top  = box.top  + scrollTop  - clientTop,
			left = box.left + scrollLeft - clientLeft;

		return { top: top, left: left };
	};

} else {
	jQuery.fn.offset = function( options ) {
		var elem = this[0];

		if ( options ) { 
			return this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
		}

		if ( !elem || !elem.ownerDocument ) {
			return null;
		}

		if ( elem === elem.ownerDocument.body ) {
			return jQuery.offset.bodyOffset( elem );
		}

		jQuery.offset.initialize();

		var computedStyle,
			offsetParent = elem.offsetParent,
			prevOffsetParent = elem,
			doc = elem.ownerDocument,
			docElem = doc.documentElement,
			body = doc.body,
			defaultView = doc.defaultView,
			prevComputedStyle = defaultView ? defaultView.getComputedStyle( elem, null ) : elem.currentStyle,
			top = elem.offsetTop,
			left = elem.offsetLeft;

		while ( (elem = elem.parentNode) && elem !== body && elem !== docElem ) {
			if ( jQuery.offset.supportsFixedPosition && prevComputedStyle.position === "fixed" ) {
				break;
			}

			computedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle;
			top  -= elem.scrollTop;
			left -= elem.scrollLeft;

			if ( elem === offsetParent ) {
				top  += elem.offsetTop;
				left += elem.offsetLeft;

				if ( jQuery.offset.doesNotAddBorder && !(jQuery.offset.doesAddBorderForTableAndCells && rtable.test(elem.nodeName)) ) {
					top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
					left += parseFloat( computedStyle.borderLeftWidth ) || 0;
				}

				prevOffsetParent = offsetParent;
				offsetParent = elem.offsetParent;
			}

			if ( jQuery.offset.subtractsBorderForOverflowNotVisible && computedStyle.overflow !== "visible" ) {
				top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
				left += parseFloat( computedStyle.borderLeftWidth ) || 0;
			}

			prevComputedStyle = computedStyle;
		}

		if ( prevComputedStyle.position === "relative" || prevComputedStyle.position === "static" ) {
			top  += body.offsetTop;
			left += body.offsetLeft;
		}

		if ( jQuery.offset.supportsFixedPosition && prevComputedStyle.position === "fixed" ) {
			top  += Math.max( docElem.scrollTop, body.scrollTop );
			left += Math.max( docElem.scrollLeft, body.scrollLeft );
		}

		return { top: top, left: left };
	};
}

jQuery.offset = {
	initialize: function() {
		var body = document.body, container = document.createElement("div"), innerDiv, checkDiv, table, td, bodyMarginTop = parseFloat( jQuery.css(body, "marginTop") ) || 0,
			html = "<div style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;'><div></div></div><table style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;' cellpadding='0' cellspacing='0'><tr><td></td></tr></table>";

		jQuery.extend( container.style, { position: "absolute", top: 0, left: 0, margin: 0, border: 0, width: "1px", height: "1px", visibility: "hidden" } );

		container.innerHTML = html;
		body.insertBefore( container, body.firstChild );
		innerDiv = container.firstChild;
		checkDiv = innerDiv.firstChild;
		td = innerDiv.nextSibling.firstChild.firstChild;

		this.doesNotAddBorder = (checkDiv.offsetTop !== 5);
		this.doesAddBorderForTableAndCells = (td.offsetTop === 5);

		checkDiv.style.position = "fixed";
		checkDiv.style.top = "20px";

		// safari subtracts parent border width here which is 5px
		this.supportsFixedPosition = (checkDiv.offsetTop === 20 || checkDiv.offsetTop === 15);
		checkDiv.style.position = checkDiv.style.top = "";

		innerDiv.style.overflow = "hidden";
		innerDiv.style.position = "relative";

		this.subtractsBorderForOverflowNotVisible = (checkDiv.offsetTop === -5);

		this.doesNotIncludeMarginInBodyOffset = (body.offsetTop !== bodyMarginTop);

		body.removeChild( container );
		body = container = innerDiv = checkDiv = table = td = null;
		jQuery.offset.initialize = jQuery.noop;
	},

	bodyOffset: function( body ) {
		var top = body.offsetTop,
			left = body.offsetLeft;

		jQuery.offset.initialize();

		if ( jQuery.offset.doesNotIncludeMarginInBodyOffset ) {
			top  += parseFloat( jQuery.css(body, "marginTop") ) || 0;
			left += parseFloat( jQuery.css(body, "marginLeft") ) || 0;
		}

		return { top: top, left: left };
	},
	
	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = (position === "absolute" && jQuery.inArray('auto', [curCSSTop, curCSSLeft]) > -1),
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is absolute
		if ( calculatePosition ) {
			curPosition = curElem.position();
		}

		curTop  = calculatePosition ? curPosition.top  : parseInt( curCSSTop,  10 ) || 0;
		curLeft = calculatePosition ? curPosition.left : parseInt( curCSSLeft, 10 ) || 0;

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if (options.top != null) {
			props.top = (options.top - curOffset.top) + curTop;
		}
		if (options.left != null) {
			props.left = (options.left - curOffset.left) + curLeft;
		}
		
		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({
	position: function() {
		if ( !this[0] ) {
			return null;
		}

		var elem = this[0],

		// Get *real* offsetParent
		offsetParent = this.offsetParent(),

		// Get correct offsets
		offset       = this.offset(),
		parentOffset = rroot.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

		// Subtract element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		offset.top  -= parseFloat( jQuery.css(elem, "marginTop") ) || 0;
		offset.left -= parseFloat( jQuery.css(elem, "marginLeft") ) || 0;

		// Add offsetParent borders
		parentOffset.top  += parseFloat( jQuery.css(offsetParent[0], "borderTopWidth") ) || 0;
		parentOffset.left += parseFloat( jQuery.css(offsetParent[0], "borderLeftWidth") ) || 0;

		// Subtract the two offsets
		return {
			top:  offset.top  - parentOffset.top,
			left: offset.left - parentOffset.left
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || document.body;
			while ( offsetParent && (!rroot.test(offsetParent.nodeName) && jQuery.css(offsetParent, "position") === "static") ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( ["Left", "Top"], function( i, name ) {
	var method = "scroll" + name;

	jQuery.fn[ method ] = function(val) {
		var elem = this[0], win;
		
		if ( !elem ) {
			return null;
		}

		if ( val !== undefined ) {
			// Set the scroll offset
			return this.each(function() {
				win = getWindow( this );

				if ( win ) {
					win.scrollTo(
						!i ? val : jQuery(win).scrollLeft(),
						 i ? val : jQuery(win).scrollTop()
					);

				} else {
					this[ method ] = val;
				}
			});
		} else {
			win = getWindow( elem );

			// Return the scroll offset
			return win ? ("pageXOffset" in win) ? win[ i ? "pageYOffset" : "pageXOffset" ] :
				jQuery.support.boxModel && win.document.documentElement[ method ] ||
					win.document.body[ method ] :
				elem[ method ];
		}
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}




// Create innerHeight, innerWidth, outerHeight and outerWidth methods
jQuery.each([ "Height", "Width" ], function( i, name ) {

	var type = name.toLowerCase();

	// innerHeight and innerWidth
	jQuery.fn["inner" + name] = function() {
		return this[0] ?
			parseFloat( jQuery.css( this[0], type, "padding" ) ) :
			null;
	};

	// outerHeight and outerWidth
	jQuery.fn["outer" + name] = function( margin ) {
		return this[0] ?
			parseFloat( jQuery.css( this[0], type, margin ? "margin" : "border" ) ) :
			null;
	};

	jQuery.fn[ type ] = function( size ) {
		// Get window width or height
		var elem = this[0];
		if ( !elem ) {
			return size == null ? null : this;
		}
		
		if ( jQuery.isFunction( size ) ) {
			return this.each(function( i ) {
				var self = jQuery( this );
				self[ type ]( size.call( this, i, self[ type ]() ) );
			});
		}

		if ( jQuery.isWindow( elem ) ) {
			// Everyone else use document.documentElement or document.body depending on Quirks vs Standards mode
			return elem.document.compatMode === "CSS1Compat" && elem.document.documentElement[ "client" + name ] ||
				elem.document.body[ "client" + name ];

		// Get document width or height
		} else if ( elem.nodeType === 9 ) {
			// Either scroll[Width/Height] or offset[Width/Height], whichever is greater
			return Math.max(
				elem.documentElement["client" + name],
				elem.body["scroll" + name], elem.documentElement["scroll" + name],
				elem.body["offset" + name], elem.documentElement["offset" + name]
			);

		// Get or set width or height on the element
		} else if ( size === undefined ) {
			var orig = jQuery.css( elem, type ),
				ret = parseFloat( orig );

			return jQuery.isNaN( ret ) ? orig : ret;

		// Set the width or height on the element (default to pixels if value is unitless)
		} else {
			return this.css( type, typeof size === "string" ? size : size + "px" );
		}
	};

});


})(window);

/**
 * This file contains the WDN template javascript code.
 */
var _gaq = _gaq || [];
var WDN = function() {
	var loadingJS = {};
	return {
		/**
		 * This stores what javascript files have been loaded already
		 */
		loadedJS : {},
		
		/**
		 * This variable stores the path to the template files.
		 * It can be set to /, http://www.unl.edu/, or nothing.
		 */
		template_path : '',
		
		/*
		 * Loads an external JavaScript file. 
		 * 
		 * @param {string} url
		 * @param {function} callback (optional) - will be called once the JS file has been loaded
		 * @param {boolean} checkLoaded (optional) - if false, the JS will be loaded without checking whether it's already been loaded
		 * @param {boolean} callbackIfLoaded (optional) - if false, the callback will not be executed if the JS has already been loaded
		 */
		
		loadJS : function(url,callback,checkLoaded,callbackIfLoaded) {
			if (url.match(/^\/?wdn\/templates_3\.0/)) {
				// trim off the leading slash
				if (url.charAt(0) == '/') {
					url = url.substring(1);
				}
				url = WDN.template_path+url;
			}
			
			if ((arguments.length>2 && checkLoaded === false) || !WDN.loadedJS[url]){
				if (url in loadingJS) {
					if (callback) {
						loadingJS[url].push(callback);
					}
					return;
				}
				loadingJS[url] = [];
				//debug statement removed
				var e = document.createElement("script");
				e.setAttribute('src', url);
				e.setAttribute('type','text/javascript');
				document.getElementsByTagName('head').item(0).appendChild(e);
				
				if (callback) {
					loadingJS[url].push(callback);
				}
				var executeCallback = function() {
					WDN.loadedJS[url] = 1;
					if (loadingJS[url]) {
						//debug statement removed
						for (var i = 0; i < loadingJS[url].length; i++) {
							loadingJS[url][i]();
						}
						delete loadingJS[url];
					}
				};
				
				e.onreadystatechange = function() {
					if (e.readyState == "loaded" || e.readyState == "complete"){
						executeCallback();
					}
				};
				e.onload = executeCallback;
				
			} else {
				//debug statement removed
				if ((arguments.length > 3 && callbackIfLoaded === false) || !callback){
					return;
				}
				callback();
			}
		},
		
		/**
		 * Load an external css file.
		 */
		loadCSS : function(url) {
			if (url.match(/^wdn\/templates_3\.0/)) {
				url = WDN.template_path+url;
			}
			var e = document.createElement("link");
			e.href = url;
			e.rel = "stylesheet";
			e.type="text/css";
			document.getElementsByTagName("head")[0].appendChild(e);
		},
		
		/**
		 * This function is called on page load to initialize template related
		 * data.
		 */
		initializeTemplate : function() {
			//gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");  
			//WDN.loadJS(gaJsHost + "google-analytics.com/ga.js");
			WDN.loadCSS('wdn/templates_3.0/css/script.css');
			WDN.loadJS('wdn/templates_3.0/scripts/xmlhttp.js');
			WDN.loadJS('wdn/templates_3.0/scripts/global_functions.js');
			WDN.loadJQuery(WDN.jQueryUsage);
		},

		/**
		 * Load jQuery included with the templates as WDN.jQuery
		 * 
		 * @param callback Called when the document is ready
		 */
		loadJQuery : function(callback) {
			WDN.loadJS('wdn/templates_3.0/scripts/jquery.js', function(){
				if (!WDN.jQuery) {
					WDN.jQuery = jQuery.noConflict(true);
				}
				WDN.jQuery(document).ready(function() {
					callback();
				});
			});
		},
		
		/**
		 * All things needed by jQuery can be put in here, and they'll get
		 * executed when jquery is loaded
		 */
		jQueryUsage : function() {
			WDN.initializePlugin('analytics');
			if (WDN.jQuery('body').hasClass('mobile')) {
				return;
			}
			WDN.initializePlugin('mobile_detect');
			WDN.initializePlugin('navigation');
			WDN.initializePlugin('search');
			WDN.initializePlugin('feedback');
			WDN.initializePlugin('socialmediashare');
			WDN.contentAdjustments();
			WDN.initializePlugin('tooltip');
			WDN.initializePlugin('toolbar');
			WDN.initializePlugin('tabs');
			WDN.initializePlugin('unlalert');
			//WDN.initializePlugin('idm');
			WDN.browserAdjustments();
			WDN.screenAdjustments();
		},
		
		/**
		 * This function logs data for debugging purposes.
		 * 
		 * To see, open firebug's console.
		 */
		log: function(data) {
			if ("console" in window && "log" in console) {
				console.log(data);
			}
		},
		
		browserAdjustments : function() {
			if (WDN.jQuery.browser.msie && (WDN.jQuery.browser.version == '6.0') && (!navigator.userAgent.match(/MSIE 8.0/))) {
				WDN.jQuery('body').prepend('<div id="wdn_upgrade_notice"></div>');
				fetchURLInto('http://www.unl.edu/wdn/templates_3.0/includes/browserupgrade.html', 'wdn_upgrade_notice');
				WDN.jQuery('head link[rel=stylesheet]').each(function(i) { this.disabled = true; });
				WDN.jQuery('body').removeAttr('class');
				WDN.jQuery('body').addClass('document');
				WDN.loadCSS('wdn/templates_3.0/css/content/columns.css');
			}
            
            if ((navigator.userAgent.match(/applewebkit/i) && !navigator.userAgent.match(/Version\/[34]/)) ||
                (navigator.userAgent.match(/firefox/i) && (navigator.userAgent.match(/firefox\/[12]/i) || navigator.userAgent.match(/firefox\/3.[01234]/i))) ||
                (navigator.userAgent.match(/msie/i))){
                // old browser needs help zebra striping
                WDN.jQuery('.zentable tbody tr:nth-child(odd)').addClass('rowOdd');
                WDN.jQuery('.zentable tbody tr:nth-child(even)').addClass('rowEven');
            } 
		},
		
		screenAdjustments : function() {
			if (screen.width<=1024) {
				WDN.jQuery('body').css({'background':'#e0e0e0'});
				if (WDN.jQuery.browser.msie) {
					WDN.jQuery('#wdn_wrapper').css({'margin':'0 0 0 5px'});
				}
			}
		},
		
		contentAdjustments : function () {
			WDN.jQuery('#footer_floater').css("zoom", 1);
			WDN.jQuery('#maincontent p.caption, #footer p.caption').each(function(i){
				if (WDN.jQuery(this).height()>20) {
					WDN.jQuery(this).css({border:'1px solid #DDD',marginleft:'0'});
				}
				//set the caption to the same width as the image it goes with so that a long caption doesn't spill over
				var imgWidth = WDN.jQuery(this).prev('img').width();
				if (imgWidth) {
					WDN.jQuery(this).width(imgWidth);
				}
			});
			//remove the dotted line underneath images that are links
			WDN.jQuery('#maincontent a img, #footer a img').each(function(j){
				WDN.jQuery(this).parent('a').addClass('imagelink');
			});
		},
		
		initializePlugin:function (plugin, callback) {
			if (!callback) {
				callback = function () {
					if ("initialize" in WDN[plugin]) {
						//debug statement removed
						WDN[plugin].initialize();
					} else {
						//debug statement removed
					}
				};
			}
			WDN.loadJS('wdn/templates_3.0/scripts/'+plugin+'.js', callback);
		},
		
		setCookie : function(name, value, seconds) {
			var expires = "";
			if (seconds) {
				var date = new Date();
				date.setTime(date.getTime()+(seconds*1000));
				expires = ";expires="+date.toGMTString();
			}
			document.cookie = name+"="+value+expires+";path=/;domain=.unl.edu";
		},
		
		getCookie : function(name) {
			var nameEQ = name + "=";
			var ca = document.cookie.split(';');
			for(var i=0;i < ca.length;i++) {
				var c = ca[i];
				while (c.charAt(0) === ' ') {
					c = c.substring(1,c.length);
				}
				if (c.indexOf(nameEQ) === 0) {
					return c.substring(nameEQ.length,c.length);
				}
			}
			return null;
		},
		
		/**
		 * Converts a relative link to an absolute link.
		 * 
		 * @param string link The relative link
		 * @param string base_url The base to use
		 */
		toAbs: function (link, base_url) {
		  if (typeof link == 'undefined')
			  return;
		  var lparts = link.split('/');
		  if (/http:|https:|ftp:/.test(lparts[0])) {
		    // already abs, return
		    return link;
		  }

		  var i, hparts = base_url.split('/');
		  if (hparts.length > 3) {
		    hparts.pop(); // strip trailing thingie, either scriptname or blank 
		  }

		  if (lparts[0] === '') { // like "/here/dude.png"
		    base_url = hparts[0] + '//' + hparts[2];
		    hparts = base_url.split('/'); // re-split host parts from scheme and domain only
		    delete lparts[0];
		  }

		  for(i = 0; i < lparts.length; i++) {
		    if (lparts[i] === '..') {
		      // remove the previous dir level, if exists
		      if (typeof lparts[i - 1] !== 'undefined') {
		        delete lparts[i - 1];
		      } else if (hparts.length > 3) { // at least leave scheme and domain
		        hparts.pop(); // strip one dir off the host for each /../
		      }
		      delete lparts[i];
		    }
		    if(lparts[i] === '.') {
		      delete lparts[i];
		    }
		  }

		  // remove deleted
		  var newlinkparts = [];
		  for (i = 0; i < lparts.length; i++) {
		    if (typeof lparts[i] !== 'undefined') {
		      newlinkparts[newlinkparts.length] = lparts[i];
		    }
		  }

		  return hparts.join('/') + '/' + newlinkparts.join('/');

		},
		
		stringToXML: function (string) {
			var doc;
			try {
				if (window.ActiveXObject) {
					doc = new ActiveXObject('Microsoft.XMLDOM');
					doc.async = 'false';
					doc.loadXML(string);
				}
				else {
					var parser = new DOMParser();
					doc = parser.parseFromString(string, 'text/xml');
				}
			}
			catch(e) {
				//debug statement removed
			}
			return doc;
		},
		
		/*
		 * This function powers the functions WDN.get and WDN.post and provides cross browser
		 * support for XHRs and cross-domain requests.
		 * 
		 * @param url A string containing the URL to be requested
		 * @param data A string or object containing data/parameters to go along with the request
		 * @param callback A function to be called when the request has been completed
		 * @param [opt] type  The expected data type of the response
		 * @param method The method to perform the request with. Supported are GET and POST
		 */
		
		request: function (url, data, callback, type, method) {
			//debug statement removed
			var $ = WDN.jQuery;
			// set the method if none/an invalid one was given
			if (!method || !/^(get|post)$/i.test(method)) {
				var method = "get";
				//debug statement removed
			}
			// normalize the method name
			method = method.toLowerCase();
			// first, try using jQuery.get or jQuery.post
			try {
				//debug statement removed
				$[method](url,data,callback,type);
				// Opera fails silently, so force it to throw an error and revert to the proxy
				// TODO: this should probably only be done if making a cross domain request.
				if (window.opera && Object.toString(window.opera.version).indexOf("[native code]") > 0) {
					//debug statement removed
					throw ("Opera");
				}
				//debug statement removed
			} catch (e) {
				//debug statement removed
				
				// the jQuery method failed, likely because of the same origin policy
				
				// if data is an object, convert it to a key=value string
				if (data && $.isPlainObject(data)) {
					//debug statement removed
					var params = '';
					for (var key in data) {
					    params = params+'&'+key+'='+data[key];
					}
				}
				
				// if using get, append the data as a querystring to the url
				if (params && method == "get") {
					//debug statement removed
					if (!/\?/.test(url)) {
						url += "?";
					}
					url += params.substr(1, params.length);
					params = null;
				}
				
				// Try CORS, or use the proxy
				// reference here, it's strongly frowned upon and not really necessary
				if (window.XDomainRequest && method != "post") {
					//debug statement removed
					var xdr = new XDomainRequest();
					xdr.open(method, url);
					xdr.onload = function () {
						//debug statement removed
						var responseText = this.responseText, dataType = (type || "").toLowerCase();
						// if we are expecting and XML object and get a string, convert it
						if (typeof responseText == "string" && dataType == "xml") {
							//debug statement removed
							responseText = WDN.stringToXML(responseText);
						}
						callback(responseText, "success", this);
					};
					xdr.send(params);
				} else {
					try {
						//debug statement removed
						var mycallback = function() {
							var textstatus = 'error';
							var data = 'error';
							if ((this.readyState == 4) && (this.status == '200')) {
								textstatus = 'success';
								data = this.responseText;
							}
							callback(data, textstatus, this);
						};
						var request = new WDN.proxy_xmlhttp();
						request.open(method.toUpperCase(), url, true);
						if (method == "post") {
							request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
						}
						request.onreadystatechange = mycallback;
						request.send(params);
					} catch(f) {
						//debug statement removed
						//debug statement removed
					}
				}
			}
			
		},
		
		get: function (url, data, callback, type) {
			WDN.request(url, data, callback, type, "GET");
		},
		
		post: function (url, data, callback, type) {
			WDN.request(url, data, callback, type, "POST");
		}
	};
}();

WDN.jQuery = jQuery.noConflict(true);WDN.loadedJS["/wdn/templates_3.0/scripts/jquery.js"]=1;WDN.template_path = "/";
WDN.loadedJS["/wdn/templates_3.0/scripts/wdn.js"]=1;
// XMLHTTP JS class is is developed by Alex Serebryakov (#0.9.1)
// For more information, consult www.ajaxextended.com

// What's new in 0.9.1:
// - fixed the _createQuery function (used to force multipart requests)
// - fixed the getResponseHeader function (incorrect search)
// - fixed the _parseXML function (bug in the ActiveX parsing section)
// - fixed the _destroyScripts function (DOM errors reported)

WDN.proxy_xmlhttp = function() {

  // The following two options are configurable
  // you don't need to change the rest. Plug & play!
  var _maximumRequestLength = 1500;
  var _apiURL = 'http://ucommxsrv1.unl.edu/xmlhttp/';

  this.status = null;
  this.statusText = null;
  this.responseText = null;
  this.responseXML = null;
  this.synchronous = false;
  this.readyState = 0;
  
  this.onreadystatechange =  function() { };
  this.onerror = function() { };
  this.onload = function() { };
  
  this.abort = function() {
    _stop = true;
    _destroyScripts();
  };
  
  this.getAllResponseHeaders = function() {
    // Returns all response headers as a string
    var result = '';
    for (var property in _responseHeaders) {
      result += property + ': ' + _responseHeaders[property] + '\r\n';
    }
    return result;
  };
  
  this.getResponseHeader = function(name) {
    // Returns a response header value
    // Note, that the search is case-insensitive
    for(var property in _responseHeaders) {
      if(property.toLowerCase() == name.toLowerCase()) {
        return _responseHeaders[property];
      }
    }
    return null;
  };
  
  this.overrideMimeType = function(type) {
    _overrideMime = type;
  };
  
  this.open = function(method, url, sync, userName, password) {
    // Setting the internal values
    if (!_checkParameters(method, url)) {
        return;
    }
    _method = (method) ? method : '';
    _url = (url) ? url : '';
    _userName = (userName) ? userName : '';
    _password = (password) ? password : '';
    _setReadyState(1);
  };
  
  this.openRequest = function(method, url, sync, userName, password) {
    // This method is inserted for compatibility purposes only
    return this.open(method, url, sync, userName, password);
  };
  
  this.send = function(data) {
    if (_stop) {
        return;
    }
    var src = _createQuery(data);
    _createScript(src);
//    _setReadyState(2);
  };
  
  this.setRequestHeader = function(name, value) {
    // Set the request header. If the defined header
    // already exists (search is case-insensitive), rewrite it
    if (_stop) {
        return;
    }
    for(var property in _requestHeaders) {
      if(property.toLowerCase() == name.toLowerCase()) {
        _requestHeaders[property] = value; return;
      }
    }
    _requestHeaders[name] = value;
  };
  
  var _method = '';
  var _url = '';
  var _userName = '';
  var _password = '';
  var _requestHeaders = {
    "HTTP-Referer": escape(document.location),
    "Content-Type": "application/x-www-form-urlencoded"
  };
  var _responseHeaders = { };
  var _overrideMime = "";
  var self = this;
  var _id = '';
  var _scripts = [];
  var _stop = false;
  
  var _throwError = function(description) {
    // Stop script execution and run
    // the user-defined error handler
    self.onerror(description);
    self.abort();
    return false;
  };
  
  var _createQuery = function(data) {
    if(!data) {
      data = '';
    }
    var headers = '';
    for (var property in _requestHeaders) {
      headers += property + '=' + _requestHeaders[property] + '&';
    }
    var originalsrc = _method +
    '$' + _id + 
    '$' + _userName +
    '$' + _password + 
    '$' + headers + 
    '$' + _escape(data) +
    '$' + _url;
    var src = originalsrc;
    var max =  _maximumRequestLength, request = [];
    var total = Math.floor(src.length / max), current = 0;
    while(src.length > 0) {
      var query = _apiURL + '?' + 'multipart' + '$' + _id + '$' + current++ + '$' + total + '$' + src.substr(0, max);
      request.push(query);
      src = src.substr(max);
    }
    if(request.length == 1) {
      src = _apiURL + '?' + originalsrc;
    } else {
      src = request;
    }
    return src;
  };
  
  var _checkParameters = function(method, url) {
    // Check the method value (GET, POST, HEAD)
    // and the prefix of the url (http://)
    if(!method) {
      return _throwError('Please, specify the query method (GET, POST or HEAD)');
    }
    if(!url) {
      return _throwError('Please, specify the URL');
    }
    if(method.toLowerCase() != 'get' &&
      method.toLowerCase() != 'post' &&
      method.toLowerCase() != 'head') {
      return _throwError('Please, specify either a GET, POST or a HEAD method');
    }
    if(url.toLowerCase().substr(0,7) != 'http://') {
      return _throwError('Only HTTP protocol is supported (http://)');
    }
    return true;
  };

  var _createScript = function(src) {
    if ('object' == typeof src) {
      for(var i = 0; i < src.length; i++) {
        _createScript(src[i]);
      }
      return true;
    }
    // Create the SCRIPT tag
    var script = document.createElement('script');
    script.src = src;
    script.type = 'text/javascript';
    if (navigator.userAgent.indexOf('Safari')){
      script.charset = 'utf-8'; // Safari bug
    }
    script = document.getElementsByTagName('head')[0].appendChild(script);
    _scripts.push(script);
    return script;
  };
  
  var _escape = function(string) {
    // Native escape() function doesn't quote the plus sign +
    string = escape(string);
    string = string.replace('+', '%2B');
    return string;
  };
  
  var _destroyScripts = function() {
    // Removes the SCRIPT nodes used by the class
    for(var i = 0; i < _scripts.length; i++) {
      if(_scripts[i].parentNode) {
        _scripts[i].parentNode.removeChild(_scripts[i]);
      }
    }
  };
  
  var _registerCallback = function() {
    // Register a callback variable (in global scope)
    // that points to current instance of the class
    _id = 'v' + Math.random().toString().substr(2);
    window[_id] = self;
  };
  
  var _setReadyState = function(number) {
    // Set the ready state property of the class
    self.readyState = number;
    self.onreadystatechange();
    if(number == 4) {
      self.onload();
    }
  };
    
  var _parseXML = function() {
      var type = self.getResponseHeader('Content-type') + _overrideMime;
      if(!(type.indexOf('html') > -1 || type.indexOf('xml') > -1)) {
        return;
      }
      var xml;
      if(document.implementation &&
        document.implementation.createDocument &&
        navigator.userAgent.indexOf('Opera') == -1) {
        var parser = new DOMParser();
        xml = parser.parseFromString(self.responseText, "text/xml");
        self.responseXML = xml;
      } else if (window.ActiveXObject) {
        xml = new ActiveXObject('MSXML2.DOMDocument.3.0');
        if (xml.loadXML(self.responseText)) {
          self.responseXML = xml;
        }
      } else {
        xml = document.body.appendChild(document.createElement('div'));
        xml.style.display = 'none';
        xml.innerHTML = self.responseText;
        _cleanWhitespace(xml, true);
        self.responseXML = xml.childNodes[0];
        document.body.removeChild(xml);
     }
  };
  
  var _cleanWhitespace = function(element, deep) {
    var i = element.childNodes.length;
    if(i === 0) {
      return;
    }
    do {
      var node = element.childNodes[--i];
      if (node.nodeType == 3 && !_cleanEmptySymbols(node.nodeValue)) {
        element.removeChild(node);
      }
      if (node.nodeType == 1 && deep) {
        _cleanWhitespace(node, true);
      }
    } while(i > 0);
  };

  var _cleanEmptySymbols = function(string) {
    string = string.replace('\r', '');
    string = string.replace('\n', '');
    string = string.replace(' ', '');
  	return (string.length === 0) ? false : true; 
  };
 
  this._parse = function(object) {
    // Parse the received data and set all
    // the appropriate properties of the class
    if(_stop) {
      return true;
    }
    if(object.multipart) {
      return true;
    }
    if(!object.success) {
      return _throwError(object.description);
    }
    _responseHeaders = object.responseHeaders;
    this.status = object.status;
    this.statusText = object.statusText;
    this.responseText = object.responseText;
    _parseXML();
    _destroyScripts();
    _setReadyState(4);
    return true;
  };
    
   _registerCallback();

};

WDN.loadedJS["/wdn/templates_3.0/scripts/xmlhttp.js"]=1;
WDN.navigation = (function() {
    var expandedHeight = 0;
    var ul_h, lockHover = false;
    return {

        preferredState : 0,

        currentState : -1,

        /**
         * URL determined to be this site's homepage
         */
        siteHomepage : false,

        /**
         * DOM element for the "HOME" LI
         */
        homepageLI : false,

        /**
         * Stores an expand/collapse timeout.
         */
        timeout : false,

        /**
         * The delay before expand occurs
         */
        expandDelay : 400,

        /**
         * The delay before collapse occurs
         */
        collapseDelay : 120,

        changeSiteNavDelay : 400,

        cssTransitionsSupport : (function() {
            q = false;
            var div = document.createElement('div');
            div.innerHTML = '<div style="-webkit-transition:color 1s linear;-ms-transition:color 1s linear;-o-transition:color 1s linear;-moz-transition:color 1s linear;"></div>';
            q = (div.firstChild.style.webkitTransition !== undefined) || (div.firstChild.style.MozTransition !== undefined) || (div.firstChild.style.OTransition !== undefined) || (div.firstChild.style.MsTransition !== undefined);
            delete div;
            return q;
        })(),

        /**
         * Initialize the navigation, and determine what the correct state
         * should be (expanded/collapsed).
         * @todo determine what it should be
         */
        initialize : function() {
            if (WDN.jQuery('body').hasClass('popup')
                || WDN.jQuery('#breadcrumbs ul li').size() == 0) {
                // This page has no navigation
                return;
            }
            
            // find the last-link in breadcrumbs
            WDN.jQuery('#breadcrumbs > ul > li:not(:first-child) > a').last().parent().addClass('last-link');
            
            if (WDN.jQuery('body').hasClass('document')) {
            	return;
            }

            //debug statement removed
            WDN.navigation.fixPresentation();

            WDN.navigation.determineSelectedBreadcrumb();
            WDN.navigation.linkSiteTitle();

            // Store the current state of the cookie
            if (WDN.getCookie('n') == 1) {
                WDN.navigation.preferredState = 1;
            }

            // add an expand toggler UI element
            var $toggler = WDN.jQuery('<div class="expand_toggle"><a href="#" title="Click to expand/collapse navigation" /></div>').prependTo('#wdn_navigation_wrapper');
            $toggler.children('a').click(function(evt) {
                if (WDN.navigation.currentState === 0) {
                    WDN.navigation.expand();
                } else {
                    WDN.navigation.collapse();
                }
                return false;
            });
            $toggler.hover(function() {
                lockHover = !lockHover;
                WDN.jQuery('#wdn_navigation_bar').mouseout();
            }, function() {
                lockHover = !lockHover;
                WDN.jQuery('#wdn_navigation_bar').mouseover();
            });

            // add the pinned state UI element
            var $pin = WDN.jQuery('<div class="pin_state"><a href="#" /></div>').appendTo('#wdn_navigation_wrapper');
            $pin.children('a').click(function(evt) {
                WDN.navigation.setPreferredState(evt);
                return false;
            });

            WDN.loadJS('wdn/templates_3.0/scripts/plugins/hoverIntent/jQuery.hoverIntent.js', function() {
                WDN.jQuery('#breadcrumbs ul li a').hoverIntent({
                    over:        WDN.navigation.switchSiteNavigation,
                    out:         function(){},
                    timeout:     WDN.navigation.changeSiteNavDelay,
                    sensitivity: 1, // Mouse must not move
                    interval:    120
                });
                WDN.navigation.initializePreferredState();
            });
        },

        /**
         * This function cleans up the navigation visual presentations
         */
        fixPresentation : function() {
            var primaries = WDN.jQuery('#navigation > ul > li');
            var primaryCount = primaries.length;
            while (primaryCount % 6 > 0) {
                WDN.jQuery('#navigation > ul').append('<li class="empty"><a /><ul><li/></ul></li>');
                primaryCount++;
            }
            primaries = WDN.jQuery('#navigation > ul > li');

            var secondaries = primaries.has('ul');
            if (secondaries.length) {
                primaries.not(':has(ul)').each(function(){
                    WDN.jQuery(this).append('<ul><li/></ul>');
                });
            }

            // fix old IE for CSS3
            var majorIEVersion = WDN.jQuery.browser.version.split(".")[0];
            if (WDN.jQuery.browser.msie && majorIEVersion < 9) {
                //debug statement removed
                var $bar_starts = WDN.jQuery('#navigation > ul > li:nth-child(6n+1)');
                $bar_starts.addClass('start');
                WDN.jQuery('#navigation > ul > li:nth-child(6n+6)').addClass('end');
                WDN.jQuery('#navigation > ul > li:nth-child(n+7)').addClass('mid-bar');
                $bar_starts.last().prevAll().addClass('top-bars');
                WDN.jQuery('#navigation > ul > li ul li:last-child').addClass('last');
            }

            var ah = [];
            var primaryLinks = WDN.jQuery('> a', primaries);
            primaryLinks.each(function(i){
                var row = Math.floor(i/6);
                var height = WDN.jQuery(this).outerHeight();
                if (!ah[row] || height > ah[row]) {
                    ah[row] = height;
                }
            });

            primaryLinks.each(function(i){
                var row = Math.floor(i/6);
                var height = WDN.jQuery(this).outerHeight();
                var pad = parseFloat(WDN.jQuery(this).css('padding-top'));
                if (height < ah[row]) {
                    var new_ah = [(ah[row] - height) / 2];
                    new_ah[1] = new_ah[0];

                    if (WDN.jQuery.browser.msie) {
                         if (majorIEVersion == 8) {
                             new_ah[0] -= 1;
                         } else if (majorIEVersion == 7 && WDN.jQuery(this).parent().hasClass('empty')) {
                             new_ah[0] -= 1;
                             new_ah[1] -= 1;
                         }
                    }
                    WDN.jQuery(this).css({
                        'padding-top' : new_ah[0] + pad + 'px',
                        'padding-bottom' : new_ah[1] + pad + 'px'
                    });
                }
            });

            ul_h = [];
            var secondaryLists = WDN.jQuery('> ul', primaries);
            secondaryLists.each(function(i){
                var row = Math.floor(i/6), height;
                if (WDN.jQuery('body').hasClass('liquid') && !(WDN.jQuery.browser.msie && majorIEVersion < 8)) {
                    height = WDN.jQuery(this).outerHeight();
                } else {
                    height = WDN.jQuery(this).height();
                }
                if (!ul_h[row] || height > ul_h[row]) {
                    ul_h[row] = height;
                }
            });
            //loop through again and apply new height
            secondaryLists.each(function(i){
                var row = Math.floor(i/6);
                WDN.jQuery(this).css({'height':ul_h[row]+'px'});
            });

            // Fix liquid box-sizing
            if (WDN.jQuery('body').hasClass('liquid') && WDN.jQuery.browser.msie && majorIEVersion < 8) {
                // Fix box-size
                var firstRun = true;
                var resizeFunc = function() {
                    var $wrapper = WDN.jQuery('#wdn_navigation_wrapper');

                    $wrapper.css('width', '');
                    $wrapper.css('padding-right', 0);
                    $wrapper.each(function() {
                        var contentWidth = WDN.jQuery(this).width();
                        var outerWidth = WDN.jQuery(this).outerWidth();
                        WDN.jQuery(this).css('width', contentWidth * 2 - outerWidth);
                    });

                };
                resizeFunc();
                WDN.jQuery(window).unbind('resize').bind('resize', resizeFunc);
            }

            //debug statement removed
        },

        transitionEnd: function() {
            WDN.navigation.setWrapperClass('expanded');
        },

        /**
         * This function should determine which breadcrumb should be selected.
         */
        determineSelectedBreadcrumb : function() {
            // First we search for a defined homepage.

            if (WDN.jQuery('link[rel=home]').length) {
                WDN.navigation.siteHomepage = WDN.toAbs(WDN.jQuery('link[rel=home]').attr('href'), window.location.toString());
                //debug statement removed
            }

            if (WDN.navigation.siteHomepage === false) {
                //debug statement removed
                if (WDN.jQuery('#breadcrumbs > ul > li').size() == 1) {
                	WDN.navigation.setHomepageLI(WDN.jQuery('#breadcrumbs > ul > li:nth-child(1)'));
                } else {
                	// Right now, stupidly select the second element.
                	WDN.navigation.setHomepageLI(WDN.jQuery('#breadcrumbs > ul > li:nth-child(2)'));
                }
            } else {
                //debug statement removed
                // Make all the hrefs absolute.
                WDN.jQuery('#breadcrumbs > ul > li > a').each(
                        function() {
                            if (this.href == WDN.navigation.siteHomepage) {
                                WDN.navigation.setHomepageLI(WDN.jQuery(this).parent());
                                return false;
                            }
                        }
                    );
                if (WDN.jQuery('#breadcrumbs > ul > li.selected').size() < 1) {
                    //debug statement removed
                    WDN.navigation.setHomepageLI(WDN.jQuery('#breadcrumbs > ul > li:last-child'));
                }
            }
        },

        setHomepageLI: function(li) {
            WDN.navigation.homepageLI = li;
            WDN.jQuery(li).addClass('selected');
            if (WDN.jQuery(li).children('a').size()) {
                // Found the homepage url in the breadcrumbs
                WDN.navigation.siteHomepage = WDN.jQuery(li).find('a').attr('href');
            } else {
                // Assume it's the current page
                WDN.navigation.siteHomepage = window.location;
                WDN.jQuery(li).wrapInner('<a href="'+WDN.navigation.siteHomepage+'"></a>');
            }
        },

        /**
         * This function will check for/add a link to the homepage in the site title.
         */

        linkSiteTitle: function() {
            // check if the link already exists
            if (WDN.jQuery("#titlegraphic h1 a").length > 0 || !WDN.navigation.siteHomepage) {
                return;
            }
            // create the link using whatever the Homepage is set to
            WDN.jQuery("#titlegraphic h1").wrapInner('<a href="' + WDN.navigation.siteHomepage +'" />');
        },

        /**
         * Expand the navigation section.
         */
        expand : function() {
            //debug statement removed
            if (WDN.navigation.currentState === 1) {
                return;
            }

            if (WDN.navigation.currentState !== -1 && WDN.navigation.preferredState != 1 && WDN.navigation.cssTransitionsSupport) {
                WDN.navigation.setWrapperClass('changing');
            } else {
                WDN.navigation.transitionEnd();
            }

            WDN.navigation.currentState = 1;
        },

        /**
         * Collapse the navigation
         */
        collapse : function(switchNav) {
            //debug statement removed
            if (WDN.navigation.currentState === 0) {
                return;
            }

            WDN.navigation.setWrapperClass('collapsed');
            WDN.navigation.currentState = 0;
            if (switchNav !== false) {
                WDN.navigation.switchSiteNavigation(WDN.jQuery(WDN.navigation.homepageLI).children('a:first-child'), false);
            }
        },

        /**
         * Set a delay for collapsing the navigation.
         */
        startCollapseDelay: function(event) {
            //debug statement removed
            clearTimeout(WDN.navigation.timeout);
            if (WDN.navigation.currentState === 0 || WDN.navigation.preferredState == 1) {
                // Already collapsed, or, prefer to stay open
                return;
            }
            WDN.navigation.timeout = setTimeout(WDN.navigation.collapse, WDN.navigation.collapseDelay);
        },

        setPreferredState : function(event) {
            //debug statement removed
            if (WDN.getCookie('n')!=1) {
                //debug statement removed

                WDN.setCookie('n',1,1209600);
                WDN.navigation.preferredState = 1;
                WDN.analytics.trackNavigationPreferredState("Open");
            } else {
                //debug statement removed
                WDN.setCookie('n',0,-100);
                WDN.navigation.preferredState = 0;
                WDN.analytics.trackNavigationPreferredState("Closed");
            }
            WDN.navigation.initializePreferredState();
        },

        /**
         * This function determines the user's preference for navigation.
         * There are two options, expanded or collapsed.
         */
        initializePreferredState : function() {
            //debug statement removed

            WDN.jQuery('#navigation').addClass('disableTransition');
            var mouseout;
            var pinUI = WDN.jQuery('#wdn_navigation_wrapper .pin_state a');

            if (WDN.navigation.preferredState == 1) {
                mouseout = WDN.jQuery.noop;
                pinUI.attr('title', 'Click to un-pin');
                WDN.navigation.expand();
            } else {
                mouseout = function() {
                    if (!lockHover) {
                        WDN.navigation.startCollapseDelay();
                    }
                };
                pinUI.attr('title', 'Click to pin open');
                WDN.navigation.collapse(false);
            }

            WDN.navigation.applyStateFixes();

            if (WDN.navigation.cssTransitionsSupport) {
                WDN.jQuery('#navigation').bind(
                    'webkitTransitionEnd transitionend oTransitionEnd msTransitionEnd',
                    function(event) {
                        if (WDN.navigation.currentState == 1) {
                            WDN.navigation.transitionEnd();
                        }
                    }
                );
            }

            WDN.jQuery('#wdn_navigation_bar').hoverIntent({
                over:        function() {
                    if (!lockHover) {
                        WDN.navigation.expand();
                    }
                },
                out:         mouseout,
                timeout:     WDN.navigation.expandDelay,
                sensitivity: 1, // Mouse must not move
                interval:    120
            });

            WDN.jQuery('#navigation').removeClass('disableTransition');
        },

        applyStateFixes : function() {
            WDN.jQuery('#wdn_content_wrapper').css('margin-top', '');

            if (WDN.navigation.preferredState == 1) {
                WDN.navigation.setWrapperPState('pinned');
            } else {
                WDN.navigation.setWrapperPState('unpinned');
                var nav_height = WDN.jQuery('#wdn_navigation_wrapper').height();
                if (nav_height > 41) {
                    WDN.jQuery('#wdn_content_wrapper').css('margin-top', nav_height);
                }
            }
        },

        switchSiteNavigation : function(event, expand) {
            //debug statement removed
            if (expand === undefined) {
                expand = true;
            }
            var breadcrumb = (event.target) ? event.target : event;
            if (WDN.jQuery(breadcrumb).parent().hasClass('selected')) {
                //debug statement removed
                return true;
            }

            var height = WDN.jQuery('#navigation > ul').height() || 50;
            var oldSelected = WDN.jQuery('#breadcrumbs > ul > li.selected:first');

            if (!WDN.jQuery('div.storednav', oldSelected).length && WDN.jQuery('#navigation > ul').length) {
                //debug statement removed
                // Store the current navigation
                WDN.navigation.storeNav(oldSelected, WDN.jQuery('#navigation > ul'));
            } else {
                WDN.jQuery('#navigation > ul').remove();
            }

            // Set the hovered breadcrumb link to selected
            oldSelected.removeClass('selected');
            WDN.jQuery(breadcrumb).parent().addClass('selected');
            // Check for stored navigation
            if (WDN.jQuery(breadcrumb).siblings('div.storednav').length) {
                //debug statement removed
                // We've already grabbed the nav for this link
                WDN.navigation.setNavigationContents(WDN.jQuery(breadcrumb).siblings('div.storednav').children().clone(), expand);
                return true;
            }

            WDN.jQuery('#navloading').remove();
            WDN.jQuery('#navigation').append('<div id="navloading" style="height:'+height+'px;"></div>');

            var nav_sniffer = 'http://www1.unl.edu/wdn/templates_3.0/scripts/navigationSniffer.php?u=';
            nav_sniffer = nav_sniffer+escape(WDN.toAbs(breadcrumb.href, window.location));
            //debug statement removed
            WDN.get(nav_sniffer, '', function(data, textStatus) {
                try {
                    if (textStatus == 'success') {
                        var breadcrumbParent = WDN.jQuery(breadcrumb).parent();
                        WDN.navigation.storeNav(breadcrumbParent, data);
                        if (breadcrumbParent.hasClass('selected')) {
                            WDN.navigation.setNavigationContents(data, expand);
                        }
                    } else {
                        // Error message
                        //debug statement removed
                        //debug statement removed
                        //debug statement removed
                    }
                } catch(e) {
                    //debug statement removed
                    //debug statement removed
                }
            });
            return false;
        },

        setNavigationContents : function(contents, expand) {
            //debug statement removed
            WDN.jQuery('#navigation').addClass('disableTransition');
            WDN.jQuery('#navloading').remove();
            WDN.jQuery('#navigation').children('ul').remove()
                .end().prepend(contents);

            WDN.navigation.currentState = -1;
            WDN.navigation.setWrapperClass('expanded');
            WDN.navigation.fixPresentation();
            WDN.navigation.collapse(false);
            WDN.navigation.applyStateFixes();

            WDN.jQuery('#navigation').removeClass('disableTransition');

            if (expand) {
                WDN.navigation.expand();
            }
        },

        setWrapperClass : function(css_class) {
            var $wrapper = WDN.jQuery('#wdn_wrapper');
            $wrapper.removeClass('nav_changing');

            if (css_class=='collapsed') {
                $wrapper.removeClass('nav_expanded nav_changing').addClass('nav_'+css_class);
                return;
            }

            $wrapper.removeClass('nav_collapsed').addClass('nav_'+css_class);
        },

        setWrapperPState : function(css_class) {
            WDN.jQuery('#wdn_wrapper').removeClass('nav_changing nav_unpinned nav_pinned').addClass('nav_' + css_class);
        },

        storeNav : function(li, data) {
            var storednavDiv = WDN.jQuery(li).children('div.storednav');
            if (storednavDiv.length) {
                storednavDiv.empty();
            } else {
                storednavDiv = WDN.jQuery('<div class="storednav"/>');
                WDN.jQuery(li).append(storednavDiv);
            }
            storednavDiv.append(data);
        }
    };
})();
WDN.loadedJS["/wdn/templates_3.0/scripts/navigation.js"]=1;
WDN.search = function() {
	return {
		initialize : function() {
			/**
			 * Hide the label when the user starts a search
			 */
			WDN.jQuery('#wdn_search_form fieldset input#q').focus(WDN.search.hideLabel);
			if (WDN.jQuery('#wdn_search_form fieldset input#q').val() !== "") {
				WDN.search.hideLabel();
			}
			/**
			 * Show the label if the user abandons an empty search box
			 */
			WDN.jQuery('#wdn_search_form fieldset input#q').blur(function() {
				if (WDN.jQuery('#wdn_search_form fieldset input#q').val() === "") {
					WDN.search.showLabel();
				}
			});
			
			var localSearch = WDN.search.hasLocalSearch();
			if (localSearch) {
				// Change form action to the local search
				var qParams = new Object();
				var url = new String(localSearch);
				var hashes = url.slice(url.indexOf('?') + 1).split('&');
				for (var i = 0; i < hashes.length; i++) {
					var hash = hashes[i].split('=');
					WDN.jQuery('#wdn_search_form').append('<input type="hidden" name="'+hash[0]+'" value="'+decodeURIComponent(hash[1])+'" />');
				}
				WDN.jQuery('#wdn_search_form').attr('action', localSearch);
			} else {
				WDN.jQuery('#wdn_search_form').attr('action', 'http://www1.unl.edu/search/');
				if (WDN.navigation.siteHomepage !== false && WDN.navigation.siteHomepage !== 'http://www.unl.edu/') {
					// Add local site to the search parameters
					WDN.jQuery('#wdn_search_form').append('<input type="hidden" name="u" value="'+WDN.navigation.siteHomepage+'" />');
				}
			}
		},
		hasLocalSearch : function() {
			
			if (WDN.jQuery('link[rel=search]').length
				&& WDN.jQuery('link[rel=search]').attr('type') != 'application/opensearchdescription+xml') {
				return WDN.toAbs(WDN.jQuery('link[rel=search]').attr('href'), location.protocol+'//'+location.hostname);
			}
			return false;
		},
		hideLabel : function() {
			WDN.jQuery('#wdn_search_form fieldset label').hide();
		},
		showLabel : function() {
			WDN.jQuery('#wdn_search_form fieldset label').show();
		}
	};
}();

WDN.loadedJS["/wdn/templates_3.0/scripts/search.js"]=1;
/**
 * This handles the toolbar at the top of the template page.
 * 
 * Tools that wish to be shown within the toolbar modal dialog must follow
 * this basic structure:
 * 
 *
WDN.toolbar_mytoolname = function() {
    return {
        initialize : function() {
			// This is called when the tool is initialized before it is shown
        },
        setupToolContent : function() {
        	// This is where your tool's content resides
        	return '<div class="col">mytool content</div>';
        },
        display : function() {
    		// this will be called when the tool is displayed
        }
    };
}();

 * To register a tool - you must call:
 * WDN.toolbar.registerTool('mytoolname', 'My Tool Title', width, height);
 * 
 */
WDN.toolbar = function() {
    var expandedHeight = 0;
    return {
    	tools : {},
    	
        initialize : function() {
    		WDN.jQuery('#header').append('<div class="hidden"><div id="toolbarcontent"></div></div>');
        	WDN.loadJS('wdn/templates_3.0/scripts/plugins/colorbox/jquery.colorbox.js', WDN.toolbar.toolTabsSetup);
        	if (WDN.jQuery.browser.msie) {
        		WDN.loadCSS('wdn/templates_3.0/css/header/colorbox-ie.css');
        	}
        	//a callback with the colorbox binding further below displays the tabs, this line hides them on close so they don't show with another instance of the colorbox
        	WDN.jQuery(document).bind('cbox_closed', function(){WDN.jQuery("#tooltabs").hide();});
        },
        toolTabsSetup : function() {
        	WDN.jQuery('#cboxWrapper').append('<div id="tooltabs"><ul></ul></div>');
        //	WDN.toolbar.registerTool('alert', 'Emergency', 1002, 500);
        	WDN.toolbar.registerTool('feeds', 'RSS Feeds', 1002, 500);
        	WDN.toolbar.registerTool('weather', 'Weather', 1002, 500);
        	WDN.toolbar.registerTool('events', 'Events', 1002, 550);
        	WDN.toolbar.registerTool('peoplefinder', 'Peoplefinder', 1002, 550);
        	WDN.toolbar.registerTool('webcams', 'Webcams', 1002, 400);
        //	WDN.toolbar.registerTool('tourmaps', 'Tour/Maps', 1042, 800);
        },
        setMaskHeight : function(toolName, height) {
        	if (toolName=='feeds') {
        		// this shortens the feed heights so we can get the message about feeds at the bottom
        		maskheight = (height-257)+'px';
        	} else if(toolName=='peoplefinder') {
        		// this shortens the feed heights so we can get the message about feeds at the bottom
        		maskheight = (height-172)+'px';
        	} else {
        		maskheight = (height-121)+'px';
        	}
        	WDN.jQuery('#toolbar_'+toolName+' div.toolbarMask').height(maskheight);
        	WDN.jQuery('#toolbar_'+toolName+' div.toolbarMask').css({overflow:"auto", padding:"0 3px 0 0"});
        },
        
        /**
         * Just register a tool so we know about it.
         * 
         * @param string plugin_name The JS file containing the tool.
         * @param string title       The title to display for the tool tab
         * @param int    pwidth      Width needed for the plugin
         * @param int    pheight     Height needed for the plugin
         */
        registerTool : function(plugin_name, title, pwidth, pheight) {
        	 WDN.jQuery('#tooltabs ul').append('<li class="'+plugin_name+'"><a href="#" class="'+plugin_name+'">'+title+'</a></li>');
        	 WDN.jQuery("a."+plugin_name).colorbox({width:pwidth, height:pheight, inline:true, href:"#toolbarcontent"}, function(){WDN.jQuery("#tooltabs").show();});
        	 WDN.jQuery("a."+plugin_name).click(function(){WDN.toolbar.switchToolFocus(plugin_name, pheight);});
        },
        setToolContent : function(plugin_name, content) {
        	WDN.jQuery("#toolbarcontent").append('<div id="toolbar_'+plugin_name+'" class="toolbar_plugin">'+content+'</div>');
        },
        getContent : function(type, height) {
        	WDN['toolbar_'+type].display();
        	WDN.toolbar.setMaskHeight(type, height); //Now that content is loaded, add the scroll bars
        },
        /**
         * Switches focus to a different tool.
         * 
         * @param string selected The tool to select
         */
        switchToolFocus : function(selected, height) {
        //	WDN.jQuery('#tooltabs').show();
        	WDN.jQuery('#toolbarcontent .toolbar_plugin').hide();
        	WDN.initializePlugin('toolbar_'+selected,
        			function(){
        				if (!WDN.toolbar.tools[selected]) {
	        				var content = WDN['toolbar_'+selected].setupToolContent(); 
	        				WDN.toolbar.setToolContent(selected, content);
	        				WDN.toolbar.tools[selected] = true;
        				}
		        		WDN['toolbar_'+selected].initialize();
		        		WDN.jQuery('#toolbar_'+selected).show();
		        		WDN.toolbar.getContent(selected, height);
	    			});
        	if ( WDN.jQuery("#tooltabs li").hasClass("current") ){
        		WDN.jQuery("#tooltabs li").removeClass("current");
        	}
        	WDN.jQuery('#tooltabs li.'+selected+'').addClass("current");
        },
        colorbox : function(element, options) {
        	WDN.jQuery('#tooltabs').hide();
        	WDN.jQuery(element).colorbox(options);
        }
    };
}();
WDN.loadedJS["/wdn/templates_3.0/scripts/toolbar.js"]=1;
WDN.tooltip = function($) {
	return {
		initialize : function() {
			//debug statement removed
			WDN.loadJS('wdn/templates_3.0/scripts/plugins/qtip/jquery.qtip.js', WDN.tooltip.tooltipSetup);
		},
		tooltipSetup : function() {
			WDN.loadCSS('/wdn/templates_3.0/css/header/tooltip.css');
			// Tooltips can only be used in the appropriate sections, and must have the correct class name and a title attribute
			WDN.tooltip.addTooltip($('#wdn_tool_links .tooltip[title], #maincontent .tooltip[title], #footer .tooltip[title]'));
		},
		addTooltip : function($elements) {
			$elements.each(function() {
				WDN.tooltip.addTooltip(this);
			});
		},
		addTooltip: function(el) {
			$(el).qtip({

				content: $(el).attr('title'),
				show: {
					effect: { length: 0 }
				},
				hide: {
					effect: { length: 0 }
				},
				style: {
					tip: {
						corner : 'bottomMiddle',
						size : {x : 17, y : 10}
					},
					width : {
						min : 100
					},
					'background' : 'url("/wdn/templates_3.0/css/header/images/qtip/defaultBG.png") repeat-x bottom',
					border : {
						color : '#f7e77c',
						width : 2
					},
					'color' : '#504500'
				},
				position: { 
					adjust: { 
						screen: true,
						y : -5
					},
					corner: { target: 'topMiddle', tooltip: 'bottomMiddle' }
				}
			});
			$(el).removeAttr('title');
			$(el).removeAttr('alt');
		}
	};
}(WDN.jQuery);
WDN.loadedJS["/wdn/templates_3.0/scripts/tooltip.js"]=1;
// What should be tracked in Google Analytics
// 
// 1. File downloads: .pdf, .doc., etc... put in the /downloads directory DONE
// 2. Social media share uses: track the clicks. Use event tracking DONE
// 3. External links: track links to outside the domain? put in /external directory DONE
// 4. Video usage tracking by default. Should be incorporated with the skin/video JS file
// 5. Navigation preferences. Which view is being used? Use event tracking DONE
// 6. Usage of the wdn_tools. Use event tracking DONE
// 7. Tab content. Use event tracking? Set up a way for departments to take advantage of this tracking?
// 
// WDN.analytics.callTrackEvent(category, action, optional_label, optional_value)
// WDN.analytics.callTrackPageview('/downloads/'+href);
//
// Department variable 'pageTracker' is available to use in this file.

WDN.analytics = function() { 
	return {
		thisURL : String(window.location), //the current page the user is on.
		rated : false, // whether the user has rated the current page.
		initialize : function() {
			_gaq.push(
				['wdn._setAccount', 'UA-3203435-1'],
				['wdn._setDomainName', '.unl.edu'],
				['wdn._setAllowLinker', true],
				['wdn._setAllowHash', false],
				['wdn._trackPageLoadTime']
			);
			
			WDN.loadJS('wdn/templates_3.0/scripts/idm.js', function(){
				WDN.idm.initialize(function() {
					WDN.analytics.loadGA();
				});
			});
			
			//debug statement removed
				filetypes = /\.(zip|exe|pdf|doc*|xls*|ppt*|mp3|m4v|mov|mp4)$/i; //these are the file extensions to track for downloaded content
				WDN.jQuery('#navigation a[href], #maincontent a[href]').each(function(){  
					var gahref = WDN.jQuery(this).attr('href');
					if ((gahref.match(/^https?\:/i)) && (!gahref.match(document.domain))){  //deal with the outbound links
						//WDN.jQuery(this).addClass('external'); //Implications for doing this?
						WDN.jQuery(this).click(function() {
							WDN.analytics.callTrackEvent('Outgoing Link', gahref, WDN.analytics.thisURL);
						});
					}  
					else if (gahref.match(/^mailto\:/i)){  //deal with mailto: links
						WDN.jQuery(this).click(function() {  
							var mailLink = gahref.replace(/^mailto\:/i, '');  
							WDN.analytics.callTrackEvent('Email', mailLink, WDN.analytics.thisURL);
						});  
					}  
					else if (gahref.match(filetypes)){  //deal with file downloads
						WDN.jQuery(this).click(function() { 
							var extension = (/[.]/.exec(gahref)) ? /[^.]+$/.exec(gahref) : undefined;
							WDN.analytics.callTrackEvent('File Download', gahref, WDN.analytics.thisURL); 
							WDN.analytics.callTrackPageview(gahref);
						});  
					}  
				}); 
				WDN.jQuery('ul.socialmedia a').click(function(){ 
					var socialMedia = WDN.jQuery(this).attr('id');
					WDN.analytics.callTrackEvent('Page Sharing', socialMedia, WDN.analytics.thisURL);
				});
				WDN.jQuery('#wdn_tool_links a').click(function(){ 
					var wdnToolLinks = WDN.jQuery(this).text();
					WDN.analytics.callTrackEvent('WDN Tool Links', wdnToolLinks, WDN.analytics.thisURL);
				});
				WDN.jQuery('div.rating div.star a').click(function(){ 
					if (!WDN.analytics.rated)
					{
						WDN.analytics.rated = true;
						var value = WDN.jQuery(this).text();
						WDN.analytics.callTrackEvent('Page Rating', 'Rated a '+value, WDN.analytics.thisURL, value);
					}
				});
		},
		
		loadGA : function(){
			_gaq.push(['wdn._trackPageview']);
			
			(function(){
				var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
				if (WDN.jQuery('body').hasClass('debug')) {
					ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/u/ga_debug.js';
				} else {
					ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
				}
				var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
			})();
			//WDN.analytics.setupHTML5tracking.intialize();
		},
		
		trackNavigationPreferredState : function(preferredState) {
			try {
				WDN.analytics.callTrackEvent('Navigation Preference', preferredState, WDN.analytics.thisURL);
			} catch(e){}
		},
		callTrackPageview: function(thePage){
			//debug statement removed
			if (!thePage) {
				_gaq.push(['wdn._trackPageview']);
				return;
			}
			_gaq.push(['wdn._trackPageview', thePage]); //First, track in the wdn analytics
			//debug statement removed
			try {
				if (WDN.analytics.isDefaultTrackerReady()) {
					_gaq.push(['_trackPageview', thePage]); // Second, track in local site analytics 
					//debug statement removed
				} else {
					throw "Default Tracker Account Not Set";
				}
			} catch(e) {
				//debug statement removed 
			}
		},
		callTrackEvent: function(category, action, label, value) {
			if (value === undefined) {
				value = 0;
			}
			value = Math.floor(value);
			//var wdnSuccess = wdnTracker._trackEvent(category, action, label, value);
			_gaq.push(['wdn._trackEvent', category, action, label, value]);
			try {
				if (WDN.analytics.isDefaultTrackerReady()) {
					var pageSuccess = _gaq.push(['_trackEvent', category, action, label, value]);
					//debug statement removed
				} else {
					throw "Default Tracker Account Not Set";
				}
			} catch(e) {
				//debug statement removed
			}
		},
		isDefaultTrackerReady: function() {
			if (typeof _gat != "undefined") {
				return _gat._getTrackerByName()._getAccount() != 'UA-XXXXX-X';
			}
			//assume the account is set async (we could check the _gaq queue, but that seems like overkill)
			return true;
		}/*,
		
		setupHTML5tracking: function() {
			
			return {
				intialize : function() {
					WDN.loadJS(
						'wdn/templates_3.0/scripts/plugins/modernizr/modernizr_1.5.js', 
						function(){
							WDN.analytics.setupHTML5tracking.checkCookie(mondernizrVersion);
						}
					);	
				},
				
				checkCookie : function(mdVersion){
					var userAgent = navigator.userAgent.toLowerCase();//grab the broswer User Agent
					uAgent = userAgent.replace(/;/g, ''); //strip out the ';' so as not to bork the cookie
					var __html5 = WDN.getCookie('__html5'); //Previous UNL HTML5 test
					
					if (!__html5) { //We haven't run this test before, so let's do it.
						//debug statement removed
						WDN.analytics.setupHTML5tracking.setCookie(uAgent, mdVersion);
						return;
					}
					//debug statement removed
					//debug statement removed
					//Let's check to see if either the browser or modernizr has changed since the last tracking
					if ((uAgent +'|+|'+mdVersion) != (__html5)){
						//debug statement removed
						WDN.analytics.setupHTML5tracking.setCookie(uAgent, mdVersion);
					} else { //we have a match and nothing has changed, so do nothing more.
						//debug statement removed
						return;
					}
				},
				
				setCookie : function(uAgent, mdVersion) {
					var name = '__html5';
					var value = uAgent +'|+|'+mdVersion; //combine gaVisitorID and Modernizr version
					WDN.setCookie(name, value, 31556926); //set a cookie for one year
					WDN.analytics.setupHTML5tracking.testBrowser();
				},
				
				testBrowser : function(){
					for (var prop in Modernizr) {
						if (typeof Modernizr[prop] === 'function') continue;
						if (prop == 'inputtypes' || prop == 'input') {
							for (var field in Modernizr[prop]) {
								if (Modernizr[prop][field]){
									////debug statement removed
									WDN.analytics.callTrackEvent('HTML5/CSS3 Support', prop + '-('+field+')', '');
								}
							}
						} else {
							if(Modernizr[prop]){
								////debug statement removed
								WDN.analytics.callTrackEvent('HTML5/CSS3 Support', prop, '');
							}
						}
					}
				}
			};
		}()*/
	};
}();

WDN.loadedJS["/wdn/templates_3.0/scripts/analytics.js"]=1;
/**
* hoverIntent is similar to jQuery's built-in "hover" function except that
* instead of firing the onMouseOver event immediately, hoverIntent checks
* to see if the user's mouse has slowed down (beneath the sensitivity
* threshold) before firing the onMouseOver event.
* 
* hoverIntent r5 // 2007.03.27 // jQuery 1.1.2+
* <http://cherne.net/brian/resources/jquery.hoverIntent.html>
* 
* hoverIntent is currently available for use in all personal or commercial 
* projects under both MIT and GPL licenses. This means that you can choose 
* the license that best suits your project, and use it accordingly.
* 
* // basic usage (just like .hover) receives onMouseOver and onMouseOut functions
* $("ul li").hoverIntent( showNav , hideNav );
* 
* // advanced usage receives configuration object only
* $("ul li").hoverIntent({
*	sensitivity: 7, // number = sensitivity threshold (must be 1 or higher)
*	interval: 100,   // number = milliseconds of polling interval
*	over: showNav,  // function = onMouseOver callback (required)
*	timeout: 0,   // number = milliseconds delay before onMouseOut function call
*	out: hideNav    // function = onMouseOut callback (required)
* });
* 
* @param  f  onMouseOver function || An object with configuration options
* @param  g  onMouseOut function  || Nothing (use configuration options object)
* @author    Brian Cherne <brian@cherne.net>
*/
(function($) {
	$.fn.hoverIntent = function(f,g) {
		// default configuration options
		var cfg = {
			sensitivity: 7,
			interval: 100,
			timeout: 0
		};
		// override configuration options with user supplied object
		cfg = $.extend(cfg, g ? { over: f, out: g } : f );

		// instantiate variables
		// cX, cY = current X and Y position of mouse, updated by mousemove event
		// pX, pY = previous X and Y position of mouse, set by mouseover and polling interval
		var cX, cY, pX, pY;

		// A private function for getting mouse position
		var track = function(ev) {
			cX = ev.pageX;
			cY = ev.pageY;
		};

		// A private function for comparing current and previous mouse position
		var compare = function(ev,ob) {
			ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t);
			// compare mouse positions to see if they've crossed the threshold
			if ( ( Math.abs(pX-cX) + Math.abs(pY-cY) ) < cfg.sensitivity ) {
				$(ob).unbind("mousemove",track);
				// set hoverIntent state to true (so mouseOut can be called)
				ob.hoverIntent_s = 1;
				return cfg.over.apply(ob,[ev]);
			} else {
				// set previous coordinates for next time
				pX = cX; pY = cY;
				// use self-calling timeout, guarantees intervals are spaced out properly (avoids JavaScript timer bugs)
				ob.hoverIntent_t = setTimeout( function(){compare(ev, ob);} , cfg.interval );
			}
		};

		// A private function for delaying the mouseOut function
		var delay = function(ev,ob) {
			ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t);
			ob.hoverIntent_s = 0;
			return cfg.out.apply(ob,[ev]);
		};

		// A private function for handling mouse 'hovering'
		var handleHover = function(e) {
			// next three lines copied from jQuery.hover, ignore children onMouseOver/onMouseOut
			var p = (e.type == "mouseover" ? e.fromElement : e.toElement) || e.relatedTarget;
			while ( p && p != this ) { try { p = p.parentNode; } catch(e) { p = this; } }
			if ( p == this ) { return false; }

			// copy objects to be passed into t (required for event object to be passed in IE)
			var ev = $.extend({},e);
			var ob = this;

			// cancel hoverIntent timer if it exists
			if (ob.hoverIntent_t) { ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t); }

			// else e.type == "onmouseover"
			if (e.type == "mouseover") {
				// set "previous" X and Y position based on initial entry point
				pX = ev.pageX; pY = ev.pageY;
				// update "current" X and Y position based on mousemove
				$(ob).bind("mousemove",track);
				// start polling interval (self-calling timeout) to compare mouse coordinates over time
				if (ob.hoverIntent_s != 1) { ob.hoverIntent_t = setTimeout( function(){compare(ev,ob);} , cfg.interval );}

			// else e.type == "onmouseout"
			} else {
				// unbind expensive mousemove event
				$(ob).unbind("mousemove",track);
				// if hoverIntent state is true, then call the mouseOut function after the specified delay
				if (ob.hoverIntent_s == 1) { ob.hoverIntent_t = setTimeout( function(){delay(ev,ob);} , cfg.timeout );}
			}
		};

		// bind the function to the two event listeners
		return this.mouseover(handleHover).mouseout(handleHover);
	};
})(WDN.jQuery);
WDN.loadedJS["/wdn/templates_3.0/scripts/plugins/hoverIntent/jQuery.hoverIntent.js"]=1;
/*
 * Changes made to plugin for purpose of adapting: 
 * 06/09/09
 * 1. Removed Average rating calculation, replaced with a 0 on plugin load.
 * 2. Modified post data to include callback.
 */
(function($) {
  var buildRating = function(obj) {
    var rating = averageRating(obj),
        obj    = buildInterface(obj),
        stars  = $("div.star", obj),
        cancel = $("div.cancel", obj);

        var fill = function() {
          drain();
          $("a", stars).css("width", "100%");
          stars.slice(0, stars.index(this) + 1).addClass("hover");
        },
        drain = function() {
          stars.removeClass("on").removeClass("hover");
        },
        reset = function() {
          drain();
          //stars.slice(0, rating[0]).addClass("on");
          //debug statement removed
          //if(percent = rating[1] ? rating[1] * 10 : null) {
            stars.eq(rating[0]-1).addClass("on").prevAll('.star').addClass('on');
          //}
        },
        cancelOn = function() {
          drain();
          $(this).addClass("on");
        },
        cancelOff = function() {
          reset();
          $(this).removeClass("on");
        };

    stars
      .hover(fill, reset).focus(fill).blur(reset)
      .click(function() {
        rating = [stars.index(this) + 1, 0];
        //debug statement removed
        WDN.analytics.callTrackEvent('Page Rating', 'Rated a '+rating[0], WDN.analytics.thisURL, rating[0]);
        var url = 'http://www1.unl.edu/comments/';
        WDN.post(
        		url, 
        		{ rating: rating[0] },
        		function() {
        		}
        );
        reset();
    	stars.unbind().addClass("done");
        $(this).css("cursor", "default");
        return false;
      });

    reset();
    return obj;

  };

  var buildInterface = function(form) {
    var container = $("<div><p>Please rate this page: </p></div>").attr({"title": form.title, "class": form.className});
    $.extend(container, {url: form.action});
    var optGroup  = $("option", $(form));
    var size      = optGroup.length;
    optGroup.each(function() {
      container.append($('<div class="star"><a href="#' + this.value + '" title="Give it ' + this.value + '/'+ size +'">' + this.value + '</a></div>'));
    });
    $(form).after(container).remove();
    return container;
  };

  //var averageRating = function(el) { return el.title.split(":")[1].split(".") }
  var averageRating = function(el) { return 0;};

  $.fn.rating = function() { return $($.map(this, function(i) { return buildRating(i)[0]; })); };

	if ($.browser.msie) try { document.execCommand("BackgroundImageCache", false, true);} catch(e) { }

})(WDN.jQuery);
WDN.loadedJS["/wdn/templates_3.0/scripts/plugins/rating/jquery.rating.js"]=1;
// ColorBox v1.3.14 - a full featured, light-weight, customizable lightbox based on jQuery 1.3+
// Copyright (c) 2010 Jack Moore - jack@colorpowered.com
// Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
(function ($, window) {
	
	var
	// ColorBox Default Settings.	
	// See http://colorpowered.com/colorbox for details.
	defaults = {
		transition: "elastic",
		speed: 300,
		width: false,
		initialWidth: "600",
		innerWidth: false,
		maxWidth: false,
		height: false,
		initialHeight: "450",
		innerHeight: false,
		maxHeight: false,
		scalePhotos: true,
		scrolling: true,
		inline: false,
		html: false,
		iframe: false,
		photo: false,
		href: false,
		title: false,
		rel: false,
		opacity: 0.9,
		preloading: true,
		current: "image {current} of {total}",
		previous: "previous",
		next: "next",
		close: "close",
		open: false,
		returnFocus: true,
		loop: true,
		slideshow: false,
		slideshowAuto: true,
		slideshowSpeed: 2500,
		slideshowStart: "start slideshow",
		slideshowStop: "stop slideshow",
		onOpen: false,
		onLoad: false,
		onComplete: false,
		onCleanup: false,
		onClosed: false,
		overlayClose: true,		
		escKey: true,
		arrowKey: true
	},
	
	// Abstracting the HTML and event identifiers for easy rebranding
	colorbox = 'colorbox',
	prefix = 'cbox',
	
	// Events	
	event_open = prefix + '_open',
	event_load = prefix + '_load',
	event_complete = prefix + '_complete',
	event_cleanup = prefix + '_cleanup',
	event_closed = prefix + '_closed',
	event_purge = prefix + '_purge',
	event_loaded = prefix + '_loaded',
	
	// Special Handling for IE
	isIE = $.browser.msie && !$.support.opacity, // feature detection alone gave a false positive on at least one phone browser and on some development versions of Chrome.
	isIE6 = isIE && $.browser.version < 7,
	event_ie6 = prefix + '_IE6',

	// Cached jQuery Object Variables
	$overlay,
	$box,
	$wrap,
	$content,
	$topBorder,
	$leftBorder,
	$rightBorder,
	$bottomBorder,
	$related,
	$window,
	$loaded,
	$loadingBay,
	$loadingOverlay,
	$title,
	$current,
	$slideshow,
	$next,
	$prev,
	$close,

	// Variables for cached values or use across multiple functions
	interfaceHeight,
	interfaceWidth,
	loadedHeight,
	loadedWidth,
	element,
	index,
	settings,
	open,
	active,
	closing = false,
	
	publicMethod,
	boxElement = prefix + 'Element';
	
	// ****************
	// HELPER FUNCTIONS
	// ****************

	// jQuery object generator to reduce code size
	function $div(id, css) { 
		id = id ? ' id="' + prefix + id + '"' : '';
		css = css ? ' style="' + css + '"' : '';
		return $('<div' + id + css + '/>');
	}

	// Convert % values to pixels
	function setSize(size, dimension) {
		dimension = dimension === 'x' ? $window.width() : $window.height();
		return (typeof size === 'string') ? Math.round((/%/.test(size) ? (dimension / 100) * parseInt(size, 10) : parseInt(size, 10))) : size;
	}
	
	// Checks an href to see if it is a photo.
	// There is a force photo option (photo: true) for hrefs that cannot be matched by this regex.
	function isImage(url) {
		return settings.photo || /\.(gif|png|jpg|jpeg|bmp)(?:\?([^#]*))?(?:#(\.*))?$/i.test(url);
	}
	
	// Assigns function results to their respective settings.  This allows functions to be used as values.
	function process(settings) {
		for (var i in settings) {
			if ($.isFunction(settings[i]) && i.substring(0, 2) !== 'on') { // checks to make sure the function isn't one of the callbacks, they will be handled at the appropriate time.
			    settings[i] = settings[i].call(element);
			}
		}
		settings.rel = settings.rel || element.rel || 'nofollow';
		settings.href = settings.href || $(element).attr('href');
		settings.title = settings.title || element.title;
		return settings;
	}

	function trigger(event, callback) {
		if (callback) {
			callback.call(element);
		}
		$.event.trigger(event);
	}

	// Slideshow functionality
	function slideshow() {
		var
		timeOut,
		className = prefix + "Slideshow_",
		click = "click." + prefix,
		start,
		stop,
		clear;
		
		if (settings.slideshow && $related[1]) {
			start = function () {
				$slideshow
					.text(settings.slideshowStop)
					.unbind(click)
					.bind(event_complete, function () {
						if (index < $related.length - 1 || settings.loop) {
							timeOut = setTimeout(publicMethod.next, settings.slideshowSpeed);
						}
					})
					.bind(event_load, function () {
						clearTimeout(timeOut);
					})
					.one(click + ' ' + event_cleanup, stop);
				$box.removeClass(className + "off").addClass(className + "on");
				timeOut = setTimeout(publicMethod.next, settings.slideshowSpeed);
			};
			
			stop = function () {
				clearTimeout(timeOut);
				$slideshow
					.text(settings.slideshowStart)
					.unbind([event_complete, event_load, event_cleanup, click].join(' '))
					.one(click, start);
				$box.removeClass(className + "on").addClass(className + "off");
			};
			
			if (settings.slideshowAuto) {
				start();
			} else {
				stop();
			}
		}
	}

	function launch(elem) {
		if (!closing) {
			
			element = elem;
			
			settings = process($.extend({}, $.data(element, colorbox)));
			
			$related = $(element);
			
			index = 0;
			
			if (settings.rel !== 'nofollow') {
				$related = $('.' + boxElement).filter(function () {
					var relRelated = $.data(this, colorbox).rel || this.rel;
					return (relRelated === settings.rel);
				});
				index = $related.index(element);
				
				// Check direct calls to ColorBox.
				if (index === -1) {
					$related = $related.add(element);
					index = $related.length - 1;
				}
			}
			
			if (!open) {
				open = active = true; // Prevents the page-change action from queuing up if the visitor holds down the left or right keys.
				
				$box.show();
				
				if (settings.returnFocus) {
					try {
						element.blur();
						$(element).one(event_closed, function () {
							try {
								this.focus();
							} catch (e) {
								// do nothing
							}
						});
					} catch (e) {
						// do nothing
					}
				}
				
				// +settings.opacity avoids a problem in IE when using non-zero-prefixed-string-values, like '.5'
				$overlay.css({"opacity": +settings.opacity, "cursor": settings.overlayClose ? "pointer" : "auto"}).show();
				
				// Opens inital empty ColorBox prior to content being loaded.
				settings.w = setSize(settings.initialWidth, 'x');
				settings.h = setSize(settings.initialHeight, 'y');
				publicMethod.position(0);
				
				if (isIE6) {
					$window.bind('resize.' + event_ie6 + ' scroll.' + event_ie6, function () {
						$overlay.css({width: $window.width(), height: $window.height(), top: $window.scrollTop(), left: $window.scrollLeft()});
					}).trigger('scroll.' + event_ie6);
				}
				
				trigger(event_open, settings.onOpen);
				
				$current.add($prev).add($next).add($slideshow).add($title).hide();
				
				$close.html(settings.close).show();
			}
			
			publicMethod.load(true);
		}
	}

	// ****************
	// PUBLIC FUNCTIONS
	// Usage format: $.fn.colorbox.close();
	// Usage from within an iframe: parent.$.fn.colorbox.close();
	// ****************
	
	publicMethod = $.fn[colorbox] = $[colorbox] = function (options, callback) {
		var $this = this, autoOpen;
		
		if (!$this[0] && $this.selector) { // if a selector was given and it didn't match any elements, go ahead and exit.
			return $this;
		}
		
		options = options || {};
		
		if (callback) {
			options.onComplete = callback;
		}
		
		if (!$this[0] || $this.selector === undefined) { // detects $.colorbox() and $.fn.colorbox()
			$this = $('<a/>');
			options.open = true; // assume an immediate open
		}
		
		$this.each(function () {
			$.data(this, colorbox, $.extend({}, $.data(this, colorbox) || defaults, options));
			$(this).addClass(boxElement);
		});
		
		autoOpen = options.open;
		
		if ($.isFunction(autoOpen)) {
			autoOpen = autoOpen.call($this);
		}
		
		if (autoOpen) {
			launch($this[0]);
		}
		
		return $this;
	};

	// Initialize ColorBox: store common calculations, preload the interface graphics, append the html.
	// This preps colorbox for a speedy open when clicked, and lightens the burdon on the browser by only
	// having to run once, instead of each time colorbox is opened.
	publicMethod.init = function () {
		// Create & Append jQuery Objects
		$window = $(window);
		$box = $div().attr({id: colorbox, 'class': isIE ? prefix + 'IE' : ''});
		$overlay = $div("Overlay", isIE6 ? 'position:absolute' : '').hide();
		
		$wrap = $div("Wrapper");
		$content = $div("Content").append(
			$loaded = $div("LoadedContent", 'width:0; height:0; overflow:hidden'),
			$loadingOverlay = $div("LoadingOverlay").add($div("LoadingGraphic")),
			$title = $div("Title"),
			$current = $div("Current"),
			$next = $div("Next"),
			$prev = $div("Previous"),
			$slideshow = $div("Slideshow").bind(event_open, slideshow),
			$close = $div("Close")
		);
		$wrap.append( // The 3x3 Grid that makes up ColorBox
			$div().append(
				$div("TopLeft"),
				$topBorder = $div("TopCenter"),
				$div("TopRight")
			),
			$div(false, 'clear:left').append(
				$leftBorder = $div("MiddleLeft"),
				$content,
				$rightBorder = $div("MiddleRight")
			),
			$div(false, 'clear:left').append(
				$div("BottomLeft"),
				$bottomBorder = $div("BottomCenter"),
				$div("BottomRight")
			)
		).children().children().css({'float': 'left'});
		
		$loadingBay = $div(false, 'position:absolute; width:9999px; visibility:hidden; display:none');
		
		$('body').prepend($overlay, $box.append($wrap, $loadingBay));
		
		$content.children()
		.hover(function () {
			$(this).addClass('hover');
		}, function () {
			$(this).removeClass('hover');
		}).addClass('hover');
		
		// Cache values needed for size calculations
		interfaceHeight = $topBorder.height() + $bottomBorder.height() + $content.outerHeight(true) - $content.height();//Subtraction needed for IE6
		interfaceWidth = $leftBorder.width() + $rightBorder.width() + $content.outerWidth(true) - $content.width();
		loadedHeight = $loaded.outerHeight(true);
		loadedWidth = $loaded.outerWidth(true);
		
		// Setting padding to remove the need to do size conversions during the animation step.
		$box.css({"padding-bottom": interfaceHeight, "padding-right": interfaceWidth}).hide();
		
		// Setup button events.
		$next.click(publicMethod.next);
		$prev.click(publicMethod.prev);
		$close.click(publicMethod.close);
		
		// Adding the 'hover' class allowed the browser to load the hover-state
		// background graphics.  The class can now can be removed.
		$content.children().removeClass('hover');
		
		$('.' + boxElement).live('click', function (e) {
			// checks to see if it was a non-left mouse-click and for clicks modified with ctrl, shift, or alt.
			if (!((e.button !== 0 && typeof e.button !== 'undefined') || e.ctrlKey || e.shiftKey || e.altKey)) {
				e.preventDefault();
				launch(this);
			}
		});
		
		$overlay.click(function () {
			if (settings.overlayClose) {
				publicMethod.close();
			}
		});
		
		// Set Navigation Key Bindings
		$(document).bind("keydown", function (e) {
			if (open && settings.escKey && e.keyCode === 27) {
				e.preventDefault();
				publicMethod.close();
			}
			if (open && settings.arrowKey && !active && $related[1]) {
				if (e.keyCode === 37 && (index || settings.loop)) {
					e.preventDefault();
					$prev.click();
				} else if (e.keyCode === 39 && (index < $related.length - 1 || settings.loop)) {
					e.preventDefault();
					$next.click();
				}
			}
		});
	};
	
	publicMethod.remove = function () {
		$box.add($overlay).remove();
		$('.' + boxElement).die('click').removeData(colorbox).removeClass(boxElement);
	};

	publicMethod.position = function (speed, loadedCallback) {
		var
		animate_speed,
		// keeps the top and left positions within the browser's viewport.
		posTop = Math.max(document.documentElement.clientHeight - settings.h - loadedHeight - interfaceHeight, 0) / 2 + $window.scrollTop(),
		posLeft = Math.max($window.width() - settings.w - loadedWidth - interfaceWidth, 0) / 2 + $window.scrollLeft();
		
		// setting the speed to 0 to reduce the delay between same-sized content.
		animate_speed = ($box.width() === settings.w + loadedWidth && $box.height() === settings.h + loadedHeight) ? 0 : speed;
		
		// this gives the wrapper plenty of breathing room so it's floated contents can move around smoothly,
		// but it has to be shrank down around the size of div#colorbox when it's done.  If not,
		// it can invoke an obscure IE bug when using iframes.
		$wrap[0].style.width = $wrap[0].style.height = "9999px";
		
		function modalDimensions(that) {
			// loading overlay height has to be explicitly set for IE6.
			$topBorder[0].style.width = $bottomBorder[0].style.width = $content[0].style.width = that.style.width;
			$loadingOverlay[0].style.height = $loadingOverlay[1].style.height = $content[0].style.height = $leftBorder[0].style.height = $rightBorder[0].style.height = that.style.height;
		}
		
		$box.dequeue().animate({width: settings.w + loadedWidth, height: settings.h + loadedHeight, top: posTop, left: posLeft}, {
			duration: animate_speed,
			complete: function () {
				modalDimensions(this);
				
				active = false;
				
				// shrink the wrapper down to exactly the size of colorbox to avoid a bug in IE's iframe implementation.
				$wrap[0].style.width = (settings.w + loadedWidth + interfaceWidth) + "px";
				$wrap[0].style.height = (settings.h + loadedHeight + interfaceHeight) + "px";
				
				if (loadedCallback) {
					loadedCallback();
				}
			},
			step: function () {
				modalDimensions(this);
			}
		});
	};

	publicMethod.resize = function (options) {
		if (open) {
			options = options || {};
			
			if (options.width) {
				settings.w = setSize(options.width, 'x') - loadedWidth - interfaceWidth;
			}
			if (options.innerWidth) {
				settings.w = setSize(options.innerWidth, 'x');
			}
			$loaded.css({width: settings.w});
			
			if (options.height) {
				settings.h = setSize(options.height, 'y') - loadedHeight - interfaceHeight;
			}
			if (options.innerHeight) {
				settings.h = setSize(options.innerHeight, 'y');
			}
			if (!options.innerHeight && !options.height) {				
				var $child = $loaded.wrapInner("<div style='overflow:auto'></div>").children(); // temporary wrapper to get an accurate estimate of just how high the total content should be.
				settings.h = $child.height();
				$child.replaceWith($child.children()); // ditch the temporary wrapper div used in height calculation
			}
			$loaded.css({height: settings.h});
			
			publicMethod.position(settings.transition === "none" ? 0 : settings.speed);
		}
	};

	publicMethod.prep = function (object) {
		if (!open) {
			return;
		}
		
		var photo,
		speed = settings.transition === "none" ? 0 : settings.speed;
		
		$window.unbind('resize.' + prefix);
		$loaded.remove();
		$loaded = $div('LoadedContent').html(object);
		
		function getWidth() {
			settings.w = settings.w || $loaded.width();
			settings.w = settings.mw && settings.mw < settings.w ? settings.mw : settings.w;
			return settings.w;
		}
		function getHeight() {
			settings.h = settings.h || $loaded.height();
			settings.h = settings.mh && settings.mh < settings.h ? settings.mh : settings.h;
			return settings.h;
		}
		
		$loaded.hide()
		.appendTo($loadingBay.show())// content has to be appended to the DOM for accurate size calculations.
		.css({width: getWidth(), overflow: settings.scrolling ? 'auto' : 'hidden'})
		.css({height: getHeight()})// sets the height independently from the width in case the new width influences the value of height.
		.prependTo($content);
		
		$loadingBay.hide();
		
		// floating the IMG removes the bottom line-height and fixed a problem where IE miscalculates the width of the parent element as 100% of the document width.
		$('#' + prefix + 'Photo').css({cssFloat: 'none', marginLeft: 'auto', marginRight: 'auto'});
		
		// Hides SELECT elements in IE6 because they would otherwise sit on top of the overlay.
		if (isIE6) {
			$('select').not($box.find('select')).filter(function () {
				return this.style.visibility !== 'hidden';
			}).css({'visibility': 'hidden'}).one(event_cleanup, function () {
				this.style.visibility = 'inherit';
			});
		}
				
		function setPosition(s) {
			var prev, prevSrc, next, nextSrc, total = $related.length, loop = settings.loop;
			publicMethod.position(s, function () {
				function defilter() {
					if (isIE) {
						//IE adds a filter when ColorBox fades in and out that can cause problems if the loaded content contains transparent pngs.
						$box[0].style.filter = false;
					}
				}
				
				if (!open) {
					return;
				}
				
				if (isIE) {
					//This fadeIn helps the bicubic resampling to kick-in.
					if (photo) {
						$loaded.fadeIn(100);
					}
				}
				
				$loaded.show();
				
				trigger(event_loaded);
				
				$title.show().html(settings.title);
				
				if (total > 1) { // handle grouping
					if (typeof settings.current === "string") {
						$current.html(settings.current.replace(/\{current\}/, index + 1).replace(/\{total\}/, total)).show();
					}
					
					$next[(loop || index < total - 1) ? "show" : "hide"]().html(settings.next);
					$prev[(loop || index) ? "show" : "hide"]().html(settings.previous);
					
					prev = index ? $related[index - 1] : $related[total - 1];
					next = index < total - 1 ? $related[index + 1] : $related[0];
					
					if (settings.slideshow) {
						$slideshow.show();
					}
					
					// Preloads images within a rel group
					if (settings.preloading) {
						nextSrc = $.data(next, colorbox).href || next.href;
						prevSrc = $.data(prev, colorbox).href || prev.href;
						
						nextSrc = $.isFunction(nextSrc) ? nextSrc.call(next) : nextSrc;
						prevSrc = $.isFunction(prevSrc) ? prevSrc.call(prev) : prevSrc;
						
						if (isImage(nextSrc)) {
							$('<img/>')[0].src = nextSrc;
						}
						
						if (isImage(prevSrc)) {
							$('<img/>')[0].src = prevSrc;
						}
					}
				}
				
				$loadingOverlay.hide();
				
				if (settings.transition === 'fade') {
					$box.fadeTo(speed, 1, function () {
						defilter();
					});
				} else {
					defilter();
				}
				
				$window.bind('resize.' + prefix, function () {
					publicMethod.position(0);
				});
				
				trigger(event_complete, settings.onComplete);
			});
		}
		
		if (settings.transition === 'fade') {
			$box.fadeTo(speed, 0, function () {
				setPosition(0);
			});
		} else {
			setPosition(speed);
		}
	};

	publicMethod.load = function (launched) {
		var href, img, setResize, prep = publicMethod.prep;
		
		active = true;
		element = $related[index];
		
		if (!launched) {
			settings = process($.extend({}, $.data(element, colorbox)));
		}
		
		trigger(event_purge);
		
		trigger(event_load, settings.onLoad);
		
		settings.h = settings.height ?
				setSize(settings.height, 'y') - loadedHeight - interfaceHeight :
				settings.innerHeight && setSize(settings.innerHeight, 'y');
		
		settings.w = settings.width ?
				setSize(settings.width, 'x') - loadedWidth - interfaceWidth :
				settings.innerWidth && setSize(settings.innerWidth, 'x');
		
		// Sets the minimum dimensions for use in image scaling
		settings.mw = settings.w;
		settings.mh = settings.h;
		
		// Re-evaluate the minimum width and height based on maxWidth and maxHeight values.
		// If the width or height exceed the maxWidth or maxHeight, use the maximum values instead.
		if (settings.maxWidth) {
			settings.mw = setSize(settings.maxWidth, 'x') - loadedWidth - interfaceWidth;
			settings.mw = settings.w && settings.w < settings.mw ? settings.w : settings.mw;
		}
		if (settings.maxHeight) {
			settings.mh = setSize(settings.maxHeight, 'y') - loadedHeight - interfaceHeight;
			settings.mh = settings.h && settings.h < settings.mh ? settings.h : settings.mh;
		}
		
		href = settings.href;
		
		$loadingOverlay.show();

		if (settings.inline) {
			// Inserts an empty placeholder where inline content is being pulled from.
			// An event is bound to put inline content back when ColorBox closes or loads new content.
			$div().hide().insertBefore($(href)[0]).one(event_purge, function () {
				$(this).replaceWith($loaded.children());
			});
			prep($(href));
		} else if (settings.iframe) {
			// IFrame element won't be added to the DOM until it is ready to be displayed,
			// to avoid problems with DOM-ready JS that might be trying to run in that iframe.
			$box.one(event_loaded, function () {
				var $iframe = $("<iframe name='" + new Date().getTime() + "' frameborder=0" + (settings.scrolling ? "" : " scrolling='no'") + (isIE ? " allowtransparency='true'" : '') + " style='width:100%; height:100%; border:0; display:block;'/>");
				$iframe[0].src = settings.href;
				$iframe.appendTo($loaded).one(event_purge, function () {
					$iframe[0].src = '//about:blank';
				});
			});
			
			prep(" ");
		} else if (settings.html) {
			prep(settings.html);
		} else if (isImage(href)) {
			img = new Image();
			img.onload = function () {
				var percent;
				img.onload = null;
				img.id = prefix + 'Photo';
				$(img).css({border: 'none', display: 'block', cssFloat: 'left'});
				if (settings.scalePhotos) {
					setResize = function () {
						img.height -= img.height * percent;
						img.width -= img.width * percent;	
					};
					if (settings.mw && img.width > settings.mw) {
						percent = (img.width - settings.mw) / img.width;
						setResize();
					}
					if (settings.mh && img.height > settings.mh) {
						percent = (img.height - settings.mh) / img.height;
						setResize();
					}
				}
				
				if (settings.h) {
					img.style.marginTop = Math.max(settings.h - img.height, 0) / 2 + 'px';
				}
				
				if ($related[1] && (index < $related.length - 1 || settings.loop)) {
					$(img).css({cursor: 'pointer'}).click(publicMethod.next);
				}
				
				if (isIE) {
					img.style.msInterpolationMode = 'bicubic';
				}
				
				setTimeout(function () { // Chrome will sometimes report a 0 by 0 size if there isn't pause in execution
					prep(img);
				}, 1);
			};
			
			setTimeout(function () { // Opera 10.6+ will sometimes load the src before the onload function is set
				img.src = href;
			}, 1);	
		} else if (href) {
			$loadingBay.load(href, function (data, status, xhr) {
				prep(status === 'error' ? 'Request unsuccessful: ' + xhr.statusText : $(this).children());
			});
		}
	};

	// Navigates to the next page/image in a set.
	publicMethod.next = function () {
		if (!active) {
			index = index < $related.length - 1 ? index + 1 : 0;
			publicMethod.load();
		}
	};
	
	publicMethod.prev = function () {
		if (!active) {
			index = index ? index - 1 : $related.length - 1;
			publicMethod.load();
		}
	};

	// Note: to use this within an iframe use the following format: parent.$.fn.colorbox.close();
	publicMethod.close = function () {
		if (open && !closing) {
			closing = true;
			
			open = false;
			
			trigger(event_cleanup, settings.onCleanup);
			
			$window.unbind('.' + prefix + ' .' + event_ie6);
			
			$overlay.fadeTo('fast', 0);
			
			$box.stop().fadeTo('fast', 0, function () {
				
				trigger(event_purge);
				
				$loaded.remove();
				
				$box.add($overlay).css({'opacity': 1, cursor: 'auto'}).hide();
				
				setTimeout(function () {
					closing = false;
					trigger(event_closed, settings.onClosed);
				}, 1);
			});
		}
	};

	// A method for fetching the current element ColorBox is referencing.
	// returns a jQuery object.
	publicMethod.element = function () {
		return $(element);
	};

	publicMethod.settings = defaults;

	// Initializes ColorBox when the DOM has loaded
	$(publicMethod.init);

}(WDN.jQuery, this));
WDN.loadedJS["/wdn/templates_3.0/scripts/plugins/colorbox/jquery.colorbox.js"]=1;
/*!
* jquery.qtip. The jQuery tooltip plugin
*
* Copyright (c) 2009 Craig Thompson
* http://craigsworks.com
*
* Licensed under MIT
* http://www.opensource.org/licenses/mit-license.php
*
* Launch  : February 2009
* Version : 1.0.0-rc3
* Released: Tuesday 12th May, 2009 - 00:00
* Debug: jquery.qtip.debug.js
*/

"use strict"; // Enable ECMAScript "strict" operation for this function. See more: http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/
/*jslint browser: true, onevar: true, undef: true, nomen: true, eqeqeq: true, bitwise: true, regexp: true, strict: true, newcap: true, immed: true */

/*global window: false, jQuery: false */

(function ($) {
	// Assign cache and event initialisation on document load
	$(document).ready(function () {
		// Adjust positions of the tooltips on window resize or scroll if enabled
		var i;
		$(window).bind('resize scroll', function (event) {
			for (i = 0; i < $.fn.qtip.interfaces.length; i++) {
				// Access current elements API
				var api = $.fn.qtip.interfaces[i];

				// Update position if resize or scroll adjustments are enabled
				if(api && api.status && api.status.rendered && api.options.position.type !== 'static' &&
				(api.options.position.adjust.scroll && event.type === 'scroll' || api.options.position.adjust.resize && event.type === 'resize')) {
					// Queue the animation so positions are updated correctly
					api.updatePosition(event, true);
				}
			}
		});

		// Hide unfocus toolipts on document mousedown
		$(document).bind('mousedown.qtip', function (event) {
			if($(event.target).parents('div.qtip').length === 0) {
				$('.qtip[unfocus]').each(function () {
					var api = $(this).qtip('api');

					// Only hide if its visible and not the tooltips target
					if($(this).is(':visible') && api && api.status && !api.status.disabled && $(event.target).add(api.elements.target).length > 1) { api.hide(event); }
				});
			}
		});
	});


	// Corner object parser
	function Corner(corner) {
		if(!corner){ return false; }

		this.x = String(corner).replace(/middle/i, 'center').match(/left|right|center/i)[0].toLowerCase();
		this.y = String(corner).replace(/middle/i, 'center').match(/top|bottom|center/i)[0].toLowerCase();
		this.offset = { left: 0, top: 0 };
		this.precedance = (corner.charAt(0).search(/^(t|b)/) > -1) ? 'y' : 'x';
		this.string = function(){ return (this.precedance === 'y') ? this.y+this.x : this.x+this.y; };
	}

	// Tip coordinates calculator
	function calculateTip(corner, width, height) {
		// Define tip coordinates in terms of height and width values
		var tips = {
			bottomright: [[0, 0], [width, height], [width, 0]],
			bottomleft: [[0, 0], [width, 0], [0, height]],
			topright: [[0, height], [width, 0], [width, height]],
			topleft: [[0, 0], [0, height], [width, height]],
			topcenter: [[0, height], [width / 2, 0], [width, height]],
			bottomcenter: [[0, 0], [width, 0], [width / 2, height]],
			rightcenter: [[0, 0], [width, height / 2], [0, height]],
			leftcenter: [[width, 0], [width, height], [0, height / 2]]
		};
		tips.lefttop = tips.bottomright;
		tips.righttop = tips.bottomleft;
		tips.leftbottom = tips.topright;
		tips.rightbottom = tips.topleft;

		return tips[corner];
	}

	// Border coordinates calculator
	function calculateBorders(radius) {
		var borders;

		// Use canvas element if supported
		if($('<canvas />').get(0).getContext) {
			borders = {
				topLeft: [radius, radius],
				topRight: [0, radius],
				bottomLeft: [radius, 0],
				bottomRight: [0, 0]
			};
		}

		// Canvas not supported - Use VML (IE)
		else if($.browser.msie) {
			borders = {
				topLeft: [-90, 90, 0],
				topRight: [-90, 90, -radius],
				bottomLeft: [90, 270, 0],
				bottomRight: [90, 270, -radius]
			};
		}

		return borders;
	}


	// Build a jQuery style object from supplied style object
	function jQueryStyle(style, sub) {
		var styleObj, i;

		styleObj = $.extend(true, {}, style);
		for (i in styleObj) {
			if(sub === true && (/(tip|classes)/i).test(i)) { delete styleObj[i]; }
			else if(!sub && (/(width|border|tip|title|classes|user)/i).test(i)) { delete styleObj[i]; }
		}

		return styleObj;
	}

	// Sanitize styles
	function sanitizeStyle(style) {
		if(typeof style.tip !== 'object') {
			style.tip = { corner: style.tip };
		}
		if(typeof style.tip.size !== 'object') {
			style.tip.size = {
				width: style.tip.size,
				height: style.tip.size
			};
		}
		if(typeof style.border !== 'object') {
			style.border = {
				width: style.border
			};
		}
		if(typeof style.width !== 'object') {
			style.width = {
				value: style.width
			};
		}
		if(typeof style.width.max === 'string') { style.width.max = parseInt(style.width.max.replace(/([0-9]+)/i, "$1"), 10); }
		if(typeof style.width.min === 'string') { style.width.min = parseInt(style.width.min.replace(/([0-9]+)/i, "$1"), 10); }

		// Convert deprecated x and y tip values to width/height
		if(typeof style.tip.size.x === 'number') {
			style.tip.size.width = style.tip.size.x;
			delete style.tip.size.x;
		}
		if(typeof style.tip.size.y === 'number') {
			style.tip.size.height = style.tip.size.y;
			delete style.tip.size.y;
		}

		return style;
	}

	// Build styles recursively with inheritance
	function buildStyle() {
		var self, i, styleArray, styleExtend, finalStyle, ieAdjust;
		self = this;

		// Build style options from supplied arguments
		styleArray = [true, {}];
		for(i = 0; i < arguments.length; i++){ styleArray.push(arguments[i]); }
		styleExtend = [$.extend.apply($, styleArray)];

		// Loop through each named style inheritance
		while(typeof styleExtend[0].name === 'string') {
			// Sanitize style data and append to extend array
			styleExtend.unshift(sanitizeStyle($.fn.qtip.styles[styleExtend[0].name]));
		}

		// Make sure resulting tooltip className represents final style
		styleExtend.unshift(true, {
			classes: {
				tooltip: 'qtip-' + (arguments[0].name || 'defaults')
			}
		}, $.fn.qtip.styles.defaults);

		// Extend into a single style object
		finalStyle = $.extend.apply($, styleExtend);

		// Adjust tip size if needed (IE 1px adjustment bug fix)
		ieAdjust = ($.browser.msie) ? 1 : 0;
		finalStyle.tip.size.width += ieAdjust;
		finalStyle.tip.size.height += ieAdjust;

		// Force even numbers for pixel precision
		if(finalStyle.tip.size.width % 2 > 0) { finalStyle.tip.size.width += 1; }
		if(finalStyle.tip.size.height % 2 > 0) { finalStyle.tip.size.height += 1; }

		// Sanitize final styles tip corner value
		if(finalStyle.tip.corner === true) {
			if(self.options.position.corner.tooltip === 'center' && self.options.position.corner.target === 'center') {
				finalStyle.tip.corner = false;
			}
			else {
				finalStyle.tip.corner = self.options.position.corner.tooltip;
			}
		}

		return finalStyle;
	}

	// Border canvas draw method
	function drawBorder(canvas, coordinates, radius, color) {
		// Create corner
		var context = canvas.get(0).getContext('2d');
		context.fillStyle = color;
		context.beginPath();
		context.arc(coordinates[0], coordinates[1], radius, 0, Math.PI * 2, false);
		context.fill();
	}

	// Create borders using canvas and VML
	function createBorder() {
		var self, i, width, radius, color, coordinates, containers, size, betweenWidth, betweenCorners, borderTop, borderBottom, borderCoord, sideWidth, vertWidth;
		self = this;

		// Destroy previous border elements, if present
		self.elements.wrapper.find('.qtip-borderBottom, .qtip-borderTop').remove();

		// Setup local variables
		width = self.options.style.border.width;
		radius = self.options.style.border.radius;
		color = self.options.style.border.color || self.options.style.tip.color;

		// Calculate border coordinates
		coordinates = calculateBorders(radius);

		// Create containers for the border shapes
		containers = {};
		for (i in coordinates) {
			// Create shape container
			containers[i] = '<div rel="' + i + '" style="' + ((/Left/).test(i) ? 'left' : 'right') + ':0; ' + 'position:absolute; height:' + radius + 'px; width:' + radius + 'px; overflow:hidden; line-height:0.1px; font-size:1px">';

			// Canvas is supported
			if($('<canvas />').get(0).getContext) { containers[i] += '<canvas height="' + radius + '" width="' + radius + '" style="vertical-align: top"></canvas>'; }

			// No canvas, but if it's IE use VML
			else if($.browser.msie) {
				size = radius * 2 + 3;
				containers[i] += '<v:arc stroked="false" fillcolor="' + color + '" startangle="' + coordinates[i][0] + '" endangle="' + coordinates[i][1] + '" ' + 'style="width:' + size + 'px; height:' + size + 'px; margin-top:' + ((/bottom/).test(i) ? -2 : -1) + 'px; ' + 'margin-left:' + ((/Right/).test(i) ? coordinates[i][2] - 3.5 : -1) + 'px; ' + 'vertical-align:top; display:inline-block; behavior:url(#default#VML)"></v:arc>';

			}

			containers[i] += '</div>';
		}

		// Create between corners elements
		betweenWidth = self.getDimensions().width - (Math.max(width, radius) * 2);
		betweenCorners = '<div class="qtip-betweenCorners" style="height:' + radius + 'px; width:' + betweenWidth + 'px; ' + 'overflow:hidden; background-color:' + color + '; line-height:0.1px; font-size:1px;">';

		// Create top border container
		borderTop = '<div class="qtip-borderTop" dir="ltr" style="height:' + radius + 'px; ' + 'margin-left:' + radius + 'px; line-height:0.1px; font-size:1px; padding:0;">' + containers.topLeft + containers.topRight + betweenCorners;
		self.elements.wrapper.prepend(borderTop);

		// Create bottom border container
		borderBottom = '<div class="qtip-borderBottom" dir="ltr" style="height:' + radius + 'px; ' + 'margin-left:' + radius + 'px; line-height:0.1px; font-size:1px; padding:0;">' + containers.bottomLeft + containers.bottomRight + betweenCorners;
		self.elements.wrapper.append(borderBottom);

		// Draw the borders if canvas were used (Delayed til after DOM creation)
		if($('<canvas />').get(0).getContext) {
			self.elements.wrapper.find('canvas').each(function () {
				borderCoord = coordinates[$(this).parent('[rel]:first').attr('rel')];
				drawBorder.call(self, $(this), borderCoord, radius, color);
			});
		}

		// Create a phantom VML element (IE won't show the last created VML element otherwise)
		else if($.browser.msie) { self.elements.tooltip.append('<v:image style="behavior:url(#default#VML);"></v:image>'); }

		// Setup contentWrapper border
		sideWidth = Math.max(radius, (radius + (width - radius)));
		vertWidth = Math.max(width - radius, 0);
		self.elements.contentWrapper.css({
			border: '0px solid ' + color,
			borderWidth: vertWidth + 'px ' + sideWidth + 'px'
		});
	}

	// Canvas tip drawing method
	function drawTip(canvas, coordinates, color) {
		// Setup properties
		var context = canvas.get(0).getContext('2d');
		context.fillStyle = color;

		// Create tip
		context.beginPath();
		context.moveTo(coordinates[0][0], coordinates[0][1]);
		context.lineTo(coordinates[1][0], coordinates[1][1]);
		context.lineTo(coordinates[2][0], coordinates[2][1]);
		context.fill();
	}

	function positionTip(corner) {
		var self, ieAdjust, positionAdjust, paddingCorner, paddingSize, newMargin;
		self = this;

		// Return if tips are disabled or tip is not yet rendered
		if(self.options.style.tip.corner === false || !self.elements.tip) { return; }
		if(!corner) { corner = new Corner(self.elements.tip.attr('rel')); }

		// Setup adjustment variables
		ieAdjust = positionAdjust = ($.browser.msie) ? 1 : 0;

		// Set initial position
		self.elements.tip.css(corner[corner.precedance], 0);

		// Set position of tip to correct side
		if(corner.precedance === 'y') {
			// Adjustments for IE6 - 0.5px border gap bug
			if($.browser.msie) {
				if(parseInt($.browser.version.charAt(0), 10) === 6) { positionAdjust = corner.y === 'top' ? -3 : 1; }
				else { positionAdjust = corner.y === 'top' ? 1 : 2; }
			}

			if(corner.x === 'center') {
				self.elements.tip.css({
					left: '50%',
					marginLeft: -(self.options.style.tip.size.width / 2)
				});
			}
			else if(corner.x === 'left') {
				self.elements.tip.css({
					left: self.options.style.border.radius - ieAdjust
				});
			}
			else {
				self.elements.tip.css({
					right: self.options.style.border.radius + ieAdjust
				});
			}

			if(corner.y === 'top') {
				self.elements.tip.css({
					top: -positionAdjust
				});
			}
			else {
				self.elements.tip.css({
					bottom: positionAdjust
				});
			}

		}
		else {
			// Adjustments for IE6 - 0.5px border gap bug
			if($.browser.msie) {
				positionAdjust = (parseInt($.browser.version.charAt(0), 10) === 6) ? 1 : (corner.x === 'left' ? 1 : 2);
			}

			if(corner.y === 'center') {
				self.elements.tip.css({
					top: '50%',
					marginTop: -(self.options.style.tip.size.height / 2)
				});
			}
			else if(corner.y === 'top') {
				self.elements.tip.css({
					top: self.options.style.border.radius - ieAdjust
				});
			}
			else {
				self.elements.tip.css({
					bottom: self.options.style.border.radius + ieAdjust
				});
			}

			if(corner.x === 'left') {
				self.elements.tip.css({
					left: -positionAdjust
				});
			}
			else {
				self.elements.tip.css({
					right: positionAdjust
				});
			}
		}

		// Adjust tooltip padding to compensate for tip
		paddingCorner = 'padding-' + corner[corner.precedance];
		paddingSize = self.options.style.tip.size[corner.precedance === 'x' ? 'width' : 'height'];
		self.elements.tooltip.css('padding', 0).css(paddingCorner, paddingSize);

		// Match content margin to prevent gap bug in IE6 ONLY
		if($.browser.msie && parseInt($.browser.version.charAt(0), 6) === 6) {
			newMargin = parseInt(self.elements.tip.css('margin-top'), 10) || 0;
			newMargin += parseInt(self.elements.content.css('margin-top'), 10) || 0;

			self.elements.tip.css({ marginTop: newMargin });
		}
	}

	// Create tip using canvas and VML
	function createTip(corner) {
		var self, color, coordinates, coordsize, path, tip;
		self = this;

		// Destroy previous tip, if there is one
		if(self.elements.tip !== null) { self.elements.tip.remove(); }

		// Setup color and corner values
		color = self.options.style.tip.color || self.options.style.border.color;
		if(self.options.style.tip.corner === false) { return; }
		else if(!corner) { corner = new Corner(self.options.style.tip.corner); }

		// Calculate tip coordinates
		coordinates = calculateTip(corner.string(), self.options.style.tip.size.width, self.options.style.tip.size.height);

		// Create tip element
		self.elements.tip = '<div class="' + self.options.style.classes.tip + '" dir="ltr" rel="' + corner.string() + '" style="position:absolute; ' + 'height:' + self.options.style.tip.size.height + 'px; width:' + self.options.style.tip.size.width + 'px; ' + 'margin:0 auto; line-height:0.1px; font-size:1px;"></div>';

		// Attach new tip to tooltip element
		self.elements.tooltip.prepend(self.elements.tip);

		// Use canvas element if supported
		if($('<canvas />').get(0).getContext) { tip = '<canvas height="' + self.options.style.tip.size.height + '" width="' + self.options.style.tip.size.width + '"></canvas>'; }

		// Canvas not supported - Use VML (IE)
		else if($.browser.msie) {
			// Create coordize and tip path using tip coordinates
			coordsize = self.options.style.tip.size.width + ',' + self.options.style.tip.size.height;
			path = 'm' + coordinates[0][0] + ',' + coordinates[0][1];
			path += ' l' + coordinates[1][0] + ',' + coordinates[1][1];
			path += ' ' + coordinates[2][0] + ',' + coordinates[2][1];
			path += ' xe';

			// Create VML element
			tip = '<v:shape fillcolor="' + color + '" stroked="false" filled="true" path="' + path + '" coordsize="' + coordsize + '" ' + 'style="width:' + self.options.style.tip.size.width + 'px; height:' + self.options.style.tip.size.height + 'px; ' + 'line-height:0.1px; display:inline-block; behavior:url(#default#VML); ' + 'vertical-align:' + (corner.y === 'top' ? 'bottom' : 'top') + '"></v:shape>';

			// Create a phantom VML element (IE won't show the last created VML element otherwise)
			tip += '<v:image style="behavior:url(#default#VML);"></v:image>';

			// Prevent tooltip appearing above the content (IE z-index bug)
			self.elements.contentWrapper.css('position', 'relative');
		}

		// Create element reference and append vml/canvas
		self.elements.tip = self.elements.tooltip.find('.' + self.options.style.classes.tip).eq(0);
		self.elements.tip.html(tip);

		// Draw the canvas tip (Delayed til after DOM creation)
		if($('<canvas  />').get(0).getContext) { drawTip.call(self, self.elements.tip.find('canvas:first'), coordinates, color); }

		// Fix IE small tip bug
		if(corner.y === 'top' && $.browser.msie && parseInt($.browser.version.charAt(0), 10) === 6) {
			self.elements.tip.css({
				marginTop: -4
			});
		}

		// Set the tip position
		positionTip.call(self, corner);
	}

	// Create title bar for content
	function createTitle() {
		var self = this;

		// Destroy previous title element, if present
		if(self.elements.title !== null) { self.elements.title.remove(); }

		// Append new ARIA attribute to tooltip
		self.elements.tooltip.attr('aria-labelledby', 'qtip-' + self.id + '-title');

		// Create title element
		self.elements.title = $('<div id="qtip-' + self.id + '-title" class="' + self.options.style.classes.title + '"></div>').css(jQueryStyle(self.options.style.title, true)).css({
			zoom: ($.browser.msie) ? 1 : 0
		}).prependTo(self.elements.contentWrapper);

		// Update title with contents if enabled
		if(self.options.content.title.text) { self.updateTitle.call(self, self.options.content.title.text); }

		// Create title close buttons if enabled
		if(self.options.content.title.button !== false && typeof self.options.content.title.button === 'string') {
			self.elements.button = $('<a class="' + self.options.style.classes.button + '" role="button" style="float:right; position: relative"></a>').css(jQueryStyle(self.options.style.button, true)).html(self.options.content.title.button).prependTo(self.elements.title).click(function (event) {
				if(!self.status.disabled) { self.hide(event); }
			});
		}
	}

	// Assign hide and show events
	function assignEvents() {
		var self, showTarget, hideTarget, inactiveEvents;
		self = this;

		// Setup event target variables
		showTarget = self.options.show.when.target;
		hideTarget = self.options.hide.when.target;

		// Add tooltip as a hideTarget is its fixed
		if(self.options.hide.fixed) { hideTarget = hideTarget.add(self.elements.tooltip); }

		// Define events which reset the 'inactive' event handler
		inactiveEvents = ['click', 'dblclick', 'mousedown', 'mouseup', 'mousemove',
							'mouseout', 'mouseenter', 'mouseleave', 'mouseover'];

		// Define 'inactive' event timer method
		function inactiveMethod(event) {
			if(self.status.disabled === true) { return; }

			//Clear and reset the timer
			clearTimeout(self.timers.inactive);
			self.timers.inactive = setTimeout(function () {
				// Unassign 'inactive' events
				$(inactiveEvents).each(function () {
					hideTarget.unbind(this + '.qtip-inactive');
					self.elements.content.unbind(this + '.qtip-inactive');
				});

				// Hide the tooltip
				self.hide(event);
			}, self.options.hide.delay);
		}

		// Check if the tooltip is 'fixed'
		if(self.options.hide.fixed === true) {
			self.elements.tooltip.bind('mouseover.qtip', function () {
				if(self.status.disabled === true) { return; }

				// Reset the hide timer
				clearTimeout(self.timers.hide);
			});
		}

		// Define show event method
		function showMethod(event) {
			if(self.status.disabled === true) { return; }

			// If set, hide tooltip when inactive for delay period
			if(self.options.hide.when.event === 'inactive') {
				// Assign each reset event
				$(inactiveEvents).each(function () {
					hideTarget.bind(this + '.qtip-inactive', inactiveMethod);
					self.elements.content.bind(this + '.qtip-inactive', inactiveMethod);
				});

				// Start the inactive timer
				inactiveMethod();
			}

			// Clear hide timers
			clearTimeout(self.timers.show);
			clearTimeout(self.timers.hide);

			// Start show timer
			if(self.options.show.delay > 0) {
				self.timers.show = setTimeout(function () {
					self.show(event);
				}, self.options.show.delay);
			}
			else {
				self.show(event);
			}
		}

		// Define hide event method
		function hideMethod(event) {
			if(self.status.disabled === true) { return; }

			// Prevent hiding if tooltip is fixed and event target is the tooltip
			if(self.options.hide.fixed === true && (/mouse(out|leave)/i).test(self.options.hide.when.event) && $(event.relatedTarget).parents('div.qtip[id^="qtip"]').length > 0) {
				// Prevent default and popagation
				event.stopPropagation();
				event.preventDefault();

				// Reset the hide timer
				clearTimeout(self.timers.hide);
				return false;
			}

			// Clear timers and stop animation queue
			clearTimeout(self.timers.show);
			clearTimeout(self.timers.hide);
			self.elements.tooltip.stop(true, true);

			// If tooltip has displayed, start hide timer
			self.timers.hide = setTimeout(function () {
				self.hide(event);
			}, self.options.hide.delay);
		}

		// Both events and targets are identical, apply events using a toggle
		if((self.options.show.when.target.add(self.options.hide.when.target).length === 1 &&
		self.options.show.when.event === self.options.hide.when.event && self.options.hide.when.event !== 'inactive') ||
		self.options.hide.when.event === 'unfocus') {
			self.cache.toggle = 0;
			// Use a toggle to prevent hide/show conflicts
			showTarget.bind(self.options.show.when.event + '.qtip', function (event) {
				if(self.cache.toggle === 0) { showMethod(event); }
				else { hideMethod(event); }
			});
		}

		// Events are not identical, bind normally
		else {
			showTarget.bind(self.options.show.when.event + '.qtip', showMethod);

			// If the hide event is not 'inactive', bind the hide method
			if(self.options.hide.when.event !== 'inactive') { hideTarget.bind(self.options.hide.when.event + '.qtip', hideMethod); }
		}

		// Focus the tooltip on mouseover
		if((/(fixed|absolute)/).test(self.options.position.type)) { self.elements.tooltip.bind('mouseover.qtip', self.focus); }

		// If mouse is the target, update tooltip position on mousemove
		if(self.options.position.target === 'mouse' && self.options.position.type !== 'static') {
			showTarget.bind('mousemove.qtip', function (event) {
				// Set the new mouse positions if adjustment is enabled
				self.cache.mouse = {
					x: event.pageX,
					y: event.pageY
				};

				// Update the tooltip position only if the tooltip is visible and adjustment is enabled
				if(self.status.disabled === false && self.options.position.adjust.mouse === true && self.options.position.type !== 'static' && self.elements.tooltip.css('display') !== 'none') { self.updatePosition(event); }
			});
		}
	}

	// BGIFRAME JQUERY PLUGIN ADAPTION
	//   Special thanks to Brandon Aaron for this plugin
	//   http://plugins.jquery.com/project/bgiframe
	function bgiframe() {
		var self, html, dimensions;
		self = this;
		dimensions = self.getDimensions();

		// Setup iframe HTML string
		html = '<iframe class="qtip-bgiframe" frameborder="0" tabindex="-1" src="javascript:false" ' + 'style="display:block; position:absolute; z-index:-1; filter:alpha(opacity=\'0\'); border: 1px solid red; ' + 'height:' + dimensions.height + 'px; width:' + dimensions.width + 'px" />';

		// Append the new HTML and setup element reference
		self.elements.bgiframe = self.elements.wrapper.prepend(html).children('.qtip-bgiframe:first');
	}

	// Define primary construct function
	function construct() {
		var self, content, url, data, method;
		self = this;

		// Call API method
		self.beforeRender.call(self);

		// Set rendered status to true
		self.status.rendered = 2;

		// Create initial tooltip elements
		self.elements.tooltip = '<div qtip="' + self.id + '" id="qtip-' + self.id + '" role="tooltip" ' + 'aria-describedby="qtip-' + self.id + '-content" class="qtip ' + (self.options.style.classes.tooltip || self.options.style) + '" ' + 'style="display:none; -moz-border-radius:0; -webkit-border-radius:0; border-radius:0; position:' + self.options.position.type + ';"> ' + '  <div class="qtip-wrapper" style="position:relative; overflow:hidden; text-align:left;"> ' + '    <div class="qtip-contentWrapper" style="overflow:hidden;"> ' + '       <div id="qtip-' + self.id + '-content" class="qtip-content ' + self.options.style.classes.content + '"></div> ' + '</div></div></div>';

		// Append to container element
		self.elements.tooltip = $(self.elements.tooltip);
		self.elements.tooltip.appendTo(self.options.position.container);

		// Setup tooltip qTip data
		self.elements.tooltip.data('qtip', {
			current: 0,
			interfaces: [self]
		});

		// Setup element references
		self.elements.wrapper = self.elements.tooltip.children('div:first');
		self.elements.contentWrapper = self.elements.wrapper.children('div:first');
		self.elements.content = self.elements.contentWrapper.children('div:first').css(jQueryStyle(self.options.style));

		// Apply IE hasLayout fix to wrapper and content elements
		if($.browser.msie) { self.elements.wrapper.add(self.elements.content).css({ zoom: 1 }); }

		// Setup tooltip attributes
		if(self.options.hide.when.event === 'unfocus') { self.elements.tooltip.attr('unfocus', true); }

		// If an explicit width is set, updateWidth prior to setting content to prevent dirty rendering
		if(typeof self.options.style.width.value === 'number') { self.updateWidth(); }

		// Create borders and tips if supported by the browser
		if($('<canvas />').get(0).getContext || $.browser.msie) {
			// Create border
			if(self.options.style.border.radius > 0) { createBorder.call(self); }
			else {
				self.elements.contentWrapper.css({
					border: self.options.style.border.width + 'px solid ' + self.options.style.border.color
				});
			}

			// Create tip if enabled
			if(self.options.style.tip.corner !== false) { createTip.call(self); }
		}

		// Neither canvas or VML is supported, tips and borders cannot be drawn!
		else {
			// Set defined border width
			self.elements.contentWrapper.css({
				border: self.options.style.border.width + 'px solid ' + self.options.style.border.color
			});

			// Reset border radius and tip
			self.options.style.border.radius = 0;
			self.options.style.tip.corner = false;
		}

		// Use the provided content string or DOM array
		if((typeof self.options.content.text === 'string' && self.options.content.text.length > 0) || (self.options.content.text.jquery && self.options.content.text.length > 0)) { content = self.options.content.text; }

		// Use title string for content if present
		else if(self.elements.target.attr('title')) {
			self.cache.attr = ['title', self.elements.target.attr('title')];
			content = self.cache.attr[1].replace(/\n/gi, '<br />');
		}

		// No title is present, use alt attribute instead
		else if(self.elements.target.attr('alt')) {
			self.cache.attr = ['alt', self.elements.target.attr('alt')];
			content = self.cache.attr[1].replace(/\n/gi, '<br />');
		}

		// No valid content was provided, inform via log
		else { content = ' '; }

		// Set the tooltips content and create title if enabled
		if(self.options.content.title.text !== false) { createTitle.call(self); }
		self.updateContent(content, false);

		// Assign events and toggle tooltip with focus
		assignEvents.call(self);
		if(self.options.show.ready === true) { self.show(); }

		// Retrieve ajax content if provided
		if(self.options.content.url !== false) {
			url = self.options.content.url;
			data = self.options.content.data;
			method = self.options.content.method || 'get';
			self.loadContent(url, data, method);
		}

		// Call API method and log event
		self.status.rendered = true;
		self.onRender.call(self);
	}

	// Instantiator
	function QTip(target, options, id) {
		// Declare this reference
		var self = this;

		// Setup class attributes
		self.id = id;
		self.options = options;
		self.status = {
			animated: false,
			rendered: false,
			disabled: false,
			focused: false
		};
		self.elements = {
			target: target.addClass(self.options.style.classes.target),
			tooltip: null,
			wrapper: null,
			content: null,
			contentWrapper: null,
			title: null,
			button: null,
			tip: null,
			bgiframe: null
		};
		self.cache = {
			attr: null,
			mouse: {},
			toggle: 0,
			overflow: { left: false, top: false }
		};
		self.timers = {};

		// Define exposed API methods
		$.extend(self, self.options.api, {
			show: function (event) {
				var returned, solo;

				// Make sure tooltip is rendered and if not, return
				if(!self.status.rendered) { return false; }

				// Only continue if element is visible
				if(self.elements.tooltip.css('display') !== 'none') { return self; }

				// Reset cached attribute if present
				if(self.cache.attr) { self.elements.target.removeAttr(self.cache.attr[0]); }

				// Clear animation queue
				self.elements.tooltip.stop(true, false);

				// Call API method and if return value is false, halt
				returned = self.beforeShow.call(self, event);
				if(returned === false) { return self; }

				// Define afterShow callback method
				function afterShow() {
					// Set ARIA hidden status attribute
					self.elements.tooltip.attr('aria-hidden', true);

					// Call API method and focus if it isn't static
					if(self.options.position.type !== 'static') { self.focus(); }
					self.onShow.call(self, event);

					// Prevent antialias from disappearing in IE7 by removing filter attribute
					if($.browser.msie) { self.elements.tooltip.get(0).style.removeAttribute('filter'); }

					// Remove opacity on show
					self.elements.tooltip.css({ opacity: '' });
				}

				// Maintain toggle functionality if enabled
				self.cache.toggle = 1;

				// Update tooltip position if it isn't static
				if(self.options.position.type !== 'static') {
					self.updatePosition(event, (self.options.show.effect.length > 0 && self.rendered !== 2));
				}

				// Hide other tooltips if tooltip is solo
				if(typeof self.options.show.solo === 'object') {
					solo = $(self.options.show.solo);
				}
				else if(self.options.show.solo === true) {
					solo = $('div.qtip').not(self.elements.tooltip);
				}
				if(solo) {
					solo.each(function () {
						if($(this).qtip('api').status.rendered === true) { $(this).qtip('api').hide(); }
					});
				}

				// Show tooltip
				if(typeof self.options.show.effect.type === 'function') {
					self.options.show.effect.type.call(self.elements.tooltip, self.options.show.effect.length);
					self.elements.tooltip.queue(function () {
						afterShow();
						$(this).dequeue();
					});
				}
				else {
					switch (self.options.show.effect.type.toLowerCase()) {
						case 'fade':
							self.elements.tooltip.fadeIn(self.options.show.effect.length, afterShow);
						break;

						case 'slide':
							self.elements.tooltip.slideDown(self.options.show.effect.length, function () {
								afterShow();
								if(self.options.position.type !== 'static') { self.updatePosition(event, true); }
							});
						break;

						case 'grow':
							self.elements.tooltip.show(self.options.show.effect.length, afterShow);
						break;

						default:
							self.elements.tooltip.show(null, afterShow);
						break;
					}

					// Add active class to tooltip
					self.elements.tooltip.addClass(self.options.style.classes.active);
				}

				// Log event and return
				return self;
			},

			hide: function (event) {
				var returned;

				// Make sure tooltip is rendered and if not, return
				if(!self.status.rendered) { return false; }

				// Only continue if element is visible
				else if(self.elements.tooltip.css('display') === 'none') { return self; }

				// Reset cached attribute if present
				if(self.cache.attr) { self.elements.target.attr(self.cache.attr[0], self.cache.attr[1]); }

				// Stop show timer and animation queue
				clearTimeout(self.timers.show);
				self.elements.tooltip.stop(true, false);

				// Call API method and if return value is false, halt
				returned = self.beforeHide.call(self, event);
				if(returned === false) { return self; }

				// Define afterHide callback method
				function afterHide() {
					// Set ARIA hidden status attribute
					self.elements.tooltip.attr('aria-hidden', true);

					// Remove opacity attribute
					self.elements.tooltip.css({ opacity: '' });

					// Call API callback
					self.onHide.call(self, event);
				}

				// Maintain toggle functionality if enabled
				self.cache.toggle = 0;

				// Hide tooltip
				if(typeof self.options.hide.effect.type === 'function') {
					self.options.hide.effect.type.call(self.elements.tooltip, self.options.hide.effect.length);
					self.elements.tooltip.queue(function () {
						afterHide();
						$(this).dequeue();
					});
				}
				else {
					switch (self.options.hide.effect.type.toLowerCase()) {
						case 'fade':
							self.elements.tooltip.fadeOut(self.options.hide.effect.length, afterHide);
						break;

						case 'slide':
							self.elements.tooltip.slideUp(self.options.hide.effect.length, afterHide);
						break;

						case 'grow':
							self.elements.tooltip.hide(self.options.hide.effect.length, afterHide);
						break;

						default:
							self.elements.tooltip.hide(null, afterHide);
						break;
					}

					// Remove active class to tooltip
					self.elements.tooltip.removeClass(self.options.style.classes.active);
				}

				// Log event and return
				return self;
			},

			toggle: function (event, state) {
				var condition = /boolean|number/.test(typeof state) ? state : !self.elements.tooltip.is(':visible');

				self[condition ? 'show' : 'hide'](event);

				return self;
			},

			updatePosition: function (event, animate) {
				if(!self.status.rendered) {
					return false;
				}


				var posOptions = options.position,
					target = $(posOptions.target),
					elemWidth = self.elements.tooltip.outerWidth(),
					elemHeight = self.elements.tooltip.outerHeight(),
					targetWidth, targetHeight, position,
					my = posOptions.corner.tooltip,
					at = posOptions.corner.target,
					returned,
					coords, i, mapName, imagePos,
					adapt = {
						left: function () {
							var leftEdge = $(window).scrollLeft(),
								rightEdge = $(window).width() + $(window).scrollLeft(),
								myOffset = my.x === 'center' ? elemWidth/2 : elemWidth,
								atOffset = my.x === 'center' ? targetWidth/2 : targetWidth,
								borderAdjust = (my.x === 'center' ? 1 : 2) * self.options.style.border.radius,
								offset = -2 * posOptions.adjust.x,
								pRight = position.left + elemWidth,
								adj;

							// Cut off by right side of window
							if(pRight > rightEdge) {
								adj = offset - myOffset - atOffset + borderAdjust;

								// Shifting to the left will make whole qTip visible, or will minimize how much is cut off
								if(position.left + adj > leftEdge || leftEdge - (position.left + adj) < pRight - rightEdge) {
									return { adjust: adj, tip: 'right' };
								}
							}
							// Cut off by left side of window
							if(position.left < leftEdge) {
								adj = offset + myOffset + atOffset - borderAdjust;

								// Shifting to the right will make whole qTip visible, or will minimize how much is cut off
								if(pRight + adj < rightEdge || pRight + adj - rightEdge < leftEdge - position.left) {
									return { adjust: adj, tip: 'left' };
								}
							}

							return { adjust: 0, tip: my.x };
						},
						top: function () {
							var topEdge = $(window).scrollTop(),
								bottomEdge = $(window).height() + $(window).scrollTop(),
								myOffset = my.y === 'center' ? elemHeight/2 : elemHeight,
								atOffset = my.y === 'center' ? targetHeight/2 : targetHeight,
								borderAdjust = (my.y === 'center' ? 1 : 2) * self.options.style.border.radius,
								offset = -2 * posOptions.adjust.y,
								pBottom = position.top + elemHeight,
								adj;

							// Cut off by bottom of window
							if(pBottom > bottomEdge) {
								adj = offset - myOffset - atOffset + borderAdjust;

								// Shifting to the top will make whole qTip visible, or will minimize how much is cut off
								if(position.top + adj > topEdge || topEdge - (position.top + adj) < pBottom - bottomEdge) {
									return { adjust: adj, tip: 'bottom' };
								}
							}
							// Cut off by top of window
							if(position.top < topEdge) {
								adj = offset + myOffset + atOffset - borderAdjust;

								// Shifting to the top will make whole qTip visible, or will minimize how much is cut off
								if(pBottom + adj < bottomEdge || pBottom + adj - bottomEdge < topEdge - position.top) {
									return { adjust: adj, tip: 'top' };
								}
							}

							return { adjust: 0, tip: my.y };
						}
					};

				if(event && options.position.target === 'mouse') {
					// Force left top to allow flipping
					at = { x: 'left', y: 'top' };
					targetWidth = targetHeight = 0;
					position = {
						top: event.pageY,
						left: event.pageX
					};
				}
				else {
					if(target[0] === document) {
						targetWidth = target.width();
						targetHeight = target.height();
						position = { top: 0, left: 0 };
					}
					else if(target[0] === window) {
						targetWidth = target.width();
						targetHeight = target.height();
						position = {
							top: target.scrollTop(),
							left: target.scrollLeft()
						};
					}
					else if(target.is('area')) {
						// Retrieve coordinates from coords attribute and parse into integers
						coords = self.options.position.target.attr('coords').split(',');
						for(i = 0; i < coords.length; i++) { coords[i] = parseInt(coords[i], 10); }

						// Setup target position object
						mapName = self.options.position.target.parent('map').attr('name');
						imagePos = $('img[usemap="#' + mapName + '"]:first').offset();
						target.position = {
							left: Math.floor(imagePos.left + coords[0]),
							top: Math.floor(imagePos.top + coords[1])
						};

						// Determine width and height of the area
						switch (self.options.position.target.attr('shape').toLowerCase()) {
							case 'rect':
								targetWidth = Math.ceil(Math.abs(coords[2] - coords[0]));
								targetHeight = Math.ceil(Math.abs(coords[3] - coords[1]));
							break;

							case 'circle':
								targetWidth = coords[2] + 1;
								targetHeight = coords[2] + 1;
							break;

							case 'poly':
								targetWidth = coords[0];
								targetHeight = coords[1];

								for (i = 0; i < coords.length; i++) {
									if(i % 2 === 0) {
										if(coords[i] > targetWidth) { targetWidth = coords[i]; }
										if(coords[i] < coords[0]) { position.left = Math.floor(imagePos.left + coords[i]); }
									}
									else {
										if(coords[i] > targetHeight) { targetHeight = coords[i]; }
										if(coords[i] < coords[1]) { position.top = Math.floor(imagePos.top + coords[i]); }
									}
								}

								targetWidth = targetWidth - (position.left - imagePos.left);
								targetHeight = targetHeight - (position.top - imagePos.top);
							break;
						}

						// Adjust position by 2 pixels (Positioning bug?)
						targetWidth -= 2;
						targetHeight -= 2;
					}
					else {
						targetWidth = target.outerWidth();
						targetHeight = target.outerHeight();
						position = target.offset();
					}

					// Adjust position relative to target
					position.left += at.x === 'right' ? targetWidth : at.x === 'center' ? targetWidth / 2 : 0;
					position.top += at.y === 'bottom' ? targetHeight : at.y === 'center' ? targetHeight / 2 : 0;
				}

				// Adjust position relative to tooltip
				position.left += posOptions.adjust.x + (my.x === 'right' ? -elemWidth : my.x === 'center' ? -elemWidth / 2 : 0);
				position.top += posOptions.adjust.y + (my.y === 'bottom' ? -elemHeight : my.y === 'center' ? -elemHeight / 2 : 0);

				// Adjust for border radius
				if(self.options.style.border.radius > 0) {
					if(my.x === 'left') { position.left -= self.options.style.border.radius; }
					else if(my.x === 'right') { position.left += self.options.style.border.radius; }

					if(my.y === 'top') { position.top -= self.options.style.border.radius; }
					else if(my.y === 'bottom') { position.top += self.options.style.border.radius; }
				}

				// Adjust tooltip position if screen adjustment is enabled
				if(posOptions.adjust.screen) {
					(function() {
						var adjusted = { x: 0, y: 0 },
							adapted = { x: adapt.left(), y: adapt.top() },
							tip = new Corner(options.style.tip.corner);

						if(self.elements.tip && tip) {
							// Adjust position according to adjustment that took place
							if(adapted.y.adjust !== 0) {
								position.top += adapted.y.adjust;
								tip.y = adjusted.y = adapted.y.tip;
							}
							if(adapted.x.adjust !== 0) {
								position.left += adapted.x.adjust;
								tip.x = adjusted.x = adapted.x.tip;
							}

							// Update overflow cache
							self.cache.overflow = {
								left: adjusted.x === false,
								top: adjusted.y === false
							};

							// Update and redraw the tip
							if(self.elements.tip.attr('rel') !== tip.string()) { createTip.call(self, tip); }
						}
					}());
				}

				// Initiate bgiframe plugin in IE6 if tooltip overlaps a select box or object element
				if(!self.elements.bgiframe && $.browser.msie && parseInt($.browser.version.charAt(0), 10) === 6) {
					bgiframe.call(self);
				}

				// Call API method and if return value is false, halt
				returned = self.beforePositionUpdate.call(self, event);
				if(returned === false) { return self; }

				// Check if animation is enabled
				if(options.position.target !== 'mouse' && animate === true) {
					// Set animated status
					self.status.animated = true;

					// Animate and reset animated status on animation end
					self.elements.tooltip.stop().animate(position, 200, 'swing', function () {
						self.status.animated = false;
					});
				}

				// Set new position via CSS
				else { self.elements.tooltip.css(position); }

				// Call API method and log event if its not a mouse move
				self.onPositionUpdate.call(self, event);

				return self;
			},

			updateWidth: function (newWidth) {
				// Make sure tooltip is rendered and width is a number
				if(!self.status.rendered || (newWidth && typeof newWidth !== 'number')) { return false; }

				// Setup elements which must be hidden during width update
				var hidden = self.elements.contentWrapper.siblings().add(self.elements.tip).add(self.elements.button),
					zoom = self.elements.wrapper.add(self.elements.contentWrapper.children()),
					tooltip = self.elements.tooltip,
					max = self.options.style.width.max,
					min = self.options.style.width.min;

				// Calculate the new width if one is not supplied
				if(!newWidth) {
					// Explicit width is set
					if(typeof self.options.style.width.value === 'number') {
						newWidth = self.options.style.width.value;
					}

					// No width is set, proceed with auto detection
					else {
						// Set width to auto initally to determine new width and hide other elements
						self.elements.tooltip.css({ width: 'auto' });
						hidden.hide();

						// Set the new calculated width and if width has not numerical, grab new pixel width
						tooltip.width(newWidth);

						// Set position and zoom to defaults to prevent IE hasLayout bug
						if($.browser.msie) {
							zoom.css({ zoom: '' });
						}

						// Set the new width
						newWidth = self.getDimensions().width;

						// Make sure its within the maximum and minimum width boundries
						if(!self.options.style.width.value) {
							newWidth = Math.min(Math.max(newWidth, min), max);
						}
					}
				}

				// Adjust newWidth by 1px if width is odd (IE6 rounding bug fix)
				if(newWidth % 2) { newWidth += 1; }

				// Set the new calculated width and unhide other elements
				self.elements.tooltip.width(newWidth);
				hidden.show();

				// Set the border width, if enabled
				if(self.options.style.border.radius) {
					self.elements.tooltip.find('.qtip-betweenCorners').each(function (i) {
						$(this).width(newWidth - (self.options.style.border.radius * 2));
					});
				}

				// IE only adjustments
				if($.browser.msie) {
					// Reset position and zoom to give the wrapper layout (IE hasLayout bug)
					zoom.css({ zoom: 1 });

					// Set the new width
					self.elements.wrapper.width(newWidth);

					// Adjust BGIframe height and width if enabled
					if(self.elements.bgiframe) { self.elements.bgiframe.width(newWidth).height(self.getDimensions.height); }
				}

				// Log event and return
				return self;
			},

			updateStyle: function (name) {
				var tip, borders, context, corner, coordinates;

				// Make sure tooltip is rendered and style is defined
				if(!self.status.rendered || typeof name !== 'string' || !$.fn.qtip.styles[name]) { return false; }

				// Set the new style object
				self.options.style = buildStyle.call(self, $.fn.qtip.styles[name], self.options.user.style);

				// Update initial styles of content and title elements
				self.elements.content.css(jQueryStyle(self.options.style));
				if(self.options.content.title.text !== false) { self.elements.title.css(jQueryStyle(self.options.style.title, true)); }

				// Update CSS border colour
				self.elements.contentWrapper.css({
					borderColor: self.options.style.border.color
				});

				// Update tip color if enabled
				if(self.options.style.tip.corner !== false) {
					if($('<canvas />').get(0).getContext) {
						// Retrieve canvas context and clear
						tip = self.elements.tooltip.find('.qtip-tip canvas:first');
						context = tip.get(0).getContext('2d');
						context.clearRect(0, 0, 300, 300);

						// Draw new tip
						corner = tip.parent('div[rel]:first').attr('rel');
						coordinates = calculateTip(corner, self.options.style.tip.size.width, self.options.style.tip.size.height);
						drawTip.call(self, tip, coordinates, self.options.style.tip.color || self.options.style.border.color);
					}
					else if($.browser.msie) {
						// Set new fillcolor attribute
						tip = self.elements.tooltip.find('.qtip-tip [nodeName="shape"]');
						tip.attr('fillcolor', self.options.style.tip.color || self.options.style.border.color);
					}
				}

				// Update border colors if enabled
				if(self.options.style.border.radius > 0) {
					self.elements.tooltip.find('.qtip-betweenCorners').css({
						backgroundColor: self.options.style.border.color
					});

					if($('<canvas />').get(0).getContext) {
						borders = calculateBorders(self.options.style.border.radius);
						self.elements.tooltip.find('.qtip-wrapper canvas').each(function () {
							// Retrieve canvas context and clear
							context = $(this).get(0).getContext('2d');
							context.clearRect(0, 0, 300, 300);

							// Draw new border
							corner = $(this).parent('div[rel]:first').attr('rel');
							drawBorder.call(self, $(this), borders[corner], self.options.style.border.radius, self.options.style.border.color);
						});
					}
					else if($.browser.msie) {
						// Set new fillcolor attribute on each border corner
						self.elements.tooltip.find('.qtip-wrapper [nodeName="arc"]').each(function () {
							$(this).attr('fillcolor', self.options.style.border.color);
						});
					}
				}

				// Log event and return
				return self;
			},

			updateContent: function (content, reposition) {
				var parsedContent, images, loadedImages;

				function afterLoad() {
					// Update the tooltip width
					self.updateWidth();

					// If repositioning is enabled, update positions
					if(reposition !== false) {
						// Update position if tooltip isn't static
						if(self.options.position.type !== 'static') { self.updatePosition(self.elements.tooltip.is(':visible'), true); }

						// Reposition the tip if enabled
						if(self.options.style.tip.corner !== false) { positionTip.call(self); }
					}
				}

				// Make sure tooltip is rendered and content is defined if not, return
				if(!self.status.rendered || !content) { return false; }

				// Call API method and set new content if a string is returned
				parsedContent = self.beforeContentUpdate.call(self, content);
				if(typeof parsedContent === 'string') { content = parsedContent; }
				else if(parsedContent === false) { return; }

				// Set position and zoom to defaults to prevent IE hasLayout bug
				if($.browser.msie) {
					self.elements.contentWrapper.children().css({
						zoom: 'normal'
					});
				}

				// Append new content if its a DOM array and show it if hidden
				if(content.jquery && content.length > 0) { content.clone(true).appendTo(self.elements.content).show(); }

				// Content is a regular string, insert the new content
				else { self.elements.content.html(content); }

				// Check if images need to be loaded before position is updated to prevent mis-positioning
				images = self.elements.content.find('img[complete=false]');
				if(images.length > 0) {
					loadedImages = 0;
					images.each(function (i) {
						$('<img src="' + $(this).attr('src') + '" />').load(function () {
							if(++loadedImages === images.length) { afterLoad(); }
						});
					});
				}
				else { afterLoad(); }

				// Call API method and log event
				self.onContentUpdate.call(self);
				return self;
			},

			loadContent: function (url, data, method) {
				var returned;

				function setupContent(content) {
					// Call API method and log event
					self.onContentLoad.call(self);

					// Update the content
					self.updateContent(content);
				}

				// Make sure tooltip is rendered and if not, return
				if(!self.status.rendered) { return false; }

				// Call API method and if return value is false, halt
				returned = self.beforeContentLoad.call(self);
				if(returned === false) { return self; }

				// Load content using specified request type
				if(method === 'post') { $.post(url, data, setupContent); }
				else { $.get(url, data, setupContent); }

				return self;
			},

			updateTitle: function (content) {
				var returned;

				// Make sure tooltip is rendered and content is defined
				if(!self.status.rendered || !content) { return false; }

				// Call API method and if return value is false, halt
				returned = self.beforeTitleUpdate.call(self);
				if(returned === false) { return self; }

				// Set the new content and reappend the button if enabled
				if(self.elements.button) { self.elements.button = self.elements.button.clone(true); }
				self.elements.title.html(content);
				if(self.elements.button) { self.elements.title.prepend(self.elements.button); }

				// Call API method and log event
				self.onTitleUpdate.call(self);
				return self;
			},

			focus: function (event) {
				var curIndex, newIndex, elemIndex, returned;

				// Make sure tooltip is rendered and if not, return
				if(!self.status.rendered || self.options.position.type === 'static') { return false; }

				// Set z-index variables
				curIndex = parseInt(self.elements.tooltip.css('z-index'), 10);
				newIndex = 15000 + $('div.qtip[id^="qtip"]').length - 1;

				// Only update the z-index if it has changed and tooltip is not already focused
				if(!self.status.focused && curIndex !== newIndex) {
					// Call API method and if return value is false, halt
					returned = self.beforeFocus.call(self, event);
					if(returned === false) { return self; }

					// Loop through all other tooltips
					$('div.qtip[id^="qtip"]').not(self.elements.tooltip).each(function () {
						if($(this).qtip('api').status.rendered === true) {
							elemIndex = parseInt($(this).css('z-index'), 10);

							// Reduce all other tooltip z-index by 1
							if(typeof elemIndex === 'number' && elemIndex > -1) {
								$(this).css({ zIndex: parseInt($(this).css('z-index'), 10) - 1 });
							}

							// Set focused status to false
							$(this).qtip('api').status.focused = false;
						}
					});

					// Set the new z-index and set focus status to true
					self.elements.tooltip.css({ zIndex: newIndex });
					self.status.focused = true;

					// Call API method and log event
					self.onFocus.call(self, event);
				}

				return self;
			},

			disable: function (state) {
				// Make sure tooltip is rendered and if not, return
				if(!self.status.rendered) { return false; }

				self.status.disabled = state ? true : false;

				return self;
			},

			destroy: function () {
				var i, returned, interfaces;

				// Call API method and if return value is false, halt
				returned = self.beforeDestroy.call(self);
				if(returned === false) { return self; }

				// Check if tooltip is rendered
				if(self.status.rendered) {
					// Remove event handlers and remove element
					self.options.show.when.target.unbind('mousemove.qtip', self.updatePosition);
					self.options.show.when.target.unbind('mouseout.qtip', self.hide);
					self.options.show.when.target.unbind(self.options.show.when.event + '.qtip');
					self.options.hide.when.target.unbind(self.options.hide.when.event + '.qtip');
					self.elements.tooltip.unbind(self.options.hide.when.event + '.qtip');
					self.elements.tooltip.unbind('mouseover.qtip', self.focus);
					self.elements.tooltip.remove();
				}

				// Tooltip isn't yet rendered, remove render event
				else { self.options.show.when.target.unbind(self.options.show.when.event + '.qtip-' + self.id + '-create'); }

				// Check to make sure qTip data is present on target element
				if(typeof self.elements.target.data('qtip') === 'object') {
					// Remove API references from interfaces object
					interfaces = self.elements.target.data('qtip').interfaces;
					if(typeof interfaces === 'object' && interfaces.length > 0) {
						// Remove API from interfaces array
						for(i = 0; i < interfaces.length - 1; i++) {
							if(interfaces[i].id === self.id) { interfaces.splice(i, 1); }
						}
					}
				}
				$.fn.qtip.interfaces.splice(self.id, 1);

				// Set qTip current id to previous tooltips API if available
				if(typeof interfaces === 'object' && interfaces.length > 0) { self.elements.target.data('qtip').current = interfaces.length - 1; }
				else { self.elements.target.removeData('qtip'); }

				// Call API method and log destroy
				self.onDestroy.call(self);

				return self.elements.target;
			},

			getPosition: function () {
				var show, offset;

				// Make sure tooltip is rendered and if not, return
				if(!self.status.rendered) { return false; }

				show = (self.elements.tooltip.css('display') !== 'none') ? false : true;

				// Show and hide tooltip to make sure coordinates are returned
				if(show) { self.elements.tooltip.css({ visiblity: 'hidden' }).show(); }
				offset = self.elements.tooltip.offset();
				if(show) { self.elements.tooltip.css({ visiblity: 'visible' }).hide(); }

				return offset;
			},

			getDimensions: function () {
				var show, dimensions;

				// Make sure tooltip is rendered and if not, return
				if(!self.status.rendered) { return false; }

				show = (!self.elements.tooltip.is(':visible')) ? true : false;

				// Show and hide tooltip to make sure dimensions are returned
				if(show) { self.elements.tooltip.css({ visiblity: 'hidden' }).show(); }
				dimensions = {
					height: self.elements.tooltip.outerHeight(),
					width: self.elements.tooltip.outerWidth()
				};
				if(show) { self.elements.tooltip.css({ visiblity: 'visible' }).hide(); }

				return dimensions;
			}
		});
	}

	// Implementation
	$.fn.qtip = function (options, blanket) {
		var i, id, interfaces, opts, obj, command, config, api;

		// Return API / Interfaces if requested
		if(typeof options === 'string') {
			if($(this).data('qtip')) {
				// Return requested object
				if(options === 'api') {
					return $(this).data('qtip').interfaces[$(this).data('qtip').current];
				}
				else if(options === 'interfaces') {
					return $(this).data('qtip').interfaces;
				}
			}
			else {
				return $(this);
			}
		}

		// Validate provided options
		else {
			// Set null options object if no options are provided
			if(!options) { options = {}; }

			// Sanitize option data
			if(typeof options.content !== 'object' || (options.content.jquery && options.content.length > 0)) {
				options.content = { text: options.content };
			}
			if(typeof options.content.title !== 'object') {
				options.content.title = { text: options.content.title };
			}
			if(typeof options.position !== 'object') {
				options.position = { corner: options.position };
			}
			if(typeof options.position.corner !== 'object') {
				options.position.corner = {
					target: options.position.corner,
					tooltip: options.position.corner
				};
			}
			if(typeof options.show !== 'object') {
				options.show = { when: options.show };
			}
			if(typeof options.show.when !== 'object') {
				options.show.when = { event: options.show.when };
			}
			if(typeof options.show.effect !== 'object') {
				options.show.effect = { type: options.show.effect };
			}
			if(typeof options.hide !== 'object') {
				options.hide = { when: options.hide };
			}
			if(typeof options.hide.when !== 'object') {
				options.hide.when = { event: options.hide.when };
			}
			if(typeof options.hide.effect !== 'object') {
				options.hide.effect = { type: options.hide.effect };
			}
			if(typeof options.style !== 'object') {
				options.style = { name: options.style };
			}

			// Sanitize option styles
			options.style = sanitizeStyle(options.style);

			// Build main options object
			opts = $.extend(true, {}, $.fn.qtip.defaults, options);

			// Inherit all style properties into one syle object and include original options
			opts.style = buildStyle.call({
				options: opts
			}, opts.style);
			opts.user = $.extend(true, {}, options);
		}

		// Iterate each matched element
		return $(this).each(function () // Return original elements as per jQuery guidelines
		{
			// Check for API commands
			if(typeof options === 'string') {
				command = options.toLowerCase();
				interfaces = $(this).qtip('interfaces');

				// Make sure API data exists
				if(typeof interfaces === 'object') {
					// Check if API call is a BLANKET DESTROY command
					if(blanket === true && command === 'destroy') {
						for(i = interfaces.length - 1; i > -1; i--) {
							if('object' === typeof interfaces[i]) {
								interfaces[i].destroy();
							}
						}
					}

					// API call is not a BLANKET DESTROY command
					else {
						// Check if supplied command effects this tooltip only (NOT BLANKET)
						if(blanket !== true) { interfaces = [$(this).qtip('api')]; }

						// Execute command on chosen qTips
						for (i = 0; i < interfaces.length; i++) {
							// Destroy command doesn't require tooltip to be rendered
							if(command === 'destroy') { interfaces[i].destroy(); }

							// Only call API if tooltip is rendered and it wasn't a destroy call
							else if(interfaces[i].status.rendered === true) {
								if(command === 'show') { interfaces[i].show(); }
								else if(command === 'hide') { interfaces[i].hide(); }
								else if(command === 'focus') { interfaces[i].focus(); }
								else if(command === 'disable') { interfaces[i].disable(true); }
								else if(command === 'enable') { interfaces[i].disable(false); }
								else if(command === 'update') { interfaces[i].updatePosition(); }
							}
						}
					}
				}
			}

			// No API commands, continue with qTip creation
			else {
				// Create unique configuration object
				config = $.extend(true, {}, opts);
				config.hide.effect.length = opts.hide.effect.length;
				config.show.effect.length = opts.show.effect.length;

				// Sanitize target options
				if(config.position.container === false) { config.position.container = $(document.body); }
				if(config.position.target === false) { config.position.target = $(this); }
				if(config.show.when.target === false) { config.show.when.target = $(this); }
				if(config.hide.when.target === false) { config.hide.when.target = $(this); }

				// Parse corner options
				config.position.corner.tooltip = new Corner(config.position.corner.tooltip);
				config.position.corner.target = new Corner(config.position.corner.target);

				// Determine tooltip ID (Reuse array slots if possible)
				id = $.fn.qtip.interfaces.length;
				for (i = 0; i < id; i++) {
					if(typeof $.fn.qtip.interfaces[i] === 'undefined') {
						id = i;
						break;
					}
				}

				// Instantiate the tooltip
				obj = new QTip($(this), config, id);

				// Add API references
				$.fn.qtip.interfaces[id] = obj;

				// Check if element already has qTip data assigned
				if(typeof $(this).data('qtip') === 'object' && $(this).data('qtip')) {
					// Set new current interface id
					if(typeof $(this).attr('qtip') === 'undefined') { $(this).data('qtip').current = $(this).data('qtip').interfaces.length; }

					// Push new API interface onto interfaces array
					$(this).data('qtip').interfaces.push(obj);
				}

				// No qTip data is present, create now
				else {
					$(this).data('qtip', {
						current: 0,
						interfaces: [obj]
					});
				}

				// If prerendering is disabled, create tooltip on showEvent
				if(config.content.prerender === false && config.show.when.event !== false && config.show.ready !== true) {
					config.show.when.target.bind(config.show.when.event + '.qtip-' + id + '-create', { qtip: id }, function (event) {
						// Retrieve API interface via passed qTip Id
						api = $.fn.qtip.interfaces[event.data.qtip];

						// Unbind show event and cache mouse coords
						api.options.show.when.target.unbind(api.options.show.when.event + '.qtip-' + event.data.qtip + '-create');
						api.cache.mouse = {
							x: event.pageX,
							y: event.pageY
						};

						// Render tooltip and start the event sequence
						construct.call(api);
						api.options.show.when.target.trigger(api.options.show.when.event);
					});
				}

				// Prerendering is enabled, create tooltip now
				else {
					// Set mouse position cache to top left of the element
					obj.cache.mouse = {
						x: config.show.when.target.offset().left,
						y: config.show.when.target.offset().top
					};

					// Construct the tooltip
					construct.call(obj);
				}
			}
		});
	};

	// Define qTip API interfaces array
	$.fn.qtip.interfaces = [];

	// Define log and constant place holders
	$.fn.qtip.log = {
		error: function () {
			return this;
		}
	};
	$.fn.qtip.constants = {};

	// Define configuration defaults
	$.fn.qtip.defaults = {
		// Content
		content: {
			prerender: false,
			text: false,
			url: false,
			data: null,
			title: {
				text: false,
				button: false
			}
		},
		// Position
		position: {
			target: false,
			corner: {
				target: 'bottomRight',
				tooltip: 'topLeft'
			},
			adjust: {
				x: 0,
				y: 0,
				mouse: true,
				screen: false,
				scroll: true,
				resize: true
			},
			type: 'absolute',
			container: false
		},
		// Effects
		show: {
			when: {
				target: false,
				event: 'mouseover'
			},
			effect: {
				type: 'fade',
				length: 100
			},
			delay: 140,
			solo: false,
			ready: false
		},
		hide: {
			when: {
				target: false,
				event: 'mouseout'
			},
			effect: {
				type: 'fade',
				length: 100
			},
			delay: 0,
			fixed: false
		},
		// Callbacks
		api: {
			beforeRender: function () {},
			onRender: function () {},
			beforePositionUpdate: function () {},
			onPositionUpdate: function () {},
			beforeShow: function () {},
			onShow: function () {},
			beforeHide: function () {},
			onHide: function () {},
			beforeContentUpdate: function () {},
			onContentUpdate: function () {},
			beforeContentLoad: function () {},
			onContentLoad: function () {},
			beforeTitleUpdate: function () {},
			onTitleUpdate: function () {},
			beforeDestroy: function () {},
			onDestroy: function () {},
			beforeFocus: function () {},
			onFocus: function () {}
		}
	};

	$.fn.qtip.styles = {
		defaults: {
			background: 'white',
			color: '#111',
			overflow: 'hidden',
			textAlign: 'left',
			width: {
				min: 0,
				max: 250
			},
			padding: '5px 9px',
			border: {
				width: 1,
				radius: 0,
				color: '#d3d3d3'
			},
			tip: {
				corner: false,
				color: false,
				size: {
					width: 13,
					height: 13
				},
				opacity: 1
			},
			title: {
				background: '#e1e1e1',
				fontWeight: 'bold',
				padding: '7px 12px'
			},
			button: {
				cursor: 'pointer'
			},
			classes: {
				target: '',
				tip: 'qtip-tip',
				title: 'qtip-title',
				button: 'qtip-button',
				content: 'qtip-content',
				active: 'qtip-active'
			}
		},
		cream: {
			border: {
				width: 3,
				radius: 0,
				color: '#F9E98E'
			},
			title: {
				background: '#F0DE7D',
				color: '#A27D35'
			},
			background: '#FBF7AA',
			color: '#A27D35',

			classes: {
				tooltip: 'qtip-cream'
			}
		},
		light: {
			border: {
				width: 3,
				radius: 0,
				color: '#E2E2E2'
			},
			title: {
				background: '#f1f1f1',
				color: '#454545'
			},
			background: 'white',
			color: '#454545',

			classes: {
				tooltip: 'qtip-light'
			}
		},
		dark: {
			border: {
				width: 3,
				radius: 0,
				color: '#303030'
			},
			title: {
				background: '#404040',
				color: '#f3f3f3'
			},
			background: '#505050',
			color: '#f3f3f3',

			classes: {
				tooltip: 'qtip-dark'
			}
		},
		red: {
			border: {
				width: 3,
				radius: 0,
				color: '#CE6F6F'
			},
			title: {
				background: '#f28279',
				color: '#9C2F2F'
			},
			background: '#F79992',
			color: '#9C2F2F',

			classes: {
				tooltip: 'qtip-red'
			}
		},
		green: {
			border: {
				width: 3,
				radius: 0,
				color: '#A9DB66'
			},
			title: {
				background: '#b9db8c',
				color: '#58792E'
			},
			background: '#CDE6AC',
			color: '#58792E',

			classes: {
				tooltip: 'qtip-green'
			}
		},
		blue: {
			border: {
				width: 3,
				radius: 0,
				color: '#ADD9ED'
			},
			title: {
				background: '#D0E9F5',
				color: '#5E99BD'
			},
			background: '#E5F6FE',
			color: '#4D9FBF',

			classes: {
				tooltip: 'qtip-blue'
			}
		}
	};
})(WDN.jQuery);
WDN.loadedJS["/wdn/templates_3.0/scripts/plugins/qtip/jquery.qtip.js"]=1;
WDN.idm = function() {
	return {
		
		/**
		 * The URL to direct the end user to when the logout link is clicked.
		 */
		logoutURL : 'https://login.unl.edu/cas/logout?url='+escape(window.location),
		
		/**
		 * The URL to direct the end user to when the login link is clicked.
		 */
		loginURL : 'https://login.unl.edu/cas/login?service='+escape(window.location),
		
		/**
		 * If populated, the public directory details for the logged in user
		 * 
		 * @var object
		 */
		user : false,
		
		/**
		 * The URL from which the LDAP information is available
		 */
		serviceURL : 'https://login.unl.edu/services/whoami/?id=',
		
		/**
		 * Initialize the IdM related scripts
		 * 
		 * @return void
		 */
		initialize : function(callback) {
			if (WDN.idm.isLoggedIn()) {
				WDN.loadJS(WDN.idm.serviceURL + WDN.getCookie('unl_sso'), function() {
					if (WDN.idm.getUserId()) {
						if (WDN.idm.user.eduPersonPrimaryAffiliation[0] != undefined) {
							_gaq.push(['wdn._setCustomVar', 1, 'Primary Affiliation', WDN.idm.user.eduPersonPrimaryAffiliation[0], 1]);
							//debug statement removed
							if (callback) {
								callback();
							}
						};
						WDN.idm.displayNotice(WDN.idm.getUserId());
					}
				});
			} else {
				if (WDN.jQuery('link[rel=login]').length) {
					WDN.idm.setLoginURL(WDN.jQuery('link[rel=login]').attr('href'));
				}
				if (callback) {
					callback();
				}
			}
		},
		
		logout : function() {
			WDN.setCookie('unl_sso', '0', -1);
			WDN.idm.user = false;
		},
			
		
		/**
		 * Checks if the user is logged in
		 * 
		 * @return bool
		 */
		isLoggedIn : function() {
			var user = WDN.getCookie('unl_sso');
			if (user !== null) {
				return true;
			}
			return false;
		},
		
		/**
		 * Returns the uid of the logged in user.
		 * 
		 * @return string
		 */
		getUserId : function() {
			return WDN.idm.user.uid;
		},
		
		/**
		 * Update the SSO tab and display user info
		 * 
		 * @param string uid
		 * 
		 * @return void
		 */
		displayNotice : function(uid) {
			if (WDN.jQuery('#wdn_identity_management').length === 0) {
				WDN.jQuery('#header').append('<div id="wdn_identity_management" class="loggedin"></div>');
			}
			
			var icon = '';
			// in planet red's use of CAS, staff usernames are converted like jdoe2 -> unl_jdoe2
			//  and student usernames are converted like s-jdoe3 -> unl_s_jdoe3
			var planetred_uid;
			if (uid.substring(2,0) == 's-') {
				planetred_uid = 'unl_' + uid.replace('-','_');
			} else {
				planetred_uid = 'unl_' + uid;
			}
			icon = '<a href="http://planetred.unl.edu/pg/profile/'+planetred_uid+'" title="Your Planet Red Profile"><img src="//planetred.unl.edu/pg/icon/'+planetred_uid+'/topbar/" alt="Your Profile Pic" /></a>';
			
			var disp_name;
			if (WDN.idm.user.cn) {
				for (var i in WDN.idm.user.cn) {
					if (!disp_name || WDN.idm.user.cn[i].length < disp_name.length) {
						disp_name = WDN.idm.user.cn[i];
					}
				}
			} else {
				disp_name = uid;
			}
			
			WDN.jQuery('#wdn_identity_management').html(icon+'<span class="username">'+disp_name+'</span><a id="wdn_idm_logout" title="Logout" href="'+WDN.idm.logoutURL+'">Logout</a>');
			
			// Any time logout link is clicked, unset the user data
			WDN.jQuery('#wdn_idm_logout').click(WDN.idm.logout);
			
			if (WDN.jQuery('link[rel=logout]').length) {
				WDN.idm.setLogoutURL(WDN.jQuery('link[rel=logout]').attr('href'));
			}
		},
		
		displayLogin : function()
		{
			if (WDN.jQuery('#wdn_identity_management').length === 0) {
				WDN.jQuery('#header').append('<div id="wdn_identity_management" class="loggedout"></div>');
			}
			
			if (WDN.jQuery('#wdn_search').length > 0) {
				// search box is being displayed, adjust the positioning
				WDN.jQuery('#wdn_identity_management').css({right:'362px'});
			}
			
			icon = '<a><img src="//planetred.unl.edu/mod/profile/graphics/defaulttopbar.gif" alt="Guest User" /></a>';
			
			WDN.jQuery('#wdn_identity_management').html(icon+'<span class="username">Guest</span><a id="wdn_idm_login" title="Login" href="'+WDN.idm.loginURL+'">Login</a>');
		},
		
		/**
		 * Set the URL to send the user to when the logout link is clicked
		 */
		setLogoutURL : function(url) {
			WDN.jQuery('#wdn_idm_logout').attr('href', url);
			WDN.idm.logoutURL = url;
		},
		
		
		/**
		 * Set the URL to send the user to when the login link is clicked
		 */
		setLoginURL : function(url) {
			if (url) {
				WDN.idm.loginURL = url;
			}
			WDN.idm.displayLogin();
		}
	};
}();
WDN.loadedJS["/wdn/templates_3.0/scripts/idm.js"]=1;
WDN.tabs = (function() {
	var jq = function(id) {
		return '#' + id.replace(/(:|\.)/g, '\\$1');
	};
	
	var getHashFromLink = function(link) {
		var uri = link.href.split('#');
		
		if (!uri[1]) {
			return false;
		}
		
		var currentPage = window.location.toString().split('#')[0];
		
		if (document.getElementsByTagName('base')[0]) {
			var basehref = document.getElementsByTagName('base')[0].getAttribute('href');
		}
		
		if (basehref) {
			if (currentPage != uri[0] && basehref != uri[0]) {
				return false;
			}
		} else {
			if (currentPage != uri[0]) {
				return false;
			}
		}
		
		return uri[1];
	};
	
	return {
		useHashChange : true,
		
		initialize : function() {
			var ie7 = document.all && navigator.appVersion.indexOf("MSIE 7.") != -1;
			//debug statement removed
			//Detect if the <span> is present. If not, add it
			WDN.jQuery('ul.wdn_tabs > li > a:not(:has(span))').each(function(){
				theHTML = WDN.jQuery(this).html();
				WDN.jQuery(this).html("<span>"+theHTML+"</span>");
			});
			
			// Add yesprint class to list items, to act as a table of contents when printed
			WDN.jQuery('ul.wdn_tabs:not(.disableSwitching) li').each(function(){
				var content    = WDN.jQuery(this).children('a').text();
				var hash_check = WDN.jQuery(this).children('a').attr('href').split('#');
				if (hash_check.length == 2 && hash_check[1] !== "") {
					WDN.jQuery('div#'+hash_check[1]).prepend("<h5 class='yesprint'>"+content+"</h5>");
				}
				return true;
			});
			
			// Set up the event for when a tab is clicked
			var hashFromTabClick = false;
			WDN.jQuery('ul.wdn_tabs:not(.disableSwitching) a').click(function() { //do something when a tab is clicked
				var trig = WDN.jQuery(this);
				var hash = getHashFromLink(this);
				
				if (!hash) {
					return true;
				}
				
				WDN.tabs.updateInterface(trig);
				hashFromTabClick = true;
				if (window.location.hash.replace('#', '') != hash) {
					window.location.hash = hash;
				}
				if (!WDN.tabs.useHashChange) {
					WDN.tabs.displayFromHash(hash);
				}
				
				return false;
			});
			
			// Adds spacing if subtabs are present
			if (WDN.jQuery('#maincontent ul.wdn_tabs li ul').length) {
				WDN.jQuery('#maincontent ul.wdn_tabs').css({'margin-bottom':'70px'});
			}
			
			// Allows for CSS correction of last tab
			if (WDN.jQuery.browser.msie) {
				WDN.jQuery('ul.wdn_tabs > li:last-child').addClass('last');
			}
			
			// If we have some tabs setup the hash stuff
			if (WDN.jQuery('ul.wdn_tabs:not(.disableSwitching)').length) {
				var isValidTabHash = function(hash) {
					var validRE = /^[a-z][\w:\-\.]*$/i;
					return validRE.test(hash);
				};
				var setupFirstHash = function(hash) {
					if (hash) {
						var ignoreTabs = WDN.jQuery(jq(hash)).closest('.wdn_tabs_content').prev('ul.wdn_tabs');
					} else {
						var ignoreTabs = WDN.jQuery();
					}
					
					var tabs = WDN.jQuery('ul.wdn_tabs:not(.disableSwitching)').not(ignoreTabs);
					
					if (WDN.jQuery('li.selected', tabs).length) {
						var trig = WDN.jQuery('li.selected:first a:first', tabs);
					} else {
						var trig = WDN.jQuery('> li:first a:first', tabs);
					}
					
					trig.each(function() {
						var innerTrig = WDN.jQuery(this);
						var hash = getHashFromLink(this);
						if (!hash || !isValidTabHash(hash)) {
							return;
						}
						WDN.tabs.updateInterface(innerTrig);
						WDN.tabs.displayFromHash(hash);
					});
				};
				
				if (WDN.tabs.useHashChange) {
					var setupHashChange = function() {
						WDN.jQuery(function($) {
							var firstRun = true;
							$(window).unbind('.wdn_tabs').bind('hashchange.wdn_tabs', function(e) {
								var hash = location.hash.replace('#', '');
								if (hash && !isValidTabHash(hash)) {
									return true;
								}
								if (hash != '' && $('.wdn_tabs_content ' + jq(hash)).length) {
									WDN.tabs.displayFromHash(hash, firstRun || !hashFromTabClick);
									if (firstRun) {
										setupFirstHash(hash);
										firstRun = false;
									}
									if (hashFromTabClick) {
										hashFromTabClick = false;
									}
									return false; //consume this hash event
								} else if (firstRun) {
									setupFirstHash();
									firstRun = false;
									return true; //we simulated a hash event (allow others to consume);
								}
							});
							$(window).hashchange();
						});
					};
					if (!WDN.jQuery.fn.hashchange) {
						WDN.loadJS('wdn/templates_3.0/scripts/plugins/hashchange/jQuery.hashchange.1-3.min.js', setupHashChange);
					} else {
						setupHashChange();
					}
				} else {
					// No hashchange listener, so simulate first run
					var hash = location.hash.replace('#', '');
					if (isValidTabHash(hash) && WDN.jQuery('.wdn_tabs_content ' + jq(hash)).length) {
							WDN.tabs.displayFromHash(hash, true);
					} else {
						hash = '';
					}
					setupFirstHash(hash);
				}
			}
			
			return true;
		},
		
		updateInterface: function(trig) {
			var tabs = trig.closest('ul.wdn_tabs');
			var curr = trig.closest('li').siblings('.selected');
			
			// Remove any selected tab class
			WDN.jQuery('li.selected', tabs).removeClass('selected');
			
			// Hide any subtabs
			WDN.jQuery('ul', tabs).hide();
			
			// Add the selected class to the tab (and sub-tab)
			trig.parents('li').addClass('selected');
			
			// Show any relevant sub-tabs
			trig.siblings().show();
			trig.closest('ul').show();
			
			var nsel = trig.closest('li').siblings('.selected');
			trig.trigger('tabchanged', [curr, nsel, tabs]);
		},
		
		displayFromHash: function(hash, forceUpdate) {
			var sel = WDN.jQuery(jq(hash));
			var tabContents = sel.closest('.wdn_tabs_content');
			tabContents.children().hide();
			sel.show();
			
			if (forceUpdate) {
				var trig = WDN.jQuery('ul.wdn_tabs li a[href$='+jq(hash)+']');
				if (trig.length) {
					WDN.tabs.updateInterface(trig.first());
				}
			}
		}
	};
})();

WDN.loadedJS["/wdn/templates_3.0/scripts/tabs.js"]=1;
WDN.feedback = function() {
	
	return {
        initialize : function() {
			////debug statement removed
			WDN.loadJS('wdn/templates_3.0/scripts/plugins/rating/jquery.rating.js', WDN.feedback.ratingSetup);
			WDN.feedback.commentSetup();
		},
		ratingSetup : function() {
			//debug statement removed
			//jQuery('#wdn_feedback').rating().animate({opacity: 'show'}, 2000);
			try {
				WDN.jQuery('#wdn_feedback').rating();
			} catch (e) {}
		},
		commentSetup : function() {
			WDN.jQuery('#wdn_feedback_comments textarea').keyup(
				function(event) {
					if (this.value.length > 0) {
						// Add the submit button
						WDN.jQuery('#wdn_feedback_comments input').css({display:'block'});
					}
				}
			);
			WDN.jQuery('#wdn_feedback_comments').submit(
				function(event) {
					var comments = WDN.jQuery('#wdn_feedback_comments textarea').val();
					if (comments.split(' ').length < 4) {
						// Users must enter in at least 4 words.
						alert('Please enter more information, give me at least 4 words!');
						return false;
					}
					WDN.post(
						'http://www1.unl.edu/comments/', 
						{comment:comments},
						function () {
							//WDN.analytics.callTrackEvent('Page Comment', 'Sent', window.location);
						}
					);
					WDN.jQuery('#wdn_feedback_comments').replaceWith('<h4>Thanks!</h4>');
					event.stopPropagation();
					return false;
				}
			);
		}
	};
}();
WDN.loadedJS["/wdn/templates_3.0/scripts/feedback.js"]=1;
WDN.socialmediashare = function() {
    return {
        initialize : function() {
            try {
            	WDN.jQuery("#wdn_emailthis").children('a').attr({'href': 'mailto:?body=Great%20content%20from%20UNL%3A%0A'+encodeURIComponent(window.location)});
                WDN.jQuery("#wdn_facebook").children('a').attr({'href': "http://www.facebook.com/share.php?u="+encodeURIComponent(window.location)});
                WDN.jQuery("#wdn_twitter").children('a').attr({'href': "http://twitter.com/share?text=Great+content+from+%23UNL&related=higher+ed,nebraska,university,big+ten&via=unlnews&url="+encodeURIComponent(window.location)});
           } catch(f) {}
            
            WDN.jQuery('a#wdn_createGoURL').click(function() {
                WDN.jQuery(this).text('Creating...');
                WDN.socialmediashare.createURL(window.location.href, 
                    function(data) {
                		data = data.replace(/http:\/\//g,'');
                        WDN.jQuery('.socialmedia li:first-child').empty().html("<input type='text' id='goURLResponse' value='"+data+"' />");
                        WDN.jQuery('#goURLResponse').focus().select();
                    }
                );
                return false;
            });
            //change the href to a goURL with GA campaign tagging
            var utm_source = "";
            var utm_campaign = "wdn_social";
            var utm_medium = "share_this";
            WDN.jQuery('.socialmedia a:not(#wdn_createGoURL)').click(function() {
                utm_source = WDN.jQuery(this).parent('li').attr('id');
                gaTagging = "utm_campaign="+utm_campaign+"&utm_medium="+utm_medium+"&utm_source="+utm_source;
                //Let's build the URL to be shrunk
                thisPage = new String(window.location.href);
                
                WDN.socialmediashare.createURL(
                    WDN.socialmediashare.buildGAURL(thisPage, gaTagging),
                    function(data) { //now we have a GoURL, let's replace the href with this new URL.
                        var strLocation = encodeURIComponent(window.location);
                        var regExpURL = new RegExp(strLocation);
                        //debug statement removed
                        var currentHref = WDN.jQuery('#'+utm_source).children('a').attr('href');
                        //debug statement removed
                        WDN.jQuery('#'+utm_source).attr({href : currentHref.replace(regExpURL, data)});
                        window.location.href = WDN.jQuery('#'+utm_source).attr('href');
                    }
                );
                return false;
            });
        },
        buildGAURL : function(url, gaTagging) { 
        	if (url.indexOf('?') != -1) { //check to see if has a ?, if not then go ahead with the ?. Otherwise add with &
                url = url+"&"+gaTagging;
            } else {
                url = url+"?"+gaTagging;
            }
        	return url;
        },
        createURL : function(createThisURL, callback, failure) { //function to create a GoURL
        	failure = failure || function() {};
        	WDN.post(
        		"http://go.unl.edu/api_create.php", 
                {theURL: createThisURL},
                function(data) {
                    //debug statement removed
                    if (data != "There was an error. ") {
                        callback(data);
                    } else {
                    	failure();
                    }
                }
            );
        }
    };
}();
WDN.loadedJS["/wdn/templates_3.0/scripts/socialmediashare.js"]=1;
/* Constructor */
var unlAlerts = function() {};

WDN.unlalert = function() {
	var _getClosedAlerts = function() {
		var c = WDN.getCookie('unlAlertsC');
		if (c) {
			return c.split(',');
		}
		
		return [];
	};
	var _pushClosedAlert = function(id) {
		var closed = _getClosedAlerts();
		if (WDN.jQuery.inArray(id, closed) >= 0) {
			return;
		}
		
		closed.push(id);
		WDN.setCookie('unlAlertsC', closed.join(','), 3600);
	};
	var _checkCookie = function(name) {
		var c = WDN.getCookie(name);
		if (c) {
			return true;
		}
		return false;
	};
	
	var activeIds = [], calltimeout;
	
	return {
		
		data_url : 'http://alert1.unl.edu/json/unlcap.js',
		//data_url : 'http://ucommbieber.unl.edu/ucomm/templatedependents/templatesharedcode/scripts/alert.master.server.js',
		
		initialize : function()
		{
			//debug statement removed
			if ("https:" != document.location.protocol) {
				// Don't break authenticated sessions
				WDN.unlalert.checkIfCallNeeded();
			}
		},
		
		checkIfCallNeeded: function() {
			if (WDN.unlalert._dataHasExpired() || WDN.unlalert._hasPreviousAlert()) {
				WDN.unlalert._callServer();
			}
		},
		
		dataReceived: function() {
			//debug statement removed
			clearTimeout(calltimeout);
			/* Set cookie to indicate time the data was aquired */
			WDN.setCookie('unlAlertsData', 1, 60);
			calltimeout = setTimeout(WDN.unlalert.checkIfCallNeeded, 60000);
		},
		
		/*------ Check if the data has expired ------*/
		_dataHasExpired: function() {
			return !_checkCookie('unlAlertsData');
		},
		
		_hasPreviousAlert: function() {
			return _checkCookie('unlAlertsA');
		},
		
		_callServer: function() {
			//debug statement removed
			var head = document.getElementsByTagName('head').item(0);
			var old  = document.getElementById('lastLoadedCmds');
			if (old) {
				head.removeChild(old);
			}
			var currdate = new Date();
			script = document.createElement('script');
			script.src = WDN.unlalert.data_url+'?'+currdate.getTime();
			script.type = 'text/javascript';
			script.defer = true;
			script.id = 'lastLoadedCmds';
			head.appendChild(script);
		},
		
		/*------ check if alert was acknowledged ------*/
		alertWasAcknowledged: function(id) {
			var closed = _getClosedAlerts();
			return WDN.jQuery.inArray(id, closed) >= 0;
		},
		
		/*------ acknowledge alert, and don't show again ------*/
		_acknowledgeAlert: function(id) {
			_pushClosedAlert(id);
		},
		
		/*------ building alert message ------*/
		alertUser: function(root) {
			if (!WDN.jQuery.isArray(root)) {
				root = [root];
			}
			
			//debug statement removed
			WDN.setCookie('unlAlertsA', 1, 60);
			activeIds = [];
			var $alertBox = WDN.jQuery("#alertbox"), $alertContent;
			var firstAlert = !$alertBox.length;
			var allAck = true;
			
			for (var i = 0; i < root.length; i++) {
				if (root[i].severity !== 'Extreme') {
					continue;
				}
				
				var uniqueID = root[i].parameter.value;
				activeIds.push(uniqueID);
				
				if (!allAck || !WDN.unlalert.alertWasAcknowledged(uniqueID)) {
					allAck = false;
				}
				
				// Add a div to store the html content
				if (!$alertBox.length) {
					$alertBox = WDN.jQuery('<div id="alertbox" />').appendTo('#maincontent').hide();
					$alertContent = WDN.jQuery('<div class="two_col right" />').appendTo($alertBox)
						.parent().prepend('<div class="col left"><img src="/wdn/templates_3.0/css/images/alert/generic.png" alt="An emergency has been issued" /></div>').end();
				} else if (i === 0) {
					$alertContent = $alertBox.children('.two_col').empty();
				}
				
				var alertTitle = root[i].headline;
				var alertDescription = root[i].description;
				var effectiveDate = root[i].effective || '';
				if (effectiveDate.length) {
					// transform the ISO effective date into a JS date by inserting a missing colon
					effectiveDate = new Date(effectiveDate.slice(0, -2) + ":" + effectiveDate.slice(-2)).toLocaleString();
				}
				
				var alertContentHTML = '<h1 class="sec_header">UNL Alert: ' + alertTitle + '</h1>';
				if (effectiveDate) {
					alertContentHTML += '<h4 class="effectiveDate">Issued at ' + effectiveDate + '</h4>';
				}
				alertContentHTML += '<p>'+ alertDescription +'<!-- Number '+uniqueID+' --></p>';
				$alertContent.append(alertContentHTML);
			}
			
			if ($alertBox.length && firstAlert) {
				// Add the alert icon to the tool links
				WDN.jQuery('#wdn_tool_links').prepend('<li class="focus"><a id="unlalerttool" class="alert" title="UNL Alert: An alert has been issued." href="#alertbox">UNL Alert</a></li>');
				WDN.tooltip.addTooltip(WDN.jQuery('#unlalerttool'));
				WDN.jQuery('#unlalerttool').click(function() {
					$alertBox.show();
					WDN.jQuery(document).bind('cbox_closed', WDN.unlalert.closeAlert);
					WDN.jQuery('#unlalerttool').colorbox({inline:true,width:"640px",href:"#alertbox",open:true});
					return false;
				});
			}
			
			if (allAck) {
				//debug statement removed
				// Ignore this alert... the user has already acknowledged it.
			} else {
				WDN.jQuery('#unlalerttool').click();
			}
		},
		
		/*------ close alert box ------*/
		closeAlert: function() {
			//create alert box
			WDN.jQuery('#alertbox').hide();
			for (var i = 0; i < activeIds.length; i++) {
				WDN.unlalert._acknowledgeAlert(activeIds[i]);
			}
		}
	};
}();

/* server side scripts for UNL Alert System */
unlAlerts.server = {

	/*------ initiate alert message if message is critical ------*/
	init: function() {
		/* We have received the data */
		WDN.unlalert.dataReceived();
		
		/* get the root of the alert data tree*/
		var alertInfo = unlAlerts.data.alert.info;
		
		if (alertInfo) {
			//debug statement removed
			WDN.unlalert.alertUser(alertInfo);
			
			return true;
		}

		WDN.setCookie('unlAlertsA', '', -1);
		return false;
	}
};

WDN.loadedJS["/wdn/templates_3.0/scripts/unlalert.js"]=1;
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

function rotateImg(imgArray_str,elementId_str,secs_int,thisNum_int){
	function showIt() {
		try {
			
			if (obj.src !== null && eval(imgArray_str+"["+thisNum_int+"][0]")!==null) {
				obj.src=eval(imgArray_str+"["+thisNum_int+"][0]");
			}
			if (obj.alt !== null && eval(imgArray_str+"["+thisNum_int+"][1]")!==null) {
				obj.alt=eval(imgArray_str+"["+thisNum_int+"][1]");
			}
			if (obj.parentNode.href!==null && eval(imgArray_str+"["+thisNum_int+"][2]")!==null) {
				obj.parentNode.href=eval(imgArray_str+"["+thisNum_int+"][2]");
				if (eval(imgArray_str+"["+thisNum_int+"][3]")!==null) {
					var clickEvent = eval(imgArray_str+"["+thisNum_int+"][3]");
					obj.parentNode.onclick=function() {eval(clickEvent);};
				} else {
					obj.parentNode.onclick=null;
				}
			} else {
				obj.parentNode.href='#';
			}
		} catch(e) {}
	}
	
	if (thisNum_int == undefined) {
		thisNum_int=Math.floor(Math.random()*eval(imgArray_str+".length"));
	}
	if (thisNum_int >= eval(imgArray_str+".length")) {
		thisNum_int = 0;
	}
	if (eval(imgArray_str+"["+thisNum_int+"]") !== null) {
		// Try and set img
		var obj = document.getElementById(elementId_str);
		
		showIt();
	}
	thisNum_int++;
	if (secs_int>0) {
		return setTimeout("rotateImg('"+imgArray_str+"','"+elementId_str+"',"+secs_int+","+thisNum_int+")",secs_int*1000);
	}
	
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


WDN.loadedJS["/wdn/templates_3.0/scripts/global_functions.js"]=1;
WDN.mobile_detect = function() {
	
	return {
		
		message : 'Welcome, mobile user! This page is available in a mobile-friendly view. Would you like to see it?',
		
		mobilesite : 'http://m.unl.edu/?view=proxy&u=',
		
		initialize : function() {
			//debug statement removed
			if (!WDN.mobile_detect.wantsMobile()){
				return true;
			}
			if (!WDN.mobile_detect.isMobile()) {
				return true;
			}
			WDN.loadCSS('/wdn/templates_3.0/css/header/mobile_detect.css');
			WDN.mobile_detect.showMessage();
		},
		
		isMobile : function() {
			var agent = navigator.userAgent.toLowerCase();
			if (agent.match(/(iPhone|iPod|blackberry|android|htc|kindle|lg|midp|mmp|mobile|nokia|opera mini|palm|pocket|psp|sgh|smartphone|sonyericsson|symbian|treo mini)/i)) {
				if (!agent.match(/(iPad)/i)) {
					return true;
				}
			}
			return false;
		},
		
		wantsMobile : function() {
			c = WDN.getCookie('wdn_mobile');
			if (c=='no'){
				return false;
			}
			return true;
		},
		
		setMobileCookie : function() { //user wants mobile, so set the cookie to yes mobile
			//debug statement removed
			WDN.setCookie('wdn_mobile', 'yes', 1200);
		},
		
		removeMobileCookie : function() { //user doesn't want mobile, so set expire the cookie to no mobile
			//debug statement removed
			WDN.setCookie('wdn_mobile', 'no', 1200);
			
		},
		
		showMessage : function() {
			WDN.jQuery('#wdn_wrapper').before('<div id="wdn_mobileMessage">'+WDN.mobile_detect.message+' <a id="wdn_mobileYes" href="'+WDN.mobile_detect.mobilesite+encodeURI(window.location.href)+'" title="View mobile version">Yes</a><a id="wdn_mobileNo" href="#">No</a></div>');
			WDN.jQuery('#wdn_mobileYes').click(function(){
				WDN.mobile_detect.setMobileCookie();
			});
			WDN.jQuery('#wdn_mobileNo').click(function(){
				WDN.mobile_detect.removeMobileCookie();
				WDN.mobile_detect.hideMessage();
				return false;
			});
		},
		
		hideMessage : function() {
			WDN.jQuery('#wdn_mobileMessage').hide();
		}
	};
}();
WDN.loadedJS["/wdn/templates_3.0/scripts/mobile_detect.js"]=1;

WDN.initializeTemplate();