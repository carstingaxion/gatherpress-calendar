# Calendar Day (`gatherpress/calendar-day`)

Renders an individual calendar cell (`<td>`) containing the day number and event entries.

## Overview

The Calendar Day block represents a single day in the grid. It acts as a context provider for its child blocks, supplying the date, day number, and associated posts/events.

In the block editor, one day cell is designated as "active" and editable with full live block controls. Inactive cells render lightweight, isolated previews that mirror the active day cell's template and styling.

## Placement & Hierarchy

- **Allowed Parents:** `gatherpress/calendar-week`, `gatherpress/calendar`
- **Allowed Direct Children:** Standard WordPress blocks (typically a `core/paragraph` bound to day number and a `gatherpress/calendar-entries` block).
- **Context Consumed:** `queryId`, `gatherpress/year`, `gatherpress/month`, `gatherpress/dayDate`, `gatherpress/dayNumber`, `gatherpress/dayPosts`, `gatherpress/isEmpty`, `gatherpress/isToday`, `gatherpress/weekday`, `gatherpress/isWeekend`.
- **Context Provided:** `gatherpress/dayDate`, `gatherpress/dayNumber`, `gatherpress/dayPosts`, `gatherpress/isEmpty`, `gatherpress/isToday`.

## Dynamic CSS Classes

Day cells receive classes reflecting their calendar state:

| Class | Condition |
|---|---|
| `.gatherpress-calendar__day` | Base class on all day cells. |
| `.is-empty` | Padding cells before the 1st or after the last day of a month. |
| `.has-posts` | Applied when one or more events/posts fall on this day. |
| `.is-today` | Today's date (also sets `aria-current="date"`). Updated in real time via the Interactivity API. |
| `.is-past` | Days earlier than today. |
| `.is-future` | Days later than today. |
| `.is-weekend` | Days classified as weekend days. |
| `.is-{weekday}` | Lowercase weekday slug (for example, `.is-monday`, `.is-friday`). |

## Block Supports

The Calendar Day block supports:
- **Layout:** Flex layout controls (horizontal, vertical, justification, alignment).
- **Color:** Text, background, and gradient supports.
- **Border:** Color, radius, style, and width controls.
- **Spacing:** Padding, margin, and block gap.
- **Typography:** Font size, line height, font family, and font weight.
- **Shadow:** Drop shadow presets and custom values.