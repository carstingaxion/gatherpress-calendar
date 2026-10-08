# Calendar (`gatherpress/calendar`)

Renders posts or events from an enclosing Query Loop block as a responsive monthly, weekly, or daily calendar grid.

## Overview

The Calendar block sits inside a WordPress `core/query` block. It calculates date boundaries, determines column structures, and arranges its inner `gatherpress/calendar-week` rows into an accessible table structure.

The calendar can display ongoing rolling dates (current month, week, or day) or anchor its boundaries to a post that supports `gatherpress-event-date` (such as a festival, multi-day conference, or season).

## Placement & Hierarchy

- **Allowed Ancestor:** `core/query`
- **Allowed Direct Children:** `gatherpress/calendar-week`
- **Context Consumed:** `queryId`, `query`, `queryContext`, `displayLayout`, `templateSlug`, `previewPostType`, `postId`, `postType`
- **Context Provided:** `gatherpress/viewType`, `gatherpress/showWeekends`, `gatherpress/startDate`, `gatherpress/endDate`, `gatherpress/year`, `gatherpress/month`

## Block Settings

The block sidebar provides the following controls under **Calendar Settings**:

### Date Range Source

Controls what determines the calendar's start and end boundaries:

- **Default:** Uses rolling real-time dates based on the viewer's current date, the active view type, and any author-configured date modifier or manual date.
- **Current:** Dynamically derives the date range from the current post context (`context.postId` and `context.postType`). Only available when the host post type declares `gatherpress-event-date` support. In the editor, changes made in the event date picker update the calendar grid and bound heading immediately.
- **Specific:** Derives the date range from an explicit post. If multiple post types support event dates (for example, `gatherpress_event`, `gatherpress_season`), a post type selector is shown first. A searchable combobox lists matching posts across published, scheduled, and draft statuses.

When anchored to an event post (**Current** or **Specific**), manual rolling controls (`Number of units to show`, `Change Month`, `Specific Date`, and `Date Offset`) are hidden to avoid conflicting date boundaries. The block automatically calculates the duration in units and presets the view type accordingly ($\le 7$ days $\to$ Day, $\le 28$ days $\to$ Week, $> 28$ days $\to$ Month).

### Calendar View

Switches the grid layout mode:

- **Month:** Standard multi-week grid showing 1 to 12 consecutive months.
- **Week:** Continuous week rows showing 1 to 5 consecutive weeks.
- **Day:** Single-row grid showing 1 to 7 consecutive day columns.

### Number of Units to Show

*(Visible in **Default** mode only)*  
Configures how many consecutive view units to render:
- Month view: 1 to 12 months.
- Week view: 1 to 5 weeks.
- Day view: 1 to 7 days.

### Specific Date & Date Offset

*(Visible in **Default** mode only)*
- **Specific Date:** Pins the calendar start to a fixed date (`YYYY-MM-DD` or `YYYY-MM`).
- **Date Offset:** Offsets the start relative to the current date (+/- N units).

### Grid Options

- **Show Weekdays:** Toggles visibility of the table header (`<th>`) containing weekday labels. When disabled, headers remain in markup for screen readers using `.gatherpress--screen-reader-text`.
- **Show Weekends:** Toggles weekend columns in month and week views. Weekend days default to Saturday and Sunday and are customizable via the `gatherpress_calendar_weekend_days` filter.

## Query Loop & Pagination

- **Date Boundaries:** WP_Query arguments apply inclusive boundaries (`after` and `before` with `inclusive => true`).
- **Pagination Sync:** Stepping through pages via `core/query-pagination-next` and `core/query-pagination-previous` advances by the active `unitCount` (for example, advancing a 7-month calendar steps forward by 7 months).
- **Label Sync:** Button labels in pagination blocks update automatically to reflect the active view type and unit count (for example, "Previous 3 Months" / "Next 3 Months").
- **Client-Side Navigation:** Supports WordPress Interactivity API client-side navigation. Focus moves to the calendar heading or table caption following navigation.

## Accessibility

- The calendar table includes a visually hidden `<caption>` element identifying the active unit.
- If weekday headers are hidden visually, they remain accessible to screen readers via `.gatherpress--screen-reader-text`.
- Today's date cell receives `aria-current="date"` on the active day cell.
- If multiple week rows are rendered, a hidden row header (`Week N`) is output so screen reader users hear the ISO week number when navigating rows.