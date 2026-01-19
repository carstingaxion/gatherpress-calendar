/**
 * State object to manage active popover and related elements.
 *
 * Centralized state prevents multiple popovers from being open
 * simultaneously and provides easy cleanup.
 *
 * @type {Object}
 * @property {HTMLElement|null} popover  - Currently active popover element.
 * @property {HTMLElement|null} backdrop - Currently active backdrop element.
 * @property {HTMLElement|null} calendar - Calendar that owns the active popover.
 * @property {Function|null}    cleanup  - Cleanup function for event listeners.
 */
export const state = {
	popover: null,
	backdrop: null,
	calendar: null,
	cleanup: null,
};

/**
 * Map of calendars to their visibility state.
 *
 * Uses WeakMap for automatic garbage collection when calendar
 * elements are removed from the DOM.
 *
 * @type {WeakMap<HTMLElement, boolean>}
 */
export const visibilityMap = new WeakMap();

/**
 * IntersectionObserver instance for monitoring calendar visibility.
 *
 * @type {IntersectionObserver|null}
 */
let observerInstance = null;

/**
 * Set the observer instance.
 * @param {IntersectionObserver|null} instance - The observer instance.
 */
export function setObserver( instance ) {
	observerInstance = instance;
}

/**
 * Get the observer instance.
 * @return {IntersectionObserver|null} - The observer instance.
 */
export function getObserver() {
	return observerInstance;
}

/**
 * Reset state to initial values.
 *
 * Called after popover is closed to ensure clean state.
 *
 * @since 0.1.0
 *
 * @return {void}
 */
export function resetState() {
	state.popover = null;
	state.backdrop = null;
	state.calendar = null;
	state.cleanup = null;
}

/**
 * Check if a calendar is currently visible in the viewport.
 *
 * @since 0.1.0
 *
 * @param {HTMLElement} calendar - The calendar element to check.
 *
 * @return {boolean} True if calendar is visible, false otherwise.
 */
export function isCalendarVisible( calendar ) {
	return visibilityMap.get( calendar ) === true;
}
