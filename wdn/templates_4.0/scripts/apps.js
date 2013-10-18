define(['jquery', 'wdn', 'modernizr'], function($, WDN, Modernizr) {
	var weatherServer = '//www.unl.edu/',
	directoryServer = '//directory.unl.edu/',
	partialFmt = 'format=partial',

	isInSecure = (window.location.protocol === 'http:'),

	loadError1 = 'An error occurred while loading this section.',
	loadError2 = 'Error loading results.',

	weatherDiv = '#currentcond',

	directoryMore = 'Please enter more information.',
	directoryDiv = '#pfresults',
	directoryProg = 'pf_progress',
	directoryRecDiv = '#pfShowRecord',
	directoryInfo = '.cInfo',
	directoryWait = 400,
	directoryTimeout,
	directoryXhr,
	directoryLastQ = '',
	initd = false;

	function displayWeather(data) {
		$(weatherDiv).html(data);
	};

	function updatePeopleFinderRecord(data, textStatus) {
		var $record = $(directoryRecDiv);
		if (textStatus == 'success') {
			$record.html(data);
		} else {
			$record.html(loadError2);
		}

		$('.mapurl', $record).removeAttr('onclick');

		$record.parent().animate({scrollTop: ($record.position().top + $record.parent().scrollTop() - 10)});
	};

	function getRecord(url) {
		$.get(url, updatePeopleFinderRecord);
		return false;
	}

	function getUID(uid) {
		var url = directoryServer + '?uid=' + uid + '&' + partialFmt;
		return getRecord(url);
	}

	function updatePeopleFinderResults(data, textStatus) {
		var $results = $(directoryDiv),
		tmp = $('<div/>');
		directoryXhr = null;

		if (textStatus == 'success') {
			tmp.html(data);
			$('.ppl_Sresult, .dep_result', tmp).click(function(evt) {
				var cInfo = $(directoryInfo, this);
				if (evt.target != cInfo[0]) {
					cInfo.click();
				}
			});

			$(directoryInfo, tmp).click(function() {
				var href = this.href;
				if (href.indexOf('?uid=') >= 0) {
					href += '&';
				} else {
					href += '/summary?';
				}
				return getRecord(href + partialFmt);
			});

			$results.empty().append(tmp.contents());
		} else {
			$results.html(loadError2);
		}
	};

	function getPeopleFinderResults(q, chooser) {
		if (directoryXhr) {
			directoryXhr.abort();
		}

		var url = directoryServer + '?q=' + q + '&' + partialFmt;
		if (chooser) {
			url += '&chooser=true';
		}
		directoryXhr = $.get(url, updatePeopleFinderResults);
	};

	function queuePFRequest(q, resultsdiv, chooser, cn, sn) {
		var $results = $(directoryDiv),
		splitQuery = '', query;

		$(directoryRecDiv).empty();

		if (cn !== undefined || sn !== undefined) {
			splitQuery = '&cn=' + encodeURIComponent(cn) + '&sn=' + encodeURIComponent(sn);
		}

		query = encodeURIComponent(q) + splitQuery;
		if (query && query === directoryLastQ) {
			return;
		}
		directoryLastQ = query;

		clearTimeout(directoryTimeout);
		if (q.length > 2 || splitQuery.length > 10) {
			$results.html($('<div/>', {id: directoryProg}));

			directoryTimeout = setTimeout(function() {
				getPeopleFinderResults(query, chooser);
			}, directoryWait);
		} else if (q.length>0) {
			$results.html(directoryMore);
		} else {
			$results.empty();
			$(directoryRecDiv).empty();
		}
	};

	return {
		initialize: function() {
			if (initd) {
				return;
			}

			$(function() {
				var $pq = $('#pq');
				$($pq.parents('form')).submit(function() {
					queuePFRequest($pq.val(), directoryDiv);
					return false;
				});
				$pq.keyup(function() {
					queuePFRequest($pq.val(), directoryDiv);
				});

				// load/prep the weather content when checked
				var prepAppResources = function() {
					WDN.loadCSS(WDN.getTemplateFilePath('css/modules/vcard.css'));

					$.ajax({
						url: weatherServer + WDN.getTemplateFilePath('includes/weather.html'),
						success: function(data) {
							displayWeather(data);

							if (isInSecure) {
								$('#wdn_radar_wrapper').addClass('wdn-frame');
							}
						},
						error: function() {
							displayWeather(loadError1);
						}
					});
				};

				var $tog = $('#wdn_resource_apps');

				// IE8
				if (!Modernizr['css-checked']) {
					$('.wdn-resource-app-trigger').click(function() {
						var aw = $('#wdn_app_wrapper');
						if ($tog.prop('checked')) {
							$tog.prop('checked', false);
							aw.height(0);
						} else {
							$tog.prop('checked', true);
							aw.height(300);
						}
					}).one('click', prepAppResources);
				} else {
					var unTog = function() {
						$tog.prop('checked', false);
					};
					$(window).on('unload', unTog);
					unTog();

					// load/prep the weather content when checked
					$tog.one('change', prepAppResources);
				}
			});

			initd = true;
		}
	};
});
