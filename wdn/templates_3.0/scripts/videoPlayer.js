/**
 * This plugin is intended for videos.
 * 
 * 1. Check for HTML5 video browser capability
 * 2. Setup HTML5 element or Flash alternative
 * 3. if HTML5, use custom video controls
 * 
 */
WDN.videoPlayer = function() {
	var i = 0;
	return {
		
		initialize : function() {
			WDN.jQuery('video').each(function(){
				var video = WDN.jQuery(this)[0];
				WDN.videoPlayer.html5Video(video);
				i++;
			});
			
		},
		
		supportsVideo: function() {
			return (!!document.createElement('video').canPlayType);
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
			var requiresFallback = true;
			if (WDN.videoPlayer.supportsH264() || WDN.videoPlayer.supportsWebM()){ //can we support H264 or WebM?
				if(video.src || WDN.jQuery(video).children('source')){ //make sure we have a source
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
				src = video.src || WDN.toAbs(WDN.jQuery(video).children('source').attr('src'), window.location.toString()) || "";
				poster = video.poster || "";
				width = video.width || WDN.jQuery(video).width();
				height = video.height || WDN.jQuery(video).height();
				WDN.jQuery(video).wrap("<div id='wdnVideo_"+i+"' />");
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
					},
					height: height,
					width: width,
					id: 'jwPlayer_'+i,
					name: 'jwPlayer_'+i
				}); 
				WDN.jQuery(video).remove();
			});
		},
		
		setupControls : function(){
			return {
				
				initialize : function(video) { //setup custom HTML5 video player
					video.preload = "auto";
					video.autobuffer = true;
					video.controls = false; //remove the standard browser controls
					WDN.jQuery(video).after(WDN.videoPlayer.setupControls.wdnVideo_Controls);
					WDN.videoPlayer.setupControls.positionControls(video);
					WDN.videoPlayer.eventControls.bindControls(video);
				}, 
			
				//setup the HTML to house the controls
				wdnVideo_Controls : 
					  '<div class="wdnVideo_controls">' +
					  '<button class="play_pause play" value="paused" type="button">' +
					  '	<span></span>' +
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
			var playProgressInterval;
			var hideControls;
			
			return {
				
				bindControls : function(video) {
					//clicking the video
					WDN.jQuery(video).click(function(){
						WDN.videoPlayer.eventControls.togglePlay(this);
					});
				
					//play and pause
					WDN.jQuery(video).siblings('.wdnVideo_controls').children('.play').click(function(){
						WDN.videoPlayer.eventControls.togglePlay(video);
						return false;
					});
					
					//video scrub
					WDN.jQuery(video).siblings('.wdnVideo_controls').children('.progress').children('.progressBar').bind({
						'mousedown': function(event){
							if (video.paused || video.ended) {
					          var videoWasPlaying = false;
					        } else {
					          var videoWasPlaying = true;
					          video.pause();
					        }
	
							document.body.focus();
							WDN.jQuery(document).bind({
								'selectstart.wdnvideo': function () { return false; },
								'mousemove.wdnvideo': function(e){
									WDN.videoPlayer.eventControls.scrubVideo(e.pageX, video);
								},
								'mouseup.wdnvideo': function() {
									WDN.jQuery(document).unbind('.wdnvideo');
									if (videoWasPlaying) {
										video.play();
									}
								}
							});
						},
						'mouseup': function(event){
							WDN.videoPlayer.eventControls.scrubVideo(event.pageX, video);
						}
					});
					//fullscreen controls
					var videoIsFullScreen = false;
					var originalWidth = video.width;
					var originalHeight = video.height;
					var originalZIndex = WDN.jQuery(video).css('z-index');
					WDN.jQuery(video).siblings('.wdnVideo_controls').children('.progress').children('.fullscreen').click(function(){
						if (!videoIsFullScreen) {
							WDN.videoPlayer.eventControls.fullScreenOn(video);
							videoIsFullScreen = true;
							hideControls = setTimeout(function() {
								WDN.videoPlayer.eventControls.hideControls(video);
							}, 600);
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
					
					//show and hide the controls
					WDN.jQuery(video).hover(
						function() {
							if(hideControls) {
								clearTimeout(hideControls);
							};
							WDN.videoPlayer.eventControls.showControls(video);
						},
						function() {
							hideControls = setTimeout(function() {
								WDN.videoPlayer.eventControls.hideControls(video);
							}, 600); //wait a few seconds and then hide the controls
						}
					);
					WDN.jQuery(video).siblings('.wdnVideo_controls').hover(
						function(){
							if(hideControls) {
								clearTimeout(hideControls);
							};
							WDN.jQuery(this).show();
						}
					);
					
					WDN.videoPlayer.eventControls.eventListeners(video);
				},
				
				//Listen for events
				eventListeners : function (video) {
					WDN.jQuery(video).bind({
						'play':         WDN.videoPlayer.eventControls.onPlay,
						'pause':        WDN.videoPlayer.eventControls.onPause,
						'ended':        WDN.videoPlayer.eventControls.onEnd,
						'volumechange': WDN.videoPlayer.eventControls.onVolumeChange,
						'error':        WDN.videoPlayer.eventControls.onError
					});
					WDN.jQuery(window).bind({
						'unload': WDN.videoPlayer.eventControls.onClose
					});
				},
				
				togglePlay : function(video) {
					if (video.paused) {
						video.play();
					} else {
						video.pause();
					}
				},
				
				onPlay : function(event) {
					video = event.target;
					WDN.jQuery(video).siblings('.wdnVideo_controls').children('.play_pause').attr('value', 'playing').removeClass('play').addClass('pause');
					WDN.videoPlayer.eventControls.trackPlayProgress(video);
					hideControls = setTimeout(function() {
						WDN.videoPlayer.eventControls.hideControls(video);
					}, 1900);
					WDN.log("We just played "+video.src);
				},
				
				onPause : function(event) {
					video = event.target;
					WDN.jQuery(video).siblings('.wdnVideo_controls').children('.play_pause').attr('value', 'paused').removeClass('pause').addClass('play');
					WDN.videoPlayer.eventControls.stopTrackPlayProgress(video);
					WDN.log("We just paused "+video.src);
				},
				
				onEnd : function(event) {
					video = event.target;
					video.pause();
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
					playProgressInterval = setInterval(function() {
							WDN.videoPlayer.eventControls.updatePlayProgress(video);
					}, 30);
				},
				
				stopTrackPlayProgress : function(video) {
					clearInterval(playProgressInterval);
				},
				
				updatePlayProgress : function(video) { //update time and progress bar
					WDN.jQuery(video).siblings('.wdnVideo_controls').children('.progress').children('.time').html(WDN.videoPlayer.eventControls.formatTime(video.currentTime)).siblings('.progressBar').children('span').css('width', (video.currentTime / video.duration)*100+'%');
				},
				
				scrubVideo : function (clickX, video){ //clickX is X location of the user's click
					var progressBarLocation = WDN.jQuery(video).siblings('.wdnVideo_controls').children('.progress').children('.progressBar').offset();
					var progressBarWidth = WDN.jQuery(video).siblings('.wdnVideo_controls').children('.progress').children('.progressBar').width();
					var newPercent = Math.max(0, Math.min(1, (clickX - progressBarLocation.left) / progressBarWidth));
					video.currentTime = newPercent * video.duration;
					WDN.videoPlayer.eventControls.updatePlayProgress(video);
				},
				
				formatTime : function(seconds) {
					var seconds = Math.round(seconds);
					var minutes = Math.floor(seconds / 60);
					minutes = (minutes >= 10) ? minutes : "0" + minutes;
					seconds = Math.floor(seconds % 60);
					seconds = (seconds >= 10) ? seconds : "0" + seconds;
					return minutes + ":" + seconds;
				},
				
				fullScreenOn : function(video) {
					video.height = window.innerHeight;
					video.width = window.innerWidth;
					WDN.jQuery(video).css({'width' : window.innerWidth + "px", 'height' : window.innerHeight + "px", 'position' : 'fixed', 'left' : '0', 'top' : '0', 'z-index' : '99999' });
					WDN.jQuery(video).siblings('.wdnVideo_controls').css({'z-index' : '999999', 'position' : 'fixed' });
					WDN.jQuery('body').append("<div id='videoBlackout'></div>");
				},
				
				fullScreenOff : function(video, originalWidth, originalHeight, originalZIndex) {
					video.height = originalHeight;
					video.width = originalWidth;
					WDN.jQuery(video).removeAttr('style');
					WDN.jQuery(video).css({'width' : originalWidth + "px", 'height' : originalHeight + "px", 'position' : 'relative', 'left' : '0', 'top' : '0', 'z-index' : originalZIndex });
					WDN.jQuery(video).siblings('.wdnVideo_controls').css({'z-index' : originalZIndex, 'position' : 'relative' });
					WDN.jQuery('#videoBlackout').remove();
				},
				
				showControls: function(video) {
					WDN.jQuery(video).siblings('.holder').remove();
					WDN.jQuery(video).siblings('.wdnVideo_controls').fadeTo(400, 0.8);
				},
				
				hideControls : function(video) {
					WDN.jQuery(video).siblings('.wdnVideo_controls').fadeTo(400, 0.0);
				},
				
				onClose : function(event) {
					alert("aaaa");
				}
			};
		}()
	};
}();