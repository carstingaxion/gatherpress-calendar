import * as __WEBPACK_EXTERNAL_MODULE__wordpress_interactivity_8e89b257__ from "@wordpress/interactivity";
/******/ var __webpack_modules__ = ({

/***/ "./src/view/helpers.js"
/*!*****************************!*\
  !*** ./src/view/helpers.js ***!
  \*****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   calculatePosition: () => (/* binding */ calculatePosition),
/* harmony export */   parseStyleString: () => (/* binding */ parseStyleString)
/* harmony export */ });
/**
 * Calculate popover position near trigger element
 * 
 * Replaces: positionPopover() function from current view.js.
 * 
 * @param {HTMLElement} triggerEl - The event dot element
 * @param {HTMLElement} popoverEl - The popover element
 * @return {Object} Position object with top and left
 */
function calculatePosition(triggerEl, popoverEl) {
  const triggerRect = triggerEl.getBoundingClientRect();
  const popoverRect = popoverEl?.getBoundingClientRect() || {
    width: 350,
    height: 200
  };
  const gap = 10;
  const margin = 10;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // Default: below and centered
  let top = triggerRect.bottom + gap;
  let left = triggerRect.left + triggerRect.width / 2 - popoverRect.width / 2;

  // Keep in viewport horizontally
  if (left < margin) left = margin;
  if (left + popoverRect.width > vw - margin) {
    left = vw - popoverRect.width - margin;
  }

  // Keep in viewport vertically
  if (top + popoverRect.height > vh - margin) {
    // Show above if no space below
    top = triggerRect.top - popoverRect.height - gap;
  }
  if (top < margin) top = margin;
  return {
    top,
    left
  };
}

/**
 * Parse inline style string to object
 * 
 * Converts "background: #fff; padding: 1rem" to object.
 * 
 * @param {string} styleString - CSS style string
 * @return {Object} Styles object
 */
function parseStyleString(styleString) {
  const styles = {};
  styleString.split(';').forEach(rule => {
    const [property, value] = rule.split(':').map(s => s.trim());
    if (property && value) {
      // Convert kebab-case to camelCase
      const camelProperty = property.replace(/-([a-z])/g, g => g[1].toUpperCase());
      styles[camelProperty] = value;
    }
  });
  return styles;
}

/***/ },

/***/ "@wordpress/interactivity"
/*!*******************************************!*\
  !*** external "@wordpress/interactivity" ***!
  \*******************************************/
(module) {

module.exports = __WEBPACK_EXTERNAL_MODULE__wordpress_interactivity_8e89b257__;

/***/ }

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ const __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	const cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	const module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	if (!(moduleId in __webpack_modules__)) {
/******/ 		delete __webpack_module_cache__[moduleId];
/******/ 		const e = new Error("Cannot find module '" + moduleId + "'");
/******/ 		e.code = 'MODULE_NOT_FOUND';
/******/ 		throw e;
/******/ 	}
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/ // define getter/value functions for harmony exports
/******/ __webpack_require__.d = (exports, definition) => {
/******/ 	for(var key in definition) {
/******/ 		if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 			Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 		}
/******/ 	}
/******/ };
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ __webpack_require__.o = (obj, prop) => (Object.hasOwn(obj, prop));
/******/ 
/******/ /* webpack/runtime/make namespace object */
/******/ // define __esModule on exports
/******/ __webpack_require__.r = (exports) => {
/******/ 	Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 	Object.defineProperty(exports, '__esModule', { value: true });
/******/ };
/******/ 
/************************************************************************/
let __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!*********************!*\
  !*** ./src/view.js ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/interactivity */ "@wordpress/interactivity");
/* harmony import */ var _view_helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./view/helpers */ "./src/view/helpers.js");
/**
 * GatherPress Calendar Interactivity Store
 * 
 * This file defines the reactive state and actions for the calendar block
 * using the WordPress Interactivity API.
 */

/**
 * WordPress dependencies
 */

/**
 * Internal dependencies
 */

(0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.store)('gatherpress/calendar', {
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
      left: 0
    },
    // ID of the currently active event (for focus management)
    // Replaces: state.triggerElement reference
    activeEventId: null,
    // Reference to the trigger element (for positioning)
    // This is derived, not stored in state
    get triggerElement() {
      const context = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)();
      return context.triggerRef;
    }
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
    openPopoverById: event => {
      event.preventDefault();
      const context = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)();
      const {
        state
      } = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.store)('gatherpress/calendar');
      const element = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getElement)();
      const eventId = element.ref.getAttribute('data-event-id');

      // Get custom styles from attribute
      const customStyles = element.ref.getAttribute('data-popover-style');
      const stylesObject = customStyles ? (0,_view_helpers__WEBPACK_IMPORTED_MODULE_1__.parseStyleString)(customStyles) : {};

      // Update reactive state (triggers re-render)
      state.popoverOpen = true;
      // Get content from state instead of DOM
      state.popoverContent = state.eventContents[eventId] || '';
      state.popoverStyles = stylesObject;
      state.activeEventId = element.ref.getAttribute('data-post-id');

      // Store trigger reference in context for positioning
      context.triggerRef = element.ref;

      // Calculate position (will be used in callback)
      state.popoverPosition = (0,_view_helpers__WEBPACK_IMPORTED_MODULE_1__.calculatePosition)(element.ref
      // Popover element will be available after render
      );
    },
    /**
     * Open popover for an event
     * 
     * Called when event dot is clicked or activated via keyboard.
     * Replaces: handleEventClick() and showPopover() functions.
     * 
     * @param {Event} event - The triggering event
     */
    openPopover: event => {
      event.preventDefault();
      const context = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)();
      const {
        state
      } = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.store)('gatherpress/calendar');
      const element = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getElement)();

      // Get content from the referenced hidden container
      const contentId = element.ref.getAttribute('data-event-content');
      const contentContainer = document.getElementById(contentId);
      if (!contentContainer) return;

      // Get custom styles from attribute
      const customStyles = element.ref.getAttribute('data-popover-style');
      const stylesObject = customStyles ? (0,_view_helpers__WEBPACK_IMPORTED_MODULE_1__.parseStyleString)(customStyles) : {};

      // Update reactive state (triggers re-render)
      state.popoverOpen = true;
      state.popoverContent = contentContainer.innerHTML;
      state.popoverStyles = stylesObject;
      state.activeEventId = element.ref.getAttribute('data-post-id');

      // Store trigger reference in context for positioning
      context.triggerRef = element.ref;

      // Calculate position (will be used in callback)
      state.popoverPosition = (0,_view_helpers__WEBPACK_IMPORTED_MODULE_1__.calculatePosition)(element.ref
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
      const {
        state
      } = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.store)('gatherpress/calendar');
      const context = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)();

      // Return focus to trigger element
      if (context.triggerRef) {
        context.triggerRef.focus();
      }

      // Clear state
      state.popoverOpen = false;
      state.popoverContent = '';
      state.popoverStyles = {};
      state.popoverPosition = {
        top: 0,
        left: 0
      };
      state.activeEventId = null;
      context.triggerRef = null;
    },
    /**
     * Handle keyboard events on event dots
     * 
     * Replaces: handleEventKeydown() function.
     * Enter/Space trigger popover, Escape closes it.
     */
    handleKeydown: event => {
      const {
        actions
      } = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.store)('gatherpress/calendar');
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
      const {
        actions
      } = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.store)('gatherpress/calendar');
      actions.closePopover();
    }
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
      const {
        state
      } = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.store)('gatherpress/calendar');
      const context = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)();
      const element = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getElement)();

      // Only run if popover is open
      if (!state.popoverOpen || !context.triggerRef) return;
      const popoverEl = element.ref;
      const triggerEl = context.triggerRef;

      // Calculate optimal position
      const position = (0,_view_helpers__WEBPACK_IMPORTED_MODULE_1__.calculatePosition)(triggerEl, popoverEl);

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
    }
  }
});
})();


//# sourceMappingURL=view.js.map