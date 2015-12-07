/**
 * (c) Copyright 2010-2013, Zazar Ltd
 * Copyright (C) 2007 Jean-François Hovinne - http://www.hovinne.com/
 *
 * jQuery plugin for display of RSS/Atom feeds
 * Based on original plugin jGFeed by jQuery HowTo.
 * Filesize function by Cary Dunn.
 * jFeed by Jean-François Hovinne
 *
 * Licensed under the MIT
 **/
(function(factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(['jquery'], factory);
	} else if (typeof module === 'object' && module.exports) {
		factory(require('jquery'));
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function($){

	$.fn.rssfeed = function(url, options, fn) {
		// Set plugin defaults
		var defaults = {
			limit: 10,
			header: true,
			titletag: 'h4',
			date: true,
			dateformat: 'datetime',
			content: true,
			snippet: true,
			media: true,
			showerror: true,
			errormsg: '',
			linktarget: '_self',
			linkredirect: '',
			linkcontent: false,
			sort: '',
			sortasc: true,
		};
		options = $.extend(defaults, options);

		// Functions
		return this.each(function(i, e) {
			var $e = $(e);

			// Add feed class to user div
			if (!$e.hasClass('rssFeed')) $e.addClass('rssFeed');

			// Check for valid url
			if(!url) return false;

			// Send request
			$.ajax(url, {
				error: function() {
					// Handle error if required
					if (options.showerror) {
						var msg;
						if (options.errormsg !== '') {
							msg = options.errormsg;
						} else {
							msg = 'Could not load feed.';
						}
						$(e).html('<div class="rssError"><p>'+ msg +'</p></div>');
					}
				},
				success: function(data){
					_process(e, data, options);

					// Optional user callback function
					if ($.isFunction(fn)) fn($e);
				}
			});
		});
	};

	function extend(target, source) {
		Object.getOwnPropertyNames(source).forEach(function(propName) {
			Object.defineProperty(target, propName, Object.getOwnPropertyDescriptor(source, propName));
		});
		return target;
	}

	function JFeed(xml) {
		this.parse(xml);
	}

	JFeed.prototype = {
		element: null,
		type: '',
		version: '',
		title: '',
		link: '',
		description: '',
		author:  '',
		language: '',
		updated: '',
		entries: [],
		parse: function(xml) {
			this.element = xml;
			this.entries = [];
		}
	};

	JFeed.factory = function(xml) {

		if ($('channel', xml).length) {
			return new JRss(xml);
		} else if ($('feed', xml).length) {
			return new JAtom(xml);
		}

		return null;
	};

	function JFeedItem(feed, element) {
		this.feed = feed;
		this.parse(element);
	}

	JFeedItem.prototype = {
		element: null,
		feed: null,
		title: '',
		link: '',
		content: '',
		get description() {
			return this.content;
		},
		get contentSnippet() {
			return _generateContentSnippet(this.content);
		},
		publishedDate: '',
		get updated() {
			return this.publishedDate;
		},
		id: '',
		media: [],
		parse: function(element) {
			this.element = element;
			this.media = [];
		}
	};

	function JAtomFeedItem(feed, element) {
		JFeedItem.call(this, feed, element);
	}
	JAtomFeedItem.prototype = {
		get title() {
			return $('title', this.element).eq(0).text();
		},
		get link() {
			return $('link', this.element).eq(0).attr('href');
		},
		get content() {
			return $('summary', this.element).eq(0).text() || $('content', this.element).eq(0).text();
		},
		get publishedDate() {
			return $('published', this.element).eq(0).text();
		},
		get updated() {
			return $('updated', this.element).eq(0).text() || this.published;
		},
		get id() {
			return $('id', this.element).eq(0).text();
		},
		parse: function(element) {
			var self = this;
			JFeedItem.prototype.parse.call(this, element);
			$('link[rel=enclosure]', element).each(function() {
				self.media.push(new JAtomMediaItem(this));
			});
		}
	};
	JAtomFeedItem.prototype = extend(Object.create(JFeedItem.prototype), JAtomFeedItem.prototype);

	function JRssFeedItem(feed, element) {
		JFeedItem.call(this, feed, element);
	}
	JRssFeedItem.prototype = {
		get title() {
			return $('title', this.element).eq(0).text();
		},
		get link() {
			return $('link', this.element).eq(0).text();
		},
		get content() {
			return $('description', this.element).eq(0).text();
		},
		get publishedDate() {
			return $('pubDate', this.element).eq(0).text();
		},
		get id() {
			return $('guid', this.element).eq(0).text();
		},
		parse: function(element) {
			var self = this;
			JFeedItem.prototype.parse.call(this, element);
			$('enclosure', element).each(function() {
				self.media.push(new JRssMediaItem(this));
			});
		}
	};
	JRssFeedItem.prototype = extend(Object.create(JFeedItem.prototype), JRssFeedItem.prototype);

	function JMediaItem(xml) {
		this.element = xml;
	}
	JMediaItem.prototype = {
		element: null,
		get href() {
			return $(this.element).attr('url');
		},
		get type() {
			return $(this.element).attr('type');
		},
		get length() {
			return $(this.element).attr('length');
		}
	};

	function JAtomMediaItem(xml) {
		JMediaItem.call(this, xml);
	}
	JAtomMediaItem.prototype = {
		get href() {
			return $(this.element).attr('href');
		}
	};
	JAtomMediaItem.prototype = extend(Object.create(JMediaItem.prototype), JAtomMediaItem.prototype);

	function JRssMediaItem(xml) {
		JMediaItem.call(this, xml);
	}
	JRssMediaItem.prototype = {};
	JRssMediaItem.prototype = extend(Object.create(JMediaItem.prototype), JRssMediaItem.prototype);


	function JAtom(xml) {
		this.type = 'atom';
		JFeed.call(this, xml);
	}

	JAtom.prototype = {
		get channel() {
			return $('feed', this.element).eq(0);
		},
		get title() {
			return $('title', this.channel).eq(0).text();
		},
		get link() {
			return $('link', this.channel).eq(0).attr('href');
		},
		get description() {
			return $('subtitle', this.channel).eq(0).text();
		},
		get language() {
			return this.channel.attr('xml:lang');
		},
		get updated() {
			return $('updated', this.channel).eq(0).text();
		},
		get author() {
			return $('name', this.channel).eq(0).text();
		},
		parse: function(xml) {
			var self = this;
			JFeed.prototype.parse.call(this, xml);
			this.version = '1.0';
			$('entry', xml).each(function() {
				self.entries.push(new JAtomFeedItem(self, this));
			});
		}
	};
	JAtom.prototype = extend(Object.create(JFeed.prototype), JAtom.prototype);

	function JRss(xml) {
		this.type = 'rss';
		JFeed.call(this, xml);
	}

	JRss.prototype = {
		get channel() {
			return $('channel', this.element).eq(0);
		},
		get version() {
			var $rss = $('rss', this.element);

			if (!$rss.length) {
				return '1.0';
			}

			return $rss.eq(0).attr('version');
		},
		get title() {
			return $('title', this.channel).eq(0).text();
		},
		get link() {
			return $('link', this.channel).eq(0).text();
		},
		get description() {
			return $('description', this.channel).eq(0).text();
		},
		get language() {
			return $('language', this.channel).eq(0).text();
		},
		get updated() {
			return $('lastBuildDate', this.channel).eq(0).text();
		},
		parse: function(xml) {
			var self = this;
			JFeed.prototype.parse.call(this, xml);
			$('item', xml).each(function() {
				self.entries.push(new JRssFeedItem(self, this));
			});
		}
	};
	JRss.prototype = extend(Object.create(JFeed.prototype), JRss.prototype);

	var _generateContentSnippet = function(content) {
		var $elem = $('<div>').html(content);
		var text = $elem[0].textContent;
		var nextSpacePos;

		if (text.length > 120) {
			nextSpacePos = text.indexOf(' ', 120);

			if (nextSpacePos !== -1) {
				text = text.substring(0, nextSpacePos) + ' ...';
			}
		}

		return text;
	};

	// Function to create HTML result
	var _process = function(e, data, options) {
		var feeds = JFeed.factory(data);
		if (!feeds.type) {
			return false;
		}
		var rowArray = [];
		var rowIndex = 0;
		var html = '';
		var row = 'odd';
		var i, j;
		var content;

		// Add header if required
		if (options.header)
			html +=	'<div class="rssHeader">' +
				'<a href="'+feeds.link+'" title="'+ feeds.description +'">'+ feeds.title +'</a>' +
				'</div>';

		// Add body
		html += '<div class="rssBody">' +
			'<ul>';


		// Add feeds
		for (i = 0, j = feeds.entries.length; i < options.limit && i < j; i++) {
			rowIndex = i;
			rowArray[rowIndex] = [];

			// Get individual feed
			var entry = feeds.entries[i];
			var pubDate;
			var sort = '';
			var feedLink = entry.link;

			// Apply sort column
			switch (options.sort) {
				case 'title':
					sort = entry.title;
					break;
				case 'date':
					sort = entry.publishedDate;
					break;
			}
			rowArray[rowIndex].sort = sort;

			// Format published date
			if (entry.publishedDate) {
				var entryDate = new Date(entry.publishedDate);
				pubDate = entryDate.toLocaleDateString() + ' ' + entryDate.toLocaleTimeString();

				switch (options.dateformat) {
					case 'datetime':
						break;
					case 'date':
						pubDate = entryDate.toLocaleDateString();
						break;
					case 'time':
						pubDate = entryDate.toLocaleTimeString();
						break;
					case 'timeline':
						pubDate = _getLapsedTime(entryDate);
						break;
					default:
						pubDate = _formatDate(entryDate,options.dateformat);
						break;
				}
			}

			// Add feed row
			if (options.linkredirect) feedLink = encodeURIComponent(feedLink);
			rowArray[rowIndex].html = '<'+ options.titletag +'><a href="'+ options.linkredirect + feedLink +'" title="View this feed at '+ feeds.title +'">'+ entry.title +'</a></'+ options.titletag +'>';

			if (options.date && pubDate) rowArray[rowIndex].html += '<div>'+ pubDate +'</div>';
			if (options.content) {
				// Use feed snippet if available and optioned
				if (options.snippet && entry.contentSnippet) {
					content = entry.contentSnippet;
				} else {
					content = entry.content;
				}

				if (options.linkcontent) {
					content = '<a href="'+ options.linkredirect + feedLink +'" title="View this feed at '+ feeds.title +'">'+ content +'</a>';
				}

				rowArray[rowIndex].html += '<p>'+ content +'</p>';
			}

			// Add any media
			if (options.media && entry.media.length) {
				rowArray[rowIndex].html += '<div class="rssMedia"><div>Media files</div><ul>';

				for (var m = 0, k = entry.media.length; m < k; m++) {
					var xmlUrl = entry.media[m].href;
					var xmlType = entry.media[m].type;
					var xmlSize = entry.media[m].length;
					rowArray[rowIndex].html += '<li><a href="'+ xmlUrl +'" title="Download this media">'+ xmlUrl.split('/').pop() +'</a> ('+ xmlType +', '+ _formatFilesize(xmlSize) +')</li>';
				}
				rowArray[rowIndex].html += '</ul></div>';
			}
		}

		// Sort if required
		if (options.sort) {
			rowArray.sort(function(a,b) {
				var c;
				var d;

				// Apply sort direction
				if (options.sortasc) {
					c = a.sort;
					d = b.sort;
				} else {
					c = b.sort;
					d = a.sort;
				}

				if (options.sort == 'date') {
					return new Date(c) - new Date(d);
				} else {
					c = c.toLowerCase();
					d = d.toLowerCase();
					return (c < d) ? -1 : (c > d) ? 1 : 0;
				}
			});
		}

		// Add rows to output
		$.each(rowArray, function(e) {

			html += '<li class="rssRow '+row+'">' + rowArray[e].html + '</li>';

			// Alternate row classes
			if (row == 'odd') {
				row = 'even';
			} else {
				row = 'odd';
			}
		});

		html += '</ul>' +
			'</div>';

		$(e).html(html);

		// Apply target to links
		$('a',e).attr('target',options.linktarget);
	};

	var _formatFilesize = function(bytes) {
		bytes = parseFloat(bytes);
		if (!bytes) {
			return '';
		}
		var s = ['bytes', 'kb', 'MB', 'GB', 'TB', 'PB'];
		var e = Math.floor(Math.log(bytes)/Math.log(1024));
		return (bytes/Math.pow(1024, Math.floor(e))).toFixed(2)+" "+s[e];
	};

	var _formatDate = function(date,mask) {

		// Convert to date and set return to the mask
		var fmtDate = new Date(date);
		date = mask;

		// Replace mask tokens
		date = date.replace('dd', _formatDigit(fmtDate.getDate()));
		date = date.replace('MMMM', _getMonthName(fmtDate.getMonth()));
		date = date.replace('MM', _formatDigit(fmtDate.getMonth()+1));
		date = date.replace('yyyy',fmtDate.getFullYear());
		date = date.replace('hh', _formatDigit(fmtDate.getHours()));
		date = date.replace('mm', _formatDigit(fmtDate.getMinutes()));
		date = date.replace('ss', _formatDigit(fmtDate.getSeconds()));

		return date;
	};

	var _formatDigit = function(digit) {
		digit += '';
		if (digit.length < 2) digit = '0' + digit;
		return digit;
	};

	var _getMonthName = function(month) {
		var name = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
		return name[month];
	};

	var _getLapsedTime = function(date) {

		// Get current date and format date parameter
		var todayDate = new Date();
		var pastDate = new Date(date);

		// Get lasped time in seconds
		var lapsedTime = Math.round((todayDate.getTime() - pastDate.getTime())/1000);
		var t, u;

		// Return lasped time in seconds, minutes, hours, days and weeks
		if (lapsedTime < 60) {
			return '< 1 min';
		} else if (lapsedTime < (60*60)) {
			t = Math.round(lapsedTime / 60) - 1;
			u = 'min';
		} else if (lapsedTime < (24*60*60)) {
			t = Math.round(lapsedTime / 3600) - 1;
			u = 'hour';
		} else if (lapsedTime < (7*24*60*60)) {
			t = Math.round(lapsedTime / 86400) - 1;
			u = 'day';
		} else {
			t = Math.round(lapsedTime / 604800) - 1;
			u = 'week';
		}

		// Check for plural units
		if (t > 1) u += 's';
		return t + ' ' + u;
	};

}));
