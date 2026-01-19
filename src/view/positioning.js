import { POPOVER_CONFIG } from './constants';
import { state, isCalendarVisible } from './state';

/**
 * Calculate optimal popover position.
 *
 * Determines the best position for the popover based on:
 * - Event dot location
 * - Viewport dimensions
 * - Popover dimensions
 *
 * Positioning logic:
 * 1. Center horizontally on the dot
 * 2. Place below dot with gap (default)
 * 3. If no space below, place above dot
 * 4. Constrain to viewport with margins
 *
 * @since 0.1.0
 *
 * @param {HTMLElement} popover   - The popover element to position.
 * @param {HTMLElement} eventLink - The event dot link element.
 *
 * @return {void}
 */
export function positionPopover( popover, eventLink ) {
	const linkRect = eventLink.getBoundingClientRect();
	const popRect = popover.getBoundingClientRect();
	const vw = window.innerWidth;
	const vh = window.innerHeight;
	const gap = POPOVER_CONFIG.gap;
	const margin = POPOVER_CONFIG.margin;

	// Start with popover below the dot.
	let top = linkRect.bottom + gap;
	// Center horizontally on the dot.
	let left = linkRect.left + linkRect.width / 2 - popRect.width / 2;

	// Keep in viewport horizontally.
	if ( left < margin ) {
		left = margin;
	}
	if ( left + popRect.width > vw - margin ) {
		left = vw - popRect.width - margin;
	}

	// Keep in viewport vertically.
	// If popover would extend below viewport, show it above the dot instead.
	if ( top + popRect.height > vh - margin ) {
		top = linkRect.top - popRect.height - gap;
	}
	// If still not enough space, clamp to viewport top.
	if ( top < margin ) {
		top = margin;
	}

	// Apply calculated position.
	popover.style.top = top + 'px';
	popover.style.left = left + 'px';
}

/**
 * Create position update handler with visibility check.
 *
 * Returns a function that updates popover position only when
 * the calendar is visible in the viewport.
 *
 * @since 0.1.0
 *
 * @param {HTMLElement} popover   - The popover element.
 * @param {HTMLElement} eventLink - The event dot link element.
 * @param {HTMLElement} calendar  - The calendar container.
 *
 * @return {Function} Position update function.
 */
export function createPositionUpdater( popover, eventLink, calendar ) {
	return function () {
		if ( state.popover && isCalendarVisible( calendar ) ) {
			positionPopover( popover, eventLink );
		}
	};
}
