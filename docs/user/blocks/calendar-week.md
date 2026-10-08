# Calendar Week (`gatherpress/calendar-week`)

A structural row container representing a single week or consecutive block of days within the GatherPress Calendar grid.

## Overview

The Calendar Week block renders as a table row (`<tr>`). On the frontend, it uses `display: contents` to allow day cells to flow directly into the CSS Grid layout managed by the parent calendar table.

It renders across all calendar views:
- **Month View:** Outputs one row for each week of the month, including empty padding cells before the first and after the last day.
- **Week View:** Outputs consecutive 7-day (or 5-day) rows without leading or trailing empty cells.
- **Day View:** Outputs a single row containing the configured number of day cells.

## Placement & Hierarchy

- **Allowed Parent:** `gatherpress/calendar`
- **Allowed Direct Children:** `gatherpress/calendar-day`
- **Context Consumed:** `queryId`, `gatherpress/year`, `gatherpress/month`, `gatherpress/weekIndex`, `gatherpress/weekDays`, `gatherpress/weekNumber`, `gatherpress/activeDate`, `gatherpress/showWeekends`
- **Context Provided:** `gatherpress/weekIndex`

## Markup & Attributes

- **Element:** `<tr>` with class `gatherpress-calendar__week`.
- **Row Header:** When multiple week rows are rendered and week numbers are active, the row prepends a hidden `<th scope="row" class="gatherpress--screen-reader-text">Week N</th>` cell for screen reader orientation.
- **Attributes:**
  - `weekIndex` (`number`, default `0`): The zero-based index of this week within the current calendar unit.
  - Supports standard WordPress text color and custom CSS class names.