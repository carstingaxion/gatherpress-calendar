/**
 * GatherPress Calendar Interactivity Store
 * 
 * This file defines the reactive state and actions for the calendar block
 * using the WordPress Interactivity API.
 */

/**
 * WordPress dependencies
 */
import { store, getContext, getElement, withSyncEvent } from '@wordpress/interactivity';
/**
 * Internal dependencies
 */
import { calculatePosition, parseStyleString } from './view/helpers';

const POPOVER_CONFIG = {
  gap: 8,
  margin: 12,
};

const OBSERVER_CONFIG = {
  threshold: 0.1,
  rootMargin: '50px',
};

store('gatherpress/calendar', {
    state: {

        // Inline styles object for popover customization
        // Replaces: data-popover-style attribute parsing
        popoverStyles: {},
        
        // Calculated position for the popover
        // Replaces: positionPopover() function logic
        popoverPosition: {
            top: 0,
            left: 0,
        },
        
        // ID of the currently active event (for focus management)
        // Replaces: state.triggerElement reference
        activeEventId: null,

		// Derived getter: evaluates true if this item's context matches activeEventId
		get isCurrentEventOpen() {
			const context = getContext();
			const { state } = store('gatherpress/calendar');
			return state.activeEventId === context.eventId;
		},

		// Reference to the trigger element (for positioning)
        // This is derived, not stored in state
        get triggerElement() {
            const context = getContext();
            return context.triggerRef;
        },
    },

    actions: {
		/**
		 * Toggles the popover open/closed
		 */
		togglePopover: withSyncEvent( (event) => {
			event.preventDefault();
			const context = getContext();
			const { state } = store('gatherpress/calendar');

			// If already open, close it; otherwise open this event
			state.activeEventId = state.activeEventId === context.eventId ? null : context.eventId;
		}),

		/**
         * Open popover for an event
         * 
         * Called when event dot is clicked or activated via keyboard.
         * Replaces: handleEventClick() and showPopover() functions.
         * 
         * @param {Event} event - The triggering event
        
        openPopover: (event) => {
            event.preventDefault();
            
            const context = getContext();
            const { state } = store('gatherpress/calendar');
            const element = getElement();
            
            // Get content from the referenced hidden container
            const contentId = element.ref.getAttribute('data-event-content');
            const contentContainer = document.getElementById(contentId);
            
            if (!contentContainer) return;
            
            // Get custom styles from attribute
            const customStyles = element.ref.getAttribute('data-popover-style');
            const stylesObject = customStyles 
            ? parseStyleString(customStyles) 
            : {};
            
            // Update reactive state (triggers re-render)
            state.popoverOpen = true;
            state.popoverContent = contentContainer.innerHTML;
            state.popoverStyles = stylesObject;
            state.activeEventId = element.ref.getAttribute('data-post-id');
            
            // Store trigger reference in context for positioning
            context.triggerRef = element.ref;
            
            // Calculate position (will be used in callback)
            state.popoverPosition = calculatePosition(
            element.ref,
            // Popover element will be available after render
            );
        }, */

		/**
		 * Closes any open popover
		 */
		closePopover: () => {
			const { state } = store('gatherpress/calendar');
			state.activeEventId = null;
		},

		/**
         * Handle keyboard events on event dots
         * 
         * Replaces: handleEventKeydown() function.
         * Enter/Space trigger popover, Escape closes it.
         */
        handleKeydown: withSyncEvent( (event) => {
            const { actions } = store('gatherpress/calendar');
            
            if (event.key === 'Enter' || event.key === ' ') {
				event.preventDefault();
				// actions.openPopover(event);
				actions.togglePopover(event);
            }
            
            if (event.key === 'Escape') {
        		actions.closePopover();
            }
        }),
        
        /**
         * Handle backdrop click
         * 
         * Clicking backdrop closes popover.
             */
        handleBackdropClick: () => {
            const { actions } = store('gatherpress/calendar');
            actions.closePopover();
        },
    },

    callbacks: {
        /**
         * Initializes IntersectionObserver on mount.
         * Replaces setupIntersectionObserver() and cleanupObserver().
         */
        initCalendarObserver: () => {
            const { ref: calendarEl } = getElement();
            const context = getContext();
            const { state, actions } = store('gatherpress/calendar');

            if (!('IntersectionObserver' in window)) {
                context.isCalendarVisible = true;
                return;
            }

            const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const isVisible = entry.isIntersecting;
                context.isCalendarVisible = isVisible;

                // If calendar leaves the viewport, close any popovers inside it
                if (!isVisible && state.activeEventId) {
                    const hasActiveEvent = calendarEl.querySelector(
                        `[data-wp-context*='"eventId":"${state.activeEventId}"']`
                    );
                    if (hasActiveEvent) {
                        actions.closePopover();
                    }
                }
            });
            }, OBSERVER_CONFIG);

            observer.observe(calendarEl);

            // Returning a function from data-wp-init acts as the unmount cleanup
            return () => {
            observer.disconnect();
            };
        },

        /**
		 * Reactively recalculates position whenever isCurrentEventOpen becomes true
		 */
		positionPopover: () => {
			const { state } = store('gatherpress/calendar');

			// Only calculate if this specific event is open
			if (!state.isCurrentEventOpen) return;

			const { ref: popoverEl } = getElement();
			const itemWrapper = popoverEl.closest('.gatherpress-calendar__event-item');
			const triggerEl = itemWrapper?.querySelector('.gatherpress-calendar__event');

			if (!triggerEl || !popoverEl) return;

			// Calculate coordinates
			const pos = calculatePosition(triggerEl, popoverEl);

			// Apply directly to the element
			popoverEl.style.top = `${pos.top}px`;
			popoverEl.style.left = `${pos.left}px`;
		},

        /**
         * Repositions the popover on window resize / scroll.
         */
        onWindowChange: () => {
            const { state, callbacks } = store('gatherpress/calendar');
            const context = getContext();

            // Only calculate if this popover is open AND the calendar is visible
            if (state.isCurrentEventOpen && context.isCalendarVisible !== false) {
                callbacks.positionPopover();
            }
        },

    }
});