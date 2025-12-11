# Changelog
All notable changes to this project will be documented in this file.

## 6.0.6 (Nov 11, 2025)
- Fix nav menu bugs
- Update collapsible fieldset padding
- Update event grid
- Updated footer employment url

## 6.0.5 (Oct 16, 2025)
- Updated order of operations in plugin auto loader
- Adjusted icon card styles
- Added datatable library and UNL styles overrides
- Updated clip-stripe-* classes

## 6.0.4 (Sept 17, 2025)
- Use mask-image for mobile breadcrumbs mask
- Bump vite from 6.3.5 to 6.3.6
- Adjust breadcrumbs mobile height
- Update font sized
- Remove `dcf-d-block` class from framework images
- Add support for AJAX nav loading
- Fix debug-clean page
- Added header-global-1-local to templates

## 6.0.3 (Sept 3, 2025)
- Fix smudging bug with bad quote

## 6.0.2 (Aug 22, 2025)
- Adding cache busting for imports
- Fix bugs related to autoloader
- Added speculation rules
- Fix misc. styling for components
- Cleaned up template files
- Added parallax styles
- Added clip path styles
- Fix footer styles and markup
- Update icons

## 6.0.1 (July 11, 2025)
- Add data-template attribute to Templates files

## 6.0.0 (July 10, 2025)
- Initial release of 6.0

## 5.3.57 (June 24, 2025)
- Load web analytics in a require.js compliant way

## 5.3.56 (June 20, 2025)
- Update domain for on-prem analytics
- Fix for form validator message color contrast

## 5.3.55 (April 10, 2025)
- Add overflow-x: clip to nav menu
- Update footer links
- Added analytics events for search modal open and close

## 5.3.54 (January 14, 2025)
- Update GSAP to fix scroll-to-top bug
- Update copyright date in footer
- Hide (most) footer content on printed pages
- Add mixins/utilities "text-wrap balance" and "pretty"
- Set width of body tag to 100vw

## 5.3.53 (November 26, 2024)
- Add container query based events layout
- Remove In Our Grit... logo from footer
- Add local version of modular scale function

## 5.3.52 (September 11, 2024)
- Revert local nav column widths to 1fr
- Fix absolute path issue in Grunt

## 5.3.51 (August 13, 2024)
- Remove lingering polyfill.io references
- Remove the alert banner when an alert grows stale
- Replace node-sass with sass

## 5.3.50 (May 21, 2024)
- New Gallery component
- Remove pollyfill.io dependency
- Add modular scale as CSS custom properties (vars)

## 5.3.49 (April 24, 2024)
- Revert copyright change in footer

## 5.3.48 (April 10, 2024)
- Add $bg-color-foreground variable

## 5.3.47 (March 20, 2024)
- New background multiply blend mode
- New soft light blend mode
- Add text-wrap: balance to headings and text-wrap: pretty

## 5.3.46 (February 13, 2024)
- .unl-scarlet@dark added
- Events widget time mode additions

## 5.3.45 (January 12, 2024)
- Added end time/all day to events widget and updated styles

## 5.3.44 (January 2, 2024)
- Update copyright year to 2024 in footer

## 5.3.43 (December 18, 2023)
- Events widget fix

## 5.3.42 (December 14, 2023)
- Fix typo in font URLs

## 5.3.41 (December 14, 2023)
- Add role="list" to framework unstyled lists
- Replaced references for Planet Red with Directory
- Fix URL path to favicon in manifest.webmanifest

## 5.3.40 (November 14, 2023)
- Change Matomo file name
- Toggle fixes
- Modal fixes

## 5.3.39 (October 12, 2023)
- Add Matomo analytics
- Font adjustments

## 5.3.38 (September 14, 2023)
- Font optimizations

## 5.3.37 (September 12, 2023)
- Optimize web fonts and critical CSS
- Add 2 new color variables

## 5.3.36 (September 5, 2023)
- HTML validation fix on @charset declaration

## 5.3.35 (September 1, 2023)
- New fonts

## 5.3.34 (August 8, 2023)
- Adjust modal wrapper max-height 
- Add --brand-kappa (orange)
- Update for new version of search
- Add 25% / 50% / 75% height/width mixins/utilities
- Ignore empty divs within the tabs component
- Hide tabs list item if child tab is hidden

## 5.3.33 (July 17, 2023)
- Add bg diagonal gradients mixin/utility
- Fix for idm.initialize in analytics.js not running sometimes

## 5.3.32 (June 20, 2023)
- GA4 analytics update
- Restore wdn_tabs alongside the new dcf-tabs

## 5.3.31 (June 14, 2023)
- Update events component layout
- Add --brand-iota color CSS variable 
- Remove nav-menu-child pseudo content
- Remove duplicate nav menu styles from app.scss 
- Tabs updates

## 5.3.30 (May 23, 2023)
- Add popups to plugins that load with every request

## 5.3.29 (May 23, 2023)
- Improve external link CSS selector

## 5.3.28 (May 23, 2023)
- New popup component 
- New external link SVG icon
- Add backdrop-filter var and adjust overlay colors

## 5.3.27 (April 12, 2023)
- New monospace font utility class
- New hand-drawn backgrounds

## 5.3.26 (February 14, 2023)
- Toggle button (part II)
- Remove the "search as you type" feature from the search box
- Blockquote style update

## 5.3.25 (January 10, 2023)
- Update year in footer
- Toggle button (part I)
- Remove mobile menu gradient overlays

## 5.3.24 (December 20, 2022)
- Remove COVID-19 site link from header

## 5.3.23 (November 10, 2022)
- Replace .dwt "InstanceBeginEditable" statements with "TemplateBeginEditable" (this had been previoulsy done but was erroneously reverted)
- Add box-shadow Sass file imports

## 5.3.22 (October 11, 2022)
- Update N logo SVG class names
- Fix color contrast on notices
- Make @dark css rules apply only to dark mode
- Add .unl-box-shadow class
- Update moment.js

## 5.3.21 (September 14, 2022)
- Update GSAP to 3.11.1

## 5.3.20 (September 13, 2022)
- Improved print syles
- Add screen media query for colors in critical CSS
- Update GSAP

## 5.3.19 (August 11, 2022)
- Move In Our Grit Our Glory logo in footer
- Fix select element corners in input groups
- Minimize message banner javascript

## 5.3.18 (August 2, 2022)
- Add link to covid19.unl.edu in the CTA area

## 5.3.17 (July 12, 2022)
- Remove deprecated ".wdn-*" button styles
- Update tertiary colors
- Add radio switch styles
- Add hr element style

## 5.3.16 (June 14, 2022)
- Use GSAP/ScrollTrigger for scroll animations

## 5.3.15 (May 10, 2022)
- Convert prev/next buttons from list to div group
- Fix modal scrolling issue on iOS
- Add playsinline attribute for autoplay videos

## 5.3.14 (April 12, 2022)
- Implement GSAP as npm module
- Remove Google Tag Manager from "local" template
- Update Sass temp files (grid renamed gap)
- Rename BG Video Toggle to Autoplay Video Toggle
- Remove progress width and max-width
- Update slideshow styles for alternate display

## 5.3.13 (March 9, 2022)
- Add new PHP TWIG template file
- Progress element styles
- Implement DCF background video toggle
- DCF update: Add gap mixins and utilites

## 5.3.12 (February 15, 2022)
- Update Modal video events to handle YouTube embeds
- Update border variables
- Update variables in dark mode bookmarklet

## 5.3.11 (January 20, 2022)
- Update NU System logo in footer
- Cleanup and reorganize CSS variables
- Update secondary background-color CSS variables

## 5.3.10 (December 14, 2021)
- Fix institution title hover color in footer
- Fix heading color in notices
- Add sizes="any" to favicon.ico

## 5.3.9 (November 10, 2021)
- Fix institution title color in footer

## 5.3.8 (November 9, 2021)
- Notice change from p to div
- Dark mode fixes (CTA links, button import styles)

## 5.3.7 (October 28, 2021)
- New DCF notices

## 5.3.6 (Octover 18, 2021)
- Dark mode

## 5.3.5 (September 14, 2021)
- Updated DCF slideshow
- Add utility for dots background images
- Add form required label color variables
- Events Plugin Timezone Fix

## 5.3.4 (August 10, 2021)
- Events updates
- NPM version requirement increase

## 5.3.3 (July 22, 2021)
- Events updates
- Footer background color change

## 5.3.2 (May 14, 2021)
- Link styling changes for accessibility
- Added Card display with entire card linked

## 5.3.1 (April 15, 2021)
- New datepicker
- Remove object-fit polyfill

## 5.3.0 (February 17, 2021)
- Initial release

## 5.2.8 (January 13, 2021)
- Button style updates
- Fix for Web Audit star in footer

## 5.2.7 (December 8, 2020)
- New monospace font stack
- Responsive tables fix

## 5.2.6 (November 12, 2020)
- Modal fix
- Add Google Tag Manager code
- Add dark mode toggle bookmarklet CSS

## 5.2.5 (October 15, 2020)
- Update UNL Alert styles
- Update IdM styles to match CTA popovers
- Add daily cache bust for client chat

## 5.2.4 (September 15, 2020)
- Add link to accessibility statement in footer
- Add scroll animations

## 5.2.3 (August 13, 2020)
- Remove Dark Mode support

## 5.2.2 (August 11, 2020)
- Remove wdn/templates_5.1 directory

## 5.2.1 (August 9, 2020)
- 5.2 Initial Release

## 5.1.4 (June 16, 2020)
- New Slideshow feature
- Update jQuery to 3.5.1

## 5.1.3 (May 7, 2020)
- Remove scroll to top from displayWDNNoticeBannerMessage so it doesn't interfere with anchor links

## 5.1.2 (May 3, 2020)
- Liberator font added
- New secondary colors
- IDM Javascript changes

## 5.1.1 (April 3, 2020)
- Button fixes in visited state

## 5.1.0 (March 25, 2020)
- 5.1 Initial Release

## 5.0.17 (March 13, 2020)
- New WDN Notice javascript to check for campus alert messsages from UComm and prepend a banner
- IDM updates to access info about logged-in user

## 5.0.16 (February 11, 2020)
- Add Third Party cookie support via samesite to WDN.setCookie()
- Remove 150th anniversary logo and update copyright year
- Fix events listing display issue

## 5.0.15 (December 10, 2019)
- DCF modal update
- Add mixin/utility to match heading letter-spacing

## 5.0.14 (October 28, 2019)
- Remove deprecated.css link from head include files (can now be included by a developer if they choose)
- Temporarily remove reduced motion preference and revert to previously-used method for transitioning modal states for search and mobile navigation
- Remove monthwidet date hover UI (JS & CSS)
- Add ID to skip nav
- Add legacy hero CSS
- Do not apply deprecated styles to .dcf-table

## 5.0.13 (August 14, 2019)
- Emergency fix to paths in wdn/templates_5.0/includes/global/head-2.html for non-local/"cloud" template users 

## 5.0.12 (August 13, 2019)
- Menu fix

## 5.0.11 (August 13, 2019)
- Update details & summary styles
- Aria label updates
- Update deprecated bands background colors
- Add search modal fade-in/out styles
- Move inline critical CSS to file
- Update jquery and jquery-migrate to latest

## 5.0.10 (June 14, 2019)
- Update summary cursor and arrow
- Include subtitle in events listings
- DCF: Add XS max-width mixin/utility, Add mixin/utility for XL max-width
- DCF: Replace measure utility classes
- DCF: Add responsive & scrollable tables
- DCF: Add portrait orientation (9×16, 3×4) aspect ratios
- DCF: Add media query for reduced motion preference

## 5.0.9 (May 9, 2019)
- Replace SkipTo.js plugin with traditional skip nav
- Update DCF for lazy loading image support
- Add timezone support to events and events-band plugins
- Add theme styles for details & summary
- Add theme easing and timing variables

## 5.0.8 (April 15, 2019)
- Add .no-webp class if browser doesn’t support WebP
- Add inline script to remove .no-js class
- Remove vertical-align from deprecated buttons
- Update critical/core CSS IDs for consistency
- Add tmp.scss files to repo

## 5.0.7 (March 11, 2019)
- Update examples
- New dcf-form class that can be applied to entire form
- Alert and notice style updates

## 5.0.6 (February 14, 2019)
- Update form styling
- Add anchor style to critical CSS
- Add id to dcf-nav-toogle-group nav tag to prevent skip-to from assigning random id to it 
- Update UNL Alert styling
- Restore TIPS logo to footer

## 5.0.5 (January 11, 2019)
- Update notch stripe hero styles
- Add trailing slash when constructing siteHomepage so that local search results are hidden on www.unl.edu
- Make sure the embedded search param is 5.0 in all places

## 5.0.4 (January 4, 2019)
- Update copyright year to 2019
- Update (Filament Group) select styling, wrapper no longer needed
- Remove duplicate !important in critical CSS
- Update mobile nav toggle buttons and the way env variables are used
- Update search button and footer styles

## 5.0.3 (December 20, 2018)
- Improve critical CSS
- Remove underline from links in headings
- Improve spacing above footer
- Replace suggested (utility) class for site title
- Update jQuery UI styles
- Use flexbox for desktop local navigation (to support old Edge)

## 5.0.2 (December 11, 2018)
- HTML Changes: 1) Add editable regions for global nav 2) Add breadcrumb wrapper 3) Add optionalfooter region
- Print styles
- Include adjustments
- Widget work including events styles

## 5.0.1 (December 11, 2018)
- Fix body scroll bug with desktop nav closing without clicking close
- Add Editable JSbody to App templates
- Implement CTA navigation
- Remove contents of global nav include files

## 5.0.0 (November 12, 2018)
- 5.0 Initial Release

## 4.1.36 (September 16, 2018)
- Change default CAS URL from login.unl.edu to shib.unl.edu

## 4.1.35 (September 5, 2018)
- Add analytics event tracking on navigation system

## 4.1.34 (August 29, 2018)
- In Our Grit, Our Glory logo added to footer
- Minor accessibility fixes

## 4.1.33 (May 1, 2018)
- No commits made, version bumped

## 4.1.32 (April 3, 2018)
- Added a gold and silver star for pages with high Web Audit scores
- Updated global footer icon markup
- Renamed 'wdn-icon-container-class'
- Increased z-index for UNL Alert

## 4.1.31 (March 6, 2018)
- Updated some links in the footer

## 4.1.30 (February 6, 2018)
- Updated year in global footer

## 4.1.29 (January 2, 2018)
- No commits made, version bumped

## 4.1.28 (December 5, 2017)
- Fontello/Spotify icon in footer
- Various footer updates
- Always show a focus outline for inputs

## 4.1.27 (November 7, 2017)
- Updated framework absolute links to use https([#1083](https://github.com/unl/wdntemplates/pull/1083))

## 4.1.26 (October 3, 2017)
- No commits made, version bumped

## 4.1.25 (September 5, 2017)
- Fixed contrast issues in table elements
- Fixed the visual height of the button within .wdn-input-group-btn
- Fixed some specificity rules in tables

## 4.1.24 (August 1, 2017)
- Changed Tungsten to load in the head on Speedy template, this will make the FOUT much less violent in the header

## 4.1.23 (July 4, 2017)
- No commits made, version bumped

## 4.1.22 (June 6, 2017)
- [Fixed the location](https://github.com/unl/wdntemplates/commit/1282778babe24510805af4e4ae36a15832bcdbbe) of the search button
- Fixed a Flash of No CSS on hard refresh([#1073](https://github.com/unl/wdntemplates/pull/1073))
- Restored button cursor lost in normalize update ([#1075](https://github.com/unl/wdntemplates/pull/1075))

## 4.1.21 (May 9, 2017)
- Removed Font Face Observer to ensure fonts were loaded

## 4.1.20 (May 9, 2017)
- Added a new speedy template to improve page speed
- Improved CSS distribution, only putting critical CSS in the head and loading other CSS later
- Fixed a change in Chrome that caused a random [border to appear](https://github.com/unl/wdntemplates/pull/1065).

## 4.1.19 (March 13, 2017)
- Updated events widget to force use of https, even if option not selected ([#1055](https://github.com/unl/wdntemplates/commit/9dae8df39db9839268e3a6537ebb1afd789e2b76))
- Disabled the direction navigation on carousels by default ([#1052](https://github.com/unl/wdntemplates/commit/2bde94c5cd76ed656645941813a8dea8ae9f0a31))

## 4.1.18 (February 13, 2017)
- Changed Nebraska N logo to improve pixel-fitting
- Updates to font size calculation in footer
- Add margin to last element (if not a .wdn-band) to add vertical space between main content and footer

## 4.1.17 (January 24, 2017)
- Happy new copyright year ([d274265](https://github.com/unl/wdntemplates/commit/d2742655fe9d0a902a52ff1dde0d28ce5f5d1aef))
- Fix subpixel border appearing below navigation bar ([#1043](ttps://github.com/unl/wdntemplates/pull/1043))
- Remove animated image caption styles ([#1044](ttps://github.com/unl/wdntemplates/pull/1044))
- Descrease hero text-shadow styles ([#1045](ttps://github.com/unl/wdntemplates/pull/1045))

## 4.1.16 (January 10, 2017)
- CSS cleanup to meet coding standards and remove shims for old platforms ([#1040](https://github.com/unl/wdntemplates/pull/1040), [#1041](https://github.com/unl/wdntemplates/pull/1041), [#1042](https://github.com/unl/wdntemplates/pull/1042))

## 4.1.15 (December 13, 2016)
- Update global footer link on Big Ten logo ([#1037](https://github.com/unl/wdntemplates/pull/1037))
- Change the example first breadcrumb to say "Nebraska" ([#1038](https://github.com/unl/wdntemplates/pull/1038)
- Fix bug in month widget configuration ([#1039](https://github.com/unl/wdntemplates/pull/1039))
- Reduce the timeout between scrolling and the fixed header moving ([3549db0](https://github.com/unl/wdntemplates/commit/3549db014b58b14198079de312327b51d21e7b06))

## 4.1.14 (November 8, 2016)
- Update CSS class for hiding footer logos ([#1029](https://github.com/unl/wdntemplates/pull/1029))
- Add analytics function for tracking mediahub iframe events ([#1031](https://github.com/unl/wdntemplates/pull/1031))
- Adjust Hero CSS for min-height ([#1032](https://github.com/unl/wdntemplates/pull/1032))
- Upgrade MediaElementJS plugin ([#1034](https://github.com/unl/wdntemplates/pull/1034))

## 4.1.13 (October 11, 2016)
- Promo image layout improvements ([#1017](https://github.com/unl/wdntemplates/pull/1017))
- Print CSS adjustments for header N ([#1018](https://github.com/unl/wdntemplates/pull/1018))
- Hidden region layout improvements ([#1020](https://github.com/unl/wdntemplates/pull/1020))
- Footer logo changes ([#1022](https://github.com/unl/wdntemplates/pull/1022))
- Footer layout improvements ([#1023](https://github.com/unl/wdntemplates/pull/1023))

## 4.1.12 (September 13, 2016)
- Margin adjustments on Hero layout ([#1011](https://github.com/unl/wdntemplates/pull/1011))
- Update global footer links that have redirected ([20e96da](https://github.com/unl/wdntemplates/commit/20e96da08cffdb571859a0b9ab152e01befcd53e))
- Institution title link will alway be brand red ([d5f8160](https://github.com/unl/wdntemplates/commit/d5f81603fefcd9cbd355d8728f7813ec0f6fb296))
- Accessiblity improvements to template provided HTML ([#1010](https://github.com/unl/wdntemplates/pull/1010))
- Adding Student Information Disclosures link (HEOA) to global footer ([#1016](https://github.com/unl/wdntemplates/pull/1016))

## 4.1.11 (July 12, 2016)

- Accessibility improvements ([#1005](https://github.com/unl/wdntemplates/pull/1005), [#1007](https://github.com/unl/wdntemplates/pull/1007))
- Footer updates for Big Ten Academic Alliance ([#1008](https://github.com/unl/wdntemplates/pull/1008))

## 4.1.10 (June 13, 2016)

- Remove font files now served from other places
- Only use/embed woff fonts (covers our support base)
- Slight header adjustments to support Nebraska N ([#992](https://github.com/unl/wdntemplates/pull/992), [#1000](https://github.com/unl/wdntemplates/pull/1000))
- Add responsive embed CSS classes ([#996](https://github.com/unl/wdntemplates/pull/996))
- Simplify fallback fonts ([#1001](https://github.com/unl/wdntemplates/pull/1001))
- Hero block style improvements ([#1003](https://github.com/unl/wdntemplates/pull/1003))

## 4.1.8 - 4.1.9 (May 8, 2016)

- Use the Nebraska N (favicon and logo area)
- Accessibility bug fixes/improvments ([#988](https://github.com/unl/wdntemplates/pull/988))

## 4.1.7 (April 11, 2016)

- Upgrade jQuery to v2.2.2 ([b288b45](https://github.com/unl/wdntemplates/commit/b288b4589a310f30a0a363e230b15cee863aa847))
- Upgrade RequireJS to v2.2.0 ([868375e](https://github.com/unl/wdntemplates/commit/868375ef3283e533f4e3cb7cdd95373e2dc04206))
- Reduce network requests for CSS resources ([#977](https://github.com/unl/wdntemplates/pull/977))
- Fixed share menu not scrolling with navigation ([#976](https://github.com/unl/wdntemplates/pull/976))
- Fixed tab selection from back/forward navigation ([#978](https://github.com/unl/wdntemplates/pull/978))
- Added new styles for hero bands ([#980](https://github.com/unl/wdntemplates/pull/980))
- General improvements to examples documentation

## 4.1.6 (March 7, 2016)

- Add an option for rendering rooms on the events band widget ([#958](https://github.com/unl/wdntemplates/pull/958))
- Fix navigation disappearing if home crumb is not a link at load ([#959](https://github.com/unl/wdntemplates/pull/959))
- Fix both login and logout interface appear in certain cases ([#960](https://github.com/unl/wdntemplates/pull/960))
- General build and size optimiations ([#961](https://github.com/unl/wdntemplates/pull/961), [538f5e7](https://github.com/unl/wdntemplates/commit/538f5e765c6fa398915f1120cf82c45740a55b4e))
- Upgrade MediaElementJS plugin to v2.19.0 ([#692](https://github.com/unl/wdntemplates/pull/962))
- Adjust text-band margins ([#963](https://github.com/unl/wdntemplates/pull/963))
- Improve the algorithm for auto-submitting searches ([#964](https://github.com/unl/wdntemplates/pull/964))
- Use the Directory avatar service for profile images ([#965](https://github.com/unl/wdntemplates/pull/965))
- Fix 301 redirect in global footer ([#966](https://github.com/unl/wdntemplates/pull/966))

## 4.1.3 - 4.1.5 (February 9, 2016)

- Fix bad selectors for navigation bar labels ([9e22020](https://github.com/unl/wdntemplates/commit/9e22020bfe1172eeedbb6130e39944f7e930521a))
- Fixed navigation icons getting pushed to the wrong location on UNLcms sites with WebForms ([#956](https://github.com/unl/wdntemplates/pull/956))
- Fixed bad variable reference from previous navigation whitespace fix ([d92c226](https://github.com/unl/wdntemplates/commit/d92c226a6047b82801bad62fb094750e6e987386))

## 4.1.2 (February 8, 2016)

### Fixed
- IE needs a z-index for search input icon ([4759e38](https://github.com/unl/wdntemplates/commit/4759e380df3e5531a1137dc150874d8299e3fee6))
- JavaScript error when home breadcrumb not found ([#942](https://github.com/unl/wdntemplates/pull/942))
- Bad URL in legacy browser warning ([#948](https://github.com/unl/wdntemplates/pull/948))
- Improve accessilbity of search interface ([#950](https://github.com/unl/wdntemplates/pull/950))
- Improve accessiblity of other header/footer elements ([#951](https://github.com/unl/wdntemplates/pull/951))
- Try to address whitespace under the navigation ([#939](https://github.com/unl/wdntemplates/issues/939), [a1b58b5](https://github.com/unl/wdntemplates/commit/a1b58b5335caea237299e29e4f68d70718385aa9))

### Changed
- Style updates to the events band ([#945](https://github.com/unl/wdntemplates/pull/945))
- Added missing Modernizr tests for touch/pointer events and upgraded to v3.3.1 ([3375097](https://github.com/unl/wdntemplates/commit/3375097d4f6e54c08a3a917e2c63d71b66b9cc8c))
- Search now using new URL ([6658ed5](https://github.com/unl/wdntemplates/commit/6658ed56329673b67472db8d6663fb632bd248d2))

### Added
- New icons in icon font ([#942](https://github.com/unl/wdntemplates/pull/942))
- Phone link in global footer ([#952](https://github.com/unl/wdntemplates/pull/952))

## 4.1.1 (January 5, 2016)

### Fixed
- Updated the global footer copyright year ([577c250](https://github.com/unl/wdntemplates/commit/577c2503dbd1eed1c051adc7bfe53b5aa6ca8588))
- Ensure cursor over IdM region is a pointer for logged in users ([#938](https://github.com/unl/wdntemplates/pull/938))

### Changed
- Print styles have been updated for minimal layout changes ([534d5fb](https://github.com/unl/wdntemplates/commit/534d5fbb708e6b677afdbd6508eb8bc51ab6a20f))

## 4.1.0 (January 4, 2016)

Many code changes took place over this period. [See full list of changes](https://github.com/unl/wdntemplates/compare/4.0.35...4.1.0)

### Changed
- New header/footer design
	- Breadcrumbs now float with nav and collapse to support longer trails
	- Two footer areas have been created local/global
	- Search interface has moved out of the navigation drawer on mobile
- Removed max-width from content bands
- General improvements to framework html for accessilbity
- Dropped support for IE < 10
- Upgraded jQuery to v2.1.4
- Upgraded Modernizr to v3.2.0 (a number of tests have been removed that are already a part of our support base)

## 4.0.35 (November 10, 2015)

### Fixed
- Regression: Flexslider styles still not right ([#893](https://github.com/unl/wdntemplates/issues/893))

## 4.0.34 (October 14, 2015)

### Fixed
- Regression: Flexslider styles accidentally changed via upgrade ([#893](https://github.com/unl/wdntemplates/issues/893))
- Regression: WDN.jQuery missing in Chrome ([#894](https://github.com/unl/wdntemplates/issues/894))

## 4.0.33 (October 13, 2015)

### Fixed
- Firefox shows invalid input styles when search is closed ([#891](https://github.com/unl/wdntemplates/pull/891))
- Firefox shows two underlines for abbr elements ([8b6a9a7](https://github.com/unl/wdntemplates/commit/8b6a9a7891479211aa21db142cd87de0b90c4953))
- Certain WDN JavaScript plugins have double-initialization problems ([3d84935](https://github.com/unl/wdntemplates/commit/3d8493523a198d3fa78f04947fd86e124322644e))
- Cloud Typography fonts are not loaded from printing ([77b316d](https://github.com/unl/wdntemplates/commit/77b316dfa60bf7e51616f80197640a8d6e8e7a8e))

### Changed
- New build system implemented ([#892](https://github.com/unl/wdntemplates/pull/892))
- New theme/styles for the included jQuery UI ([50e6e0f](https://github.com/unl/wdntemplates/commit/50e6e0f96d643e64b47584b99644687c2a2c3e46))
- IE 8 will now trigger the upgrade notice ([#887](https://github.com/unl/wdntemplates/issues/887))

## 4.0.32 (September 23, 2015)

### Fixed
- CSS Loader throws an error if called for an already loaded sheet without a callback ([f18ea83](https://github.com/unl/wdntemplates/commit/f18ea837cfdb28cbde3ed0035dc8cbdaa4bd75c0))
- Remove the focus outline from maincontent div. ([f00e2a4](https://github.com/unl/wdntemplates/commit/f00e2a491f8e9dbe7c5cf44b91a1aa7527b05a18))
- Search not being closed when escape is hit ([#890](https://github.com/unl/wdntemplates/pull/890))

## 4.0.31 (September 8, 2015)

### Fixed
- Use non-breaking spaces in global footer to ensure unit name and QA link do not wrap ([#876](https://github.com/unl/wdntemplates/pull/876))
- The Windows XP warning should be shown in browserstack tests too ([#877](https://github.com/unl/wdntemplates/pull/877))
- Removed Firefox browser supplied underline on abbreviated site titles ([0b28aa0](https://github.com/unl/wdntemplates/commit/0b28aa0178596a9398d2ffa8fef291235b274034))

### Changed
- Change recommended mark-up for Notice widget. Remains backwards compatible ([#880](https://github.com/unl/wdntemplates/pull/880))
- Change the maincontent legacy white-space wrapper to use margin instead of padding ([#880](https://github.com/unl/wdntemplates/pull/880))
- Only use the user's first name when rendering their identity information ([#883](https://github.com/unl/wdntemplates/pull/883))

### Added
- Allow getting a versioned URL for loading framework files ([#880](https://github.com/unl/wdntemplates/pull/880))
- New class to display normal lists inside of a form layout list ([#882](https://github.com/unl/wdntemplates/pull/882))
- Accessibility improvement: allow maincontent to be focused from skip link activation ([#884](https://github.com/unl/wdntemplates/pull/884))
- Accessibliity improvement: allow the search frame to be closed by pressing ESC ([#886](https://github.com/unl/wdntemplates/pull/886))

## 4.0.30 (August 12, 2015)

### Fixed
- Fixed an issue that could result in the navigation staying hidden ([27bfc76](https://github.com/unl/wdntemplates/commit/27bfc763aeab6ad57c15f90e4a9798f646e74442))
- Fixed extended fonts not loading for https ([#875](https://github.com/unl/wdntemplates/pull/875))
- Fixed initialization of extended fonts ([0346b86](https://github.com/unl/wdntemplates/commit/0346b86278a147a3de9135c4d3fbd77110beace6))

## 4.0.29 (August 11, 2015)

### Fixed
- The QA link in the footer has been updated to go to a special page on WebAudit ([#867](https://github.com/unl/wdntemplates/pull/867))
- Scroll depth analytics have been disabled ([#868](https://github.com/unl/wdntemplates/pull/868))
- Disabled buttons should not have box-shadows ([#869](https://github.com/unl/wdntemplates/pull/869))
- Fixed various display issues with the nav bar and removed swipe events ([#870](https://github.com/unl/wdntemplates/pull/870))

### Added
- New loadable font variations have been added to support small caps and extended latin ([#871](https://github.com/unl/wdntemplates/pull/871))

### Removed
- All references to the old wiki have been removed ([f8d2ab4](https://github.com/unl/wdntemplates/commit/f8d2ab4ba23af3e668608fe8c04a90a3da4f2d06))

## 4.0.28 (July 14, 2015)

### Fixed
- Affiliate CSS media query adjustments ([#839](https://github.com/unl/wdntemplates/pull/839), [#840](https://github.com/unl/wdntemplates/pull/840))
- Favicon optimizations and making the iOS icons match ([#842](https://github.com/unl/wdntemplates/pull/842))
- MedisElementJS updated and patched for various issues ([a61c729](https://github.com/unl/wdntemplates/commit/a61c72987d27a6314be5da248df7c1342ae71ed9))
- Fixed alert message not loaded immediately due to race condition ([9bb042f](https://github.com/unl/wdntemplates/commit/9bb042f0869eb91f07bea81e0b33ed226f71c809))
- Fix main share widget flashing/changing colors during load ([7bc12b8](https://github.com/unl/wdntemplates/commit/7bc12b8e68d40560ed027e49706ddd0a23ee32f8))
- Reduce scope of `wdn-input-group-btn` styles ([abc242e](https://github.com/unl/wdntemplates/commit/abc242eff84a85ab3525c053471d1ed05313f30f))

### Added
- Notice of Nondiscrimination now included in non-editable footer ([#846](https://github.com/unl/wdntemplates/pull/846))

## 4.0.27 (May 11, 2015)

### Fixed
- MediaElementJS (audio/video player) updated and patched for continuous loading bug ([#834](https://github.com/unl/wdntemplates/pull/834))
- Change swipe to open navigation sensitivity settings ([#835](https://github.com/unl/wdntemplates/pull/835))
- Fix RSS link in events widget ([#837](https://github.com/unl/wdntemplates/pull/837))
- Update jQuery to version 1.11.3
- Make form legend styles more readable ([#838](https://github.com/unl/wdntemplates/pull/838))

## 4.0.26 (April 23, 2015)

### Fixed
- Fix share widget regressions introduced in 4.0.25 release ([#832](https://github.com/unl/wdntemplates/pull/832))

## 4.0.25 (April 14, 2015)

### Fixed
- Fix build issues with LESS compiler ([#818](https://github.com/unl/wdntemplates/pull/818), [#819](https://github.com/unl/wdntemplates/pull/819))
- Fix font smoothing issues in Safari ([#820](https://github.com/unl/wdntemplates/pull/820))
- Add LinkedIn to the share widget ([#821](https://github.com/unl/wdntemplates/pull/821))
- Removed opacity from wdn-button ([#824](https://github.com/unl/wdntemplates/pull/824))
- The UNL Search tool will no longer support overrides outside of the UNL Search application. The popover interface will be used for all searches. ([#830](https://github.com/unl/wdntemplates/pull/830))

### Added
- Affiliate styles (less file) have been updated to match current styles ([#831](https://github.com/unl/wdntemplates/pull/831))
- Social Share widget plugin now supports adding multiple widgets on the page ([#825](https://github.com/unl/wdntemplates/pull/825))

## 4.0.24 (November 11, 2014)

### Fixed
- Positioning of the share icon was off a few pixels ([#815](https://github.com/unl/wdntemplates/pull/815))
- Bad CSS selector in validation plugin for one-by-name - Positioning of the share icon was off a few pixels ([#817](https://github.com/unl/wdntemplates/pull/817))
- Flipbook in band_imagery plugin was showing the last image instead of first

## 4.0.23 (October 13, 2014)

### Fixed
- Fixed possible race condition with loading randomizer plugin CSS ([#812](https://github.com/unl/wdntemplates/pull/812))
- Improved print CSS to properly render header ([#810](https://github.com/unl/wdntemplates/pull/810))
- Corrected color contrast issue for month widget event listings for "today" ([#808](https://github.com/unl/wdntemplates/pull/808))
- Local analytic plugin was not properly tracking events ([#803](https://github.com/unl/wdntemplates/pull/803), [#807](https://github.com/unl/wdntemplates/pull/807))
- Changed the selected (home) breadcrumb to be red to improve visibility ([#805](https://github.com/unl/wdntemplates/pull/805), [#814](https://github.com/unl/wdntemplates/pull/814))
- Fixed issue with IE 10 not being able to close notice boxes ([#638](https://github.com/unl/wdntemplates/issues/638))
- Removed all CSS relating to the "apps" header segment ([#801](https://github.com/unl/wdntemplates/pull/801))

### Added
- Icons that match the streamline set ([#809](https://github.com/unl/wdntemplates/pull/809))
- Required attribute to main search input ([#811](https://github.com/unl/wdntemplates/pull/811))

## 4.0.20 - 4.0.22 (September 2, 2014)

### Fixed
- UNL Alerts are loaded with slightly different data

## 4.0.19 (August 27, 2014)

### Added
- This change log to make it easier to see what was added, removed, fixed and deprecated for each future release.
- Added TIPS Incident Reporting logo to the footer

### Fixed
- The events widgets were updated to display dates/times in the Central timezone.  They were converting dates to the local timzeone, which was causing confusion because they did not used to act this way.  It was also an issue because all day events are considered to start at midnight, but the timezone conversion was causing all day events to start at 11pm on the day before.
- Prevent the events band widget from displaying a location with the name of 'null'.  If an event did not have a location defined, it was displaying as 'null'.
- The events-band plugin should support multiple instance ([#792](https://github.com/unl/wdntemplates/pull/792))
- Styles for the `.wdn-promo-band` and `<blockquote>` elements were updated for color and font-size
