/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/block.json"
/*!************************!*\
  !*** ./src/block.json ***!
  \************************/
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"telex/block-gatherpress-calendar","version":"0.1.0","title":"GatherPress Calendar","category":"widgets","icon":"calendar-alt","description":"Display query loop posts in a monthly calendar format.","ancestor":["core/query"],"usesContext":["queryId","query","queryContext","displayLayout","templateSlug","previewPostType"],"attributes":{"selectedMonth":{"type":"string","default":""},"monthModifier":{"type":"number","default":0},"templateConfigStyle":{"type":"object","default":{}}},"example":{},"supports":{"reusable":false,"html":false,"align":true,"alignWide":true,"customClassName":true,"typography":{"fontSize":true,"lineHeight":true,"__experimentalFontFamily":true,"__experimentalFontWeight":true,"__experimentalFontStyle":true,"__experimentalTextTransform":true,"__experimentalTextDecoration":true,"__experimentalLetterSpacing":true,"__experimentalDefaultControls":{"fontSize":true}},"color":{"gradients":true,"link":true,"__experimentalDefaultControls":{"background":true,"text":true}},"spacing":{"margin":true,"padding":true}},"styles":[{"name":"default","label":"Classic","isDefault":true},{"name":"minimal","label":"Minimal"},{"name":"bold","label":"Bold"},{"name":"circular","label":"Circular"},{"name":"gradient","label":"Gradient"}],"textdomain":"gatherpress-calendar","editorScript":"file:./index.js","editorStyle":"file:./index.css","style":"file:./style-index.css","viewScript":"file:./view.js","render":"file:./render.php"}');

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
 * Default template for inner blocks
 *
 * @type {Array}
 */

const TEMPLATE = [['core/post-title', {
  level: 3
}], ['core/post-date']];

/**
 * Calculate target date based on selectedMonth and monthModifier
 *
 * This is the SINGLE SOURCE OF TRUTH for date calculation.
 * Used by both date query and calendar generation.
 *
 * @since 0.1.0
 *
 * @param {string} selectedMonth - The selected month in format YYYY-MM.
 * @param {number} monthModifier - The month offset from current month.
 *
 * @return {Date} The target date object.
 */
function calculateTargetDate(selectedMonth, monthModifier = 0) {
  let targetDate;
  if (selectedMonth && /^\d{4}-\d{2}$/.test(selectedMonth)) {
    // Use selected month (ignore monthModifier when explicit month is set)
    const [year, month] = selectedMonth.split('-').map(Number);
    targetDate = new Date(year, month - 1, 1);
  } else {
    // Use current month with modifier
    targetDate = new Date();

    // Apply month modifier if no explicit month is selected
    if (monthModifier !== 0) {
      // Set to first day of month first to avoid date overflow issues
      targetDate.setDate(1);
      // Now apply the month modifier - JavaScript handles year overflow automatically
      targetDate.setMonth(targetDate.getMonth() + monthModifier);
    }
  }
  return targetDate;
}

/**
 * Get day names based on start of week setting
 *
 * Uses WordPress dateI18n to get properly localized day names.
 *
 * @since 0.1.0
 *
 * @param {number} startOfWeek - The start of week (0=Sunday, 1=Monday, etc.).
 *
 * @return {Array<string>} Array of day name labels.
 */
function getDayNames(startOfWeek = 0) {
  const days = [];

  // Base date: 2024-01-07 is a Sunday (day 0)
  const baseSunday = new Date('2024-01-07');
  for (let i = 0; i < 7; i++) {
    // Calculate the day of week (0=Sunday, 6=Saturday)
    const dayOfWeek = (startOfWeek + i) % 7;

    // Create a date for this day of week
    const dayDate = new Date(baseSunday);
    dayDate.setDate(baseSunday.getDate() + dayOfWeek);

    // Get the abbreviated day name using dateI18n for proper localization
    // 'D' format returns the abbreviated day name (e.g., 'Mon', 'Tue', etc.)
    days.push((0,_wordpress_date__WEBPACK_IMPORTED_MODULE_5__.dateI18n)('D', dayDate));
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
 * @param {number} monthModifier - The month offset from current month (e.g., -1 for last month, +1 for next month).
 *
 * @return {Object} Calendar data structure with weeks and days.
 */
function generateCalendar(posts, startOfWeek = 0, selectedMonth = '', monthModifier = 0) {
  // Use the single source of truth for date calculation
  const targetDate = calculateTargetDate(selectedMonth, monthModifier);
  const year = targetDate.getFullYear();
  const month = targetDate.getMonth();

  // Organize posts by date
  const postsByDate = {};
  if (posts && posts.length > 0) {
    posts.forEach(post => {
      console.log('Post in Edit Calendar:', post);
      let postDate;
      if (post.type === 'gatherpress_event') {
        postDate = post.meta.gatherpress_datetime_start;
      } else {
        postDate = post.date;
      }
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
 * Calculate date query parameters for the selected month
 *
 * This function converts the selectedMonth attribute (or current month with modifier)
 * to year and month values that can be used in a WP_Query date_query. It handles the
 * JavaScript-specific behavior where Date.getMonth() returns a zero-based index (0-11)
 * that must be incremented by 1 to get the human-readable month number (1-12).
 *
 * JavaScript Date Months:
 * - January = 0, February = 1, ..., December = 11 (zero-based)
 * 
 * Human-Readable/WP_Query Months:
 * - January = 1, February = 2, ..., December = 12 (one-based)
 *
 * @since 0.1.0
 *
 * @param {string} selectedMonth - The selected month in format YYYY-MM.
 * @param {number} monthModifier - The month offset from current month.
 *
 * @return {Object} Date query object for WP_Query with year and month properties.
 */
function calculateDateQuery(selectedMonth, monthModifier = 0) {
  // Use the single source of truth for date calculation
  const targetDate = calculateTargetDate(selectedMonth, monthModifier);
  const year = targetDate.getFullYear();
  /**
   * IMPORTANT: JavaScript's getMonth() returns 0-11 (January=0, December=11)
   * We add 1 to convert to human-readable format (January=1, December=12)
   * which matches WordPress WP_Query's expected month parameter format.
   */
  const month = targetDate.getMonth() + 1;
  return {
    year: year,
    month: month
  };
}

/**
 * Convert BoxControl value to CSS string
 *
 * @since 0.1.0
 *
 * @param {Object|string} value - The BoxControl value.
 *
 * @return {string} CSS value string.
 */
function boxControlToCSS(value) {
  if (!value) {
    return '';
  }
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'object') {
    const {
      top = '0',
      right = '0',
      bottom = '0',
      left = '0'
    } = value;
    return `${top} ${right} ${bottom} ${left}`;
  }
  return '';
}

/**
 * Convert BorderControl value to CSS strings
 *
 * @since 0.1.0
 *
 * @param {Object} value - The BorderControl value.
 *
 * @return {Object} CSS value strings.
 */
function borderControlToCSS(value) {
  if (!value) {
    return {};
  }
  const result = {};
  if (value.width) {
    result.borderWidth = value.width;
  }
  if (value.style) {
    result.borderStyle = value.style;
  }
  if (value.color) {
    result.borderColor = value.color;
  }
  if (value.radius) {
    if (typeof value.radius === 'string') {
      result.borderRadius = value.radius;
    } else if (typeof value.radius === 'object') {
      const {
        topLeft = '0',
        topRight = '0',
        bottomRight = '0',
        bottomLeft = '0'
      } = value.radius;
      result.borderRadius = `${topLeft} ${topRight} ${bottomRight} ${bottomLeft}`;
    }
  }
  return result;
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
    selectedMonth,
    monthModifier = 0,
    templateConfigStyle = {}
  } = attributes;
  const {
    query,
    queryId
  } = context;
  const [showMonthPicker, setShowMonthPicker] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_6__.useState)(false);

  /**
   * Calculate date query based on selectedMonth and monthModifier
   */
  const dateQuery = calculateDateQuery(selectedMonth, monthModifier);

  /**
   * Fetch posts based on query context with date filtering
   * The useSelect hook will automatically re-run when selectedMonth or monthModifier changes
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

    // Create a clean query object, removing GatherPress-specific parameters
    // that interfere with the REST API query
    const cleanQuery = {
      ...query
    };

    // Remove GatherPress-specific query vars that don't work with getEntityRecords
    delete cleanQuery.gatherpress_event_query;
    delete cleanQuery.include_unfinished;

    // If orderBy is 'datetime' (GatherPress specific), change to 'date'
    if (cleanQuery.orderBy === 'datetime') {
      cleanQuery.orderBy = 'date';
    }
    console.log('Original Query Context:', query);
    console.log('Cleaned Query Context:', cleanQuery);
    const queryArgs = {
      per_page: cleanQuery.perPage || 100,
      order: cleanQuery.order || 'DESC',
      orderby: cleanQuery.orderBy || 'date',
      _embed: 'wp:term'
    };

    // Add date query filter based on the calculated month/year
    if (dateQuery && dateQuery.year && dateQuery.month) {
      queryArgs.year = dateQuery.year;
      queryArgs.month = dateQuery.month;
    }

    // Add taxonomy query if present
    if (cleanQuery.taxQuery) {
      Object.keys(cleanQuery.taxQuery).forEach(taxonomy => {
        queryArgs[taxonomy] = cleanQuery.taxQuery[taxonomy];
      });
    }

    // Add author query if present
    if (cleanQuery.author) {
      queryArgs.author = cleanQuery.author;
    }

    // Add search query if present
    if (cleanQuery.search) {
      queryArgs.search = cleanQuery.search;
    }

    // Get site settings for start_of_week
    const site = getSite();
    const weekStartsOn = site?.start_of_week || 0;
    console.log('Final Query Args:', queryArgs);
    return {
      posts: getEntityRecords('postType', cleanQuery.postType || 'post', queryArgs) || [],
      startOfWeek: weekStartsOn
    };
  },
  // CRITICAL: Add selectedMonth and monthModifier as dependencies so the query updates when they change
  [query, selectedMonth, monthModifier, dateQuery.year, dateQuery.month]);
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
    className: 'gatherpress-calendar-block'
  });
  const innerBlocksProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useInnerBlocksProps)({
    className: 'gatherpress-calendar-template'
  }, {
    // allowedBlocks: ALLOWED_BLOCKS,
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
  const calendar = generateCalendar(posts, startOfWeek, selectedMonth, monthModifier);
  const monthOptions = generateMonthOptions();

  // Build inline styles for template config
  const templateConfigStyles = {
    backgroundColor: templateConfigStyle.backgroundColor || undefined,
    padding: boxControlToCSS(templateConfigStyle.padding) || undefined,
    ...borderControlToCSS({
      width: templateConfigStyle.borderWidth,
      style: templateConfigStyle.borderStyle,
      color: templateConfigStyle.borderColor,
      radius: templateConfigStyle.borderRadius
    }),
    boxShadow: templateConfigStyle.boxShadow || undefined
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
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
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("br", {}), selectedMonth ? monthOptions.find(o => o.value === selectedMonth)?.label : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Current Month', 'gatherpress-calendar'), !selectedMonth && monthModifier !== 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.Fragment, {
              children: [' ', monthModifier > 0 ? `+${monthModifier}` : monthModifier, ' ', monthModifier === 1 ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('month', 'gatherpress-calendar') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('months', 'gatherpress-calendar')]
            })]
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
        }), !selectedMonth && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("hr", {
            style: {
              margin: '16px 0',
              borderTop: '1px solid #ddd'
            }
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("p", {
            style: {
              marginTop: '16px',
              marginBottom: '8px',
              fontWeight: '500'
            },
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Month Offset', 'gatherpress-calendar')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("p", {
            style: {
              fontSize: '12px',
              color: '#757575',
              marginBottom: '12px'
            },
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Display a month relative to the current month. For example, -1 shows last month, +1 shows next month. The calendar will automatically update as time passes.', 'gatherpress-calendar')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalNumberControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Months from current', 'gatherpress-calendar'),
            value: monthModifier,
            onChange: value => {
              const numValue = value === '' ? 0 : parseInt(value, 10);
              setAttributes({
                monthModifier: isNaN(numValue) ? 0 : numValue
              });
            },
            min: -12,
            max: 12,
            step: 1,
            help: monthModifier === 0 ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Showing current month', 'gatherpress-calendar') : monthModifier < 0 ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)(`Showing ${Math.abs(monthModifier)} month(s) ago`, 'gatherpress-calendar') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)(`Showing ${monthModifier} month(s) ahead`, 'gatherpress-calendar')
          }), monthModifier !== 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
            isSecondary: true,
            onClick: () => setAttributes({
              monthModifier: 0
            }),
            style: {
              width: '100%',
              marginTop: '8px'
            },
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Reset Month Offset', 'gatherpress-calendar')
          })]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Template Style', 'gatherpress-calendar'),
        initialOpen: false,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.PanelColorSettings, {
          title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Background', 'gatherpress-calendar'),
          colorSettings: [{
            value: templateConfigStyle.backgroundColor,
            onChange: backgroundColor => {
              setAttributes({
                templateConfigStyle: {
                  ...templateConfigStyle,
                  backgroundColor
                }
              });
            },
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Background Color', 'gatherpress-calendar')
          }]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalBoxControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Padding', 'gatherpress-calendar'),
          values: templateConfigStyle.padding,
          onChange: padding => {
            setAttributes({
              templateConfigStyle: {
                ...templateConfigStyle,
                padding
              }
            });
          }
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.__experimentalBorderControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Border', 'gatherpress-calendar'),
          value: {
            width: templateConfigStyle.borderWidth,
            style: templateConfigStyle.borderStyle,
            color: templateConfigStyle.borderColor,
            radius: templateConfigStyle.borderRadius
          },
          onChange: border => {
            setAttributes({
              templateConfigStyle: {
                ...templateConfigStyle,
                borderWidth: border.width,
                borderStyle: border.style,
                borderColor: border.color,
                borderRadius: border.radius
              }
            });
          }
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RangeControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Box Shadow Blur', 'gatherpress-calendar'),
          value: parseInt(templateConfigStyle.boxShadow?.match(/\d+/)?.[0] || 0),
          onChange: blur => {
            setAttributes({
              templateConfigStyle: {
                ...templateConfigStyle,
                boxShadow: blur > 0 ? `0 8px ${blur}px rgba(0, 0, 0, 0.15)` : undefined
              }
            });
          },
          min: 0,
          max: 50
        })]
      })]
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
          style: templateConfigStyles,
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