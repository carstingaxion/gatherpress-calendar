/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/calendar-day/edit.js"
/*!**********************************!*\
  !*** ./src/calendar-day/edit.js ***!
  \**********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./editor.scss */ "./src/calendar-day/editor.scss");
/* harmony import */ var _utils_day_number__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/day-number */ "./src/utils/day-number.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);
/**
 * GatherPress Calendar Day Block Editor Component
 *
 * @package
 * @since 0.4.0
 */







const EMPTY_ARRAY = [];

/**
 * Edit Component for Calendar Day
 *
 * Renders an individual calendar cell with date information and event dots/content.
 *
 * @param {Object} props          Component props.
 * @param {Object} props.context  Context provided by parent Calendar / query.
 * @param {string} props.clientId This block's client ID.
 * @return {Element} Day cell preview element.
 */
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.memo)(function Edit({
  context,
  clientId
}) {
  const dayDate = context?.['gatherpress/dayDate'] ?? '';
  const dayNumber = context?.['gatherpress/dayNumber'] ?? 1;
  const isToday = context?.['gatherpress/isToday'] ?? false;
  const isEmpty = context?.['gatherpress/isEmpty'] ?? false;
  const weekday = context?.['gatherpress/weekday'] ?? '';
  const isWeekend = context?.['gatherpress/isWeekend'] ?? false;
  const rawPosts = context?.['gatherpress/dayPosts'];
  const posts = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => rawPosts ?? EMPTY_ARRAY, [rawPosts]);

  // block.json's own providesContext only re-exposes values stored in
  // this block's *attributes*, which we never set (day number etc. are
  // purely derived from context, not persisted). That means descendants
  // - like a Day Number block bound to our binding source, which reads
  // this same context to resolve its value - would only ever see stale
  // attribute defaults. Re-provide the real, current values explicitly
  // so bindings and any other context-aware child resolve correctly.
  const dayContext = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => ({
    'gatherpress/dayDate': dayDate,
    'gatherpress/dayNumber': dayNumber,
    'gatherpress/dayPosts': posts,
    'gatherpress/isEmpty': isEmpty,
    'gatherpress/isToday': isToday,
    'gatherpress/weekday': weekday,
    'gatherpress/isWeekend': isWeekend
  }), [dayDate, dayNumber, posts, isEmpty, isToday, weekday, isWeekend]);

  // If a real Day Number block (a paragraph bound to the calendar-day
  // binding source) already exists among this day's own inner blocks,
  // it renders the day number itself - skip the plain fallback below to
  // avoid showing the number twice, and mirror its own text alignment.
  const {
    hasDayNumberBlock
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.useSelect)(select => {
    const blocks = select(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.store).getBlocks(clientId);
    return {
      hasDayNumberBlock: !!(0,_utils_day_number__WEBPACK_IMPORTED_MODULE_4__.findDayNumberBlock)(blocks)
    };
  }, [clientId]);
  const classNames = ['gatherpress-calendar__day', isEmpty ? 'is-empty' : '', isToday ? 'is-today' : '', posts.length > 0 ? 'has-posts' : '', isWeekend ? 'is-weekend' : '', weekday ? `is-${weekday}` : ''].filter(Boolean).join(' ');
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.useBlockProps)({
    className: classNames
  });
  const {
    children,
    ...innerBlocksWrapperProps
  } = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.useInnerBlocksProps)({}, {
    templateLock: false,
    renderAppender: false
  });
  if (isEmpty) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("td", {
      ...blockProps
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("td", {
    ...blockProps,
    children: [!hasDayNumberBlock && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
      className: "gatherpress-calendar__day-number",
      children: dayNumber
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
      ...innerBlocksWrapperProps,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.BlockContextProvider, {
        value: dayContext,
        children: children
      })
    })]
  });
}));

/***/ },

/***/ "./src/calendar-day/index.js"
/*!***********************************!*\
  !*** ./src/calendar-day/index.js ***!
  \***********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./block.json */ "./src/calendar-day/block.json");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./edit */ "./src/calendar-day/edit.js");
/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./save */ "./src/calendar-day/save.js");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./style.scss */ "./src/calendar-day/style.scss");
/**
 * GatherPress Calendar Day Block Registration
 *
 * @package
 * @since 0.4.0
 */




/**
 * Internal dependencies
 */




(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_2__.name, {
  edit: _edit__WEBPACK_IMPORTED_MODULE_3__["default"],
  save: _save__WEBPACK_IMPORTED_MODULE_4__["default"]
});
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockBindingsSource)({
  name: 'gatherpress/calendar-day',
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Calendar Day Number', 'gatherpress-calendar'),
  usesContext: ['gatherpress/dayNumber', 'gatherpress/isEmpty'],
  getValues({
    context
  }) {
    if (context?.['gatherpress/isEmpty']) {
      return {
        content: ''
      };
    }
    const dayNumber = context?.['gatherpress/dayNumber'];
    return {
      content: dayNumber ? String(dayNumber) : '1'
    };
  }
});

/***/ },

/***/ "./src/calendar-day/save.js"
/*!**********************************!*\
  !*** ./src/calendar-day/save.js ***!
  \**********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ save)
/* harmony export */ });
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);
/**
 * GatherPress Calendar Day Block Save Component
 *
 * Server-side rendering generates the <td> container and injects context;
 * this save component preserves the InnerBlocks template structure.
 *
 * @package
 * @since 0.4.0
 */



function save() {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.InnerBlocks.Content, {});
}

/***/ },

/***/ "./src/utils/day-number.js"
/*!*********************************!*\
  !*** ./src/utils/day-number.js ***!
  \*********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   findDayNumberBlock: () => (/* binding */ findDayNumberBlock),
/* harmony export */   getDayNumberJustifyContent: () => (/* binding */ getDayNumberJustifyContent),
/* harmony export */   getLayoutProps: () => (/* binding */ getLayoutProps),
/* harmony export */   isDayNumberBindingBlock: () => (/* binding */ isDayNumberBindingBlock)
/* harmony export */ });
/**
 * Shared helpers for locating the "Day Number" block - a core/paragraph
 * bound to the gatherpress/calendar-day binding source - among a calendar
 * day's real inner blocks, and reading its own visual settings so both the
 * live day and the read-only day previews can stay in sync with it.
 *
 * @package
 * @since 0.4.0
 */

const DAY_NUMBER_BINDING_SOURCE = 'gatherpress/calendar-day';

/**
 * Whether a block's `content` attribute is bound to the Day Number source.
 *
 * @param {Object} block Block object.
 *
 * @return {boolean} Whether the block is the Day Number bound block.
 */
function isDayNumberBindingBlock(block) {
  return block?.attributes?.metadata?.bindings?.content?.source === DAY_NUMBER_BINDING_SOURCE;
}

/**
 * Finds the Day Number bound block among a day's real inner blocks.
 *
 * @param {Array} blocks Inner blocks.
 *
 * @return {Object|undefined} The Day Number block, if present.
 */
function findDayNumberBlock(blocks) {
  return (blocks ?? []).find(isDayNumberBindingBlock);
}
const JUSTIFY_CONTENT_BY_TEXT_ALIGN = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end'
};

/**
 * Translates the Day Number block's own text alignment into a
 * justify-content value for the flex "events" row it sits in. Text-align
 * alone has no visible effect on a shrink-wrapped flex item's position
 * within its row, so the row's main-axis alignment must follow it instead.
 *
 * @param {Array} blocks Day's real inner blocks.
 *
 * @return {string|undefined} A justify-content value, or undefined to keep the CSS default.
 */
function getDayNumberJustifyContent(blocks) {
  const textAlign = findDayNumberBlock(blocks)?.attributes?.style?.typography?.textAlign;
  return JUSTIFY_CONTENT_BY_TEXT_ALIGN[textAlign];
}

/**
 * Resolves Gutenberg layout attributes (flex, grid, orientation, justification, alignment)
 * into standard Core classes and inline styles for virtual previews.
 *
 * @param {Object} layout - Block's layout attribute object.
 * @return {Object} { className: string, style: Object }
 */
function getLayoutProps(layout = {}) {
  const classes = [];
  const style = {};
  const type = layout?.type || 'default';
  if (type === 'flex') {
    classes.push('is-layout-flex');
    style.display = 'flex';
    const isVertical = layout.orientation === 'vertical';

    // Orientation (Row vs Column)
    if (isVertical) {
      classes.push('is-vertical');
      style.flexDirection = 'column';
    } else {
      classes.push('is-horizontal');
      style.flexDirection = 'row';
    }

    // Flex Wrap
    if (layout.flexWrap === 'nowrap') {
      classes.push('is-nowrap');
      style.flexWrap = 'nowrap';
    } else {
      style.flexWrap = 'wrap';
    }

    // Horizontal alignment (Justification)
    const justifyMap = {
      left: {
        className: 'is-content-justification-left',
        css: 'flex-start'
      },
      center: {
        className: 'is-content-justification-center',
        css: 'center'
      },
      right: {
        className: 'is-content-justification-right',
        css: 'flex-end'
      },
      'space-between': {
        className: 'is-content-justification-space-between',
        css: 'space-between'
      }
    };
    if (layout.justifyContent && justifyMap[layout.justifyContent]) {
      classes.push(justifyMap[layout.justifyContent].className);
      const cssVal = justifyMap[layout.justifyContent].css;

      // In vertical flex, horizontal alignment belongs to the cross axis (alignItems)
      if (isVertical) {
        style.alignItems = cssVal === 'space-between' ? 'stretch' : cssVal;
      } else {
        style.justifyContent = cssVal;
      }
    }

    // Vertical alignment
    const alignMap = {
      top: {
        className: 'is-vertically-aligned-top',
        css: 'flex-start'
      },
      center: {
        className: 'is-vertically-aligned-center',
        css: 'center'
      },
      bottom: {
        className: 'is-vertically-aligned-bottom',
        css: 'flex-end'
      },
      stretch: {
        className: 'is-vertically-aligned-stretch',
        css: 'stretch'
      }
    };
    if (layout.verticalAlignment && alignMap[layout.verticalAlignment]) {
      classes.push(alignMap[layout.verticalAlignment].className);
      const cssVal = alignMap[layout.verticalAlignment].css;

      // In vertical flex, vertical alignment belongs to the main axis (justifyContent)
      if (isVertical) {
        style.justifyContent = cssVal === 'stretch' ? 'flex-start' : cssVal;
      } else {
        style.alignItems = cssVal;
      }
    }
  } else if (type === 'grid') {
    classes.push('is-layout-grid');
    style.display = 'grid';
    const columns = layout.columnFields || layout.columns;
    if (columns) {
      style.gridTemplateColumns = `repeat(${columns}, minmax(0, 1fr))`;
    }
  } else if (type === 'constrained') {
    classes.push('is-layout-constrained');
  } else {
    classes.push('is-layout-flow');
  }
  return {
    className: classes.join(' '),
    style
  };
}

/***/ },

/***/ "./src/calendar-day/editor.scss"
/*!**************************************!*\
  !*** ./src/calendar-day/editor.scss ***!
  \**************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "./src/calendar-day/style.scss"
/*!*************************************!*\
  !*** ./src/calendar-day/style.scss ***!
  \*************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "react/jsx-runtime"
/*!**********************************!*\
  !*** external "ReactJSXRuntime" ***!
  \**********************************/
(module) {

module.exports = window["ReactJSXRuntime"];

/***/ },

/***/ "@wordpress/block-editor"
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
(module) {

module.exports = window["wp"]["blockEditor"];

/***/ },

/***/ "@wordpress/blocks"
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
(module) {

module.exports = window["wp"]["blocks"];

/***/ },

/***/ "@wordpress/data"
/*!******************************!*\
  !*** external ["wp","data"] ***!
  \******************************/
(module) {

module.exports = window["wp"]["data"];

/***/ },

/***/ "@wordpress/element"
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
(module) {

module.exports = window["wp"]["element"];

/***/ },

/***/ "@wordpress/i18n"
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
(module) {

module.exports = window["wp"]["i18n"];

/***/ },

/***/ "./src/calendar-day/block.json"
/*!*************************************!*\
  !*** ./src/calendar-day/block.json ***!
  \*************************************/
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"gatherpress/calendar-day","version":"0.4.0","title":"Calendar Day","category":"gatherpress","icon":"calendar","description":"An individual day cell inside the GatherPress Calendar grid.","parent":["gatherpress/calendar-week","gatherpress/calendar"],"usesContext":["queryId","gatherpress/year","gatherpress/month","gatherpress/dayDate","gatherpress/dayNumber","gatherpress/dayPosts","gatherpress/isEmpty","gatherpress/isToday","gatherpress/weekday","gatherpress/isWeekend"],"providesContext":{"gatherpress/dayDate":"date","gatherpress/dayNumber":"day","gatherpress/dayPosts":"posts","gatherpress/isEmpty":"isEmpty","gatherpress/isToday":"isToday","gatherpress/weekday":"weekday","gatherpress/isWeekend":"isWeekend"},"attributes":{"date":{"type":"string","default":""},"day":{"type":"number","default":0},"isEmpty":{"type":"boolean","default":false},"isToday":{"type":"boolean","default":false}},"supports":{"interactivity":{"clientNavigation":true},"html":false,"reusable":false,"customClassName":true,"color":{"background":true,"text":true,"gradients":true,"__experimentalDefaultControls":{"background":true,"text":true}},"shadow":true,"contentRole":true,"spacing":{"padding":true,"margin":true,"blockGap":true},"layout":{"allowSwitching":true,"allowInheriting":false,"allowSizingOnChildren":true,"default":{"type":"flex","orientation":"horizontal","justifyContent":"left"}},"__experimentalBorder":{"color":true,"radius":true,"style":true,"width":true,"__experimentalDefaultControls":{"color":true,"radius":true,"width":true}},"typography":{"fontSize":true,"lineHeight":true,"__experimentalFontFamily":true,"__experimentalFontWeight":true}},"textdomain":"gatherpress-calendar","editorScript":"file:./index.js","editorStyle":"file:./index.css","style":"file:./style-index.css"}');

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	const __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		const cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		const module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			const e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		const deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn) => {
/******/ 			if(chunkIds) {
/******/ 				deferred.push([chunkIds, fn]);
/******/ 				return;
/******/ 			}
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				let [chunkIds, fn] = deferred[i];
/******/ 				let fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if (__webpack_require__.O.j(chunkIds[j])) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					const r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = (module) => {
/******/ 		const getter = module && module.__esModule ?
/******/ 			() => (module['default']) :
/******/ 			() => (module);
/******/ 		__webpack_require__.d(getter, { a: getter });
/******/ 		return getter;
/******/ 	};
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	// define getter/value functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	__webpack_require__.o = (obj, prop) => (Object.hasOwn(obj, prop));
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		const installedChunks = {
/******/ 			"calendar-day/index": 0,
/******/ 			"calendar-day/style-index": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		const webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			let [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		const chunkLoadingGlobal = globalThis["webpackChunkgatherpress_calendar"] ||= [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	let __webpack_exports__ = __webpack_require__.O(undefined, ["calendar-day/style-index"], () => (__webpack_require__("./src/calendar-day/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=index.js.map