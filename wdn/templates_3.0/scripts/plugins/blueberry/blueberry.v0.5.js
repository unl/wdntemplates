/*
 * jQuery Blueberry Slider v0.5 BETA
 * Originally created and developed by: http://marktyrrell.com/labs/blueberry/
 * Forked and expanded by: https://github.com/smeranda/
 *
 * Copyright (C) 2011, Mark Tyrrell <me@marktyrrell.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

(function($){
	$.fn.extend({
		blueberry: function(options) {

			//default values for plugin options
			var defaults = {
				interval: 5000,
				duration: 500,
				lineheight: 1,
				height: 'auto', //reserved
				hoverpause: true,
				clickstop: true,
				pager: true,
				nav: true, //reserved
				keynav: true,
				nav: true
			};
			var options =  $.extend(defaults, options);
 
			return this.each(function() {
				var o = options;
				var obj = $(this);

				//store the slide and pager lis
				var slides = $('.slides > li', obj);
				var pager = $('.pager li', obj);

				//set initial current and next slide index values
				var current = 0;
				var next = current+1;

				//define vars for setsize function
				var sliderWidth = 0;
				var cropHeight = 0;

				//hide all slides, fade in the first, add active class to first slide
				slides.hide().eq(current).fadeIn(o.duration).addClass('active');

				//build pager if it doesn't already exist and if enabled
				if(pager.length) {
					pager.eq(current).addClass('active');
				} else if(o.pager){
					obj.append('<div class="pagerWrapper"><ul class="pager"></ul></div>');
					slides.each(function(index) {
						$('.pager', obj).append('<li><a href="#">'+(index+1)+'</a></li>');
					});
					pager = $('.pager li', obj);
					pager.eq(current).addClass('active');
				}
				
				//Add the left/right nav if enabled
				if(o.nav && o.pager){
				    pager.parent().prepend('<li class="prev nav"><a href="#">&#9664;</a></li>');
				    pager.parent().append('<li class="next nav"><a href="#">&#9654;</a></li>');
				}

				//rotate to selected slide on pager click
				if(pager){
					$('.pager li:not(.nav) a').click(function() {
						//stop the timer
						//set the slide index based on pager index
						if(o.nav) { //if we have nav, the index will be a bit off
						    next = $(this).parent().index() - 1;
						} else {
						    next = $(this).parent().index();
						}
						//rotate the slides
						rotate();
						return false;
					});
				}

				//primary function to change slides
				var rotate = function(){
					//set the size of the slider
					setsize();
					//fade out current slide and remove active class,
					//fade in next slide and add active class
					slides.eq(current).fadeOut(o.duration).removeClass('active')
						.end().eq(next).fadeIn(o.duration).addClass('active').queue(function(){
							//add rotateTimer function to end of animation queue
							//this prevents animation buildup caused by requestAnimationFrame
							//rotateTimer starts a timer for the next rotate
							rotateTimer();
							$(this).dequeue();
					});

					//update pager to reflect slide change
					if(pager){
						pager.eq(current).removeClass('active')
							.end().eq(next).addClass('active');
					}

					//update current and next vars to reflect slide change
					//set next as first slide if current is the last
					current = next;
					next = current >= slides.length-1 ? 0 : current+1;
				};
				
				//rotate the slide on direction click
				
				if(o.nav){
    				$('#wdn_Carousel .nav a').click(function () {
    				    if($(this).parent().hasClass('next')) {
    				        rotate();
    				    } else {
    				        next = $('.pager .active').index() - 2;
    				        rotate();
    				    }
    				    return false;
    				});
				};
				
				//create a timer to control slide rotation interval
				var rotateTimer = function(){
					clearTimeout(obj.play);
					obj.play = setTimeout(function(){
						//trigger slide rotate function at end of timer
						rotate();
					}, o.interval);
				};
				//start the timer for the first time
				rotateTimer();

				//pause the slider on hover
				//disabled by default due to bug
				if(o.hoverpause){
					slides.hover(function(){
						//stop the timer in mousein
						clearTimeout(obj.play);
					}, function(){
						//start the timer on mouseout
						rotateTimer();
					});
				}

				//stop the slides from progressing if one is clicked.
				if(o.clickstop){
				    slides.click(function(){
				        WDN.log('slide clicked');
				        clearTimeout(obj.play);
				        slides.unbind('mouseenter mouseleave');
				    });
				}

				//calculate and set height based on image width/height ratio and specified line height
				var setsize = function(){
					//get height and width of initial slide image and calculate size ratio
					var slideHeight = slides.eq(current).height();
					var slideWidth = slides.eq(current).width();
					var slideRatio = slideWidth/slideHeight;
					
					sliderWidth = $('.slides', obj).width();
					cropHeight = Math.floor(((sliderWidth/slideRatio)/o.lineheight))*o.lineheight;
                    $('.slides', obj).css({height: cropHeight});
                    //console.log(sliderWidth +', '+ cropHeight +', '+ slideRatio +', '+ slideHeight +', '+ slideWidth);
				};

				//bind setsize function to window resize event
				$(window).resize(function(){
					setsize();
				});
				
				//Add keyboard navigation
				if(o.keynav){
					$(document).keyup(function(e){
						switch (e.which) {
							case 39: case 32: //right arrow & space
								rotate();
							break;
							case 37: // left arrow
								next = $('.pager .active').index() - 2;
								rotate();
							break;
						}
					});
				}


			});
		}
	});
})(WDN.jQuery);