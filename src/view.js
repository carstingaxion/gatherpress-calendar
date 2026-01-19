/**
 * GatherPress Calendar Block Frontend Script
 *
 * Progressive enhancement for the GatherPress Calendar block.
 * This script adds interactive popover functionality to event dots,
 * but the calendar remains fully functional without JavaScript.
 *
 * - Event dots are simple <a> links
 * - Content (innerBlocks) for each event is in a hidden container
 * - JavaScript reads from hidden container and shows in popover
 * - Creates valid HTML
 *
 * Progressive enhancement for the GatherPress Calendar block.
 * This script adds interactive popover functionality to event dots,
 * but the calendar remains fully functional without JavaScript.
 *
 * @package
 * @since 0.1.0
 */

import { CLASS_NAMES } from './view/constants';
import { setupIntersectionObserver, cleanupObserver } from './view/observer';
import { closePopover } from './view/popover';
import { handleEscapeKey } from './view/handlers';

( function () {
	'use strict';

	/**
	 * Initialize popover functionality for all calendars on the page.
	 *
	 * Sets up:
	 * - IntersectionObserver for visibility tracking
	 * - Event handlers for visible calendars only
	 * - Global keyboard handlers (Escape)
	 *
	 * @since 0.1.0
	 *
	 * @return {void}
	 */
	function init() {
		const calendars = document.querySelectorAll(
			'.' + CLASS_NAMES.calendar
		);

		if ( ! calendars.length ) {
			return;
		}

		// Set up IntersectionObserver to track calendar visibility.
		setupIntersectionObserver( calendars );

		// Global escape key handler to close any open popover.
		document.addEventListener( 'keydown', handleEscapeKey );
	}

	/**
	 * Handle DOM ready state.
	 *
	 * Ensures initialization happens after DOM is fully loaded.
	 *
	 * @since 0.1.0
	 *
	 * @return {void}
	 */
	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', init );
	} else {
		init();
	}

	/**
	 * Cleanup on page unload.
	 *
	 * Ensures proper cleanup of observers and event listeners
	 * to prevent memory leaks.
	 *
	 * @since 0.1.0
	 *
	 * @return {void}
	 */
	window.addEventListener( 'beforeunload', function () {
		closePopover();
		cleanupObserver();
	} );
} )();
