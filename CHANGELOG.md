# Changelog
All notable changes to this project will be documented in this file.

## 4.0.23 (October 13, 2014)

### Fixed
- Fixed possible race condition with loading randomizer plugin CSS
- Improved print CSS to properly render header
- Corrected color contrast issue for month widget event listings for "today"
- Local analytic plugin was not properly tracking events
- Changed the selected (home) breadcrumb to be red to improve visibility
- Fixed issue with IE 10 not being able to close notice boxes
- Removed all CSS relating to the "apps" header segment

### Added
- Icons that match the streamline set

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
- The events-band plugin should support multiple instance (#792)
- Styles for the `.wdn-promo-band` and `<blockquote>` elements were updated for color and font-size
