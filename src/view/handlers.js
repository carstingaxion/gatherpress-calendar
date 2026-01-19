import { CLASS_NAMES } from './constants';
import { state, isCalendarVisible } from './state';
import { showPopover, closePopover } from './popover';

/**
 * Handle click on event dot.
 *
 * Prevents default link navigation and shows popover instead.
 * Only processes if calendar is visible (optimization).
 *
 * @since 0.1.0
 *
 * @param {Event}       event     - The click event.
 * @param {HTMLElement} eventLink - The event dot link element.
 * @param {HTMLElement} calendar  - The calendar container.
 *
 * @return {void}
 */
export function handleEventClick( event, eventLink, calendar ) {
	// Check if calendar is visible before processing.
	if ( ! isCalendarVisible( calendar ) ) {
		return;
	}

	event.preventDefault();
	event.stopPropagation();
	showPopover( eventLink, calendar );
}

/**
 * Handle keyboard interaction on event dot.
 *
 * Enter and Space keys trigger the same action as click.
 * Only processes if calendar is visible.
 *
 * @since 0.1.0
 *
 * @param {KeyboardEvent} event     - The keyboard event.
 * @param {HTMLElement}   eventLink - The event dot link element.
 * @param {HTMLElement}   calendar  - The calendar container.
 *
 * @return {void}
 */
export function handleEventKeydown( event, eventLink, calendar ) {
	// Check if calendar is visible before processing.
	if ( ! isCalendarVisible( calendar ) ) {
		return;
	}

	if ( event.key === 'Enter' || event.key === ' ' ) {
		event.preventDefault();
		showPopover( eventLink, calendar );
	}
}

/**
 * Handle Escape key to close popover.
 *
 * Global handler that closes any open popover when Escape is pressed.
 *
 * @since 0.1.0
 *
 * @param {KeyboardEvent} event - The keyboard event.
 *
 * @return {void}
 */
export function handleEscapeKey( event ) {
	if ( event.key === 'Escape' && state.popover ) {
		closePopover();
	}
}

/**
 * Setup event handlers for a single calendar.
 *
 * Iterates through all event dots in the calendar and attaches:
 * - Click handler (prevents default navigation)
 * - Keyboard handler (Enter/Space keys)
 * - ARIA attributes for accessibility
 *
 * @since 0.1.0
 *
 * @param {HTMLElement} calendar - The calendar container element.
 *
 * @return {void}
 */
export function setupCalendar( calendar ) {
	const events = calendar.querySelectorAll( '.' + CLASS_NAMES.event );

	events.forEach( function ( eventLink ) {
		// Skip if already set up (prevents duplicate handlers).
		if ( eventLink.hasAttribute( 'data-setup' ) ) {
			return;
		}
		eventLink.setAttribute( 'data-setup', 'true' );

		// Add ARIA attributes for screen readers.
		eventLink.setAttribute( 'role', 'button' );
		eventLink.setAttribute( 'tabindex', '0' );

		// Attach event handlers.
		eventLink.addEventListener( 'click', function ( e ) {
			handleEventClick( e, eventLink, calendar );
		} );

		eventLink.addEventListener( 'keydown', function ( e ) {
			handleEventKeydown( e, eventLink, calendar );
		} );
	} );
}
