# WDN Templates v6.0 to v6.1 Migration Guide

## ZIP Download

For 6.1 the download files can be found at ([https://wdn.unl.edu/sites/unl.edu.university-communication.web-developer-network/files/downloads/wdn_6.1.zip](https://wdn.unl.edu/sites/unl.edu.university-communication.web-developer-network/files/downloads/wdn_6.1.zip))

## Updating Your Template Files

The template files were changed so reference [https://wdn.unl.edu/sites/unl.edu.university-communication.web-developer-network/files/downloads/UNLTemplates_6.1.zip](https://wdn.unl.edu/sites/unl.edu.university-communication.web-developer-network/files/downloads/UNLTemplates_6.1.zip) to get the current version of your template

### Footer Changes

It was brought up that the default example footer in `wdn/templates_6.1/includes/local/footer-local.html` had a couple schema.org data errors. This has been updated and you may need to update your footer to match the new version.

## CSS Changes

### DCF Bleed and DCF Wrapper

`dcf-bleed` was updated to not rely on the body being `width: 100vw`. Having the body tag being `width: 100vw` caused some users to have some full width content being rendered behind the scroll bar. If you are using `dcf-bleed` in your code you may need to verify it is still styled as expected.

### Nav Bar and Visit/Apply/Give links

The desktop and mobile nav had some minor redesigns. Importantly, moving the Visit/Apply/Give links out of the navigation dialog and back to the top of the header. These changes had a couple z-index modifications so double check nothing is being rendered in front of the nav menus

### IDM Widget

The IDM widget was re-designed to avoid confusion in regards to logging in and your current logged in state. There was also a handful of changes to the services linked inside the IDM widget's dialog.

## JS Changes

### UNL Notice Banner

The UNL notice banner is used for critical notices to the UNL community that do not pertain to the police such as ITS outages. These now have a contain ID `unl-notice-banner`. So if you had any system referencing the notice banner that can be updated to reference that ID.

### getClassInstance in unl-utility

A new function was added to the `wdn/templates_6.1/js/lib/unl-utility.js` file which allows for an easier way to get a reference to the class instance of a component. `getClassInstance` is a function that takes in the ID of the component's element and returns a promise which resolves to the class instance. It needs to be a promise since you can call the function before the component is initialized. So if you had any systems in place to get that class instance, that can be updated to use that function.
