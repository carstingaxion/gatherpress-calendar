/**
 * GatherPress Calendar Interactivity Store
 * 
 * This file defines the reactive state and actions for the calendar block
 * using the WordPress Interactivity API.
 */

import { store, getContext, getElement } from '@wordpress/interactivity';

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
            actions.openPopover(event);
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

  // Callbacks: Lifecycle hooks
  callbacks: {
    updatePosition: () => {
      // Implementation
    },
  },
});