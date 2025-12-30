/**
 * GatherPress Calendar Block Frontend Script
 *
 * This file contains JavaScript code that runs on the frontend of the site
 * for posts/pages containing the GatherPress Calendar block. It handles
 * interactive behaviors such as event click handling and dynamic navigation.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/#view-script
 *
 * @package GatherPressCalendar
 * @since 0.1.0
 */

/**
 * Initialize the GatherPress Calendar block frontend functionality
 *
 * Sets up event listeners and interactive features for the calendar.
 *
 * @since 0.1.0
 *
 * @return {void}
 */
( function initGatherPressCalendar() {
	'use strict';

	/**
	 * Wait for DOM to be ready
	 */
	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', init );
	} else {
		init();
	}

	/**
	 * Initialize calendar functionality
	 *
	 * @since 0.1.0
	 *
	 * @return {void}
	 */
	function init() {
		const calendars = document.querySelectorAll( '.gatherpress-calendar' );

		if ( ! calendars.length ) {
			return;
		}

		calendars.forEach( function ( calendar ) {
			setupEventClickHandlers( calendar );
		} );

		// Log initialization
		if ( window.console && window.console.log ) {
			// eslint-disable-next-line no-console
			console.log(
				'GatherPress Calendar: Initialized ' +
					calendars.length +
					' calendar(s)'
			);
		}
	}

	/**
	 * Setup click handlers for events in the calendar
	 *
	 * @since 0.1.0
	 *
	 * @param {HTMLElement} calendar - The calendar element.
	 *
	 * @return {void}
	 */
	function setupEventClickHandlers( calendar ) {
		const events = calendar.querySelectorAll(
			'.gatherpress-calendar__event'
		);

		events.forEach( function ( event ) {
			event.addEventListener( 'click', function ( e ) {
				const link = event.querySelector( 'a' );

				if ( link ) {
					// If there's a link inside, navigate to it
					window.location.href = link.href;
				} else {
					// Custom event for developers to hook into
					const customEvent = new CustomEvent(
						'gatherpress-calendar-event-click',
						{
							detail: {
								element: event,
								calendar: calendar,
							},
							bubbles: true,
						}
					);
					document.dispatchEvent( customEvent );
				}
			} );

			// Add keyboard accessibility
			event.setAttribute( 'tabindex', '0' );
			event.setAttribute( 'role', 'button' );

			event.addEventListener( 'keydown', function ( e ) {
				if ( e.key === 'Enter' || e.key === ' ' ) {
					e.preventDefault();
					event.click();
				}
			} );
		} );
	}
} )();