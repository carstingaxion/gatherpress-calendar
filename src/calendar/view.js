/**
 * GatherPress Calendar Interactivity Store
 *
 * Moves keyboard focus to the month heading after "Previous Month" or
 * "Next Month" changes the calendar without a page reload.
 *
 * After client-side navigation, core/query focuses the first link of its
 * Post Template. A calendar has no Post Template, so focus fell back to the
 * document body, and screen readers did not hear the new month.
 *
 * @package
 */

import { store, getElement, getContext } from '@wordpress/interactivity';

/**
 * Router region of the calendar whose pagination link was clicked last.
 *
 * @type {string|null}
 */
let pendingRegion = null;

// Browser back/forward replaces a click whose navigation has not finished.
// The router renders that history entry asynchronously, after this runs.
window.addEventListener( 'popstate', () => {
	pendingRegion = null;
} );

/**
 * Returns the ID of the router region that contains an element.
 *
 * @param {Element|null} element Element inside a core/query block.
 *
 * @return {string|null} Region ID, like "query-0", or null.
 */
function getRegionId( element ) {
	return (
		element?.closest( '[data-wp-router-region]' )?.dataset.wpRouterRegion ??
		null
	);
}

// Track active modal elements to elevate ONLY the cell that owns the open modal.
document.addEventListener( 'click', ( event ) => {
	const trigger = event.target?.closest?.(
		'.gatherpress-modal--trigger-open'
	);
	if ( trigger ) {
		const entry = trigger.closest( '.gatherpress-calendar__entry' );
		const day = trigger.closest( '.gatherpress-calendar__day' );

		document
			.querySelectorAll( '.is-modal-active' )
			.forEach( ( el ) => el.classList.remove( 'is-modal-active' ) );
		if ( entry ) {
			entry.classList.add( 'is-modal-active' );
		}
		if ( day ) {
			day.classList.add( 'is-modal-active' );
		}

		// Clear background hover/focus when opening modal.
		const { state } = store( 'gatherpress/calendar' );
		state.hoveredEventId = null;
		state.focusedEventId = null;
	}

	const closeBtn = event.target?.closest?.(
		'.gatherpress-modal--trigger-close'
	);
	if ( closeBtn ) {
		document
			.querySelectorAll( '.is-modal-active' )
			.forEach( ( el ) => el.classList.remove( 'is-modal-active' ) );
	}
} );

document.addEventListener( 'keydown', ( event ) => {
	if ( 'Escape' === event.key ) {
		document
			.querySelectorAll( '.is-modal-active' )
			.forEach( ( el ) => el.classList.remove( 'is-modal-active' ) );
	}
} );

store( 'gatherpress/calendar', {
	state: {
		hoveredEventId: null,
		focusedEventId: null,
	},
	actions: {
		hoverEvent( event ) {
			if ( event?.target?.closest?.( '.wp-block-gatherpress-modal' ) ) {
				return;
			}
			// Do not highlight background if a modal is currently open.
			if (
				document.querySelector(
					'.is-modal-active, dialog[open], .wp-block-gatherpress-modal.is-open'
				)
			) {
				return;
			}
			const context = getContext();
			if ( context?.eventId ) {
				const { state } = store( 'gatherpress/calendar' );
				state.hoveredEventId = context.eventId;
			}
		},

		unhoverEvent( event ) {
			if (
				event?.relatedTarget?.closest?.( '.wp-block-gatherpress-modal' )
			) {
				return;
			}
			const { state } = store( 'gatherpress/calendar' );
			state.hoveredEventId = null;
		},

		focusEvent( event ) {
			if ( event?.target?.closest?.( '.wp-block-gatherpress-modal' ) ) {
				return;
			}
			if (
				document.querySelector(
					'.is-modal-active, dialog[open], .wp-block-gatherpress-modal.is-open'
				)
			) {
				return;
			}
			const context = getContext();
			if ( context?.eventId ) {
				const { state } = store( 'gatherpress/calendar' );
				state.focusedEventId = context.eventId;
			}
		},

		unfocusEvent() {
			const { state } = store( 'gatherpress/calendar' );
			state.focusedEventId = null;
		},

		/**
		 * Remembers a click on a pagination link of this calendar's query.
		 *
		 * Runs on document clicks, after the click handler of core/query.
		 * That handler calls preventDefault() only when it navigates on the
		 * client, so a click that opens a new tab is ignored here too.
		 *
		 * @param {MouseEvent} event Click event.
		 */
		rememberPagination( event ) {
			const link = event.target?.closest?.(
				'.wp-block-query-pagination a[href]'
			);
			if ( ! link || ! event.defaultPrevented ) {
				return;
			}

			const regionId = getRegionId( getElement().ref );
			if ( regionId && regionId === getRegionId( link ) ) {
				pendingRegion = regionId;
			}
		},
	},
	callbacks: {
		isEventHovered() {
			const context = getContext();
			const { state } = store( 'gatherpress/calendar' );
			return Boolean(
				context?.eventId && state.hoveredEventId === context.eventId
			);
		},

		isEventFocused() {
			const context = getContext();
			const { state } = store( 'gatherpress/calendar' );
			return Boolean(
				context?.eventId && state.focusedEventId === context.eventId
			);
		},

		/**
		 * Focuses the month heading after this calendar's own pagination.
		 *
		 * Runs when the wrapper mounts. Its data-wp-key changes with the date
		 * range, so this runs once per navigation, and also on page load and
		 * on browser back/forward, where no click is pending.
		 *
		 * Without a month heading, the first calendar table gets focus. Its
		 * caption names the month.
		 */
		focusAfterNavigation() {
			const { ref } = getElement();
			const regionId = getRegionId( ref );
			if ( ! regionId || regionId !== pendingRegion ) {
				return;
			}
			pendingRegion = null;

			// Do not take focus from an element outside this calendar's query.
			const region = ref.closest( '[data-wp-router-region]' );
			const { activeElement, body } = ref.ownerDocument;
			if (
				activeElement &&
				activeElement !== body &&
				! region.contains( activeElement )
			) {
				return;
			}

			const target =
				region.querySelector( '.gatherpress-calendar__heading' ) ??
				ref.querySelector( 'table' );
			if ( ! target ) {
				return;
			}
			if ( ! target.hasAttribute( 'tabindex' ) ) {
				target.setAttribute( 'tabindex', '-1' );
			}
			target.focus();
		},
	},
} );
