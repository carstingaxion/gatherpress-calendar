/* eslint-env browser */
import { OBSERVER_CONFIG } from './constants';
import { state, visibilityMap, setObserver, getObserver } from './state';
import { closePopover } from './popover';
import { setupCalendar } from './handlers';

/**
 * Set up IntersectionObserver to track calendar visibility.
 *
 * The observer watches for calendars entering/leaving the viewport
 * and enables/disables event handlers accordingly. This provides:
 * - Better performance by reducing event handler overhead
 * - Lower battery consumption on mobile devices
 * - Automatic cleanup when calendars scroll off-screen
 *
 * @since 0.1.0
 *
 * @param {NodeList} calendars - List of calendar elements to observe.
 *
 * @return {void}
 */
export function setupIntersectionObserver( calendars ) {
	if ( ! ( 'IntersectionObserver' in window ) ) {
		// Fallback for browsers without IntersectionObserver support.
		// Set all calendars as visible and set them up immediately.
		calendars.forEach( function ( calendar ) {
			visibilityMap.set( calendar, true );
			setupCalendar( calendar );
		} );
		return;
	}

	/**
	 * IntersectionObserver callback.
	 *
	 * Processes intersection changes and updates calendar state.
	 *
	 * @param {IntersectionObserverEntry[]} entries - Array of intersection changes.
	 */
	setObserver(
		new IntersectionObserver(
			function ( entries ) {
				entries.forEach( function ( entry ) {
					const calendar = entry.target;
					const wasVisible = visibilityMap.get( calendar );
					const isVisible = entry.isIntersecting;

					// Update visibility state.
					visibilityMap.set( calendar, isVisible );

					if ( isVisible && ! wasVisible ) {
						// Calendar entered viewport - set it up.
						setupCalendar( calendar );
					} else if ( ! isVisible && wasVisible ) {
						// Calendar left viewport.
						// If this calendar has an active popover, close it.
						if ( state.calendar === calendar ) {
							closePopover();
						}
					}
				} );
			},
			{
				threshold: OBSERVER_CONFIG.threshold,
				rootMargin: OBSERVER_CONFIG.rootMargin,
			}
		)
	);

	// Start observing all calendars.
	calendars.forEach( function ( calendar ) {
		const observer = getObserver();
		visibilityMap.set( calendar, false );
		observer.observe( calendar );
	} );
}

/**
 * Stop observing all calendars and clean up observer.
 *
 * Called during component unmount or cleanup.
 *
 * @since 0.1.0
 *
 * @return {void}
 */
export function cleanupObserver() {
	const observer = getObserver();
	if ( observer ) {
		observer.disconnect();
		setObserver( null );
	}
}
