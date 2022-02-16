"use strict";

define([
  'analytics', // This also loads the IdM plugin
  'navigation',
  'search',
  'unlalert',
  'lazy-load',
  'legacy',
  'modals',
  'hover_intent',
  'cta-nav',
  'form_validation',
  'qa',
  'bg-videos'
], function () {
  for (var i = 0, pluginCount = arguments.length; i < pluginCount; i++) {
    var pluginObj = arguments[i];
    if (pluginObj && "initialize" in pluginObj) {
      pluginObj.initialize();
    }
  }
});
