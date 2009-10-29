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
          stars.slice(0, rating[0]).addClass("on");
          if(percent = rating[1] ? rating[1] * 10 : null) {
            stars.eq(rating[0]).addClass("on").children("a").css("width", percent + "%");
          }
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
        var url = 'http://www1.unl.edu/comments/';
        WDN.post(
        		url, 
        		{ rating: rating[0] },
        		function() {
        	        reset();
        	    	stars.unbind().addClass("done");
        		}
        );
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