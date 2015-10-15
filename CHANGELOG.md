# Changelog
All notable changes to this project will be documented in this file.

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
