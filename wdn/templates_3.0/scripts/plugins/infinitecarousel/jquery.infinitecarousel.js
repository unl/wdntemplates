/*
 * jQuery Infinite Carousel
 * @author admin@catchmyfame.com - http://www.catchmyfame.com
 * @version 2.0.1
 * @date April 7, 2010
 * @category jQuery plugin
 * @copyright (c) 2009 admin@catchmyfame.com (www.catchmyfame.com)
 * @license CC Attribution-Share Alike 3.0 - http://creativecommons.org/licenses/by-sa/3.0/
 * 
 * UNL Changes:
 * http://its-gforge.unl.edu/gf/project/wdntemplates/scmsvn/?action=browse&path=/trunk/wdn/templates_3.0/scripts/plugins/infinitecarousel/jquery.infinitecarousel.js
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
				thumbnailWidth: '20px',
				thumbnailHeight: '20px',
				thumbnailFontSize: '.7em',
				easeLeft: 'linear',
				easeRight: 'linear',
				imagePath: '/js/infinitecarousel/images/',
				inView: 1,
				padding: '0px',
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
			$(obj).css({'position':'relative','overflow':'hidden'}).width((imgWidth*o.inView)+(o.inView*parseInt(o.padding)*2)).height(imgHeight+(parseInt(o.padding)*2)); //,'overflow':'hidden'
			$('ul', obj).css({'list-style':'none','margin':'0','padding':'0','position':'relative'}).width(imgWidth*numImages);
			$('li', obj).css({'display':'inline','float':'left','padding':o.padding});

			// Move rightmost image over to the left
			$('li:last', obj).prependTo($('ul', obj));
			$('ul', obj).css('left',-imgWidth-(parseInt(o.padding)*2)+'px').width(9999);

			// Build progress bar
			if(o.displayProgressBar)
			{
				$(obj).append('<div id="progress'+randID+'" class="ic-progress-bar" style="position:absolute;bottom:0;background:#bbb;left:0;z-index:1"></div>');
				$('#progress'+randID).width('100%').height(5).css('opacity','.6');
			}

			// Animate progress bar
			function startProgressBar(barTime)
			{
				barTime = (barTime==null)? o.displayTime:barTime;
				$('#progress'+randID).width('100%').height(5);
				$('#progress'+randID).animate({'width':0},barTime);
			}

			// Build textholder div(s) as wide as one image and as tall as the textholderHeight option
			var containerBorder = parseInt($(obj).css('border-bottom-width')) + parseInt($(obj).css('border-top-width'));
			if(isNaN(containerBorder)) containerBorder = 0; // IE returns NaN for $(obj).css('border-bottom-width')
			var containerPaddingLeft = parseInt($(obj).css('padding-left')); // Normally we'd do both left and right but only left matters here
			for(i=1;i<=o.inView;i++)
			{
				$(obj).append('<div id="textholder'+randID+'_'+i+'" class="textholder" style="position:absolute;width:'+imgWidth+'px;bottom:0px;margin-bottom:'+-(imgHeight*o.textholderHeight+containerBorder)+'px;"><span></span></div>');
				$('#textholder'+randID+'_'+i).css({'left':(i-1)*(imgWidth+parseInt(o.padding)*2),'margin-left':parseInt(o.padding)+containerPaddingLeft,'margin-right':o.padding});
				$('#textholder'+randID+'_'+i).height(imgHeight*o.textholderHeight);
				html = '<div class="minmax" id="minmax'+randID+'_'+i+'" style="width:8px;height:8px;position:absolute;top:1px;right:10px;cursor:pointer;background:url('+o.imagePath+'caption.gif) no-repeat 0 -8px"></div>';
				html += '<div class="close" id="close'+randID+'_'+i+'" style="width:8px;height:8px;position:absolute;top:1px;right:1px;cursor:pointer;background:url('+o.imagePath+'caption.gif) no-repeat 0 0"></div>';
				$('#textholder'+randID+'_'+i).append(html);
				$('#minmax'+randID+'_'+i).hide();
				$('#close'+randID+'_'+i).hide();
				if(!o.autoHideCaptions) showtext($('li:eq('+i+') p', obj).html(),i);
			}
			var textholderPadding = parseInt($('#textholder'+randID+'_1').css('padding-left')) + parseInt($('#textholder'+randID+'_1').css('padding-right'));
			if (textholderPadding > 0) $('.textholder',obj).width(imgWidth-textholderPadding);

			$('.close',obj).each(function(i){ // Need to use each() because a loop doesn't work in this situation. see http://www.bennadel.com/blog/534-The-Beauty-Of-The-jQuery-Each-Method.htm
				$(this).click(function(){$('#textholder'+randID+'_'+(i+1)).animate({marginBottom:(-imgHeight*o.textholderHeight)-containerBorder-12+'px'},500)});
			});
			$('.minmax',obj).each(function(i){ // Same reason as previous chunk
				$(this).click(function(){
					if(parseInt($('#textholder'+randID+'_'+(i+1)).css('margin-bottom'))==0)
					{
						$('#textholder'+randID+'_'+(i+1)).animate({marginBottom:((-imgHeight*o.textholderHeight)-containerBorder+12)+'px'},500,function(){
							$('#minmax'+randID+'_'+(i+1)).css('background-position','0 -16px')});
					}
					else
					{
						$('#textholder'+randID+'_'+(i+1)).animate({marginBottom:'0px'},500,function(){
							$('#minmax'+randID+'_'+(i+1)).css('background-position','0 -8px')});
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
					$('#minmax'+randID+'_'+i).css('background-position','0 -8px');
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

			function hideCaption() {$('.textholder',obj).stop().animate({marginBottom:(-imgHeight*o.textholderHeight-containerBorder-12)+'px'},o.transitionSpeed)}

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
						setTimeout(function(){$('#play_pause_btn'+randID).css('background-position','0 -16px')},o.transitionSpeed);
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
				$(obj).after('<div id="thumbs'+randID+'" style="position:relative;overflow:auto;clear:left;text-align:left;padding-top:5px;"></div>');
				for(i=0;i<=numImages-1;i++)
				{
					thumb = $('img:eq('+(i+1)+')', obj).attr('src');
					$('#thumbs'+randID).append('<div class="thumb" id="thumb'+randID+'_'+(i+1)+'" style="cursor:pointer;background-image:url('+thumb+');background-size:auto 100%;-moz-background-size:auto 100%;-webkit-background-size:auto 100%;display:inline;float:left;width:'+o.thumbnailWidth+';height:'+o.thumbnailHeight+';line-height:'+o.thumbnailHeight+';padding:0;overflow:hidden;text-align:center;border:2px solid #ccc;margin-right:4px;font-size:'+o.thumbnailFontSize+';font-family:Arial;color:#000;text-shadow:0 0 3px #fff">'+(i+1)+'</div>');
					if(i<=o.inView) $('#thumb'+randID+'_'+i).css({'border-color':'#ff0000'});
					unviewable.push(i+1);
				}
				// Initialize viewable/unviewable arrays
				for(i=1;i<=o.inView;i++) viewable.push(unviewable.shift());

				// Next two lines are a special case to handle the first list element which was originally the last
				thumb = $('img:first', obj).attr('src');
				$('#thumb'+randID+'_'+numImages).css({'background-image':'url('+thumb+')'});
				$('#thumbs'+randID+' div.thumb:not(:first)').css({opacity:.65}); // makes all thumbs 65% opaque except the first one

				$('#thumbs'+randID+' div.thumb').hover(function(){$(this).animate({'opacity':1},150)},function(){if(viewable[0]!=this.id.split('_')[1]) $(this).animate({'opacity':.65},250)}); // add hover to thumbs
				// Assign click handler for the thumbnails. Normally the format $('.thumb') would work but since it's outside of our object (obj) it would get called multiple times
				$('#thumbs'+randID+' div').bind('click', thumbclick); // We use bind instead of just plain click so that we can repeatedly remove and reattach the handler
				
				if(!o.displayThumbnailNumbers) $('#thumbs'+randID+' div').text('');
				if(!o.displayThumbnailBackground) $('#thumbs'+randID+' div').css({'background-image':'none'});
			}

			if(o.showControls)
			{
				// Pause/play button(img)
				html = '<div id="play_pause_btn'+randID+'" style="cursor:pointer;position:absolute;top:3px;right:3px;border:none;width:16px;height:16px;background:url('+o.imagePath+'playpause.gif) no-repeat 0 0"></div>';
				$(obj).append(html);
				var status = 'play';
				$('#play_pause_btn'+randID).css('opacity',.5).hover(function(){$(this).animate({opacity:'1'},250)},function(){$(this).animate({opacity:'.5'},250)});
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
				arrowsTop = ((imgHeight/2)-15)+parseInt(o.padding);
				html = '<div id="btn_rt'+randID+'" style="position:absolute;right:2px;top:'+arrowsTop+'px;cursor:pointer;border:none;width:13px;height:30px;background:url('+o.imagePath+'leftright.gif) no-repeat 0 0"></div>';
				html += '<div id="btn_lt'+randID+'" style="position:absolute;left:2px;top:'+arrowsTop+'px;cursor:pointer;border:none;width:13px;height:30px;background:url('+o.imagePath+'leftright.gif) no-repeat -13px 0"></div>';
				(o.prevNextInternal) ? $(obj).append(html):$('#'+wrapID).append(html);

				$('#btn_rt'+randID).css('opacity',.5).click(function(){
					forcePrevNext('next');
				}).hover(function(){$(this).animate({opacity:'1'},250)},function(){$(this).animate({opacity:'.5'},250)});
				$('#btn_lt'+randID).css('opacity',.5).click(function(){
					forcePrevNext('prev');
				}).hover(function(){$(this).animate({opacity:'1'},250)},function(){$(this).animate({opacity:'.5'},250)});

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
					$(document).keydown(function(event){
						if(event.keyCode == 39)
						{
							forcePrevNext('next');
							$(document).unbind('keydown');
						}
						if(event.keyCode == 37)
						{
							forcePrevNext('prev');
							$(document).unbind('keydown');
						}
						if(event.keyCode == 80 || event.keyCode == 111) forcePause();
						if(event.keyCode == 83 || event.keyCode == 115)
						{
							forceStart();
							$(document).unbind('keydown');
						}
					});
				}
			}

			function forcePrevNext(dir)
			{
				o.onPauseClick.call(this);
				$('#btn_rt'+randID).unbind('click');
				$('#btn_lt'+randID).unbind('click');
				setTimeout(function(){$('#play_pause_btn'+randID).css('background-position','0 -16px')},o.transitionSpeed-1);
				autopilot = 0;
				$('#progress'+randID).stop().fadeOut();
				status='pause';
				clearTimeout(clearInt);
				(dir=='prev') ? moveRight():moveLeft();
				$('#play_pause_btn'+randID).unbind('click');
				setTimeout(function(){
						$('#play_pause_btn'+randID).bind('click',function(){forceStart();});
						$('#btn_rt'+randID).bind('click',function(){forcePrevNext('next')});
						$('#btn_lt'+randID).bind('click',function(){forcePrevNext('prev')});
					},o.transitionSpeed);
			}

			function forcePause()
			{
				$('#play_pause_btn'+randID).unbind('click'); // unbind the click, wait for transition, then reenable
				if(autopilot)
				{
					o.onPauseClick.call(this);
					$('#play_pause_btn'+randID).fadeTo(250,0,function(){$(this).css({'background-position':'0 -16px','opacity':'.5'});}).animate({opacity:.5},250);
					autopilot = 0;
					showminmax();
					$('#progress'+randID).stop().fadeOut();
					clearTimeout(clearInt);
					setTimeout(function(){$('#play_pause_btn'+randID).bind('click',function(){forceStart();})},o.transitionSpeed);
				}
			}

			function forceStart()
			{
				$('#play_pause_btn'+randID).unbind('click'); // unbind the click, wait for transition, then reenable
				if(!autopilot)
				{
					setTimeout(function(){$('#play_pause_btn'+randID).css('background-position','0 0')},o.transitionSpeed-1);
					autopilot = 1;
					moveLeft();
					clearInt=setInterval(function(){moveLeft();},o.displayTime+o.transitionSpeed);
					setTimeout(function(){$('#play_pause_btn'+randID).bind('click',function(){forcePause();})},o.transitionSpeed);
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
				if(o.displayThumbnails) for(i=1;i<=numImages;i++) $('#thumb'+randID+'_'+i).css({'border-color':'#ccc'}).animate({'opacity': .65},500);
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
				if(o.displayThumbnails) for(i=0;i<viewable.length;i++) $('#thumb'+randID+'_'+viewable[i]).css({'border-color':'#ff0000'}).animate({'opacity': 1},500);
				if(!o.autoHideCaptions) for(i=1;i<=o.inView;i++) showtext($('li:eq('+i+') p', obj).html(),i);
				if(o.displayThumbnails) $('#thumbs'+randID+' div').bind('click', thumbclick).css({'cursor':'pointer'});
				ary=[];
				for(x=1;x<=o.inView;x++){ary.push($('img:eq('+x+')',obj).attr('src'))}
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
				$('li:lt('+dist+')', obj).clone(true).insertAfter($('li:last', obj)); // Copy the first image (offscreen to the left) to the end of the list (offscreen to the right)
				o.onSlideStart.call(this,viewable,'left');
				$('ul', obj).animate({left:-imgWidth*(dist+1)-(parseInt(o.padding)*(dist+1))*2},o.transitionSpeed,o.easeLeft,function(){ // Animate the entire list to the left
					$('li:lt('+dist+')', obj).remove(); // When the animation finishes, remove the first image (on the left). It has already been copied to the end of the list (right)
					$(this).css({'left':-imgWidth-parseInt(o.padding)*2});
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
				$('li:gt('+(numImages-(dist+1))+')', obj).clone(true).insertBefore($('li:first', obj)); // Copy rightmost (last) li and insert it after the first li
				o.onSlideStart.call(this,viewable,'right');
				$('ul', obj).css('left',-(imgWidth*(dist+1))-(parseInt(o.padding)*((dist+1)*2)))
					.animate({left:-imgWidth-(parseInt(o.padding)*2)},o.transitionSpeed,o.easeRight,function(){
						$('li:gt('+(numImages-1)+')', obj).remove();
						postMove();
					});
			}

			// Kickoff the show
			if(autopilot)
			{
				var clearInt = setInterval(function(){moveLeft();},o.displayTime+o.transitionSpeed);
				if(o.displayProgressBar) startProgressBar(o.displayTime+o.transitionSpeed);
			} else {status='pause';$('#play_pause_btn'+randID).css({'background-position':'0 -16px'});}
			keyBind();
 		});
	}
	});
})(WDN.jQuery);