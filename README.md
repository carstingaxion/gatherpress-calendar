# GatherPress Calendar

**Contributors:** carstenbach & WordPress Telex  
**Tags:** block, calendar, gatherpress, events, query-loop  
**Tested up to:** 7.1  
**Stable tag:** 0.4.2  
**License:** GPLv2 or later  
**License URI:** <https://www.gnu.org/licenses/gpl-2.0.html>  

A set of WordPress blocks that renders Query Loop results in a monthly calendar layout. Works with standard WordPress posts, custom post types, and GatherPress events.

[![Playground Demo Link](https://img.shields.io/badge/WordPress_Playground-blue?logo=wordpress&logoColor=%23fff&labelColor=%233858e9&color=%233858e9)](https://playground.wordpress.net/?blueprint-url=https://raw.githubusercontent.com/carstingaxion/gatherpress-calendar/main/.wordpress-org/blueprints/blueprint.json) [![Build, test & measure](https://github.com/carstingaxion/gatherpress-calendar/actions/workflows/build-test-measure.yml/badge.svg?branch=main)](https://github.com/carstingaxion/gatherpress-calendar/actions/workflows/build-test-measure.yml)

---

![Gradient block style with colorful background](.wordpress-org/screenshot-6.gif)

## Description

GatherPress Calendar is a WordPress block that renders Query Loop results as a monthly calendar. It integrates with the WordPress Query Loop block to display posts organized by their publication date (or event date for GatherPress events) in a structured calendar view.

https://github.com/user-attachments/assets/7089ef0c-e2aa-417a-a3fb-a5861315869b

---

## Block Architecture

The calendar is divided into modular nested blocks configured inside WordPress's core `core/query` block:

```text
core/query
└── gatherpress/calendar
    └── gatherpress/calendar-week
        └── gatherpress/calendar-day
            ├── core/paragraph (bound to day number)
            └── gatherpress/calendar-entries
                └── [Your Post Template Blocks] (e.g., Post Title, Post Date)
```

### 1. Calendar (`gatherpress/calendar`)
* Ancestor: Must be placed inside a `core/query` block.
* Manages target month/year calculation, weekday header rendering, and table grid structure.
* Supports color, spacing, border, and Interactivity API client-side navigation.

### 2. Calendar Week (`gatherpress/calendar-week`)
* Parent: `gatherpress/calendar`.
* Renders week table rows (`<tr>`) formatted to flow inside CSS Grid via `display: contents`.

### 3. Calendar Day (`gatherpress/calendar-day`)
* Parent: `gatherpress/calendar-week`.
* Renders individual day cells (`<td>`).
* Exposes block context: `gatherpress/dayDate`, `gatherpress/dayNumber`, `gatherpress/dayPosts`, `gatherpress/isEmpty`, `gatherpress/isToday`, `gatherpress/weekday`, `gatherpress/isWeekend`.
* Supports native layout controls (Flex), colors, borders, shadows, spacing, and typography.

### 4. Calendar Entries (`gatherpress/calendar-entries`)
* Parent: `gatherpress/calendar-day`.
* Iterates over `gatherpress/dayPosts` (similar to `core/post-template`).
* Renders its inner blocks once per post, injecting `postId` and `postType` context into each entry.
* Supports Flex and Grid layout controls, block gap, colors, borders, shadows, and spacing.

---

## Block Bindings

The plugin registers two core Block Bindings sources:

### `gatherpress/calendar-day`
Binds the day number to text/paragraph blocks inside a day cell.
* **Context used:** `gatherpress/dayNumber`, `gatherpress/isEmpty`.
* **Example:** Connects a `core/paragraph` block to automatically output the numeric day of the month without custom HTML.

### `gatherpress/calendar-heading`
Binds the currently active calendar month heading to a `core/heading` or `core/paragraph` block placed anywhere inside the same Query Loop.
* **Context used:** `query`.
* **Output:** Localized "Month Year" string (e.g., `September 2026`) that updates automatically when navigating between months.

---

## Query Loop & Pagination Integration

* **Automatic Date Filtering:** Applies `year` and `month` parameters to `WP_Query` and the REST API, restricting queries to the active month.
* **Core Query Pagination:** Fully compatible with `core/query-pagination-previous` and `core/query-pagination-next`. Clicking next/previous steps through calendar months sequentially.
* **Client Navigation:** Supports WordPress Interactivity API client-side navigation without full-page reloads.
* **Numeric Pagination Suppression:** Automatically suppresses `core/query-pagination-numbers` within calendar queries.

---

## Date Resolution & Post Types

* **Standard Posts & Custom Post Types:** Positioned by publication date (`post_date`).
* **GatherPress Events:** Positioned using the event start timestamp from GatherPress's event database table (`datetime_start_gmt`). Conflicting past/upcoming query filters are removed automatically.
* **Target Month Controls:**
  * **Default:** Current site month.
  * **Specific Month:** Defined via `selectedMonth` (`YYYY-MM`).
  * **Relative Offset:** Defined via `monthModifier` (integer offset from the current month, e.g., `-1` for previous month, `+1` for next month).

---

## Display & Styling

### Block Styles

* **`gatherpress/calendar`:**
  * `default` (Classic)
  * `minimal` (Minimal)
  * `bold` (Bold)
  * `circular` (Circular)
  * `gradient` (Gradient)
* **`gatherpress/calendar-entries`:**
  * `default` (Classic list/template layout)
  * `dots` (Colored status indicators)

### Weekday & Weekend Configuration

* **`showWeekdays` (boolean):** Toggles table header row (`<th>`) visibility.
* **`showWeekends` (boolean):** Toggles weekend columns in the grid.
* **Filterable Weekend Days:** Filter `gatherpress_calendar_weekend_days` allows customizing which days are considered weekends (defaults to `0` [Sunday] and `6` [Saturday]):

```php
add_filter( 'gatherpress_calendar_weekend_days', function() {
    return array( 5, 6 ); // Friday and Saturday
} );
```

### Responsive Behavior

* Uses CSS Container Queries (`@container calendar (max-width: 400px)`) to hide weekday headers and scale cell contents automatically in constrained spaces.
* Fallback media queries provided for browsers without container query support.

---

## Installation & Setup

1. Ensure the **GatherPress** plugin is installed and activated.
2. Upload the plugin files to `/wp-content/plugins/gatherpress-calendar/`
3. Activate the plugin.
4. Add a **Event Calendar** block (variation) to any page or template.
6. Configure inner blocks inside the day cell's template to customize event appearance.

![Calendar configuration in the block editor](.wordpress-org/screenshot-2.png)


## Screenshots

1. Classic calendar style showing GatherPress events
2. Calendar configuration in the block editor
3. Minimal block style with clean design
4. Bold block style with high contrast
5. Circular block style with rounded cells
6. Gradient block style with colorful background
7. Popover showing event details on mobile
8. Template configuration interface in editor

## Changelog

All notable changes to this project will be documented in the [CHANGELOG.md](CHANGELOG.md).
