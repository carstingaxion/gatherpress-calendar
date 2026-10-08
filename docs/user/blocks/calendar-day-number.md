# Calendar Day Number (`gatherpress/calendar-day`)

A Block Bindings source that binds a `core/paragraph` block to the current day number of a calendar cell.

## Overview

The `gatherpress/calendar-day` binding source populates paragraph blocks inside `gatherpress/calendar-day` with the cell's day number.

When placed in inactive or padding cells (`isEmpty: true`), the source outputs an empty string.

## Supported Blocks

- `core/paragraph`

## Attribute Binding

Binds to the `content` attribute:

```html
<!-- wp:paragraph {"metadata":{"bindings":{"content":{"source":"gatherpress/calendar-day"}}}} -->
<p></p>
<!-- /wp:paragraph -->
```

## Date Formatting Options

The binding source supports an optional format argument in its binding metadata, configurable via the block settings sidebar under **Day Number Settings**:

| Format | Output Example | Description |
| --- | --- | --- |
| `j` (Default) | 1, 2, 15 | Day of the month without leading zeros. |
| `d`   | 01, 02, 15 | Day of the month with two leading digits. |
| `jS`  | 1st, 2nd, 15th | English ordinal suffix. |
| `j.`  | 1., 2., 15. | Dot suffix (standard European notation). |
| `D j` | Mon 1, Tue 2 | Abbreviated weekday and day of the month. |

### Example with Custom Format

```html
<!-- wp:paragraph {"metadata":{"bindings":{"content":{"source":"gatherpress/calendar-day","args":{"format":"d"}}}}} -->
<p></p>
<!-- /wp:paragraph -->
```