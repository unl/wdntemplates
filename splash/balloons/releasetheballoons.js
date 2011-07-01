var UNL_Balloons = (function() {
	var $; // Will set to our jQuery variable once it's available on the callback so we can use $

	var balloonBatch = 10; // Number of balloons to release each time
	var maxBalloons = 29; // Max number of balloons before balloon overdose
	var clickActive = true; // Set to false when maxBalloons has been reached
	var balloonRegistry = new Array(); // Keep track of what balloons are currently on screen

	var interval = new Object(); // setInterval variable for interval.move and interval.hadEnough
	var moveTimeSpan = 25; // Time span for move interval
	var moveDistance = 1; // Pixel distance to move

	var balloonCounter;

	return {
		init : function() {
			$ = WDN.jQuery;

			// Throttle it for IE 8
			if ($.browser.msie && $.browser.version < 9.0 ) {
				maxBalloons = 19;
			}
			// Let Chrome go bananas
			var userAgent = navigator.userAgent.toLowerCase();
			$.browser.chrome = /chrome/.test(navigator.userAgent.toLowerCase());
			if ($.browser.chrome) {
				maxBalloons = 79;
			}

			$('#footer').prepend('<div id="releasetheballoons"><img id="releasetheballoons-img" src="/ucomm/splash/balloons/releasetheballoons.png" alt="Click to Release the Balloons" /><br /><div id="balloon-counter" class="flip-counter" style="display:none;"></div></div>');

			// force IE7 to repaint
			if ($.browser.msie && $.browser.version < 8.0 ) {
				$('#releasetheballoons').css('zoom', 1);
			}

			// Initialize the counter
			balloonCounter = new flipCounter("balloon-counter", {pace: 750, fW: 30, tFH: 22, bFH: 36, bOffset: 221});

			$('#releasetheballoons-img').click(function() {
				if (!clickActive) {
					return;
				}

				if (balloonRegistry.length > maxBalloons) {
					clickActive = false;
					$('#okclicksomemore').remove();
					$('<div class="balloon-message" id="ithinkyouvehadenough">We\'re running out of balloons! Give us a second to get some more...</div>').insertAfter('#footer_floater');
					interval.hadEnough = setInterval('UNL_Balloons.checkMaxBalloons();', 1000);
				} else {
					UNL_Balloons.addBalloons();
					WDN.log('balloonRegistry: '+balloonRegistry);
					if (interval.move == null) {
						WDN.log('Release the balloons!');
						UNL_Balloons.startBalloons();
					}
				}
			});

			//Let's just go ahead and release some beloons on page load
			window.onload = function() {
				$('#releasetheballoons-img').click();
			};
		},

		addBalloons : function() {
			// Timestamp to append to the ajax request so it's not cached
			var ts = Math.round((new Date()).getTime() / 1000);
			$.get('/ucomm/splash/balloons/ballooncount.html?time='+ts, function(data) {
				// Only set the value with ajax data on page load, not on additional clicks
				if ($('#balloon-counter').css('display') == 'none') {
					balloonCounter.setValue(data*balloonBatch);
					$('#balloon-counter').show();
					$('<div id="balloons-released"></div>').insertAfter('#balloon-counter');
					$('#balloons-released').html(balloonCounter.getValue() + ' balloons have been "released" on UNL.edu');
				}
			});
			balloonCounter.add(balloonBatch);

			var lastIndex = (balloonRegistry.length ? balloonRegistry.length-1 : 0);
			var lastBalloon = (balloonRegistry[lastIndex] ? balloonRegistry[lastIndex] : 0);

			var centerPosition;
			if ($.browser.msie && $.browser.version < 9.0) {
				centerPosition = (document.body.clientWidth/2)-35;
			} else {
				centerPosition = (window.innerWidth/2)-35;
			}
			var footerPosition = $('#footer').offset().top;

			var i;
			for (i=lastBalloon+1;i<=lastBalloon+balloonBatch;i++) {
				$('#wdn_content_wrapper').append('<div class="balloon" id="balloon'+i+'">BALLOON FLOATING ACROSS THE SCREEN!</div>');
				$('#balloon'+i).offset({'left' : centerPosition, 'top' : footerPosition});
				WDN.log('Added balloon'+i);
				balloonRegistry.push(i);
			}
		},

		startBalloons : function() {
			interval.move = setInterval('UNL_Balloons.moveBalloons();', moveTimeSpan);
		},

		moveBalloons : function() {
			if (balloonRegistry.length < 1) {
				clearInterval(interval.move);
				interval.move = null;
				WDN.log('Move interval cleared!');
			}

			// Start at the back of the array so items can be removed without screwing up the indices
			var i;
			for (i=balloonRegistry.length-1;i>=0;i--) {
				var currentBalloon = $('#balloon'+balloonRegistry[i]);
				var offset = currentBalloon.offset();

				// Get the last digit of the balloon id, i.e. 9 for 59
				var sigFig = balloonRegistry[i]%10;

				// Do some stuff with random numbers to try to get some different flow amongst balloons
				// Basically this was the result of trial and error,
				// Not ideal but I'm not going to write a whole damn balloon physics engine (like I'd know how anyway)
				var moveVertical = (Math.floor(Math.random()*10)/(sigFig+1) > .3 ? moveDistance : 0);
				var moveHorizontal = ((Math.floor(Math.random()*100)+1)/(sigFig+2) < 2.5 ? -(moveDistance) : 0);

				// Try to keep half of them on each side of the screen,
				// again, not ideal but who do I look like, Professor Tim Gay???
				if (sigFig%2) {
					moveHorizontal = Math.abs(moveHorizontal);
				}

				// Actually move the balloon
				currentBalloon.offset({'left' : offset.left+moveHorizontal, 'top' : offset.top-moveVertical});

				// If the balloon has exited the top of the view port, remove from the DOM and the registry
				if (offset.top < -80) {
					currentBalloon.remove();
					WDN.log('Removed balloon key: '+i+'; Balloon id: '+currentBalloon.attr('id'));
					balloonRegistry.splice(i, 1);
					WDN.log(' Registry is now: '+balloonRegistry);
				}
			};
		},

		checkMaxBalloons : function() {
			if (balloonRegistry.length < maxBalloons) {
				clearInterval(interval.hadEnough);
				clickActive = true;
				$('#ithinkyouvehadenough').remove();
				$('<div class="balloon-message" id="okclicksomemore">OK, we inflated some more balloons. You can click again!</div>').insertAfter('#footer_floater');
				WDN.log('User no longer in danger of balloon overdose.');
			}
		}
	};
})();

WDN.loadCSS('/ucomm/splash/balloons/releasetheballoons.css');
WDN.loadCSS('/ucomm/splash/counter/css/counter.css');
WDN.loadJQuery(UNL_Balloons.init);
