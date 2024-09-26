define(['jquery'], function($) {
    //Wait a little bit, then send a request to Web Audit to determine this site's current score.
    var success = function(data) {

        if (!data) {
            //no closest site was found
            return;
        }

        var gpa = parseFloat(data.gpa);
        var $link = $('#qa-test');
        if (gpa === 100) {
            $link.after('<span aria-hidden="true">&nbsp;&starf;</span><span class="dcf-sr-only">100% (gold star)</span>');
        } else if (gpa >= 90) {
            $link.after('<span aria-hidden="true">&nbsp;&star;</span><span class="dcf-sr-only">90% (silver star)</span>');
        }
    };

    var getBaseUrl = function()
    {
        //Reduce the load on webaudit by using the base url if available (will result in more cached hits)
        var $base = $('base');
        if ($base.length) {
            return $base.attr('href');
        }

        //Otherwise use the current page URL which will result in a request to webaudit for every page on the site
        return window.location;
    };

    //Wait a little bit and then send check for the score
    setTimeout(function(){
        $.ajax({
            url: 'https://webaudit.unl.edu/registry/closest/?format=json&query='+encodeURIComponent(getBaseUrl()),
            timeout: 1000,
            success: success
        });
    }, 1000);
});
