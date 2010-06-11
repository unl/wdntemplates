/**
 * This plugin is intended for videos.
 * 
 * 1. Check for HTML5 video browser capability
 * 2. Setup HTML5 element or Flash alternative
 * 
 */
WDN.videoPlayer = function() {
	return {
		
		initialize : function() {
			i = 0;
			WDN.jQuery('video').each(function(){
				var video = WDN.jQuery(this);
				WDN.log(video);
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
			if (WDN.videoPlayer.supportsH264()){ //can we support H264?
				if(video.attr('src') || video.children('source')){ //make sure we have a source
					requiresFallback = false;
				}
			}
			WDN.log('requiresFallback: '+requiresFallback);
			if (requiresFallback){
				WDN.videoPlayer.createFallback(video);
			} else {
				WDN.videoPlayer.setupControls(video);
			}
		},
		
		createFallback : function(video) { //call the flash player option
			WDN.loadJS('/wdn/templates_3.0/scripts/plugins/swfobject/jQuery.swfobject.1.0.9.js', function(){
				src = video.attr('src') || video.children('source').attr('src') || "";
				poster = video.attr('poster') || "";
				width = video.attr('width') || video.width();
				height = video.attr('height') || video.height();
				video.wrap("<div id='wdnVideo_"+i+"' />");
				video.remove();
				WDN.jQuery('#wdnVideo_'+i).flash({     
					swf: '/wdn/templates_3.0/includes/swf/player4.3.swf',   // these arguments will be passed into the flash document 
					allowfullscreen: 'true',
					allowscriptaccess: 'always',
					flashvars: {   
						'file': src,   //relative to the player.swf
						'image': poster,   //relative to index.html
						'skin': '/wdn/templates_3.0/includes/swf/UNLVideoSkin.swf',   //relative to index.html
						'autostart': 'false',
						'controlbar': 'over'
						//stretching: 'exactfit',
					},
					height: height ,
					width: width,
					id: 'jwPlayer'+i,
					name: 'jwPlayer'+i
				});  
			});
			
		},
		
		setupControls : function(video) { //setup custom HTML5 video player
			
		}
	};
}();