# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased](https://github.com/carstingaxion/gatherpress-calendar/compare/0.8.0...HEAD)

## [0.8.0](https://github.com/carstingaxion/gatherpress-calendar/compare/0.7.1...0.8.0) - 2026-10-08

### 🚀 Added

- Support separator filter ([#141](https://github.com/carstingaxion/gatherpress-calendar/pull/141))
- Feature/named variations ([#140](https://github.com/carstingaxion/gatherpress-calendar/pull/140))
- Allow to define the date range via an event ([#139](https://github.com/carstingaxion/gatherpress-calendar/pull/139))
- fix(i18n): make calendar heading date formats translatable ([#125](https://github.com/carstingaxion/gatherpress-calendar/pull/125))
- feat(calendar): announce ISO week number in multi-week views ([#123](https://github.com/carstingaxion/gatherpress-calendar/pull/123))
- Remove all hard post type deps in favor of supports ([#122](https://github.com/carstingaxion/gatherpress-calendar/pull/122))
- Update README from actual plugin code and add a Warning about non-existent block deprecations ([#119](https://github.com/carstingaxion/gatherpress-calendar/pull/119))
- Auto-update labels of pagination blocks based on attributes ([#118](https://github.com/carstingaxion/gatherpress-calendar/pull/118))
- Allow customizing the maximum number of posts queried for each calendar ([#116](https://github.com/carstingaxion/gatherpress-calendar/pull/116))

### 🐛 Fixed

- Keep aria-modal and SVG markup in calendar weeks ([#133](https://github.com/carstingaxion/gatherpress-calendar/pull/133))
- fix(entries): restore the page post after a nested calendar ([#130](https://github.com/carstingaxion/gatherpress-calendar/pull/130))
- SOC & DRY ([#124](https://github.com/carstingaxion/gatherpress-calendar/pull/124))
- Fix month navigation for queryId 0 and move focus to the new month ([#115](https://github.com/carstingaxion/gatherpress-calendar/pull/115))

### Dependency Updates & Maintenance

- Bump shell-quote from 1.10.0 to 1.12.0 ([#138](https://github.com/carstingaxion/gatherpress-calendar/pull/138))
- Bump compression from 1.8.1 to 1.8.2 ([#127](https://github.com/carstingaxion/gatherpress-calendar/pull/127))
- Bump proxy-addr from 2.0.7 to 2.0.8 ([#126](https://github.com/carstingaxion/gatherpress-calendar/pull/126))
- Bump source-map-js from 1.2.1 to 1.2.2 ([#128](https://github.com/carstingaxion/gatherpress-calendar/pull/128))

## [0.7.1](https://github.com/carstingaxion/gatherpress-calendar/compare/0.7.0...0.7.1) - 2026-10-05

### Fixes

- overwriting GatherPress core editor settings (#114) Props to @mattcowan

## [0.7.0](https://github.com/carstingaxion/gatherpress-calendar/compare/0.6.0...0.7.0) - 2026-10-04

### 🚀 Added

- Interactivity API for timebased CSS classes ([#110](https://github.com/carstingaxion/gatherpress-calendar/pull/110))
- Allow to use custom date format for the dayNumber ([#109](https://github.com/carstingaxion/gatherpress-calendar/pull/109))
- Update block names (query + heading) from unitCount and viewType ([#108](https://github.com/carstingaxion/gatherpress-calendar/pull/108))
- Show event titles, fit narrow screens, and name the calendar table ([#101](https://github.com/carstingaxion/gatherpress-calendar/pull/101))
- Add the event title to calendar entry links for screen readers ([#100](https://github.com/carstingaxion/gatherpress-calendar/pull/100))

### 🐛 Fixed

- Dont show fake events on every day, but only when selected (and no real event data exists) ([#106](https://github.com/carstingaxion/gatherpress-calendar/pull/106))
- Fix wrong dates caused by tz ([#105](https://github.com/carstingaxion/gatherpress-calendar/pull/105))

### Dependency Updates & Maintenance

- Bump the wordpress-packages group across 1 directory with 11 updates ([#104](https://github.com/carstingaxion/gatherpress-calendar/pull/104))
- Bump brace-expansion ([#99](https://github.com/carstingaxion/gatherpress-calendar/pull/99))

## [0.6.0](https://github.com/carstingaxion/gatherpress-calendar/compare/0.5.0...0.6.0) - 2026-09-30

### 🚀 Added

- Reduce UI of GatherPress core query controls. ([#97](https://github.com/carstingaxion/gatherpress-calendar/pull/97))
- Allow to render n-calendars ([#95](https://github.com/carstingaxion/gatherpress-calendar/pull/95))

## [0.5.0](https://github.com/carstingaxion/gatherpress-calendar/compare/0.4.2...0.5.0) - 2026-09-29

### 🚀 Added

- week & day views ([#87](https://github.com/carstingaxion/gatherpress-calendar/pull/87))
- Fix/apply styles to entries ([#85](https://github.com/carstingaxion/gatherpress-calendar/pull/85))
- Fix/remove useless code ([#84](https://github.com/carstingaxion/gatherpress-calendar/pull/84))
- Remove custom date-query filter in favor of GatherPress' core  ([#82](https://github.com/carstingaxion/gatherpress-calendar/pull/82))

## [0.4.2](https://github.com/carstingaxion/gatherpress-calendar/compare/0.4.1...0.4.2) - 2026-09-26

- Fix/remove unused code ([#79](https://github.com/carstingaxion/gatherpress-calendar/pull/79))

## [0.4.1](https://github.com/carstingaxion/gatherpress-calendar/compare/0.4.0...0.4.1) - 2026-09-25

- Fix/a lot of css ([#76](https://github.com/carstingaxion/gatherpress-calendar/pull/76))

## [0.4.0](https://github.com/carstingaxion/gatherpress-calendar/compare/0.3.1...0.4.0) - 2026-09-23

### 🚀 Added

- Feature/splitt off blocks 2 ([#69](https://github.com/carstingaxion/gatherpress-calendar/pull/69))
- Feature/refactor following gatherpress awesome ([#66](https://github.com/carstingaxion/gatherpress-calendar/pull/66))
- Add compatibility for core/pagination blocks ([#62](https://github.com/carstingaxion/gatherpress-calendar/pull/62))
- Add a new attribute that holds the visibility state of the weekdays header ([#61](https://github.com/carstingaxion/gatherpress-calendar/pull/61))
- Feature/interactivity api refactor 2 ([#57](https://github.com/carstingaxion/gatherpress-calendar/pull/57))

### Dependency Updates & Maintenance

- Bump ws from 7.5.10 to 7.5.13 ([#50](https://github.com/carstingaxion/gatherpress-calendar/pull/50))
- Bump qs and express ([#42](https://github.com/carstingaxion/gatherpress-calendar/pull/42))
- Bump websocket-driver from 0.7.4 to 0.7.5 ([#51](https://github.com/carstingaxion/gatherpress-calendar/pull/51))
- Bump fast-uri from 3.1.0 to 3.1.7 ([#44](https://github.com/carstingaxion/gatherpress-calendar/pull/44))
- Bump postcss-selector-parser ([#49](https://github.com/carstingaxion/gatherpress-calendar/pull/49))
- Bump js-yaml from 4.1.1 to 4.3.2 ([#48](https://github.com/carstingaxion/gatherpress-calendar/pull/48))
- Bump http-proxy-middleware from 2.0.9 to 2.0.10 ([#47](https://github.com/carstingaxion/gatherpress-calendar/pull/47))
- Bump picomatch from 2.3.1 to 2.3.2 ([#43](https://github.com/carstingaxion/gatherpress-calendar/pull/43))
- Bump the composer group across 1 directory with 2 updates ([#45](https://github.com/carstingaxion/gatherpress-calendar/pull/45))
- Bump @babel/plugin-transform-modules-systemjs from 7.28.5 to 7.29.8 ([#46](https://github.com/carstingaxion/gatherpress-calendar/pull/46))
- Bump follow-redirects from 1.15.11 to 1.16.0 ([#38](https://github.com/carstingaxion/gatherpress-calendar/pull/38))
- Bump svgo from 3.3.2 to 3.3.5 ([#29](https://github.com/carstingaxion/gatherpress-calendar/pull/29))
- Bump immutable from 5.1.4 to 5.1.9 ([#28](https://github.com/carstingaxion/gatherpress-calendar/pull/28))
- Run packages-update ([#41](https://github.com/carstingaxion/gatherpress-calendar/pull/41))

## [0.3.1](https://github.com/carstingaxion/gatherpress-calendar/compare/0.3.0...0.3.1) - 2026-09-11

- Prepare for f.t automation ([#23](https://github.com/carstingaxion/gatherpress-calendar/pull/23))
- rebuild as release artifact
