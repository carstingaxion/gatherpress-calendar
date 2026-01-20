import { CLASS_NAMES, ANIMATION_CONFIG } from './constants';
import { state, resetState } from './state';
import { positionPopover, createPositionUpdater } from './positioning';

/**
 * Create backdrop element.
 *
 * The backdrop is a semi-transparent overlay that:
 * - Dims the content behind the popover
 * - Closes the popover when clicked
 * - Provides visual focus on the popover
 *
 * @since 0.1.0
 *
 * @return {HTMLElement} The created backdrop element.
 */
export function createBackdrop() {
	const backdrop = document.createElement( 'div' );
	backdrop.className = CLASS_NAMES.backdrop;
	backdrop.addEventListener( 'click', closePopover );
	return backdrop;
}

/**
 * Create close button for popover.
 *
 * @since 0.1.0
 *
 * @return {HTMLElement} The created close button element.
 */
export function createCloseButton() {
	const closeBtn = document.createElement( 'button' );
	closeBtn.className = CLASS_NAMES.popoverClose;
	closeBtn.innerHTML = '&times;';
	closeBtn.setAttribute( 'aria-label', 'Close' );
	closeBtn.addEventListener( 'click', closePopover );
	return closeBtn;
}

/**
 * Create popover element with content.
 *
 * Getting content from a hidden container referenced by data-event-content.
 *
 * @since 0.1.0
 *
 * @param {string} content     - HTML content for the popover.
 * @param {string} customStyle - Custom inline styles.
 *
 * @return {HTMLElement} The created popover element.
 */
export function createPopover( content, customStyle ) {
	const popover = document.createElement( 'div' );
	popover.className = CLASS_NAMES.popover;
	popover.setAttribute( 'role', 'dialog' );
	popover.setAttribute( 'aria-modal', 'true' );
	popover.setAttribute( 'tabindex', '-1' );

	if ( customStyle ) {
		popover.setAttribute( 'style', customStyle );
	}

	popover.innerHTML = content;
	popover.appendChild( createCloseButton() );

	return popover;
}

/**
 * Animate popover and backdrop into view.
 *
 * Uses CSS transitions for smooth fade-in effect.
 *
 * @since 0.1.0
 *
 * @param {HTMLElement} popover  - The popover element.
 * @param {HTMLElement} backdrop - The backdrop element.
 *
 * @return {void}
 */
export function animateIn( popover, backdrop ) {
	// Small delay allows browser to calculate dimensions before transitioning.
	setTimeout( function () {
		backdrop.classList.add( CLASS_NAMES.isActive );
		popover.classList.add( CLASS_NAMES.isActive );
	}, ANIMATION_CONFIG.fadeDelay );
}

/**
 * Animate popover and backdrop out of view.
 *
 * @since 0.1.0
 *
 * @param {HTMLElement} popover  - The popover element.
 * @param {HTMLElement} backdrop - The backdrop element.
 * @param {Function}    callback - Function to call after animation completes.
 *
 * @return {void}
 */
export function animateOut( popover, backdrop, callback ) {
	// Start fade-out animation.
	popover.classList.remove( CLASS_NAMES.isActive );
	if ( backdrop ) {
		backdrop.classList.remove( CLASS_NAMES.isActive );
	}

	// Wait for animation to complete before cleanup.
	setTimeout( callback, ANIMATION_CONFIG.fadeDuration );
}

/**
 * Show popover with event content.
 *
 * Creates and displays a popover overlay containing the event's inner blocks content.
 *
 * - Gets content from hidden container referenced by data-event-content
 * - Creates and displays popover with that content
 * The popover is positioned near the clicked event dot and includes:
 * - Post content from inner blocks (title, date, excerpt, etc.)
 * - Close button (×)
 * - Custom styling from templateConfigStyle attribute
 *
 * @since 0.1.0
 *
 * @param {HTMLAnchorElement} eventLink   - The event dot link element that was clicked.
 * @param {HTMLElement}       calendar    - The calendar container element.
 * @param {boolean}           viaKeyboard - Whether opened via keyboard.
 *
 * @return {void}
 */
export function showPopover( eventLink, calendar, viaKeyboard ) {
	// Close any existing popover first.
	if ( state.popover ) {
		closePopover();
	}

	// Get content from hidden container.
	const contentId = eventLink.getAttribute( 'data-event-content' );
	if ( ! contentId ) {
		return;
	}

	const contentContainer = document.getElementById( contentId );
	if ( ! contentContainer ) {
		return;
	}

	const content = contentContainer.innerHTML;
	if ( ! content ) {
		return;
	}

	// Get custom styling.
	const customStyle = eventLink.getAttribute( 'data-popover-style' ) || '';

	// Create and append elements.
	const backdrop = createBackdrop();
	const popover = createPopover( content, customStyle );

	document.body.appendChild( backdrop );
	document.body.appendChild( popover );

	// Position popover near the event dot.
	positionPopover( popover, eventLink );

	// Animate in.
	animateIn( popover, backdrop );

	// Update state.
	state.popover = popover;
	state.backdrop = backdrop;
	state.calendar = calendar;
	state.triggerElement = eventLink;
	state.openedViaKeyboard = viaKeyboard;

	// Move focus to popover for keyboard navigation.
	popover.focus();

	// Setup position update handler.
	const updatePos = createPositionUpdater( popover, eventLink, calendar );

	// Update position on scroll and resize.
	window.addEventListener( 'scroll', updatePos, { passive: true } );
	window.addEventListener( 'resize', updatePos, { passive: true } );

	// Store cleanup function.
	state.cleanup = function () {
		window.removeEventListener( 'scroll', updatePos );
		window.removeEventListener( 'resize', updatePos );
	};
}

/**
 * Close the active popover.
 *
 * Removes the popover and backdrop from the DOM with fade-out animation.
 * Cleans up event listeners to prevent memory leaks.
 *
 * @since 0.1.0
 *
 * @return {void}
 */
export function closePopover() {
	if ( ! state.popover ) {
		return;
	}

	// Store reference to trigger element and keyboard flag before cleanup.
	const triggerElement = state.triggerElement;
	const wasKeyboard = state.openedViaKeyboard;

	// Clean up event listeners.
	if ( state.cleanup ) {
		state.cleanup();
	}

	const popover = state.popover;
	const backdrop = state.backdrop;

	// Animate out and clean up.
	animateOut( popover, backdrop, function () {
		if ( popover && popover.parentNode ) {
			popover.parentNode.removeChild( popover );
		}
		if ( backdrop && backdrop.parentNode ) {
			backdrop.parentNode.removeChild( backdrop );
		}
		resetState();
		// Only return focus if opened via keyboard.
		if (
			wasKeyboard &&
			triggerElement &&
			typeof triggerElement.focus === 'function'
		) {
			triggerElement.focus();
		}
	} );
}
