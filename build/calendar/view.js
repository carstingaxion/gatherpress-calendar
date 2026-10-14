import * as __WEBPACK_EXTERNAL_MODULE__wordpress_interactivity_8e89b257__ from "@wordpress/interactivity";
/******/ var __webpack_modules__ = ({

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
/*!******************************!*\
  !*** ./src/calendar/view.js ***!
  \******************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/interactivity */ "@wordpress/interactivity");
/**
 * GatherPress Calendar Interactivity Store
 *
 * Moves keyboard focus to the month heading after "Previous Month" or
 * "Next Month" changes the calendar without a page reload.
 *
 * After client-side navigation, core/query focuses the first link of its
 * Post Template. A calendar has no Post Template, so focus fell back to the
 * document body, and screen readers did not hear the new month.
 *
 * @package
 */



/**
 * Router region of the calendar whose pagination link was clicked last.
 *
 * @type {string|null}
 */
let pendingRegion = null;

// Browser back/forward replaces a click whose navigation has not finished.
// The router renders that history entry asynchronously, after this runs.
window.addEventListener('popstate', () => {
  pendingRegion = null;
});

/**
 * Returns the ID of the router region that contains an element.
 *
 * @param {Element|null} element Element inside a core/query block.
 *
 * @return {string|null} Region ID, like "query-0", or null.
 */
function getRegionId(element) {
  return element?.closest('[data-wp-router-region]')?.dataset.wpRouterRegion ?? null;
}
;(0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.store)('gatherpress/calendar', {
  state: {
    hoveredEventId: null,
    focusedEventId: null
  },
  actions: {
    hoverEvent(event) {
      if (event?.target?.closest?.('.wp-block-gatherpress-modal')) {
        return;
      }
      // Ask GatherPress / DOM if any modal is currently open
      if (document.querySelector('.wp-block-gatherpress-modal.gatherpress--is-visible')) {
        return;
      }
      const context = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)();
      if (context?.eventId) {
        const {
          state
        } = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.store)('gatherpress/calendar');
        state.hoveredEventId = context.eventId;
      }
    },
    unhoverEvent(event) {
      if (event?.relatedTarget?.closest?.('.wp-block-gatherpress-modal')) {
        return;
      }
      const {
        state
      } = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.store)('gatherpress/calendar');
      state.hoveredEventId = null;
    },
    focusEvent(event) {
      if (event?.target?.closest?.('.wp-block-gatherpress-modal')) {
        return;
      }
      if (document.querySelector('.wp-block-gatherpress-modal.gatherpress--is-visible')) {
        return;
      }
      const context = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)();
      if (context?.eventId) {
        const {
          state
        } = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.store)('gatherpress/calendar');
        state.focusedEventId = context.eventId;
      }
    },
    unfocusEvent() {
      const {
        state
      } = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.store)('gatherpress/calendar');
      state.focusedEventId = null;
    },
    /**
     * Remembers a click on a pagination link of this calendar's query.
     *
     * Runs on document clicks, after the click handler of core/query.
     * That handler calls preventDefault() only when it navigates on the
     * client, so a click that opens a new tab is ignored here too.
     *
     * @param {MouseEvent} event Click event.
     */
    rememberPagination(event) {
      const link = event.target?.closest?.('.wp-block-query-pagination a[href]');
      if (!link || !event.defaultPrevented) {
        return;
      }
      const regionId = getRegionId((0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getElement)().ref);
      if (regionId && regionId === getRegionId(link)) {
        pendingRegion = regionId;
      }
    }
  },
  callbacks: {
    isEventHovered() {
      const context = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)();
      const {
        state
      } = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.store)('gatherpress/calendar');
      return Boolean(context?.eventId && state.hoveredEventId === context.eventId);
    },
    isEventFocused() {
      const context = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)();
      const {
        state
      } = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.store)('gatherpress/calendar');
      return Boolean(context?.eventId && state.focusedEventId === context.eventId);
    },
    /**
     * Focuses the month heading after this calendar's own pagination.
     *
     * Runs when the wrapper mounts. Its data-wp-key changes with the date
     * range, so this runs once per navigation, and also on page load and
     * on browser back/forward, where no click is pending.
     *
     * Without a month heading, the first calendar table gets focus. Its
     * caption names the month.
     */
    focusAfterNavigation() {
      const {
        ref
      } = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getElement)();
      const regionId = getRegionId(ref);
      if (!regionId || regionId !== pendingRegion) {
        return;
      }
      pendingRegion = null;

      // Do not take focus from an element outside this calendar's query.
      const region = ref.closest('[data-wp-router-region]');
      const {
        activeElement,
        body
      } = ref.ownerDocument;
      if (activeElement && activeElement !== body && !region.contains(activeElement)) {
        return;
      }
      const target = region.querySelector('.gatherpress-calendar__heading') ?? ref.querySelector('table');
      if (!target) {
        return;
      }
      if (!target.hasAttribute('tabindex')) {
        target.setAttribute('tabindex', '-1');
      }
      target.focus();
    }
  }
});
})();


//# sourceMappingURL=view.js.map