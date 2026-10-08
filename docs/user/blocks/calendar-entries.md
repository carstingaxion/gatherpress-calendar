# Calendar Entries (`gatherpress/calendar-entries`)

Renders a list of events scheduled on a calendar day, using its inner blocks as a template for each event.

## Overview

The Calendar Entries block functions similarly to `core/post-template`. It loops over the events for the current day (from `gatherpress/dayPosts`) and renders its inner block structure once per event.

For each iteration, the block injects the specific event's `postId` and `postType` into the block context tree.

## Placement & Hierarchy

- **Allowed Ancestor:** `gatherpress/calendar-day`
- **Allowed Direct Children:** Core post blocks and GatherPress event blocks (for example, `core/post-title`, `gatherpress/event-date`, `gatherpress/modal-manager`).
- **Context Consumed:** `gatherpress/dayDate`, `gatherpress/dayPosts`, `gatherpress/isEmpty`, `postType`
- **Context Provided:** `postId`, `postType` (per entry)

## Block Styles

- **Classic (`default`):** Standard list layout showing event start times, titles, and popover modals.
- **Colored Dots (`dots`):** Compact display hiding the visible text and rendering interactive circular color indicators per event. Used automatically on narrow containers via Container Queries.

## Accessibility Notes

- **Hidden Titles in Time Links:** When an entry template displays the event time via `gatherpress/event-date` without a visible `core/post-title` outside a modal, the event title is injected into the time link inside `<span class="gatherpress--screen-reader-text">`. This ensures screen reader users hear which event the time trigger belongs to (WCAG 2.4.4 / 4.1.2).
- **Untitled Events:** If an event has no post title, a localized placeholder (`(no title)`) is provided so keyboard and screen reader users have an accessible link text to open the details modal.