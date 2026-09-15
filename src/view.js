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

  // Actions: Event handlers
  actions: {
    openPopover: (event) => {
      // Implementation
    },
    closePopover: () => {
      // Implementation  
    },
    handleKeydown: (event) => {
      // Implementation
    },
  },

  // Callbacks: Lifecycle hooks
  callbacks: {
    updatePosition: () => {
      // Implementation
    },
  },
});