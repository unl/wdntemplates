/**
 * Sample embed code (the id attribute of the video tag must be unique):
 *
<!--[if IE]><script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script><![endif]-->
<video id="wdn-player-2699" controls src="http://mediahub.unl.edu/uploads/f39aea3b4141ec47720d78f9ac75d9de.mp4"
  poster="http://itunes.unl.edu/thumbnails.php?url=http%3A%2F%2Fmediahub.unl.edu%2Fuploads%2Ff39aea3b4141ec47720d78f9ac75d9de.mp4">
  <track src="http://mediahub.unl.edu/media/2699/vtt" kind="subtitles" type="text/vtt" srclang="en" />
</video>
<script src="http://www.unl.edu/wdn/templates_3.1/scripts/mediaelement_embed.js"></script>
 */

(function() {
  var scripts = document.getElementsByTagName("script");
  var thisScriptTag = scripts[scripts.length-1];
  var templatesRoot = "http://www.unl.edu/wdn/templates_3.1/";

  if (typeof(WDN) === "undefined") {
    var WDN = new Object;
    if (typeof(window.WDN) !== "undefined") {
      WDN = window.WDN;
      if (typeof(window.WDN.getTemplateFilePath) === "function") {
        templatesRoot = WDN.getTemplateFilePath("", true);
      }
    } else {
      window.WDN = WDN;
    }
  }

  var mediaElementLoad = function() {
    var v = WDN.jQuery(thisScriptTag).prev("video");
    var id = mediaElementRegisterPlayer(v.attr("id"), v.attr("poster"));
    mediaElementAttach(mediaElementPlayers[id][0], mediaElementPlayers[id][1]);
  };

  var mediaElementRegisterPlayer = function(id, poster) {
    if (typeof(mediaElementPlayers) === "undefined") {
      mediaElementPlayers = [];
    }
    mediaElementPlayers.push([id, poster]);
    return mediaElementPlayers.length-1;
  };

  var mediaElementAttach = function(playerId, src) {
    var attachPlayer = function() {
      var parentWidth = WDN.jQuery("#" + playerId).parent().width();
      WDN.jQuery("#" + playerId).attr("width", parentWidth);

      var i = new Image();
      WDN.jQuery(i).bind("load", function(event) {
        WDN.jQuery("#" + playerId).attr("height", parentWidth * (this.height / this.width));
        WDN.jQuery("#" + playerId).mediaelementplayer();
      });
      WDN.jQuery(i).bind("error", function(event) {
        WDN.jQuery("#" + playerId).attr("height", parentWidth * (9 / 16));
        WDN.jQuery("#" + playerId).mediaelementplayer();
      });
      i.src = src;
    };

    if (typeof(MediaElementPlayer) === "undefined" && !WDN.mediaElementPlayerLoaded) {
      var c = document.createElement("link");
      c.setAttribute("type", "text/css");
      c.setAttribute("rel", "stylesheet");
      if (typeof(WDN.hasDocumentClass) === "function" && WDN.hasDocumentClass("debug") == true) {
        c.setAttribute("href", templatesRoot+"scripts/plugins/mediaelement/css/mediaelementplayer.css");
      } else {
        c.setAttribute("href", templatesRoot+"scripts/plugins/mediaelement/css/mediaelementplayer.min.css");
      }
      document.getElementsByTagName("head")[0].appendChild(c);

      var j = document.createElement("script");
      j.setAttribute("type", "text/javascript");
      if (typeof(WDN.hasDocumentClass) === "function" && WDN.hasDocumentClass("debug") == true) {
        j.setAttribute("src", templatesRoot+"scripts/plugins/mediaelement/mediaelement-and-player.js");
      } else {
        j.setAttribute("src", templatesRoot+"scripts/plugins/mediaelement/mediaelement-and-player.min.js");
      }

      // Modern browsers
      j.onload = function() {
        WDN.mediaElementPlayerLoaded = true;
        attachPlayer();
      };
      // IE8
      j.onreadystatechange = function() {
        if (j.readyState == "loaded") {
          WDN.mediaElementPlayerLoaded = true;
          attachPlayer();
        }
      };

      document.getElementsByTagName("head")[0].appendChild(j);
    } else {
      attachPlayer();
    }
  };

  if (typeof(WDN.loadJQuery) !== "function") {
    if (typeof(jQuery) === "undefined") {
      var j = document.createElement("script");
      j.setAttribute("type", "text/javascript");
      j.setAttribute("src", "https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js");
      j.onload = function() {
        WDN.jQuery = jQuery;
        mediaElementLoad();
      };
      document.getElementsByTagName("head")[0].appendChild(j);
    } else {
      WDN.jQuery = jQuery;
      mediaElementLoad();
    }
  } else {
    WDN.loadJQuery(function() {
      mediaElementLoad();
    });
  }
})();