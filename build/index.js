/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/block.json"
/*!************************!*\
  !*** ./src/block.json ***!
  \************************/
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"telex/block-gatherpress-calendar","version":"0.1.0","title":"GatherPress Calendar","category":"widgets","icon":"calendar-alt","description":"Display query loop posts in a monthly calendar format.","ancestor":["core/query"],"usesContext":["queryId","query","queryContext","displayLayout","templateSlug","previewPostType"],"attributes":{"selectedMonth":{"type":"string","default":""}},"example":{},"supports":{"reusable":false,"html":false,"align":true,"alignWide":true,"customClassName":true,"typography":{"fontSize":true,"lineHeight":true,"__experimentalFontFamily":true,"__experimentalFontWeight":true,"__experimentalFontStyle":true,"__experimentalTextTransform":true,"__experimentalTextDecoration":true,"__experimentalLetterSpacing":true,"__experimentalDefaultControls":{"fontSize":true}},"color":{"gradients":true,"link":true,"__experimentalDefaultControls":{"background":true,"text":true}},"spacing":{"margin":true,"padding":true}},"styles":[{"name":"default","label":"Classic","isDefault":true},{"name":"minimal","label":"Minimal"},{"name":"bold","label":"Bold"},{"name":"circular","label":"Circular"},{"name":"gradient","label":"Gradient"}],"textdomain":"gatherpress-calendar","editorScript":"file:./index.js","editorStyle":"file:./index.css","style":"file:./style-index.css","viewScript":"file:./view.js","render":"file:./render.php"}');

/***/ },

/***/ "./src/edit.js"
/*!*********************!*\
  !*** ./src/edit.js ***!
  \*********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Edit)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/core-data */ "@wordpress/core-data");
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_date__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/date */ "@wordpress/date");
/* harmony import */ var _wordpress_date__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_date__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./editor.scss */ "./src/editor.scss");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__);
/**
 * GatherPress Calendar Block Editor Component
 *
 * This file defines the edit component that renders the block within
 * the WordPress block editor. It provides the interface for users to
 * interact with and configure the calendar block.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @package GatherPressCalendar
 * @since 0.1.0
 */









/**
 * Editor-specific styles
 *
 * Styles defined here are only applied within the block editor context.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */


/**
 * Allowed inner blocks
 *
 * List of core post blocks that can be used within the calendar.
 *
 * @type {Array<string>}
 */

const ALLOWED_BLOCKS = ['core/post-title', 'core/post-date', 'core/post-excerpt', 'core/post-featured-image', 'core/post-terms', 'core/post-author', 'core/post-author-name', 'core/post-author-biography', 'core/avatar'];

/**
 * Default template for inner blocks
 *
 * @type {Array}
 */
const TEMPLATE = [['core/post-title', {
  level: 3
}], ['core/post-date']];

/**
 * Get day names based on start of week setting
 *
 * @since 0.1.0
 *
 * @param {number} startOfWeek - The start of week (0=Sunday, 1=Monday, etc.).
 *
 * @return {Array<string>} Array of day name labels.
 */
function getDayNames(startOfWeek = 0) {
  const allDays = [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Sun', 'gatherpress-calendar'), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Mon', 'gatherpress-calendar'), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Tue', 'gatherpress-calendar'), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Wed', 'gatherpress-calendar'), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Thu', 'gatherpress-calendar'), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Fri', 'gatherpress-calendar'), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Sat', 'gatherpress-calendar')];
  const days = [];
  for (let i = 0; i < 7; i++) {
    days.push(allDays[(startOfWeek + i) % 7]);
  }
  return days;
}

/**
 * Generate calendar structure
 *
 * Creates a monthly calendar grid with posts placed on their dates.
 *
 * @since 0.1.0
 *
 * @param {Array} posts - Array of post objects.
 * @param {number} startOfWeek - The start of week (0=Sunday, 1=Monday, etc.).
 * @param {string} selectedMonth - The selected month in format YYYY-MM (e.g., "2025-07").
 *
 * @return {Object} Calendar data structure with weeks and days.
 */
function generateCalendar(posts, startOfWeek = 0, selectedMonth = '') {
  // Determine which month to display
  let targetDate;
  if (selectedMonth && /^\d{4}-\d{2}$/.test(selectedMonth)) {
    // Use selected month
    const [year, month] = selectedMonth.split('-').map(Number);
    targetDate = new Date(year, month - 1, 1);
  } else {
    // Use current month
    targetDate = new Date();
  }
  const year = targetDate.getFullYear();
  const month = targetDate.getMonth();

  // Organize posts by date
  const postsByDate = {};
  if (posts && posts.length > 0) {
    posts.forEach(post => {
      const postDate = post.date;
      if (!postDate) {
        return;
      }
      const dateObj = new Date(postDate);
      const dateStr = (0,_wordpress_date__WEBPACK_IMPORTED_MODULE_5__.dateI18n)('Y-m-d', dateObj);
      if (!postsByDate[dateStr]) {
        postsByDate[dateStr] = [];
      }
      postsByDate[dateStr].push(post);
    });
  }

  // Get first day of month and total days
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  let startDayOfWeek = firstDay.getDay();

  // Adjust start day based on start_of_week setting
  startDayOfWeek = (startDayOfWeek - startOfWeek + 7) % 7;

  // Create weeks array
  const weeks = [];
  let currentWeek = [];

  // Fill initial empty days
  for (let i = 0; i < startDayOfWeek; i++) {
    currentWeek.push({
      isEmpty: true
    });
  }

  // Fill days with posts
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayPosts = postsByDate[dateStr] || [];
    currentWeek.push({
      day,
      date: dateStr,
      posts: dayPosts,
      isEmpty: false
    });
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  // Fill remaining empty days
  while (currentWeek.length > 0 && currentWeek.length < 7) {
    currentWeek.push({
      isEmpty: true
    });
  }
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }
  return {
    monthName: (0,_wordpress_date__WEBPACK_IMPORTED_MODULE_5__.dateI18n)('F Y', firstDay),
    weeks,
    dayNames: getDayNames(startOfWeek)
  };
}

/**
 * Generate month options for the picker
 *
 * @since 0.1.0
 *
 * @return {Array} Array of month options.
 */
function generateMonthOptions() {
  const options = [];
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  // Generate options for current year and next year
  for (let year = currentYear - 1; year <= currentYear + 1; year++) {
    for (let month = 1; month <= 12; month++) {
      const date = new Date(year, month - 1, 1);
      const value = `${year}-${String(month).padStart(2, '0')}`;
      const label = (0,_wordpress_date__WEBPACK_IMPORTED_MODULE_5__.dateI18n)('F Y', date);
      options.push({
        value,
        label
      });
    }
  }
  return options;
}

/**
 * Edit Component
 *
 * Renders the block's edit interface in the WordPress editor.
 *
 * @since 0.1.0
 *
 * @param {Object} props - The component props.
 * @param {Object} props.attributes - The block attributes.
 * @param {Function} props.setAttributes - Function to update attributes.
 * @param {Object} props.context - Context from parent blocks.
 * @param {string} props.clientId - The block's client ID.
 *
 * @return {Element} The React element to be rendered in the editor.
 */
function Edit({
  attributes,
  setAttributes,
  context,
  clientId
}) {
  const {
    selectedMonth
  } = attributes;
  const {
    query,
    queryId
  } = context;
  const [showMonthPicker, setShowMonthPicker] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_6__.useState)(false);

  /**
   * Fetch posts based on query context and start_of_week setting
   */
  const {
    posts,
    startOfWeek
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_3__.useSelect)(select => {
    if (!query) {
      return {
        posts: [],
        startOfWeek: 0
      };
    }
    const {
      getEntityRecords
    } = select(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_4__.store);
    const {
      getSite
    } = select(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_4__.store);
    const queryArgs = {
      per_page: query.perPage || 100,
      order: query.order || 'DESC',
      orderby: query.orderBy || 'date',
      _embed: 'wp:term'
    };

    // Add taxonomy query if present
    if (query.taxQuery) {
      Object.keys(query.taxQuery).forEach(taxonomy => {
        queryArgs[taxonomy] = query.taxQuery[taxonomy];
      });
    }

    // Add author query if present
    if (query.author) {
      queryArgs.author = query.author;
    }

    // Add search query if present
    if (query.search) {
      queryArgs.search = query.search;
    }

    // Get site settings for start_of_week
    const site = getSite();
    const weekStartsOn = site?.start_of_week || 0;
    return {
      posts: getEntityRecords('postType', query.postType || 'post', queryArgs) || [],
      startOfWeek: weekStartsOn
    };
  }, [query]);
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
    className: 'gatherpress-calendar-block'
  });
  const innerBlocksProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useInnerBlocksProps)({
    className: 'gatherpress-calendar-template'
  }, {
    allowedBlocks: ALLOWED_BLOCKS,
    template: TEMPLATE,
    templateLock: false
  });
  if (!query) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("div", {
      ...blockProps,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Placeholder, {
        icon: "calendar-alt",
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('GatherPress Calendar', 'gatherpress-calendar'),
        instructions: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('This block must be used inside a Query Loop block.', 'gatherpress-calendar')
      })
    });
  }
  const calendar = generateCalendar(posts, startOfWeek, selectedMonth);
  const monthOptions = generateMonthOptions();
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Calendar Settings', 'gatherpress-calendar'),
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("p", {
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Select a specific month to display, or leave empty to show the current month.', 'gatherpress-calendar')
        }), showMonthPicker ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("div", {
            style: {
              marginBottom: '12px',
              maxHeight: '200px',
              overflowY: 'auto',
              border: '1px solid #ddd',
              borderRadius: '4px'
            },
            children: monthOptions.map(option => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
              isPressed: selectedMonth === option.value,
              onClick: () => {
                setAttributes({
                  selectedMonth: option.value
                });
                setShowMonthPicker(false);
              },
              style: {
                width: '100%',
                justifyContent: 'flex-start',
                padding: '8px 12px'
              },
              children: option.label
            }, option.value))
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
            isSecondary: true,
            onClick: () => setShowMonthPicker(false),
            style: {
              width: '100%'
            },
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Cancel', 'gatherpress-calendar')
          })]
        }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
            style: {
              marginBottom: '12px',
              padding: '8px',
              background: '#f0f0f1',
              borderRadius: '4px'
            },
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("strong", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Current Selection:', 'gatherpress-calendar')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("br", {}), selectedMonth ? monthOptions.find(o => o.value === selectedMonth)?.label : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Current Month', 'gatherpress-calendar')]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
            isPrimary: true,
            onClick: () => setShowMonthPicker(true),
            style: {
              width: '100%',
              marginBottom: '8px'
            },
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Change Month', 'gatherpress-calendar')
          }), selectedMonth && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
            isSecondary: true,
            onClick: () => setAttributes({
              selectedMonth: ''
            }),
            style: {
              width: '100%'
            },
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Reset to Current Month', 'gatherpress-calendar')
          })]
        })]
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("div", {
      ...blockProps,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
        className: "gatherpress-calendar",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("h2", {
          className: "gatherpress-calendar__month",
          children: calendar.monthName
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("table", {
          className: "gatherpress-calendar__table",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("thead", {
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("tr", {
              children: calendar.dayNames.map((dayName, index) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("th", {
                children: dayName
              }, index))
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("tbody", {
            children: calendar.weeks.map((week, weekIndex) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("tr", {
              children: week.map((day, dayIndex) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("td", {
                className: `gatherpress-calendar__day ${day.isEmpty ? 'is-empty' : ''} ${day.posts?.length > 0 ? 'has-posts' : ''}`,
                children: !day.isEmpty && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.Fragment, {
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("div", {
                    className: "gatherpress-calendar__day-number",
                    children: day.day
                  }), day.posts?.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("div", {
                    className: "gatherpress-calendar__events",
                    children: day.posts.map(post => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("div", {
                      className: "gatherpress-calendar__event",
                      title: post.title?.rendered || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('(No title)', 'gatherpress-calendar')
                    }, post.id))
                  })]
                })
              }, dayIndex))
            }, weekIndex))
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
          className: "gatherpress-calendar__template-config",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("p", {
            className: "gatherpress-calendar__template-label",
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Configure how events appear in the calendar by adding blocks below:', 'gatherpress-calendar')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("div", {
            ...innerBlocksProps
          })]
        })]
      })
    })]
  });
}

/***/ },

/***/ "./src/editor.scss"
/*!*************************!*\
  !*** ./src/editor.scss ***!
  \*************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "./src/index.js"
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./style.scss */ "./src/style.scss");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./edit */ "./src/edit.js");
/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./save */ "./src/save.js");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./block.json */ "./src/block.json");
/**
 * GatherPress Calendar Block Registration
 *
 * Registers the GatherPress Calendar block with WordPress, defining its
 * edit and save functions along with associated metadata.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 *
 * @package GatherPressCalendar
 * @since 0.1.0
 */



/**
 * Style imports
 *
 * Imports SCSS files that contain styles applied to both the frontend
 * and the editor. The webpack configuration processes these files.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */


/**
 * Internal dependencies
 */




/**
 * Register the GatherPress Calendar block type
 *
 * This registration connects the block metadata with its edit and save
 * implementations. Even though this is a dynamic block that uses render.php,
 * the save function is needed to preserve the InnerBlocks template structure.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_4__.name, {
  /**
   * Edit function for the block
   *
   * @see ./edit.js
   */
  edit: _edit__WEBPACK_IMPORTED_MODULE_2__["default"],
  /**
   * Save function for the block
   *
   * Saves the InnerBlocks template structure to the database.
   *
   * @see ./save.js
   */
  save: _save__WEBPACK_IMPORTED_MODULE_3__["default"]
});

/***/ },

/***/ "./src/save.js"
/*!*********************!*\
  !*** ./src/save.js ***!
  \*********************/
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
 * GatherPress Calendar Block Save Component
 *
 * This file defines the save function that determines how the block's
 * content is serialized and saved to the database. For this block,
 * we need to save the InnerBlocks structure which defines the template
 * for how individual events are displayed in the calendar.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @package GatherPressCalendar
 * @since 0.1.0
 */



/**
 * Save Component
 *
 * Saves the block markup with InnerBlocks for the post template.
 * Even though this is a dynamic block (using render.php), we still
 * need to save the InnerBlocks structure so the template is preserved.
 *
 * @since 0.1.0
 *
 * @return {Element} The React element representing the saved block content.
 */

function save() {
  const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.useBlockProps.save({
    className: 'gatherpress-calendar-block'
  });
  const innerBlocksProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.useInnerBlocksProps.save({
    className: 'gatherpress-calendar-template'
  });
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
    ...blockProps,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
      ...innerBlocksProps
    })
  });
}

/***/ },

/***/ "./src/style.scss"
/*!************************!*\
  !*** ./src/style.scss ***!
  \************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


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

/***/ "@wordpress/components"
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
(module) {

module.exports = window["wp"]["components"];

/***/ },

/***/ "@wordpress/core-data"
/*!**********************************!*\
  !*** external ["wp","coreData"] ***!
  \**********************************/
(module) {

module.exports = window["wp"]["coreData"];

/***/ },

/***/ "@wordpress/data"
/*!******************************!*\
  !*** external ["wp","data"] ***!
  \******************************/
(module) {

module.exports = window["wp"]["data"];

/***/ },

/***/ "@wordpress/date"
/*!******************************!*\
  !*** external ["wp","date"] ***!
  \******************************/
(module) {

module.exports = window["wp"]["date"];

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

/***/ "react/jsx-runtime"
/*!**********************************!*\
  !*** external "ReactJSXRuntime" ***!
  \**********************************/
(module) {

module.exports = window["ReactJSXRuntime"];

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Check if module exists (development only)
/******/ 		if (__webpack_modules__[moduleId] === undefined) {
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
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
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"index": 0,
/******/ 			"./style-index": 0
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
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
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
/******/ 		var chunkLoadingGlobal = globalThis["webpackChunkblock_gatherpress_calendar"] = globalThis["webpackChunkblock_gatherpress_calendar"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["./style-index"], () => (__webpack_require__("./src/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=index.js.map