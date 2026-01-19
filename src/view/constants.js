/**
 * Popover positioning configuration.
 *
 * @type {Object}
 * @property {number} gap    - Gap between event dot and popover in pixels.
 * @property {number} margin - Minimum margin from viewport edges in pixels.
 */
export const POPOVER_CONFIG = {
	gap: 10,
	margin: 10,
};

/**
 * IntersectionObserver configuration.
 *
 * @type {Object}
 * @property {number} threshold  - Percentage of element that must be visible (0.1 = 10%).
 * @property {string} rootMargin - Margin around viewport for triggering observer.
 */
export const OBSERVER_CONFIG = {
	threshold: 0.1,
	rootMargin: '50px',
};

/**
 * Animation timing configuration.
 *
 * @type {Object}
 * @property {number} fadeDelay    - Delay before fade-in animation starts (ms).
 * @property {number} fadeDuration - Duration of fade animation (ms).
 */
export const ANIMATION_CONFIG = {
	fadeDelay: 10,
	fadeDuration: 200,
};

/**
 * CSS class names used throughout the component.
 *
 * @type {Object}
 */
export const CLASS_NAMES = {
	calendar: 'gatherpress-calendar',
	event: 'gatherpress-calendar__event',
	popover: 'gatherpress-calendar__popover',
	popoverClose: 'gatherpress-calendar__popover-close',
	backdrop: 'gatherpress-calendar__backdrop',
	isActive: 'is-active',
};
