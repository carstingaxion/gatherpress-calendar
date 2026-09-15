/**
 * GatherPress Calendar Interactivity Store
 * 
 * This file defines the reactive state and actions for the calendar block
 * using the WordPress Interactivity API.
 */

/**
 * WordPress dependencies
 */
import { store, getContext, getElement } from '@wordpress/interactivity';
/**
 * Internal dependencies
 */
import { calculatePosition, parseStyleString } from './view/helpers';


store('gatherpress/calendar', {
    state: {
        // Whether the popover is currently visible
        // Replaces: state.popover !== null check in current code
        popoverOpen: false,
        
        // HTML content to display in popover
        // Replaces: Reading from hidden content containers
        popoverContent: '',
        
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
        
        // Reference to the trigger element (for positioning)
        // This is derived, not stored in state
        get triggerElement() {
            const context = getContext();
            return context.triggerRef;
        },
    },

    actions: {
        /**
         * Open popover for an event
         * 
         * Called when event dot is clicked or activated via keyboard.
         * Replaces: handleEventClick() and showPopover() functions.
         * 
         * @param {Event} event - The triggering event
         */
        openPopoverById: (event) => {
            event.preventDefault();
            
            const context = getContext();
            const { state } = store('gatherpress/calendar');
            const element = getElement();
            const eventId = element.ref.getAttribute('data-post-id');

            // Get custom styles from attribute
            const customStyles = element.ref.getAttribute('data-popover-style');
            const stylesObject = customStyles 
            ? parseStyleString(customStyles) 
            : {};

            // Verify content exists
            if (eventId && state.eventContents && state.eventContents[eventId]) {
                state.popoverContent = state.eventContents[eventId];
                state.popoverOpen = true;
                state.activeEventId = eventId;
                context.triggerRef = element.ref;
            }

            // Calculate position (will be used in callback)
            state.popoverPosition = calculatePosition(
            element.ref,
            // Popover element will be available after render
            );


        },

        /**
         * Close the popover
         * 
         * Replaces: closePopover() function.
         * Handles focus return automatically via directives.
         */
        closePopover: () => {
            const { state } = store('gatherpress/calendar');
            const context = getContext();
            
            // Return focus to trigger element
            if (context.triggerRef) {
                context.triggerRef.focus();
            }
            
            // Clear state
            state.popoverOpen = false;
            state.popoverContent = '';
            state.popoverStyles = {};
            state.popoverPosition = { top: 0, left: 0 };
            state.activeEventId = null;
            context.triggerRef = null;
        },
        
        /**
         * Handle keyboard events on event dots
         * 
         * Replaces: handleEventKeydown() function.
         * Enter/Space trigger popover, Escape closes it.
         */
        handleKeydown: (event) => {
            const { actions } = store('gatherpress/calendar');
            
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                actions.openPopoverById(event);
            }
            
            if (event.key === 'Escape') {
                actions.closePopover();
            }
        },
        
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
         * Update popover position
         * 
         * Called after popover renders to position it near the trigger.
         * Replaces: positionPopover() and createPositionUpdater() functions.
         * 
         * Uses data-wp-watch directive for reactive updates.
         */
        updatePosition: () => {
            const { state } = store('gatherpress/calendar');
            const context = getContext();
            const element = getElement();
            
            // Only run if popover is open
            if (!state.popoverOpen || !context.triggerRef) return;
            
            const popoverEl = element.ref;
            const triggerEl = context.triggerRef;
            
            // Calculate optimal position
            const position = calculatePosition(triggerEl, popoverEl);
            
            // Update position in state (reactive)
            state.popoverPosition = position;
            
            // Apply directly to element for immediate effect
            popoverEl.style.top = `${position.top}px`;
            popoverEl.style.left = `${position.left}px`;
        },
        
        /**
         * Initialize event handlers
         * 
         * Replaces: IntersectionObserver setup.
         * Note: Interactivity API handles visibility automatically.
         */
        onLoad: () => {
            // Any initialization code
            // Most of this is now handled by directives
        },

        /**
         * Reactively injects HTML content into the popover whenever state.popoverContent changes.
         */
        renderPopoverContent: () => {
            const { state } = store('gatherpress/calendar');
            const { ref } = getElement();

            // Accessing state.popoverContent subscribes this callback to its changes
            ref.innerHTML = state.popoverContent || '';
        },
    }
});