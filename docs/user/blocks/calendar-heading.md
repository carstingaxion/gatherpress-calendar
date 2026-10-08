# Calendar Heading (`gatherpress/calendar-heading`)

A Block Bindings source that binds a `core/heading` or `core/paragraph` block to the active date range of an enclosing GatherPress Calendar.

## Overview

The `gatherpress/calendar-heading` binding source allows any standard WordPress Heading or Paragraph block to dynamically display the calendar's visible date range.

When placed inside the same `core/query` block as a Calendar block, it reflects pagination, date offsets, and event post anchoring without custom coding.

## Supported Blocks

- `core/heading`
- `core/paragraph`

## Attribute Binding

Binds to the `content` attribute:

```html
<!-- wp:heading {"metadata":{"bindings":{"content":{"source":"gatherpress/calendar-heading"}}}} -->
<h2></h2>
<!-- /wp:heading -->
```

## Formatted Output

The binding evaluates `viewType`, `unitCount`, and the active date boundaries:

-   **Single Month:** Localized month and year (e.g., September 2026).
-   **Multi-Month Range:** Start and end month span (e.g., May – November 2026).
-   **Single Week:** Formatted day span (e.g., Sep 14 – 20, 2026 or May 25 – Jun 7, 2026 across multiple weeks). Respects weekend-hiding settings.
-   **Single Day:** Full localized day and date (e.g., Friday, January 8, 2027).
-   **Multi-Day Range:** Formatted date span (e.g., May 30 – Jun 2, 2026).

## Integration with Event Anchoring

When the sibling Calendar block uses dateRangeSource set to **Current** (`context`) or **Specific** (`selected`):

-   The heading reflects the event's start and end date range.
-   In the editor, date adjustments made in GatherPress's Event Date & Time sidebar update the bound heading on the canvas without saving.
-   On the frontend, inclusive date boundaries ensure the full event span is reflected in page headers and Query Loop blocks.