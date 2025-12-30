
# GatherPress Calendar

Contributors:      WordPress Telex
Tags:              block, calendar, gatherpress, events
Tested up to:      6.8
Stable tag:        0.1.0
License:           GPLv2 or later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html


A WordPress block plugin that provides a table-based alternative to the `core/post-template` block for displaying query results.

## Features

- **Calendar Layout**: Display query loop posts in a structured calendar format
- **Core Block Support**: Works with standard WordPress post blocks:
  - `core/post-title`
  - `core/post-date`
  - `core/post-excerpt`
  - `core/post-featured-image`
  - `core/post-terms`
  - `core/post-author`
  - `core/post-author-name`
  - `core/post-author-biography`
  - `core/avatar`


## Usage

1. Add a **Query Loop** block to your page/post
2. Inside the Query Loop, add the **GatherPress Calendar** block
3. Add post blocks (e.g., Post Title, Post Date) as children to setup, how one event will be shown inside the calendar.


## Block Structure

The block must be used as a child of `core/query` (Query Loop block). It renders a full monthly calendar of the current month, where each event is placed on its event date.
