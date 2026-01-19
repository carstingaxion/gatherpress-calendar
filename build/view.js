/******/ var __webpack_modules__ = ({

/***/ "./src/view/constants.js"
/*!*******************************!*\
  !*** ./src/view/constants.js ***!
  \*******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ANIMATION_CONFIG: () => (/* binding */ ANIMATION_CONFIG),
/* harmony export */   CLASS_NAMES: () => (/* binding */ CLASS_NAMES),
/* harmony export */   OBSERVER_CONFIG: () => (/* binding */ OBSERVER_CONFIG),
/* harmony export */   POPOVER_CONFIG: () => (/* binding */ POPOVER_CONFIG)
/* harmony export */ });
/**
 * Popover positioning configuration.
 *
 * @type {Object}
 * @property {number} gap    - Gap between event dot and popover in pixels.
 * @property {number} margin - Minimum margin from viewport edges in pixels.
 */
const POPOVER_CONFIG = {
  gap: 10,
  margin: 10
};

/**
 * IntersectionObserver configuration.
 *
 * @type {Object}
 * @property {number} threshold  - Percentage of element that must be visible (0.1 = 10%).
 * @property {string} rootMargin - Margin around viewport for triggering observer.
 */
const OBSERVER_CONFIG = {
  threshold: 0.1,
  rootMargin: '50px'
};

/**
 * Animation timing configuration.
 *
 * @type {Object}
 * @property {number} fadeDelay    - Delay before fade-in animation starts (ms).
 * @property {number} fadeDuration - Duration of fade animation (ms).
 */
const ANIMATION_CONFIG = {
  fadeDelay: 10,
  fadeDuration: 200
};

/**
 * CSS class names used throughout the component.
 *
 * @type {Object}
 */
const CLASS_NAMES = {
  calendar: 'gatherpress-calendar',
  event: 'gatherpress-calendar__event',
  eventContent: 'gatherpress-calendar__event-content',
  popover: 'gatherpress-calendar__popover',
  popoverClose: 'gatherpress-calendar__popover-close',
  backdrop: 'gatherpress-calendar__backdrop',
  isActive: 'is-active'
};

/***/ },

/***/ "./src/view/handlers.js"
/*!******************************!*\
  !*** ./src/view/handlers.js ***!
  \******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   handleEscapeKey: () => (/* binding */ handleEscapeKey),
/* harmony export */   handleEventClick: () => (/* binding */ handleEventClick),
/* harmony export */   handleEventKeydown: () => (/* binding */ handleEventKeydown),
/* harmony export */   setupCalendar: () => (/* binding */ setupCalendar)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ "./src/view/constants.js");
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./state */ "./src/view/state.js");
/* harmony import */ var _popover__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./popover */ "./src/view/popover.js");




/**
 * Handle click on event dot.
 *
 * Prevents default link navigation and shows popover instead.
 * Only processes if calendar is visible (optimization).
 *
 * @since 0.1.0
 *
 * @param {Event}       event     - The click event.
 * @param {HTMLElement} eventLink - The event dot link element.
 * @param {HTMLElement} calendar  - The calendar container.
 *
 * @return {void}
 */
function handleEventClick(event, eventLink, calendar) {
  // Check if calendar is visible before processing.
  if (!(0,_state__WEBPACK_IMPORTED_MODULE_1__.isCalendarVisible)(calendar)) {
    return;
  }
  event.preventDefault();
  event.stopPropagation();
  (0,_popover__WEBPACK_IMPORTED_MODULE_2__.showPopover)(eventLink, calendar);
}

/**
 * Handle keyboard interaction on event dot.
 *
 * Enter and Space keys trigger the same action as click.
 * Only processes if calendar is visible.
 *
 * @since 0.1.0
 *
 * @param {KeyboardEvent} event     - The keyboard event.
 * @param {HTMLElement}   eventLink - The event dot link element.
 * @param {HTMLElement}   calendar  - The calendar container.
 *
 * @return {void}
 */
function handleEventKeydown(event, eventLink, calendar) {
  // Check if calendar is visible before processing.
  if (!(0,_state__WEBPACK_IMPORTED_MODULE_1__.isCalendarVisible)(calendar)) {
    return;
  }
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    (0,_popover__WEBPACK_IMPORTED_MODULE_2__.showPopover)(eventLink, calendar);
  }
}

/**
 * Handle Escape key to close popover.
 *
 * Global handler that closes any open popover when Escape is pressed.
 *
 * @since 0.1.0
 *
 * @param {KeyboardEvent} event - The keyboard event.
 *
 * @return {void}
 */
function handleEscapeKey(event) {
  if (event.key === 'Escape' && _state__WEBPACK_IMPORTED_MODULE_1__.state.popover) {
    (0,_popover__WEBPACK_IMPORTED_MODULE_2__.closePopover)();
  }
}

/**
 * Setup event handlers for a single calendar.
 *
 * Iterates through all event dots in the calendar and attaches:
 * - Click handler (prevents default navigation)
 * - Keyboard handler (Enter/Space keys)
 * - ARIA attributes for accessibility
 *
 * @since 0.1.0
 *
 * @param {HTMLElement} calendar - The calendar container element.
 *
 * @return {void}
 */
function setupCalendar(calendar) {
  const events = calendar.querySelectorAll('.' + _constants__WEBPACK_IMPORTED_MODULE_0__.CLASS_NAMES.event);
  events.forEach(function (eventLink) {
    // Skip if already set up (prevents duplicate handlers).
    if (eventLink.hasAttribute('data-setup')) {
      return;
    }
    eventLink.setAttribute('data-setup', 'true');

    // Add ARIA attributes for screen readers.
    eventLink.setAttribute('role', 'button');
    eventLink.setAttribute('tabindex', '0');

    // Attach event handlers.
    eventLink.addEventListener('click', function (e) {
      handleEventClick(e, eventLink, calendar);
    });
    eventLink.addEventListener('keydown', function (e) {
      handleEventKeydown(e, eventLink, calendar);
    });
  });
}

/***/ },

/***/ "./src/view/observer.js"
/*!******************************!*\
  !*** ./src/view/observer.js ***!
  \******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   cleanupObserver: () => (/* binding */ cleanupObserver),
/* harmony export */   setupIntersectionObserver: () => (/* binding */ setupIntersectionObserver)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ "./src/view/constants.js");
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./state */ "./src/view/state.js");
/* harmony import */ var _popover__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./popover */ "./src/view/popover.js");
/* harmony import */ var _handlers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./handlers */ "./src/view/handlers.js");
/* eslint-env browser */





/**
 * Set up IntersectionObserver to track calendar visibility.
 *
 * The observer watches for calendars entering/leaving the viewport
 * and enables/disables event handlers accordingly. This provides:
 * - Better performance by reducing event handler overhead
 * - Lower battery consumption on mobile devices
 * - Automatic cleanup when calendars scroll off-screen
 *
 * @since 0.1.0
 *
 * @param {NodeList} calendars - List of calendar elements to observe.
 *
 * @return {void}
 */
function setupIntersectionObserver(calendars) {
  if (!('IntersectionObserver' in window)) {
    // Fallback for browsers without IntersectionObserver support.
    // Set all calendars as visible and set them up immediately.
    calendars.forEach(function (calendar) {
      _state__WEBPACK_IMPORTED_MODULE_1__.visibilityMap.set(calendar, true);
      (0,_handlers__WEBPACK_IMPORTED_MODULE_3__.setupCalendar)(calendar);
    });
    return;
  }

  /**
   * IntersectionObserver callback.
   *
   * Processes intersection changes and updates calendar state.
   *
   * @param {IntersectionObserverEntry[]} entries - Array of intersection changes.
   */
  (0,_state__WEBPACK_IMPORTED_MODULE_1__.setObserver)(new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      const calendar = entry.target;
      const wasVisible = _state__WEBPACK_IMPORTED_MODULE_1__.visibilityMap.get(calendar);
      const isVisible = entry.isIntersecting;

      // Update visibility state.
      _state__WEBPACK_IMPORTED_MODULE_1__.visibilityMap.set(calendar, isVisible);
      if (isVisible && !wasVisible) {
        // Calendar entered viewport - set it up.
        (0,_handlers__WEBPACK_IMPORTED_MODULE_3__.setupCalendar)(calendar);
      } else if (!isVisible && wasVisible) {
        // Calendar left viewport.
        // If this calendar has an active popover, close it.
        if (_state__WEBPACK_IMPORTED_MODULE_1__.state.calendar === calendar) {
          (0,_popover__WEBPACK_IMPORTED_MODULE_2__.closePopover)();
        }
      }
    });
  }, {
    threshold: _constants__WEBPACK_IMPORTED_MODULE_0__.OBSERVER_CONFIG.threshold,
    rootMargin: _constants__WEBPACK_IMPORTED_MODULE_0__.OBSERVER_CONFIG.rootMargin
  }));

  // Start observing all calendars.
  calendars.forEach(function (calendar) {
    const observer = (0,_state__WEBPACK_IMPORTED_MODULE_1__.getObserver)();
    _state__WEBPACK_IMPORTED_MODULE_1__.visibilityMap.set(calendar, false);
    observer.observe(calendar);
  });
}

/**
 * Stop observing all calendars and clean up observer.
 *
 * Called during component unmount or cleanup.
 *
 * @since 0.1.0
 *
 * @return {void}
 */
function cleanupObserver() {
  const observer = (0,_state__WEBPACK_IMPORTED_MODULE_1__.getObserver)();
  if (observer) {
    observer.disconnect();
    (0,_state__WEBPACK_IMPORTED_MODULE_1__.setObserver)(null);
  }
}

/***/ },

/***/ "./src/view/popover.js"
/*!*****************************!*\
  !*** ./src/view/popover.js ***!
  \*****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   animateIn: () => (/* binding */ animateIn),
/* harmony export */   animateOut: () => (/* binding */ animateOut),
/* harmony export */   closePopover: () => (/* binding */ closePopover),
/* harmony export */   createBackdrop: () => (/* binding */ createBackdrop),
/* harmony export */   createCloseButton: () => (/* binding */ createCloseButton),
/* harmony export */   createPopover: () => (/* binding */ createPopover),
/* harmony export */   showPopover: () => (/* binding */ showPopover)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ "./src/view/constants.js");
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./state */ "./src/view/state.js");
/* harmony import */ var _positioning__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./positioning */ "./src/view/positioning.js");




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
function createBackdrop() {
  const backdrop = document.createElement('div');
  backdrop.className = _constants__WEBPACK_IMPORTED_MODULE_0__.CLASS_NAMES.backdrop;
  backdrop.addEventListener('click', closePopover);
  return backdrop;
}

/**
 * Create close button for popover.
 *
 * @since 0.1.0
 *
 * @return {HTMLElement} The created close button element.
 */
function createCloseButton() {
  const closeBtn = document.createElement('button');
  closeBtn.className = _constants__WEBPACK_IMPORTED_MODULE_0__.CLASS_NAMES.popoverClose;
  closeBtn.innerHTML = '&times;';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.addEventListener('click', closePopover);
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
function createPopover(content, customStyle) {
  const popover = document.createElement('div');
  popover.className = _constants__WEBPACK_IMPORTED_MODULE_0__.CLASS_NAMES.popover;
  popover.setAttribute('role', 'dialog');
  popover.setAttribute('aria-modal', 'true');
  popover.setAttribute('tabindex', '-1');
  if (customStyle) {
    popover.setAttribute('style', customStyle);
  }
  popover.innerHTML = content;
  popover.appendChild(createCloseButton());
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
function animateIn(popover, backdrop) {
  // Small delay allows browser to calculate dimensions before transitioning.
  setTimeout(function () {
    backdrop.classList.add(_constants__WEBPACK_IMPORTED_MODULE_0__.CLASS_NAMES.isActive);
    popover.classList.add(_constants__WEBPACK_IMPORTED_MODULE_0__.CLASS_NAMES.isActive);
  }, _constants__WEBPACK_IMPORTED_MODULE_0__.ANIMATION_CONFIG.fadeDelay);
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
function animateOut(popover, backdrop, callback) {
  // Start fade-out animation.
  popover.classList.remove(_constants__WEBPACK_IMPORTED_MODULE_0__.CLASS_NAMES.isActive);
  if (backdrop) {
    backdrop.classList.remove(_constants__WEBPACK_IMPORTED_MODULE_0__.CLASS_NAMES.isActive);
  }

  // Wait for animation to complete before cleanup.
  setTimeout(callback, _constants__WEBPACK_IMPORTED_MODULE_0__.ANIMATION_CONFIG.fadeDuration);
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
 * @param {HTMLAnchorElement} eventLink - The event dot link element that was clicked.
 * @param {HTMLElement}       calendar  - The calendar container element.
 *
 * @return {void}
 */
function showPopover(eventLink, calendar) {
  // Close any existing popover first.
  if (_state__WEBPACK_IMPORTED_MODULE_1__.state.popover) {
    closePopover();
  }

  // Get content from hidden container.
  const contentId = eventLink.getAttribute('data-event-content');
  if (!contentId) {
    return;
  }
  const contentContainer = document.getElementById(contentId);
  if (!contentContainer) {
    return;
  }
  const content = contentContainer.innerHTML;
  if (!content) {
    return;
  }

  // Get custom styling.
  const customStyle = eventLink.getAttribute('data-popover-style') || '';

  // Create and append elements.
  const backdrop = createBackdrop();
  const popover = createPopover(content, customStyle);
  document.body.appendChild(backdrop);
  document.body.appendChild(popover);

  // Position popover near the event dot.
  (0,_positioning__WEBPACK_IMPORTED_MODULE_2__.positionPopover)(popover, eventLink);

  // Animate in.
  animateIn(popover, backdrop);

  // Update state.
  _state__WEBPACK_IMPORTED_MODULE_1__.state.popover = popover;
  _state__WEBPACK_IMPORTED_MODULE_1__.state.backdrop = backdrop;
  _state__WEBPACK_IMPORTED_MODULE_1__.state.calendar = calendar;

  // Move focus to popover for keyboard navigation.
  popover.focus();

  // Setup position update handler.
  const updatePos = (0,_positioning__WEBPACK_IMPORTED_MODULE_2__.createPositionUpdater)(popover, eventLink, calendar);

  // Update position on scroll and resize.
  window.addEventListener('scroll', updatePos, {
    passive: true
  });
  window.addEventListener('resize', updatePos, {
    passive: true
  });

  // Store cleanup function.
  _state__WEBPACK_IMPORTED_MODULE_1__.state.cleanup = function () {
    window.removeEventListener('scroll', updatePos);
    window.removeEventListener('resize', updatePos);
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
function closePopover() {
  if (!_state__WEBPACK_IMPORTED_MODULE_1__.state.popover) {
    return;
  }

  // Clean up event listeners.
  if (_state__WEBPACK_IMPORTED_MODULE_1__.state.cleanup) {
    _state__WEBPACK_IMPORTED_MODULE_1__.state.cleanup();
  }
  const popover = _state__WEBPACK_IMPORTED_MODULE_1__.state.popover;
  const backdrop = _state__WEBPACK_IMPORTED_MODULE_1__.state.backdrop;

  // Animate out and clean up.
  animateOut(popover, backdrop, function () {
    if (popover && popover.parentNode) {
      popover.parentNode.removeChild(popover);
    }
    if (backdrop && backdrop.parentNode) {
      backdrop.parentNode.removeChild(backdrop);
    }
    (0,_state__WEBPACK_IMPORTED_MODULE_1__.resetState)();
  });
}

/***/ },

/***/ "./src/view/positioning.js"
/*!*********************************!*\
  !*** ./src/view/positioning.js ***!
  \*********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createPositionUpdater: () => (/* binding */ createPositionUpdater),
/* harmony export */   positionPopover: () => (/* binding */ positionPopover)
/* harmony export */ });
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ "./src/view/constants.js");
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./state */ "./src/view/state.js");



/**
 * Calculate optimal popover position.
 *
 * Determines the best position for the popover based on:
 * - Event dot location
 * - Viewport dimensions
 * - Popover dimensions
 *
 * Positioning logic:
 * 1. Center horizontally on the dot
 * 2. Place below dot with gap (default)
 * 3. If no space below, place above dot
 * 4. Constrain to viewport with margins
 *
 * @since 0.1.0
 *
 * @param {HTMLElement} popover   - The popover element to position.
 * @param {HTMLElement} eventLink - The event dot link element.
 *
 * @return {void}
 */
function positionPopover(popover, eventLink) {
  const linkRect = eventLink.getBoundingClientRect();
  const popRect = popover.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const gap = _constants__WEBPACK_IMPORTED_MODULE_0__.POPOVER_CONFIG.gap;
  const margin = _constants__WEBPACK_IMPORTED_MODULE_0__.POPOVER_CONFIG.margin;

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

  // Apply calculated position.
  popover.style.top = top + 'px';
  popover.style.left = left + 'px';
}

/**
 * Create position update handler with visibility check.
 *
 * Returns a function that updates popover position only when
 * the calendar is visible in the viewport.
 *
 * @since 0.1.0
 *
 * @param {HTMLElement} popover   - The popover element.
 * @param {HTMLElement} eventLink - The event dot link element.
 * @param {HTMLElement} calendar  - The calendar container.
 *
 * @return {Function} Position update function.
 */
function createPositionUpdater(popover, eventLink, calendar) {
  return function () {
    if (_state__WEBPACK_IMPORTED_MODULE_1__.state.popover && (0,_state__WEBPACK_IMPORTED_MODULE_1__.isCalendarVisible)(calendar)) {
      positionPopover(popover, eventLink);
    }
  };
}

/***/ },

/***/ "./src/view/state.js"
/*!***************************!*\
  !*** ./src/view/state.js ***!
  \***************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getObserver: () => (/* binding */ getObserver),
/* harmony export */   isCalendarVisible: () => (/* binding */ isCalendarVisible),
/* harmony export */   resetState: () => (/* binding */ resetState),
/* harmony export */   setObserver: () => (/* binding */ setObserver),
/* harmony export */   state: () => (/* binding */ state),
/* harmony export */   visibilityMap: () => (/* binding */ visibilityMap)
/* harmony export */ });
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
const state = {
  popover: null,
  backdrop: null,
  calendar: null,
  cleanup: null
};

/**
 * Map of calendars to their visibility state.
 *
 * Uses WeakMap for automatic garbage collection when calendar
 * elements are removed from the DOM.
 *
 * @type {WeakMap<HTMLElement, boolean>}
 */
const visibilityMap = new WeakMap();

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
function setObserver(instance) {
  observerInstance = instance;
}

/**
 * Get the observer instance.
 * @return {IntersectionObserver|null} - The observer instance.
 */
function getObserver() {
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
function resetState() {
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
function isCalendarVisible(calendar) {
  return visibilityMap.get(calendar) === true;
}

/***/ }

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Check if module exists (development only)
/******/ 	if (__webpack_modules__[moduleId] === undefined) {
/******/ 		var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 		e.code = 'MODULE_NOT_FOUND';
/******/ 		throw e;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/make namespace object */
/******/ (() => {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!*********************!*\
  !*** ./src/view.js ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _view_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./view/constants */ "./src/view/constants.js");
/* harmony import */ var _view_observer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./view/observer */ "./src/view/observer.js");
/* harmony import */ var _view_popover__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./view/popover */ "./src/view/popover.js");
/* harmony import */ var _view_handlers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./view/handlers */ "./src/view/handlers.js");
/**
 * GatherPress Calendar Block Frontend Script
 *
 * Progressive enhancement for the GatherPress Calendar block.
 * This script adds interactive popover functionality to event dots,
 * but the calendar remains fully functional without JavaScript.
 *
 * - Event dots are simple <a> links
 * - Content (innerBlocks) for each event is in a hidden container
 * - JavaScript reads from hidden container and shows in popover
 * - Creates valid HTML
 *
 * Progressive enhancement for the GatherPress Calendar block.
 * This script adds interactive popover functionality to event dots,
 * but the calendar remains fully functional without JavaScript.
 *
 * @package
 * @since 0.1.0
 */





(function () {
  'use strict';

  /**
   * Initialize popover functionality for all calendars on the page.
   *
   * Sets up:
   * - IntersectionObserver for visibility tracking
   * - Event handlers for visible calendars only
   * - Global keyboard handlers (Escape)
   *
   * @since 0.1.0
   *
   * @return {void}
   */
  function init() {
    const calendars = document.querySelectorAll('.' + _view_constants__WEBPACK_IMPORTED_MODULE_0__.CLASS_NAMES.calendar);
    if (!calendars.length) {
      return;
    }

    // Set up IntersectionObserver to track calendar visibility.
    (0,_view_observer__WEBPACK_IMPORTED_MODULE_1__.setupIntersectionObserver)(calendars);

    // Global escape key handler to close any open popover.
    document.addEventListener('keydown', _view_handlers__WEBPACK_IMPORTED_MODULE_3__.handleEscapeKey);
  }

  /**
   * Handle DOM ready state.
   *
   * Ensures initialization happens after DOM is fully loaded.
   *
   * @since 0.1.0
   *
   * @return {void}
   */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /**
   * Cleanup on page unload.
   *
   * Ensures proper cleanup of observers and event listeners
   * to prevent memory leaks.
   *
   * @since 0.1.0
   *
   * @return {void}
   */
  window.addEventListener('beforeunload', function () {
    (0,_view_popover__WEBPACK_IMPORTED_MODULE_2__.closePopover)();
    (0,_view_observer__WEBPACK_IMPORTED_MODULE_1__.cleanupObserver)();
  });
})();
})();


//# sourceMappingURL=view.js.map