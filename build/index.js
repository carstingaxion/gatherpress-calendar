/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/block.json"
/*!************************!*\
  !*** ./src/block.json ***!
  \************************/
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"gatherpress/calendar","version":"0.1.0","title":"GatherPress Calendar","category":"gatherpress","icon":"calendar-alt","description":"Display query loop posts in a monthly calendar format.","ancestor":["core/query"],"usesContext":["queryId","query","queryContext","displayLayout","templateSlug","previewPostType"],"attributes":{"selectedMonth":{"type":"string","default":""},"monthModifier":{"type":"number","default":0},"templateConfigStyle":{"type":"object","default":{}}},"example":{},"supports":{"reusable":false,"html":false,"align":true,"alignWide":true,"customClassName":true,"typography":{"fontSize":true,"lineHeight":true,"__experimentalFontFamily":true,"__experimentalFontWeight":true,"__experimentalFontStyle":true,"__experimentalTextTransform":true,"__experimentalTextDecoration":true,"__experimentalLetterSpacing":true,"__experimentalDefaultControls":{"fontSize":true}},"color":{"gradients":true,"link":true,"__experimentalDefaultControls":{"background":true,"text":true}},"spacing":{"margin":true,"padding":true}},"styles":[{"name":"default","label":"Classic","isDefault":true},{"name":"minimal","label":"Minimal"},{"name":"bold","label":"Bold"},{"name":"circular","label":"Circular"},{"name":"gradient","label":"Gradient"}],"textdomain":"gatherpress-calendar","editorScript":"file:./index.js","editorStyle":"file:./index.css","style":"file:./style-index.css","viewScript":"file:./view.js","render":"file:./render.php"}');

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
 * interact with and configure the calendar block, including:
 * - Visual calendar preview with posts from the query context
 * - Month selection and month modifier controls
 * - Template configuration for how posts appear
 * - Popover styling options
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @package
 * @since 0.1.0
 */



/* eslint-disable @wordpress/no-unsafe-wp-apis */






/**
 * Editor-specific styles
 *
 * Styles defined here are only applied within the block editor context.
 * They help distinguish the editor view from the frontend display.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */


/**
 * Default template for inner blocks.
 *
 * Defines the initial blocks that appear when the calendar is first added.
 * Users can modify this template by adding, removing, or reordering blocks.
 *
 * @type {Array<Array>}
 * @since 0.1.0
 */

const TEMPLATE = [['core/post-title', {
  level: 3
}], ['core/post-date']];

/**
 * Calculate target date based on selectedMonth and monthModifier.
 *
 * This is the SINGLE SOURCE OF TRUTH for date calculation throughout the block.
 * It's used by both the date query (for fetching posts) and the calendar generation
 * (for displaying the grid). This ensures consistency between what posts are fetched
 * and where they appear in the calendar.
 *
 * Logic:
 * 1. If selectedMonth is set (format: "YYYY-MM"), use that specific month
 * 2. Otherwise, use current month + monthModifier
 * 3. JavaScript Date handles year overflow automatically (e.g., month 13 becomes January of next year)
 *
 * Why we set date to 1 first:
 * Setting the date to 1 before applying monthModifier prevents issues with months
 * that have different numbers of days. For example, if today is Jan 31 and we add
 * 1 month without this, JavaScript would try to create Feb 31, which doesn't exist.
 *
 * @since 0.1.0
 *
 * @param {string} selectedMonth - The selected month in format "YYYY-MM" (e.g., "2025-07").
 * @param {number} monthModifier - The month offset from current month (e.g., -1 for last month, +1 for next month).
 *
 * @return {Date} The calculated target date object.
 *
 * @example
 * // Get a specific month
 * calculateTargetDate('2025-07', 0) // Returns July 2025
 *
 * @example
 * // Get last month relative to today
 * calculateTargetDate('', -1) // Returns last month's date
 *
 * @example
 * // Get next month relative to today
 * calculateTargetDate('', 1) // Returns next month's date
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
      // This prevents problems like "Jan 31 + 1 month = March 3" instead of "Feb 28/29"
      targetDate.setDate(1);
      // Now apply the month modifier - JavaScript handles year overflow automatically
      // For example: December (month 11) + 1 = January (month 0) of next year
      targetDate.setMonth(targetDate.getMonth() + monthModifier);
    }
  }
  return targetDate;
}

/**
 * Get day names based on start of week setting.
 *
 * Uses WordPress dateI18n to get properly localized day names that respect
 * the site's language settings. The order of days is adjusted based on the
 * start_of_week option (e.g., Monday-first vs Sunday-first).
 *
 * How it works:
 * 1. Start with a known Sunday (2024-01-07)
 * 2. For each day of the week, calculate which day it should be based on startOfWeek
 * 3. Use dateI18n with 'D' format to get the translated abbreviated day name
 *
 * @since 0.1.0
 *
 * @param {number} startOfWeek - The start of week (0=Sunday, 1=Monday, 2=Tuesday, etc.).
 *
 * @return {Array<string>} Array of day name labels in the correct order.
 *
 * @example
 * // Sunday-first week (US style)
 * getDayNames(0) // Returns ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
 *
 * @example
 * // Monday-first week (European style)
 * getDayNames(1) // Returns ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
 */
function getDayNames(startOfWeek = 0) {
  const days = [];

  // Base date: 2024-01-07 is a Sunday (day 0)
  // We use a fixed date so calculations are consistent
  const baseSunday = new Date('2024-01-07');
  for (let i = 0; i < 7; i++) {
    // Calculate the day of week (0=Sunday, 6=Saturday)
    // The modulo ensures we wrap around (e.g., day 7 becomes day 0)
    const dayOfWeek = (startOfWeek + i) % 7;

    // Create a date for this day of week by adding days to base Sunday
    const dayDate = new Date(baseSunday);
    dayDate.setDate(baseSunday.getDate() + dayOfWeek);

    // Get the abbreviated day name using dateI18n for proper localization
    // 'D' format returns the abbreviated day name (e.g., 'Mon', 'Tue', etc.)
    // This respects the site's language setting via WordPress core
    days.push((0,_wordpress_date__WEBPACK_IMPORTED_MODULE_5__.dateI18n)('D', dayDate));
  }
  return days;
}

/**
 * Generate calendar structure with posts.
 *
 * Creates a monthly calendar grid where posts are placed on their respective dates.
 * The calendar structure includes:
 * - Month name and year
 * - Weeks array (each week is 7 days)
 * - Each day contains: day number, date string, and array of posts for that date
 * - Empty days before/after the month to complete the grid
 *
 * Post organization:
 * - For GatherPress events: uses gatherpress_datetime_start meta field
 * - For other post types: uses publication date
 * - Multiple posts can appear on the same day
 *
 * @since 0.1.0
 *
 * @param {Array<Object>} posts         - Array of post objects from the REST API.
 * @param {number}        startOfWeek   - The start of week (0=Sunday, 1=Monday, etc.).
 * @param {string}        selectedMonth - The selected month in format "YYYY-MM".
 * @param {number}        monthModifier - The month offset from current month.
 *
 * @return {Object} Calendar data structure containing:
 *   - {string} monthName - Formatted month and year (e.g., "January 2025")
 *   - {Array<Array<Object>>} weeks - Array of weeks, each containing 7 day objects
 *   - {Array<string>} dayNames - Array of day name labels
 *
 * @example
 * const calendar = generateCalendar(posts, 0, '', 0);
 * // Returns:
 * // {
 * //   monthName: 'January 2025',
 * //   weeks: [
 * //     [
 * //       { isEmpty: true },
 * //       { day: 1, date: '2025-01-01', posts: [], isEmpty: false },
 * //       ...
 * //     ],
 * //     ...
 * //   ],
 * //   dayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
 * // }
 */
function generateCalendar(posts, startOfWeek = 0, selectedMonth = '', monthModifier = 0) {
  // Use the single source of truth for date calculation
  const targetDate = calculateTargetDate(selectedMonth, monthModifier);
  // console.log( 'Generating calendar for date:', targetDate );
  const year = targetDate.getFullYear();
  const month = targetDate.getMonth();

  // Organize posts by date for quick lookup
  // Format: { 'YYYY-MM-DD': [post1, post2, ...] }
  const postsByDate = {};
  if (posts && posts.length > 0) {
    posts.forEach(post => {
      // console.log( 'Post in Edit Calendar:', post );
      let postDate;
      // For GatherPress events, use event start date
      if (post.type === 'gatherpress_event') {
        postDate = post.meta.gatherpress_datetime_start;
      } else {
        // For other post types, use publication date
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

  // Calculate calendar dimensions
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  let startDayOfWeek = firstDay.getDay();

  // Adjust start day based on start_of_week setting
  // This shifts the calendar so it starts on the configured day
  startDayOfWeek = (startDayOfWeek - startOfWeek + 7) % 7;

  // Build the weeks array
  const weeks = [];
  let currentWeek = [];

  // Fill initial empty days before the month starts
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

    // When week is complete (7 days), start a new week
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  // Fill remaining empty days after the month ends
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
 * Generate month options for the month picker.
 *
 * Creates an array of month options spanning from last year to next year,
 * providing users with a reasonable range of months to choose from without
 * overwhelming them with too many options.
 *
 * @since 0.1.0
 *
 * @return {Array<Object>} Array of month options, each containing:
 *   - {string} value - Month value in format "YYYY-MM"
 *   - {string} label - Formatted month name and year (e.g., "January 2025")
 *
 * @example
 * const options = generateMonthOptions();
 * // Returns array like:
 * // [
 * //   { value: '2024-01', label: 'January 2024' },
 * //   { value: '2024-02', label: 'February 2024' },
 * //   ...
 * //   { value: '2026-12', label: 'December 2026' }
 * // ]
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
 * Calculate date query parameters for the selected month.
 *
 * Converts the selectedMonth attribute (or current month with modifier) to year
 * and month values that can be used in a WP_Query date_query or REST API request.
 *
 * JavaScript Date Month Behavior:
 * - Date.getMonth() returns 0-11 (January=0, December=11) - zero-based index
 * - WP_Query expects 1-12 (January=1, December=12) - one-based index
 * - Therefore we must add 1 to getMonth() result for WordPress compatibility
 *
 * This is a common source of off-by-one errors in JavaScript date handling.
 * Always remember: JavaScript months are zero-based, human months are one-based.
 *
 * @since 0.1.0
 *
 * @param {string} selectedMonth - The selected month in format "YYYY-MM".
 * @param {number} monthModifier - The month offset from current month.
 *
 * @return {Object} Date query object containing:
 *   - {number} year - Four-digit year (e.g., 2025)
 *   - {number} month - Month number 1-12 (January=1, December=12)
 *
 * @example
 * // Calculate for January 2025
 * calculateDateQuery('2025-01', 0)
 * // Returns: { year: 2025, month: 1 }
 *
 * @example
 * // Calculate for last month (if current is Feb 2025)
 * calculateDateQuery('', -1)
 * // Returns: { year: 2025, month: 1 }
 */
function calculateDateQuery(selectedMonth, monthModifier = 0) {
  // Use the single source of truth for date calculation
  const targetDate = calculateTargetDate(selectedMonth, monthModifier);
  const year = targetDate.getFullYear();
  /**
   * CRITICAL: JavaScript's getMonth() returns 0-11 (January=0, December=11)
   * We MUST add 1 to convert to human-readable/WP_Query format (January=1, December=12)
   *
   * Why this matters:
   * - Without +1: December would be month 11, January would be month 0
   * - WP_Query interprets month 0 as "all months"
   * - WP_Query expects month 1-12 to match specific months
   *
   * Example:
   * const dec = new Date('2025-12-01');
   * dec.getMonth()     // Returns 11 (zero-based)
   * dec.getMonth() + 1 // Returns 12 (one-based, correct for WP_Query)
   */
  const month = targetDate.getMonth() + 1;
  return {
    year,
    month
  };
}

/**
 * Convert BoxControl value to CSS string.
 *
 * BoxControl can return values in different formats (string or object with
 * individual sides). This function normalizes them to a CSS-compatible string.
 *
 * @since 0.1.0
 *
 * @param {Object|string|undefined} value - The BoxControl value.
 *
 * @return {string} CSS value string (e.g., "10px 20px 10px 20px").
 *
 * @example
 * // String input
 * boxControlToCSS('1rem') // Returns '1rem'
 *
 * @example
 * // Object input
 * boxControlToCSS({ top: '10px', right: '20px', bottom: '10px', left: '20px' })
 * // Returns '10px 20px 10px 20px'
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
 * Convert BorderControl value to CSS strings.
 *
 * BorderControl returns an object with width, style, color, and radius properties.
 * This function converts them to individual CSS property strings that can be
 * applied as inline styles.
 *
 * @since 0.1.0
 *
 * @param {Object|undefined} value - The BorderControl value object.
 *
 * @return {Object} Object containing CSS property strings:
 *   - {string} borderWidth - CSS border-width value
 *   - {string} borderStyle - CSS border-style value
 *   - {string} borderColor - CSS border-color value
 *   - {string} borderRadius - CSS border-radius value
 *
 * @example
 * borderControlToCSS({
 *   width: '2px',
 *   style: 'solid',
 *   color: '#000',
 *   radius: '4px'
 * })
 * // Returns:
 * // {
 * //   borderWidth: '2px',
 * //   borderStyle: 'solid',
 * //   borderColor: '#000',
 * //   borderRadius: '4px'
 * // }
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
 * Main editor component for the GatherPress Calendar block.
 * Handles:
 * - Rendering the calendar preview with posts
 * - Month selection and month modifier controls
 * - Template configuration interface
 * - Popover styling controls
 * - Query context validation
 *
 * Component Lifecycle:
 * 1. Receives attributes and context from WordPress
 * 2. Uses useSelect to fetch posts based on query context
 * 3. Generates calendar structure from posts
 * 4. Renders calendar preview and controls
 * 5. Updates attributes when user interacts with controls
 *
 * @since 0.1.0
 *
 * @param {Object}   props               - Component props.
 * @param {Object}   props.attributes    - Block attributes containing:
 *                                       - {string} selectedMonth - Selected month in format "YYYY-MM"
 *                                       - {number} monthModifier - Month offset from current month
 *                                       - {Object} templateConfigStyle - Popover styling configuration
 * @param {Function} props.setAttributes - Function to update block attributes.
 * @param {Object}   props.context       - Context from parent blocks, including:
 *                                       - {Object} query - Query Loop query configuration
 *                                       - {number} queryId - Query Loop ID for pagination
 *
 * @return {Element} React element rendered in the editor.
 */
function Edit({
  attributes,
  setAttributes,
  context
}) {
  const {
    selectedMonth,
    monthModifier = 0,
    templateConfigStyle = {}
  } = attributes;
  const {
    query
  } = context;
  const [showMonthPicker, setShowMonthPicker] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_6__.useState)(false);

  /**
   * Calculate date query based on selectedMonth and monthModifier.
   * This ensures the calendar only fetches posts for the displayed month.
   */
  const dateQuery = calculateDateQuery(selectedMonth, monthModifier);

  /**
   * Fetch posts based on query context with date filtering.
   *
   * The useSelect hook automatically re-runs when dependencies change,
   * ensuring the calendar updates when:
   * - User changes selected month
   * - User changes month modifier
   * - Parent Query Loop changes its configuration
   *
   * Why we clean the query:
   * - GatherPress adds 'gatherpress_event_query' parameter
   * - This parameter conflicts with our date_query
   * - We remove it and any other GatherPress-specific params
   * - REST API getEntityRecords doesn't understand these custom params
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

    // console.log( 'Original Query Context:', query );
    // console.log( 'Cleaned Query Context:', cleanQuery );

    // Build REST API query arguments
    const queryArgs = {
      per_page: cleanQuery.perPage || 100,
      order: cleanQuery.order || 'DESC',
      orderby: cleanQuery.orderBy || 'date',
      _embed: 'wp:term'
    };

    // Add date query filter based on the calculated month/year
    // This is what makes the calendar only show posts from the displayed month
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

    // console.log( 'Final Query Args:', queryArgs );

    return {
      posts: getEntityRecords('postType', cleanQuery.postType || 'post', queryArgs) || [],
      startOfWeek: weekStartsOn
    };
  },
  // CRITICAL: Dependencies array ensures query updates when these values change
  [query, dateQuery]);
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
    className: 'gatherpress-calendar-block'
  });
  const innerBlocksProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useInnerBlocksProps)({
    className: 'gatherpress-calendar-template'
  }, {
    template: TEMPLATE,
    templateLock: false
  });

  // Show placeholder if block is not inside a Query Loop
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

  // Build inline styles for template config preview
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

  /**
   * Generate dynamic help text for month offset control.
   *
   * Uses sprintf to properly format the text based on the current modifier value.
   * This provides clear, localized feedback about what the current offset means.
   */
  let monthOffsetHelp;
  if (monthModifier === 0) {
    monthOffsetHelp = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Showing current month', 'gatherpress-calendar');
  } else if (monthModifier < 0) {
    // For negative values, use absolute value in the message
    monthOffsetHelp = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.sprintf)(/* translators: %d: number of months ago */
    (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Showing %d month(s) ago', 'gatherpress-calendar'), Math.abs(monthModifier));
  } else {
    // For positive values
    monthOffsetHelp = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.sprintf)(/* translators: %d: number of months ahead */
    (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Showing %d month(s) ahead', 'gatherpress-calendar'), monthModifier);
  }
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
            help: monthOffsetHelp
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
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.BoxControl, {
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
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.BorderControl, {
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
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/compose */ "@wordpress/compose");
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_compose__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/hooks */ "@wordpress/hooks");
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_hooks__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./style.scss */ "./src/style.scss");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./edit */ "./src/edit.js");
/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./save */ "./src/save.js");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./block.json */ "./src/block.json");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__);
/**
 * GatherPress Calendar Block Registration
 *
 * Registers the GatherPress Calendar block with WordPress, defining its
 * edit and save functions along with associated metadata.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 *
 * @package
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

(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_10__.name, {
  /**
   * Edit function for the block
   *
   * @see ./edit.js
   */
  edit: _edit__WEBPACK_IMPORTED_MODULE_8__["default"],
  /**
   * Save function for the block
   *
   * Saves the InnerBlocks template structure to the database.
   *
   * @see ./save.js
   */
  save: _save__WEBPACK_IMPORTED_MODULE_9__["default"]
});

/**
 * Add calendar notice to Query Loop block inspector controls.
 *
 * This filter wraps the Query Loop block's BlockEdit component to inject
 * a notice when a GatherPress Calendar block is present as a direct child
 * AND the query is for gatherpress_event post type.
 *
 * The notice explains that the calendar will override GatherPress's
 * 'gatherpress_event_query' setting and use date-based filtering instead.
 *
 * Technical approach:
 * - Uses editor.BlockEdit filter to wrap the Query block component
 * - Checks if selected block is core/query
 * - Checks if query is for gatherpress_event post type
 * - Checks if any direct child is gatherpress/calendar
 * - Injects notice into InspectorControls
 *
 * @since 0.1.0
 */
const withCalendarNotice = (0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_1__.createHigherOrderComponent)(BlockEdit => {
  return props => {
    // Only apply to Query Loop blocks
    if (props.name !== 'core/query') {
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(BlockEdit, {
        ...props
      });
    }

    /**
     * Check if this Query block:
     * 1. Has a calendar child
     * 2. Is querying gatherpress_event post type
     *
     * Queries the block editor store to check if any direct child
     * of this block is a GatherPress Calendar block, and if the
     * query is specifically for GatherPress events.
     */
    const {
      hasCalendarChild,
      isGatherPressQuery
    } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_5__.useSelect)(select => {
      const {
        getBlock
      } = select(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.store);
      const block = getBlock(props.clientId);
      if (!block || !block.innerBlocks || block.innerBlocks.length === 0) {
        return {
          hasCalendarChild: false,
          isGatherPressQuery: false
        };
      }
      const hasCalendar = block.innerBlocks.some(innerBlock => innerBlock.name === 'gatherpress/calendar');

      // Check if the query is for gatherpress_event post type
      const postType = block.attributes?.query?.postType || 'post';
      const isGatherPress = postType === 'gatherpress_event';
      return {
        hasCalendarChild: hasCalendar,
        isGatherPressQuery: isGatherPress
      };
    }, [props.clientId]);

    // Only show notice if both conditions are met:
    // 1. Calendar block is present
    // 2. Query is for gatherpress_event post type
    const shouldShowNotice = hasCalendarChild && isGatherPressQuery;
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.Fragment, {
      children: [shouldShowNotice && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_6__.InspectorControls, {
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Notice, {
          status: "info",
          isDismissible: false,
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("p", {
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('The GatherPress Calendar block is active in this Query Loop. The calendar will use date-based filtering for the selected month, overriding the "Upcoming or past events" setting.', 'gatherpress-calendar')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("p", {
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('This ensures the calendar only displays events from the specific month, regardless of whether they are past or upcoming events.', 'gatherpress-calendar')
          })]
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(BlockEdit, {
        ...props
      })]
    });
  };
}, 'withCalendarNotice');

/**
 * Register the filter to add calendar notices to Query blocks.
 *
 * This filter runs on every Query block render in the editor,
 * checking for calendar children and the post type before injecting notices.
 *
 * Priority 20 ensures it runs after other Query block modifications.
 *
 * @since 0.1.0
 */
(0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_2__.addFilter)('editor.BlockEdit', 'gatherpress-calendar/with-calendar-notice', withCalendarNotice, 20);

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
 * @package
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

/***/ "@wordpress/compose"
/*!*********************************!*\
  !*** external ["wp","compose"] ***!
  \*********************************/
(module) {

module.exports = window["wp"]["compose"];

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

/***/ "@wordpress/hooks"
/*!*******************************!*\
  !*** external ["wp","hooks"] ***!
  \*******************************/
(module) {

module.exports = window["wp"]["hooks"];

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
/******/ 		var chunkLoadingGlobal = globalThis["webpackChunkgatherpress_calendar"] = globalThis["webpackChunkgatherpress_calendar"] || [];
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