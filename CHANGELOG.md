# Changelog
All notable changes to this project will be documented in this file.

## 4.0.19

### Added
- This change log to make it easier to see what was added, removed, fixed and deprecated for each future release.
- Added TIPS Incident Reporting logo to the footer

### Deprecated
- Nothing.

### Removed
- Nothing.

### Fixed
- Display event widget dates/times in the Central timezone.  Events widgets were converting dates to the local timzeone, which was causing confusion because they did not used to act this way.  It was also an issue because all day events are considered to start at midnight, but the timezone conversion was causing all day events to start at 11pm on the day before.
