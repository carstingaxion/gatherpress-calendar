import * as __WEBPACK_EXTERNAL_MODULE__wordpress_interactivity_8e89b257__ from "@wordpress/interactivity";
/******/ var __webpack_modules__ = ({

/***/ "./src/view/helpers.js"
/*!*****************************!*\
  !*** ./src/view/helpers.js ***!
  \*****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   applyCalculatedPosition: () => (/* binding */ applyCalculatedPosition),
/* harmony export */   parseStyleString: () => (/* binding */ parseStyleString)
/* harmony export */ });
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

/**
 * Calculate popover position near trigger element
 *
 * It calculates optimal popover position and applies it directly.
 *
 * @param {HTMLElement} popover        - The event dot element
 * @param {HTMLElement} eventLink      - The popover element
 * @param {Object}      POPOVER_CONFIG - The configuration arguments for popovers
 */
function applyCalculatedPosition(popover, eventLink, POPOVER_CONFIG) {
  const linkRect = eventLink.getBoundingClientRect();
  const popRect = popover.getBoundingClientRect() || {
    width: 350,
    height: 200
  };
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const {
    gap,
    margin
  } = POPOVER_CONFIG;

  // Start with popover below the dot.
  let top = linkRect.bottom + gap;
  // Center horizontally on the dot.
  let left = linkRect.left + linkRect.width / 2 - popRect.width / 2;

  // Keep in viewport horizontally.
  if (left < margin) {
    left = margin;
  }
  if (left + popRect.width > vw - margin) {
    left = vw - popRect.width - margin;
  }

  // Keep in viewport vertically.
  // If popover would extend below viewport, show it above the dot instead.
  if (top + popRect.height > vh - margin) {
    top = linkRect.top - popRect.height - gap;
  }
  // If still not enough space, clamp to viewport top.
  if (top < margin) {
    top = margin;
  }

  // Apply calculated position directly.
  popover.style.top = `${top}px`;
  popover.style.left = `${left}px`;
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
 *
 * Progressive enhancement for the GatherPress Calendar block.
 * This script adds interactive popover functionality to event dots,
 * but the calendar remains fully functional without JavaScript.
 *
 * - Event dots are simple <a> links
 * - Content (innerBlocks) for each event is in a hidden container
 * - JavaScript reads from hidden container and shows in popover
 * - Creates valid HTML
 */

/**
 * WordPress dependencies
 */

/**
 * Internal dependencies
 */

const OBSERVER_CONFIG = {
  threshold: 0.1,
  rootMargin: '50px'
};
const POPOVER_CONFIG = {
  gap: 8,
  margin: 12
};
(0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.store)('gatherpress/calendar', {
  state: {
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
    // Derived getter: evaluates true if this item's context matches activeEventId
    get isCurrentEventOpen() {
      const context = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)();
      const {
        state
      } = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.store)('gatherpress/calendar');
      return state.activeEventId === context.eventId;
    },
    // Reference to the trigger element (for positioning)
    // This is derived, not stored in state
    get triggerElement() {
      const context = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)();
      return context.triggerRef;
    }
  },
  actions: {
    /**
     * Toggles the popover open/closed
     */
    togglePopover: (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.withSyncEvent)(event => {
      event.preventDefault();
      const context = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)();
      const {
        state
      } = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.store)('gatherpress/calendar');

      // If already open, close it; otherwise open this event
      state.activeEventId = state.activeEventId === context.eventId ? null : context.eventId;
    }),
    /**
     * Closes any open popover
     */
    closePopover: () => {
      const {
        state
      } = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.store)('gatherpress/calendar');
      state.activeEventId = null;
    },
    /**
     * Handle keyboard events on event dots
     *
     * Replaces: handleEventKeydown() function.
     * Enter/Space trigger popover, Escape closes it.
     */
    handleKeydown: (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.withSyncEvent)(event => {
      const {
        actions
      } = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.store)('gatherpress/calendar');
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
      const {
        actions
      } = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.store)('gatherpress/calendar');
      actions.closePopover();
    }
  },
  callbacks: {
    /**
     * Initializes IntersectionObserver on mount.
     * Replaces setupIntersectionObserver() and cleanupObserver().
     */
    initCalendarObserver: () => {
      const context = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)();
      const {
        state,
        actions
      } = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.store)('gatherpress/calendar');
      if (!('IntersectionObserver' in window)) {
        context.isCalendarVisible = true;
        return;
      }
      const {
        ref: calendarEl
      } = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getElement)();
      const observer = new window.IntersectionObserver(entries => {
        entries.forEach(entry => {
          const isVisible = entry.isIntersecting;
          context.isCalendarVisible = isVisible;
          // If calendar leaves the viewport, close any popovers inside it
          if (!isVisible && state.activeEventId) {
            actions.closePopover();
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
      const {
        state
      } = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.store)('gatherpress/calendar');

      // Only calculate if this specific event is open
      if (!state.isCurrentEventOpen) {
        return;
      }
      const {
        ref: popoverEl
      } = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getElement)();
      const itemWrapper = popoverEl.closest('.gatherpress-calendar__event-item');
      const triggerEl = itemWrapper?.querySelector('.gatherpress-calendar__event');
      if (!triggerEl || !popoverEl) {
        return;
      }

      // This calls the smart positioning logic from the old implementation
      ;(0,_view_helpers__WEBPACK_IMPORTED_MODULE_1__.applyCalculatedPosition)(popoverEl, triggerEl, POPOVER_CONFIG);
    },
    /**
     * Repositions the popover on window resize / scroll.
     */
    onWindowChange: () => {
      const {
        state,
        callbacks
      } = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.store)('gatherpress/calendar');
      const context = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)();

      // Only calculate if this popover is open AND the calendar is visible
      if (state.isCurrentEventOpen && context.isCalendarVisible !== false) {
        callbacks.positionPopover();
      }
    }
  }
});
})();


//# sourceMappingURL=view.js.map