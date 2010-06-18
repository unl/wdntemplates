/**
 * This plugin is intended for videos.
 * 
 * 1. Check for HTML5 video browser capability
 * 2. Setup HTML5 element or Flash alternative
 * 3. if HTML5, use custom video controls
 * 
 */
WDN.videoPlayer = function() {
	return {
		
		initialize : function() {
			i = 0;
			WDN.jQuery('video').each(function(){
				var video = WDN.jQuery(this)[0];
				WDN.videoPlayer.html5Video(video);
				i++;
			});
			
		},
		
		supportsVideo: function() {
			if (!!document.createElement('video').canPlayType) {
				return true;
			} else {
				return false;
			}
		},
		
		supportsH264: function() {
			if(WDN.videoPlayer.supportsVideo) {
				var v = document.createElement("video");
				if(v.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"') != '') {
					return true;
				}
			}
			return false;
		},
		
		supportsWebM: function() {
			if(WDN.videoPlayer.supportsVideo) {
				var v = document.createElement("video");
				if(v.canPlayType('video/webm; codecs="vp8, vorbis"') != '') {
					return true;
				}
			}
			return false;
		},
		
		html5Video : function(video) {
			requiresFallback = true;
			if (WDN.videoPlayer.supportsH264() || WDN.videoPlayer.supportsWebM()){ //can we support H264 or WebM?
				if(video.src || video.children('source')){ //make sure we have a source
					requiresFallback = false;
				}
			}
			WDN.log('requiresFallback (video): '+requiresFallback);
			if (requiresFallback){
				WDN.videoPlayer.createFallback(video);
			} else {
				WDN.loadCSS('/wdn/templates_3.0/css/content/videoPlayer.css');
				WDN.videoPlayer.setupControls.initialize(video);
			}
		},
		
		createFallback : function(video) { //call the flash player option
			WDN.loadJS('/wdn/templates_3.0/scripts/plugins/swfobject/jQuery.swfobject.1.0.9.js', function(){
				src = video.src || WDN.jQuery(video).children('source').attr('src') || "";
				poster = video.poster || "";
				width = video.width || WDN.jQuery(video).width();
				height = video.height || WDN.jQuery(video).height();
				WDN.jQuery(video).wrap("<div id='wdnVideo_"+i+"' />");
				WDN.jQuery(video).remove();
				WDN.jQuery('#wdnVideo_'+i).flash({     
					swf: '/wdn/templates_3.0/includes/swf/player4.3.swf',   
					allowfullscreen: 'true',
					allowscriptaccess: 'always',
					flashvars: {   
						'file': src,   
						'image': poster,   
						'skin': '/wdn/templates_3.0/includes/swf/UNLVideoSkin.swf',   
						'autostart': 'false',
						'controlbar': 'over'
						//stretching: 'exactfit',
					},
					height: height,
					width: width,
					id: 'jwPlayer_'+i,
					name: 'jwPlayer_'+i
				});  
			});
		},
		
		setupControls : function(){
			return {
				
				initialize : function(video) { //setup custom HTML5 video player
					video.preload = true;
					video.autobuffer = true;
					video.controls = false; //remove the standard browser controls
					WDN.jQuery(video).after(WDN.videoPlayer.setupControls.wdnVideo_Controls);
					WDN.videoPlayer.setupControls.positionControls(video);
					WDN.videoPlayer.eventControls.bindControls(video);
				}, 
			
				//setup the HTML to house the controls
				wdnVideo_Controls : '<div class="wdnVideo_controls">' +
					  '<button class="play_pause play" value="paused" type="button">' +
					  '	<span>Play</span>' +
					  '</button>' +
					  '<div class="progress">' +
					  '	<button class="fullscreen" value="no" type="button"></button>'+
					  '	<ul class="volume">'+
					  '		<li class="on"></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li>'+
					  '	</ul>'+
					  '	<span class="time">00:00</span>'+
					  '	<div class="progressBar"><span></span></div>'+
					  '</div>',
				
				positionControls : function(video) { //place the controls relative and over the video
					progressWidth = video.width - 110;
					progressBarWidth = progressWidth - 110;
					WDN.jQuery(video).siblings('.wdnVideo_controls').children('.progress').css('width', progressWidth+'px').children('.progressBar').css('width', progressBarWidth+'px');
				}
			};
		}(),
		
		eventControls : function() {
			return {
				
				bindControls : function(video) {
					//when play button is clicked
					/*
					WDN.jQuery(video).click(function(){
						WDN.videoPlayer.eventControls.onPlayControlClick(event, video);
						return false;
					});
					*/
				
					//play and pause
					WDN.jQuery(video).siblings('.wdnVideo_controls').children('.play').click(function(){
						WDN.videoPlayer.eventControls.onPlayControlClick(event, video);
						return false;
					});
					
					//start of video scrub
					WDN.jQuery(video).siblings('.wdnVideo_controls').children('.progress').children('.progressBar').mousedown(function(event){
						if (video.paused || video.ended) {
				          videoWasPlaying = false;
				        } else {
				          videoWasPlaying = true;
				          video.pause();
				          WDN.videoPlayer.eventControls.stopTrackPlayProgress(video);
				        }

						document.body.focus();
						document.onselectstart = function () { return false; };
						document.onmousemove = function(e){
							WDN.videoPlayer.eventControls.scrubVideo(e.pageX, video);
						};
						document.onmouseup = function() {
							document.onselectstart = function () { return true; };
							document.onmousemove = null;
							document.onmouseup = null;
							if (videoWasPlaying) {
								video.play();
								WDN.videoPlayer.eventControls.trackPlayProgress(video);
							}
						};
					});
					
					//video scrubbing
					WDN.jQuery(video).siblings('.wdnVideo_controls').children('.progress').children('.progressBar').mouseup(function(event){
						WDN.videoPlayer.eventControls.scrubVideo(event.pageX, video);
					});
					
					//fullscreen controls
					videoIsFullScreen = false;
					originalWidth = video.width;
					originalHeight = video.height;
					originalZIndex = WDN.jQuery(video).css('z-index');
					WDN.jQuery(video).siblings('.wdnVideo_controls').children('.progress').children('.fullscreen').click(function(){
						if (!videoIsFullScreen) {
							WDN.videoPlayer.eventControls.fullScreenOn(video);
							videoIsFullScreen = true;
						} else {
							WDN.videoPlayer.eventControls.fullScreenOff(video, originalWidth, originalHeight, originalZIndex);
							videoIsFullScreen = false;
						}
					});
					
					//volume control
					video.volume = .75;
					WDN.jQuery(video).siblings('.wdnVideo_controls').children('.progress').children('.volume').children('li').eq(-2).prevAll('li').addClass('on');
					
					WDN.jQuery(video).siblings('.wdnVideo_controls').children('.progress').children('.volume').children('li').click(function(){
						volume = (WDN.jQuery(this).index() / 8);
						video.volume = volume;
						WDN.jQuery(this).prevAll('li').andSelf().addClass('on');
						WDN.jQuery(this).nextAll('li').removeClass('on');
					});
					
					WDN.videoPlayer.eventControls.eventListeners(video);
				},
				
				//Listen for events
				eventListeners : function (video) {
					video.addEventListener('play', WDN.videoPlayer.eventControls.onPlay, false);
					video.addEventListener('pause', WDN.videoPlayer.eventControls.onPause, false);
					video.addEventListener('ended', WDN.videoPlayer.eventControls.onEnd, false);
					video.addEventListener('volumechange', WDN.videoPlayer.eventControls.onVolumeChange, false);
					video.addEventListener('error',WDN.videoPlayer.eventControls.onError, false);
					//video.addEventListener('mousemove',WDN.videoPlayer.eventControls.showControls, false);
					//video.addEventListener('mouseout',WDN.videoPlayer.eventControls.hideControls, false);
				},
				
				//functions for when events are triggered
				onPlayControlClick : function(event, video) {
					if (video === undefined) {
						video = event.target;
					}
					if(video.paused || video.ended) {
						video.play();
						WDN.jQuery(video).siblings('.wdnVideo_controls').children('.play_pause').attr('value', 'playing').removeClass('play').addClass('pause').children('span').text('Pause');
						WDN.videoPlayer.eventControls.trackPlayProgress(video);
					} else {
						video.pause();
						WDN.jQuery(video).siblings('.wdnVideo_controls').children('.play_pause').attr('value', 'paused').removeClass('pause').addClass('play').children('span').text('Play');
						WDN.videoPlayer.eventControls.stopTrackPlayProgress(video);
					}
				},
				
				onPlay : function(event) {
					video = event.target;
					
					WDN.log("We just played "+video.src);
				},
				
				onPause : function(event) {
					video = event.target;
					
					WDN.log("We just paused "+video.src);
				},
				
				onEnd : function(event) {
					video = event.target;
					WDN.videoPlayer.eventControls.stopTrackPlayProgress(video);
					WDN.log("video is over");
				},
				
				onVolumeChange : function(event){
					video = event.target;
					WDN.log("volume change");
				},
				
				onError : function(event) { // See: http://www.whatwg.org/specs/web-apps/current-work/multipage/video.html#error-codes
					video = event.target;
					WDN.log("Rats, after all of this and we get an error playing the video.");
					WDN.videoPlayer.createFallback(video); // fallback to the Flash option
				},
				
				trackPlayProgress : function(video) {
					playProgressInterval = setInterval("WDN.videoPlayer.eventControls.updatePlayProgress(video)", 30);
				},
				
				stopTrackPlayProgress : function(video) {
					clearInterval(playProgressInterval);
				},
				
				updatePlayProgress : function(video) { //update time and progress bar
					WDN.jQuery(video).siblings('.wdnVideo_controls').children('.progress').children('.time').html(WDN.videoPlayer.eventControls.formatTime(video.currentTime)).siblings('.progressBar').children('span').css('width', (video.currentTime / video.duration)*100+'%');
				},
				
				scrubVideo : function (clickX, video){ //clickX is X location of the user's click
					progressBarLocation = WDN.jQuery(video).siblings('.wdnVideo_controls').children('.progress').children('.progressBar').offset();
					progressBarWidth = WDN.jQuery(video).siblings('.wdnVideo_controls').children('.progress').children('.progressBar').width();
					newPercent = Math.max(0, Math.min(1, (clickX - progressBarLocation.left) / progressBarWidth));
					video.currentTime = newPercent * video.duration;
					WDN.videoPlayer.eventControls.updatePlayProgress(video);
				},
				
				formatTime : function(seconds) {
					seconds = Math.round(seconds);
					minutes = Math.floor(seconds / 60);
					minutes = (minutes >= 10) ? minutes : "0" + minutes;
					seconds = Math.floor(seconds % 60);
					seconds = (seconds >= 10) ? seconds : "0" + seconds;
					return minutes + ":" + seconds;
				},
				
				fullScreenOn : function(video) {
					video.height = window.innerHeight;
					video.width = window.innerWidth;
					WDN.jQuery(video).css({'width' : window.innerWidth + "px", 'height' : window.innerHeight + "px", 'position' : 'fixed', 'left' : '0', 'top' : '0', 'z-index' : '9999999999' });
					WDN.jQuery(video).siblings('.wdnVideo_controls').css({'z-index' : '99999999999', 'position' : 'fixed' });
				},
				
				fullScreenOff : function(video, originalWidth, originalHeight, originalZIndex) {
					video.height = originalHeight;
					video.width = originalWidth;
					WDN.jQuery(video).removeAttr('style');
					WDN.jQuery(video).css({'width' : originalWidth + "px", 'height' : originalHeight + "px", 'position' : 'relative', 'left' : '0', 'top' : '0', 'z-index' : originalZIndex });
					WDN.jQuery(video).siblings('.wdnVideo_controls').css({'z-index' : originalZIndex, 'position' : 'relative' });
				},
				
				showControls: function(event) {
					video = event.target;
					WDN.jQuery(video).siblings('.wdnVideo_controls').fadeIn();
					WDN.videoPlayer.setupControls.positionControls(video);
				},
				
				hideControls : function(event) {
					video = event.target;
					WDN.jQuery(video).siblings('.wdnVideo_controls').fadeOut();
				}
			};
		}()
	};
}();