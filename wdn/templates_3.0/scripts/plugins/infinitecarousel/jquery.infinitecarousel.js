/*
 * jQuery Infinite Carousel
 * @author admin@catchmyfame.com - http://www.catchmyfame.com
 * @version 2.0.2
 * @date June 12, 2010
 * @category jQuery plugin
 * @copyright (c) 2009 admin@catchmyfame.com (www.catchmyfame.com)
 * @license CC Attribution-Share Alike 3.0 - http://creativecommons.org/licenses/by-sa/3.0/
 * 
 * UNL Changes:
 * http://gforge.unl.edu/gf/project/wdntemplates/scmsvn/?action=browse&path=/trunk/wdn/templates_3.0/scripts/plugins/infinitecarousel/jquery.infinitecarousel.js
 */

(function($){
	$.fn.extend({ 
		infiniteCarousel: function(options)
		{
			var defaults = 
			{
				transitionSpeed: 800,
				displayTime: 6000,
				textholderHeight: .15,
				displayProgressBar: true,
				displayThumbnails: true,
				displayThumbnailNumbers: true,
				displayThumbnailBackground: true,
				easeLeft: 'linear',
				easeRight: 'linear',
				inView: 1,
				advance: 1,
				showControls: true,
				autoHideControls: false,
				autoHideCaptions: false,
				autoStart: true,
				prevNextInternal: true,
				enableKeyboardNav: true,
				onSlideStart: function(){},
				onSlideEnd: function(){},
				onPauseClick: function(){}
			};
			var options = $.extend(defaults, options);
	
    		return this.each(function() {
    			var randID = Math.round(Math.random()*100000000);
			var o=options;
			var obj = $(this);
			var autopilot = o.autoStart;

			var numImages = $('img', obj).length; // Number of images
			var imgHeight = $('img:first', obj).height();
			var imgWidth = $('img:first', obj).width();

			if(o.inView > numImages-1) o.inView=numImages-1; // check to make sure inview isnt greater than the number of images. inview should be at least two less than numimages (otherwise hinting wont work and animating left may catch a flash), but one less can work
			$('p', obj).hide(); // Hide any text paragraphs in the carousel
			$(obj).addClass('ic-wrapper');
			$(obj).width(imgWidth*o.inView).height(imgHeight);
			$('ul', obj).width(imgWidth*numImages);

			// Build progress bar
			if(o.displayProgressBar)
			{
				$(obj).append('<div id="progress'+randID+'" class="ic-progress-bar" />');
			}

			// Animate progress bar
			function startProgressBar(barTime)
			{
				barTime = barTime || o.displayTime;
				$('#progress'+randID).css({'width':null, 'height':null});
				$('#progress'+randID).animate({'width':0}, barTime);
			}

			// Build textholder div(s) as wide as one image and as tall as the textholderHeight option
			var containerBorder = parseInt($(obj).css('border-bottom-width')) + parseInt($(obj).css('border-top-width'));
			if(isNaN(containerBorder)) containerBorder = 0; // IE returns NaN for $(obj).css('border-bottom-width')
			var containerPaddingLeft = parseInt($(obj).css('padding-left')); // Normally we'd do both left and right but only left matters here
			for(i=1;i<=o.inView;i++)
			{
				$('<div id="textholder'+randID+'_'+i+'" class="textholder"><span /></div>').css({
					'width':imgWidth,
					'height':imgHeight*o.textholderHeight,
					'margin-bottom':-(imgHeight*o.textholderHeight+containerBorder),
					'left':(i-1)*imgWidth,
					'margin-left':containerPaddingLeft
				}).appendTo(obj);
				html = '<div class="minmax" id="minmax'+randID+'_'+i+'" />';
				html += '<div class="close" id="close'+randID+'_'+i+'" />';
				$('#textholder'+randID+'_'+i).append(html);
				$('#minmax'+randID+'_'+i).hide();
				$('#close'+randID+'_'+i).hide();
				if(!o.autoHideCaptions) showtext($('li:eq('+i+') p', obj).html(),i);
			}
			var textholderPadding = parseInt($('#textholder'+randID+'_1').css('padding-left')) + parseInt($('#textholder'+randID+'_1').css('padding-right'));
			if (textholderPadding > 0) $('.textholder',obj).width(imgWidth-textholderPadding);

			$('.close',obj).each(function(i){
				$(this).click(function(){$('#textholder'+randID+'_'+(i+1)).animate({marginBottom:(-imgHeight*o.textholderHeight)-containerBorder-12+'px'},500);});
			});
			$('.minmax',obj).each(function(i){
				$(this).click(function(){
					if(parseInt($('#textholder'+randID+'_'+(i+1)).css('margin-bottom'))==0)
					{
						$('#textholder'+randID+'_'+(i+1)).animate({marginBottom:((-imgHeight*o.textholderHeight)-containerBorder+12)+'px'},500,function(){
							$('#minmax'+randID+'_'+(i+1)).addClass('min');});
					}
					else
					{
						$('#textholder'+randID+'_'+(i+1)).animate({marginBottom:'0px'},500,function(){
							$('#minmax'+randID+'_'+(i+1)).removeClass('min');});
					}

				});
			});

			function showtext(t,i)
			{
				if(autopilot)
				{
					$('#minmax'+randID+'_'+i).hide();
					$('#close'+randID+'_'+i).hide();
				}
				if(t != null)
				{
					$('#textholder'+randID+'_'+i+' span').html(t); // Change textholder content
					$('#textholder'+randID+'_'+i).stop().animate({marginBottom:'0px'},500); // Raise textholder
					$('#minmax'+randID+'_'+i).removeClass('min');
					showminmax();
				}
			}

			function showminmax()
			{
				if(!autopilot)
				{
					$('.minmax',obj).fadeIn(250);
					$('.close',obj).fadeIn(250);
				}
			}

			function hideCaption() {$('.textholder',obj).stop().animate({marginBottom:(-imgHeight*o.textholderHeight-containerBorder-12)+'px'},o.transitionSpeed);}

			if(o.displayThumbnails)
			{
				function thumbclick(event)
				{
					target_num = this.id.split('_'); // we want target_num[1]
					if(viewable[0] != target_num[1])
					{
						status='pause';
						$('#progress'+randID).stop().fadeOut();
						clearTimeout(clearInt);
						$('#thumbs'+randID+' div').css({'cursor':'default'}).unbind('click'); // Unbind the thumbnail click event until the transition has ended
						autopilot = 0;
						setTimeout(function(){$('#play_pause_btn'+randID).addClass('play');},o.transitionSpeed);
						$('#play_pause_btn'+randID).unbind('click').bind('click',function(){forceStart();});
					}
					if(target_num[1] > viewable[0])
					{
						diff = target_num[1] - viewable[0];
						moveLeft(diff);
					}
					if(target_num[1] < viewable[0])
					{
						diff = viewable[0]- target_num[1];
						moveRight(diff);
					}
				}

				var viewable = []; // track which images are being displayed
				var unviewable = []; // track which images are being displayed
				// Build thumbnail viewer and thumbnail divs
				$(obj).after('<div id="thumbs'+randID+'" class="thumb-wrapper" />');
				for(i=0;i<numImages;i++)
				{
					thumb = $('img:eq('+(i)+')', obj).attr('src');
					var thumbDiv = $('<div class="thumb" id="thumb'+randID+'_'+(i+1)+'" />');
					thumbDiv.hover(function(){
						$(this).animate({'opacity':activeOpacity},150);
					}, function(){
						if ($.inArray(parseInt(this.id.split('_')[1]), viewable) < 0) {
							$(this).animate({'opacity':inactiveOpacity},250, function() {
								$(this).css('opacity', null);
							});
						} else {
							$(this).css('opacity', null);
						}
					}).bind('click', thumbclick);
					if (thumb && o.displayThumbnailBackground) {
						thumbDiv.css({'background-image':'url('+thumb+')'});
					}
					if (o.displayThumbnailNumbers) {
						thumbDiv.text(i+1);
					}
					$('#thumbs'+randID).append(thumbDiv);
					if(i<=o.inView) $('#thumb'+randID+'_'+i).addClass('active');
					var activeOpacity = $('#thumbs'+randID+' div.thumb.active').css('opacity') || 1;
					var inactiveOpacity = $('#thumbs'+randID+' div.thumb:not(.active)').css('opacity') || 0.65;
					unviewable.push(i+1);
				}
				// Initialize viewable/unviewable arrays
				for(i=1;i<=o.inView;i++) viewable.push(unviewable.shift());
			}
			
			// Move rightmost image over to the left (after thumb creation to prevent workaround calls)
			$('li:last', obj).prependTo($('ul', obj));
			$('ul', obj).css('left',-imgWidth+'px');

			if(o.showControls)
			{
				// Pause/play button(img)
				$('<div class="playpause" id="play_pause_btn'+randID+'" />').appendTo(obj);
				var status = 'play';
				var inactivePlayOpacity = $('#play_pause_btn'+randID).css('opacity') || 0.5;
				$('#play_pause_btn'+randID).hover(function(){$(this).animate({opacity:'1'},250);},function(){$(this).animate({opacity:inactivePlayOpacity},250);});
				$('#play_pause_btn'+randID).click(function(){
					status = (status == 'play') ? 'pause':'play';
					(status=='play') ? forceStart():forcePause();
				});

				if(!o.prevNextInternal)
				{
					wrapID = $(obj).attr('id')+'Wrapper';
					$(obj).wrap('<div id="'+wrapID+'"></div>').css('margin','0 auto');
					$('#'+wrapID).css('position','relative').width(($(obj).width()+40+parseInt($(obj).css('padding-left'))+parseInt($(obj).css('padding-right'))));
				}

				// Prev/next button(img)
				var arrowsTop = ((imgHeight/2)-15);
				$('<div id="btn_rt'+randID+'" class="btn_rt" />').css({'top':arrowsTop+'px'}).appendTo((o.prevNextInternal) ? obj : $('#'+wrapID));
				$('<div id="btn_lt'+randID+'" class="btn_lt" />').css({'top':arrowsTop+'px'}).appendTo((o.prevNextInternal) ? obj : $('#'+wrapID));
				
				var inactivePrevNextOpacity = $('#btn_rt'+randID).css('opacity') || 0.5;
				$('#btn_rt'+randID).click(function(){
					forcePrevNext('next');
				}).hover(function(){$(this).animate({opacity:'1'},250);},function(){$(this).animate({opacity:inactivePrevNextOpacity},250);});
				$('#btn_lt'+randID).click(function(){
					forcePrevNext('prev');
				}).hover(function(){$(this).animate({opacity:'1'},250);},function(){$(this).animate({opacity:inactivePrevNextOpacity},250);});

				if(o.autoHideControls && o.prevNextInternal)
				{
					function showcontrols()
					{
						$('#play_pause_btn'+randID).stop().animate({top:'3px',right:'3px'},250);
						$('#btn_rt'+randID).stop().animate({top:arrowsTop+'px',right:'2px'},250);
						$('#btn_lt'+randID).stop().animate({top:arrowsTop+'px',left:'2px'},250);
					}
					function hidecontrols()
					{
						$('#play_pause_btn'+randID).stop().animate({top:-16-containerBorder+'px',right:-16-containerBorder+'px'},250);
						$('#btn_rt'+randID).stop().animate({right:'-16px'},250);
						$('#btn_lt'+randID).stop().animate({left:'-16px'},250);
					}
					$(obj).hover(showcontrols,hidecontrols);
					hidecontrols();
				}
				if(o.autoHideCaptions)
				{
					var isHover;
					function autoShowCap(){isHover=true;for(i=1;i<=o.inView;i++) showtext($('li:eq('+i+') p', obj).html(),i);}
					function autoHideCap(){isHover=false;hideCaption();}
					$(obj).hover(autoShowCap,autoHideCap);
					hideCaption();
				}
			}

			function keyBind(){
				if(o.enableKeyboardNav)
				{
					$(document).bind('keydown.ic', function(event){
						if(event.keyCode == 39)
						{
							forcePrevNext('next');
							$(document).unbind('keydown.ic');
						}
						if(event.keyCode == 37)
						{
							forcePrevNext('prev');
							$(document).unbind('keydown.ic');
						}
						if(event.keyCode == 80 || event.keyCode == 111) forcePause();
						if(event.keyCode == 83 || event.keyCode == 115)
						{
							forceStart();
							$(document).unbind('keydown.ic');
						}
					});
				}
			}

			function forcePrevNext(dir)
			{
				o.onPauseClick.call(this);
				$('#btn_rt'+randID).unbind('click');
				$('#btn_lt'+randID).unbind('click');
				setTimeout(function(){$('#play_pause_btn'+randID).addClass('play');},o.transitionSpeed-1);
				autopilot = 0;
				$('#progress'+randID).stop().fadeOut();
				status='pause';
				clearTimeout(clearInt);
				(dir=='prev') ? moveRight():moveLeft();
				$('#play_pause_btn'+randID).unbind('click');
				setTimeout(function(){
						$('#play_pause_btn'+randID).bind('click',function(){forceStart();});
						$('#btn_rt'+randID).bind('click',function(){forcePrevNext('next');});
						$('#btn_lt'+randID).bind('click',function(){forcePrevNext('prev');});
					},o.transitionSpeed);
			}

			function forcePause()
			{
				$('#play_pause_btn'+randID).unbind('click'); // unbind the click, wait for transition, then reenable
				if(autopilot)
				{
					o.onPauseClick.call(this);
					$('#play_pause_btn'+randID).fadeTo(250,0,function(){$(this).addClass('play').css({'opacity':inactivePlayOpacity});}).animate({opacity:inactivePlayOpacity},250);
					autopilot = 0;
					showminmax();
					$('#progress'+randID).stop().fadeOut();
					clearTimeout(clearInt);
					setTimeout(function(){$('#play_pause_btn'+randID).bind('click',function(){forceStart();});},o.transitionSpeed);
				}
			}

			function forceStart()
			{
				$('#play_pause_btn'+randID).unbind('click'); // unbind the click, wait for transition, then reenable
				if(!autopilot)
				{
					setTimeout(function(){$('#play_pause_btn'+randID).removeClass('play');},o.transitionSpeed-1);
					autopilot = 1;
					moveLeft();
					clearInt=setInterval(function(){moveLeft();},o.displayTime+o.transitionSpeed);
					setTimeout(function(){$('#play_pause_btn'+randID).bind('click',function(){forcePause();});},o.transitionSpeed);
				}
			}

			function preMove()
			{
				hideCaption();
				// Fade out play/pause/left/right
				if(o.showControls && o.prevNextInternal)
				{
					$('#play_pause_btn'+randID).fadeOut(200);
					$('#btn_lt'+randID).fadeOut(200);
					$('#btn_rt'+randID).fadeOut(200);
				}
				if(o.displayThumbnails) for(i=1;i<=numImages;i++) $('#thumb'+randID+'_'+i).removeClass('active');
			}

			function postMove()
			{
				if(o.showControls && o.prevNextInternal)
				{
					$('#play_pause_btn'+randID).fadeIn(200);
					$('#btn_lt'+randID).fadeIn(200);
					$('#btn_rt'+randID).fadeIn(200);
				}
				keyBind();
				if(o.autoHideCaptions && isHover) autoShowCap();
				if(o.displayThumbnails) for(i=0;i<viewable.length;i++) $('#thumb'+randID+'_'+viewable[i]).addClass('active');
				if(!o.autoHideCaptions) for(i=1;i<=o.inView;i++) showtext($('li:eq('+i+') p', obj).html(),i);
				if(o.displayThumbnails) $('#thumbs'+randID+' div').unbind('click').bind('click', thumbclick).css({'cursor':'pointer'});
				ary=[];
				for(x=1;x<=o.inView;x++){ary.push($('img:eq('+x+')',obj).attr('src'));}
				o.onSlideEnd.call(this,ary);
			}

			function moveLeft(dist)
			{
				if(dist==null) dist=o.advance;
				preMove();
				if(o.displayThumbnails)
				{
					for(i=1;i<=dist;i++){
						viewable.push(unviewable.shift());
						unviewable.push(viewable.shift());
					}
				}
				if(o.displayTime == 0){clearInterval(clearInt);} // If running a contonuous show with no display time, fist clear the interval. Then below, recursively call moveLeft
				o.onSlideStart.call(this,viewable,'left');
				if (dist == numImages - 1) {
					$('li:eq(0)', obj).insertAfter($('li:last', obj));
					$('ul', obj).css({left:0});
					dist -= 1;
				}
				
				$('ul', obj).animate({left:-imgWidth*(dist+1)},o.transitionSpeed,o.easeLeft,function(){ // Animate the entire list to the left
					$('li:lt('+dist+')', obj).insertAfter($('li:last', obj)); // Move the first image (offscreen to the left) to the end of the list (offscreen to the right)
					$(this).css({'left':-imgWidth});
					if(o.displayProgressBar && autopilot) startProgressBar();
					postMove();
					if(o.displayTime == 0){moveLeft();}
				});
			}
			function moveRight(dist)
			{
				if(dist==null) dist=o.advance;
				preMove();
				if(o.displayThumbnails)
				{
					for(i=1;i<=dist;i++){
						viewable.unshift(unviewable.pop());
						unviewable.unshift(viewable.pop());
					}
				}
				
				//Need to move the last image back to the front
				var gt = dist;
				if (dist == numImages - 1) {
					$('li:eq(0)', obj).insertAfter($('li:last', obj));
					$('ul', obj).css({left:0});
					dist -= 1;
					var cleanup = 0;
				} else {
					var cleanup = 1;
				}
				
				$('li:gt('+(numImages-(gt+1))+')', obj).insertBefore($('li:first', obj)); // Move rightmost (last) li to after the first li
				o.onSlideStart.call(this,viewable,'right');
				$('ul', obj).css({left:-(imgWidth*(dist+1))}).animate({left:-imgWidth*cleanup},o.transitionSpeed,o.easeRight,function(){
					if (!cleanup) {
						$('li:last', obj).prependTo($('ul', obj));
						$('ul', obj).css('left',-imgWidth+'px');
					}
					postMove();
				});
			}

			// Kickoff the show
			if(autopilot)
			{
				var clearInt = setInterval(function(){moveLeft();},o.displayTime+o.transitionSpeed);
				if(o.displayProgressBar) startProgressBar(o.displayTime+o.transitionSpeed);
			} else {status='pause';$('#play_pause_btn'+randID).addClass('play');}
			keyBind();
 		});
	}
	});
})(WDN.jQuery);