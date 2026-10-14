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
/*!**********************************!*\
  !*** ./src/calendar-day/view.js ***!
  \**********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/interactivity */ "@wordpress/interactivity");
/**
 * GatherPress Calendar Day Interactivity Store
 *
 * Updates today, past, and future classes on calendar day cells
 * based on the visitor's local browser time to support static page caches.
 *
 * @package
 */



/**
 * Returns today's date in YYYY-MM-DD format using browser local time.
 *
 * @return {string} YYYY-MM-DD string.
 */
function getBrowserToday() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
;(0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.store)('gatherpress/calendar-day', {
  callbacks: {
    /**
     * True if the cell's date matches today in the visitor's browser.
     *
     * @return {boolean} True if today.
     */
    isToday() {
      const ctx = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)();
      const date = ctx?.date;
      if (!date) {
        return false;
      }
      return date === getBrowserToday();
    },
    /**
     * True if the cell's date is before today in the visitor's browser.
     *
     * @return {boolean} True if past.
     */
    isPast() {
      const ctx = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)();
      const date = ctx?.date;
      if (!date) {
        return false;
      }
      return date < getBrowserToday();
    },
    /**
     * True if the cell's date is after today in the visitor's browser.
     *
     * @return {boolean} True if future.
     */
    isFuture() {
      const ctx = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)();
      const date = ctx?.date;
      if (!date) {
        return false;
      }
      return date > getBrowserToday();
    },
    /**
     * Sets aria-current="date" for today, or false to remove the attribute.
     *
     * @return {string|false} 'date' or false.
     */
    ariaCurrent() {
      const ctx = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)();
      const date = ctx?.date;
      return date && date === getBrowserToday() ? 'date' : false;
    }
  }
});
})();


//# sourceMappingURL=view.js.map