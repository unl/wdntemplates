"use strict";

define([
  'analytics', // This also loads the IdM plugin
  'navigation',
  'search',
  'unlalert',
  'modals',
  'lazy-load',
  'legacy',
  'hover_intent',
  'cta-nav',
  'form_validation',
  'qa'
], function () {
  for (var i = 0, pluginCount = arguments.length; i < pluginCount; i++) {
    var pluginObj = arguments[i];
    if (pluginObj && "initialize" in pluginObj) {
      pluginObj.initialize();
    }
  }
});
