# Calendar Blocks

The GatherPress Calendar block set renders posts and GatherPress events inside WordPress's core Query Loop block (`core/query`) as a structured, accessible monthly, weekly, or daily calendar grid.

[Calendar](./calendar.md): The main container block. Calculates date boundaries, manages column layouts, and arranges week rows into a responsive table grid. Can display rolling dates or anchor its range to a post that supports `gatherpress-event-date` (such as a multi-day conference, festival, or season).

[Calendar Week](./calendar-week.md): A table row (`<tr>`) container grouping day cells for a single week or consecutive block of days. Uses `display: contents` to flow day cells directly into the table's CSS Grid.

[Calendar Day](./calendar-day.md): An individual day cell (`<td>`) in the grid. Serves as a context provider for its child blocks, supplying the date, day number, and associated events. Supports layout, border, color, spacing, and typography controls.

[Calendar Entries](./calendar-entries.md): Lists the events scheduled for a single day. Works similarly to `core/post-template`, rendering its inner blocks as a template once per event with that event's `postId` and `postType` context.

---

## Block Bindings Sources

These sources bind standard WordPress blocks to live calendar data without custom code:

[Calendar Heading](./calendar-heading.md): Binds a `core/heading` or `core/paragraph` block to the visible date range of an enclosing Calendar block. Automatically updates across pagination steps, view changes, and event-anchored dates.

[Calendar Day Number](./calendar-day-number.md): Binds a `core/paragraph` block inside a day cell to that cell's day number. Supports customizable date formats (for example, `1`, `01`, `1st`, `1.`, `Mon 1`).

---

## Block Variations

GatherPress Calendar registers block variations on core blocks for clean naming, inserter categorization, and List View representation:

### Bound Block Variations
- **Calendar Heading (`core/heading`):** Heading preconfigured with the `gatherpress/calendar-heading` binding, level 2, center alignment, and class `gatherpress-calendar-heading`.
- **Calendar Day Number (`core/paragraph`):** Paragraph preconfigured with the `gatherpress/calendar-day` binding, small font size, and class `gatherpress-calendar__day-number`.

### Pagination Variations
- **Calendar Pagination (`core/query-pagination`):** Navigation container configured with flex spacing and class `gatherpress-calendar-pagination`.
- **Previous Calendar Period (`core/query-pagination-previous`):** Steps backward by the calendar's active span, styled with class `gatherpress-calendar-pagination-previous`.
- **Next Calendar Period (`core/query-pagination-next`):** Steps forward by the calendar's active span, styled with class `gatherpress-calendar-pagination-next`.

---

## Block Hierarchy

The calendar blocks nest inside a standard WordPress Query Loop block:

```text
core/query (Event Calendar variation)
├── core/heading (Calendar Heading variation)
├── core/query-pagination (Calendar Pagination variation)
│   ├── core/query-pagination-previous (Previous Calendar Period variation)
│   └── core/query-pagination-next (Next Calendar Period variation)
└── gatherpress/calendar
    └── gatherpress/calendar-week
        └── gatherpress/calendar-day
            ├── core/paragraph (Calendar Day Number variation)
            └── gatherpress/calendar-entries
                └── [Event Template Blocks] (e.g. Post Title, Event Date, Modal Manager)