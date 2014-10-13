# Changelog
All notable changes to this project will be documented in this file.

## 4.0.23 (October 13, 2014)

### Fixed
- Fixed possible race condition with loading randomizer plugin CSS ([#812](https://github.com/unl/wdntemplates/pull/812))
- Improved print CSS to properly render header ([#810](https://github.com/unl/wdntemplates/pull/810))
- Corrected color contrast issue for month widget event listings for "today" ([#808](https://github.com/unl/wdntemplates/pull/808))
- Local analytic plugin was not properly tracking events ([#803](https://github.com/unl/wdntemplates/pull/803), [#807](https://github.com/unl/wdntemplates/pull/803))
- Changed the selected (home) breadcrumb to be red to improve visibility ([#805](https://github.com/unl/wdntemplates/pull/805))
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
