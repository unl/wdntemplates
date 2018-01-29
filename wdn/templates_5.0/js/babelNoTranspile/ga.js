// Google Analytics (ga.js) - legacy support
var _gaq = _gaq || [];
(function() {
  var ga = document.createElement('script'); ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

// Google Analytics (analytics.js)
(function(b,o,i,l,e,r){b.GoogleAnalyticsObject=l;b[l]||(b[l]=
function(){(b[l].q=b[l].q||[]).push(arguments)});b[l].l=+new Date;
e=o.createElement(i);r=o.getElementsByTagName(i)[0];
e.src='https://www.google-analytics.com/analytics.js';
r.parentNode.insertBefore(e,r)}(window,document,'script','ga'));
