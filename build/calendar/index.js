/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/calendar/edit.js"
/*!******************************!*\
  !*** ./src/calendar/edit.js ***!
  \******************************/
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
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./editor.scss */ "./src/calendar/editor.scss");
/* harmony import */ var _edit_constants__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./edit/constants */ "./src/calendar/edit/constants.js");
/* harmony import */ var _edit_utils_date_utils__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./edit/utils/date-utils */ "./src/calendar/edit/utils/date-utils.js");
/* harmony import */ var _edit_utils_calendar_utils__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./edit/utils/calendar-utils */ "./src/calendar/edit/utils/calendar-utils.js");
/* harmony import */ var _utils_use_stable_value__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../utils/use-stable-value */ "./src/utils/use-stable-value.js");
/* harmony import */ var _edit_hooks_useCalendarData__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./edit/hooks/useCalendarData */ "./src/calendar/edit/hooks/useCalendarData.js");
/* harmony import */ var _edit_components_CalendarTable__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./edit/components/CalendarTable */ "./src/calendar/edit/components/CalendarTable.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__);
/**
 * GatherPress Calendar Block Editor Component
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @package
 * @since 0.1.0
 */







/**
 * Editor-specific styles
 *
 * Styles defined here are only applied within the block editor context.
 * They help distinguish the editor view from the frontend display.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */







// import { MonthPicker } from './edit/components/MonthPicker';
// import { MonthControls } from './edit/components/MonthControls';


/**
 * Edit Component
 *
 * Main editor component for the GatherPress Calendar block.
 *
 * @since 0.1.0
 *
 * @param {Object}   props               - Component props.
 * @param {Object}   props.attributes    - Block attributes.
 * @param {Function} props.setAttributes - Function to update block attributes.
 * @param {Object}   props.context       - Context from parent blocks.
 * @param {string}   props.clientId      - This block's client ID.
 *
 * @return {Element} React element rendered in the editor.
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
    showWeekdays = true,
    showWeekends = true
  } = attributes;
  const {
    query
  } = context;
  // const [ showMonthPicker, setShowMonthPicker ] = useState( false );
  const [activeDate, setActiveDate] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useState)('');

  // Calculate date query based on selectedMonth and monthModifier.
  const dateQuery = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useMemo)(() => (0,_edit_utils_date_utils__WEBPACK_IMPORTED_MODULE_7__.calculateDateQuery)(selectedMonth, monthModifier), [selectedMonth, monthModifier]);

  // Fetch posts and site settings.
  const {
    posts,
    startOfWeek
  } = (0,_edit_hooks_useCalendarData__WEBPACK_IMPORTED_MODULE_10__.useCalendarData)(query, dateQuery);

  // Generate calendar structure.
  const calendar = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useMemo)(() => (0,_edit_utils_calendar_utils__WEBPACK_IMPORTED_MODULE_8__.generateCalendar)(posts, startOfWeek, selectedMonth, monthModifier, showWeekends), [posts, startOfWeek, selectedMonth, monthModifier, showWeekends]);

  // Resolve which day is currently "live"/editable: keep the previously
  // active date if it still exists in this month, otherwise fall back to
  // today (or the 1st) so the preview always has a live cell to show.
  const resolvedActiveDate = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useMemo)(() => {
    const days = calendar.weeks.flat();
    if (days.some(day => day.date === activeDate)) {
      return activeDate;
    }
    return (0,_edit_utils_calendar_utils__WEBPACK_IMPORTED_MODULE_8__.getDefaultActiveDate)(calendar);
  }, [calendar, activeDate]);

  // Locate the real week/day template blocks so previews can clone their
  // actual inner content (Day Number, Post Title, Event Date, etc.) and
  // mirror their own color/border styling (e.g. a custom background).
  const {
    dayInnerBlocks,
    dayBlockAttributes,
    weekBlockAttributes
  } = (0,_utils_use_stable_value__WEBPACK_IMPORTED_MODULE_9__.useStableValue)((0,_wordpress_data__WEBPACK_IMPORTED_MODULE_4__.useSelect)(select => {
    const {
      getBlocks
    } = select(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.store);
    const weekBlock = getBlocks(clientId)[0];
    const dayBlock = weekBlock ? getBlocks(weekBlock.clientId)[0] : null;
    return {
      dayInnerBlocks: dayBlock ? getBlocks(dayBlock.clientId) : [],
      dayBlockAttributes: dayBlock?.attributes ?? {},
      weekBlockAttributes: weekBlock?.attributes ?? {}
    };
  }, [clientId]));
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)();

  // The real, live-editable week+day+content InnerBlocks tree. Rendered
  // inside <tbody> at whichever week row contains resolvedActiveDate;
  // every other week is a read-only preview (see CalendarTable).
  const {
    children: liveWeekChildren,
    ...tbodyProps
  } = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useInnerBlocksProps)({
    className: 'gatherpress-calendar__weeks'
  }, {
    allowedBlocks: ['gatherpress/calendar-week'],
    template: _edit_constants__WEBPACK_IMPORTED_MODULE_6__.CALENDAR_TEMPLATE,
    templateLock: false,
    // TODO: Consider 'contentOnly', which is nice here.
    renderAppender: false
  });
  const workdayCount = 7 - (0,_edit_utils_calendar_utils__WEBPACK_IMPORTED_MODULE_8__.getWeekendDays)().length;
  const tableStyle = {
    gap: (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.__experimentalGetGapCSSValue)(attributes.style?.spacing?.blockGap),
    '--gatherpress-calendar-columns': showWeekends ? 7 : workdayCount
  };

  // Stable reference: every week's BlockContextProvider value is built on
  // top of this, and an unstable base object here would force a fresh
  // context (and a cascading re-render of every preview cell) on every
  // render, even ones unrelated to the calendar's own data (e.g. simply
  // selecting a block).
  const weekContext = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useMemo)(() => ({
    'gatherpress/year': dateQuery.year,
    'gatherpress/month': dateQuery.month
  }), [dateQuery]);

  // Show placeholder if block is not inside a Query Loop.
  if (!query) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("div", {
      ...blockProps,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Placeholder, {
        icon: "calendar-alt",
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('GatherPress Calendar', 'gatherpress-calendar'),
        instructions: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('This block must be used inside a Query Loop block.', 'gatherpress-calendar')
      })
    });
  }

  // // Handlers
  // const handleMonthSelect = ( value ) => {
  // 	setAttributes( { selectedMonth: value } );
  // 	setShowMonthPicker( false );
  // };

  // const handleMonthChange = ( value ) => {
  // 	setAttributes( { selectedMonth: value } );
  // };

  // const handleModifierChange = ( value ) => {
  // 	const numValue = value === '' ? 0 : parseInt( value, 10 );
  // 	setAttributes( {
  // 		monthModifier: isNaN( numValue ) ? 0 : numValue,
  // 	} );
  // };

  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Calendar Settings', 'gatherpress-calendar'),
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("hr", {
          style: {
            margin: '16px 0',
            borderTop: '1px solid #ddd'
          }
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Weekdays', 'gatherpress-calendar'),
          checked: showWeekdays,
          onChange: value => setAttributes({
            showWeekdays: value
          }),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Display the days of the week inside the calendars header.', 'gatherpress-calendar')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Weekends', 'gatherpress-calendar'),
          checked: showWeekends,
          onChange: value => setAttributes({
            showWeekends: value
          }),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Display weekend days in the calendar grid.', 'gatherpress-calendar')
        })]
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("div", {
      ...blockProps,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)(_edit_components_CalendarTable__WEBPACK_IMPORTED_MODULE_11__.CalendarTable, {
        calendar: calendar,
        showWeekdays: showWeekdays,
        style: tableStyle,
        activeDate: resolvedActiveDate,
        setActiveDate: setActiveDate,
        weekContext: weekContext,
        liveWeekChildren: liveWeekChildren,
        dayInnerBlocks: dayInnerBlocks,
        weekBlockAttributes: weekBlockAttributes,
        dayBlockAttributes: dayBlockAttributes,
        tbodyProps: tbodyProps
      })
    })]
  });
}

/***/ },

/***/ "./src/calendar/edit/components/CalendarTable.js"
/*!*******************************************************!*\
  !*** ./src/calendar/edit/components/CalendarTable.js ***!
  \*******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CalendarTable: () => (/* binding */ CalendarTable)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _WeekPreviewRow__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./WeekPreviewRow */ "./src/calendar/edit/components/WeekPreviewRow.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);




/**
 * CalendarTable Component
 *
 * Renders the calendar grid as virtual instances of the real
 * gatherpress/calendar-week (and, within it, gatherpress/calendar-day)
 * blocks: one week is rendered live/editable, matching the week that
 * contains the current `activeDate`; every other week is a read-only
 * preview built from the same underlying template blocks. This mirrors
 * what Calendar_Structure_Builder + Calendar_Week::render() do server-side.
 *
 * @since 0.1.0
 *
 * @param {Object}   props                     - Component props.
 * @param {Object}   props.calendar            - Calendar data structure.
 * @param {boolean}  props.showWeekdays        - Whether to show the days-of-week header row.
 * @param {Object}   props.style               - Inline style for the <table> (e.g. gap).
 * @param {string}   props.activeDate          - The currently live/editable day's date.
 * @param {Function} props.setActiveDate       - Setter to change the active day.
 * @param {Object}   props.weekContext         - Base context shared by every week (year, month).
 * @param {Element}  props.liveWeekChildren    - The real, live-rendered week InnerBlocks content.
 * @param {Array}    props.dayInnerBlocks      - The real day template's inner blocks, for previews.
 * @param {Object}   props.weekBlockAttributes - The real calendar-week block's own attributes, for style parity.
 * @param {Object}   props.dayBlockAttributes  - The real calendar-day block's own attributes, for style parity.
 * @param {Object}   props.tbodyProps          - Props (ref/className) tying <tbody> to the live week's InnerBlocks.
 *
 * @return {Element} Calendar table component.
 */

function CalendarTable({
  calendar,
  showWeekdays,
  style,
  activeDate,
  setActiveDate,
  weekContext,
  liveWeekChildren,
  dayInnerBlocks,
  weekBlockAttributes,
  dayBlockAttributes,
  tbodyProps
}) {
  // Memoized so each week's context object keeps its reference across
  // renders that don't actually change the calendar/active day - an
  // unstable BlockContextProvider value would otherwise re-render every
  // descendant (live and previewed) on every unrelated render.
  const weekContexts = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => calendar.weeks.map((week, weekIndex) => ({
    ...weekContext,
    'gatherpress/weekIndex': weekIndex,
    'gatherpress/weekDays': week,
    'gatherpress/activeDate': activeDate,
    'gatherpress/setActiveDate': setActiveDate
  })), [calendar, weekContext, activeDate, setActiveDate]);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("table", {
    className: "gatherpress-calendar__table",
    style: style,
    children: [showWeekdays && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("thead", {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("tr", {
        children: calendar.dayNames.map((dayName, index) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("th", {
          children: dayName
        }, index))
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("tbody", {
      ...tbodyProps,
      children: calendar.weeks.map((week, weekIndex) => {
        const isActiveWeek = week.some(day => day.date === activeDate);
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.BlockContextProvider, {
          value: weekContexts[weekIndex],
          children: isActiveWeek ? liveWeekChildren : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_WeekPreviewRow__WEBPACK_IMPORTED_MODULE_2__.WeekPreviewRow, {
            week: week,
            dayInnerBlocks: dayInnerBlocks,
            weekBlockAttributes: weekBlockAttributes,
            dayBlockAttributes: dayBlockAttributes,
            onActivateDay: setActiveDate
          })
        }, weekIndex);
      })
    })]
  });
}

/***/ },

/***/ "./src/calendar/edit/components/DayPreviewCell.js"
/*!********************************************************!*\
  !*** ./src/calendar/edit/components/DayPreviewCell.js ***!
  \********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DayPreviewCell: () => (/* binding */ DayPreviewCell)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utils_day_number__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../utils/day-number */ "./src/utils/day-number.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);




/**
 * Clones inner blocks, resolving the Day Number bound block's content to
 * this specific day's number directly, instead of relying on the binding
 * being (re-)evaluated inside the preview's own isolated editor context.
 * Keeps the block's own typography/color so it still looks identical to
 * the live version - just guarantees the correct value shows every time.
 *
 * @param {Array}  blocks - Real inner blocks to preview.
 * @param {Object} day    - Day data (day, isEmpty).
 *
 * @return {Array} Inner blocks with the Day Number block's value resolved.
 */

function withResolvedDayNumber(blocks, day) {
  return (blocks ?? []).map(block => {
    if (!(0,_utils_day_number__WEBPACK_IMPORTED_MODULE_2__.isDayNumberBindingBlock)(block)) {
      return block;
    }
    return {
      ...block,
      attributes: {
        ...block.attributes,
        content: day.isEmpty ? '' : String(day.day ?? ''),
        metadata: {
          ...block.attributes?.metadata,
          bindings: undefined
        }
      }
    };
  });
}

/**
 * DayPreviewCell Component
 *
 * Renders a single, non-editable calendar day cell as a virtual instance:
 * a real `<td>` (matching gatherpress/calendar-day's own markup, including
 * its own color/border block-support styling) wrapping a read-only editor
 * preview of that day's real inner blocks (e.g. Day Number, Post Title,
 * Event Date), rendered under the day's own context (date, day number,
 * posts, isToday, isEmpty).
 *
 * We deliberately preview only the day's *inner* blocks rather than the
 * gatherpress/calendar-day block itself, because previewing a block that
 * renders its own <td> would nest an extra wrapper element inside this
 * <td>, producing invalid table markup.
 *
 * Clicking the cell activates it, making it the live/editable day.
 *
 * @since 0.4.0
 *
 * @param {Object}   props                    - Component props.
 * @param {Object}   props.day                - Day data (day, date, posts, isEmpty, isToday).
 * @param {Array}    props.innerBlocks        - The real calendar-day block's inner blocks to preview.
 * @param {Object}   props.dayBlockAttributes - The real calendar-day block's own attributes, for style parity.
 * @param {Function} props.onActivateDay      - Called with this day's date when the cell is clicked.
 *
 * @return {Element} Day cell preview element.
 */
function DayPreviewCellComponent({
  day,
  innerBlocks,
  dayBlockAttributes,
  onActivateDay
}) {
  const onActivate = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => onActivateDay(day.date), [onActivateDay, day.date]);
  const dayContext = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => ({
    'gatherpress/dayDate': day.date ?? '',
    'gatherpress/dayNumber': day.day ?? 0,
    'gatherpress/dayPosts': day.posts ?? [],
    'gatherpress/isEmpty': !!day.isEmpty,
    'gatherpress/isToday': !!day.isToday
  }), [day]);
  const hasDayNumberBlock = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => (innerBlocks ?? []).some(_utils_day_number__WEBPACK_IMPORTED_MODULE_2__.isDayNumberBindingBlock), [innerBlocks]);
  const resolvedBlocks = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => withResolvedDayNumber(innerBlocks, day), [innerBlocks, day]);

  // Mirror the real calendar-day block's own color/border/spacing/shadow
  // styling (e.g. a custom background, padding, or drop-shadow) so every
  // previewed day looks like the live one.
  const colorProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.__experimentalUseColorProps)(dayBlockAttributes ?? {});
  const borderProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.__experimentalUseBorderProps)(dayBlockAttributes ?? {});
  const spacingProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.__experimentalGetSpacingClassesAndStyles)(dayBlockAttributes ?? {});
  const shadowProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.__experimentalGetShadowClassesAndStyles)(dayBlockAttributes ?? {});
  const layoutProps = (0,_utils_day_number__WEBPACK_IMPORTED_MODULE_2__.getLayoutProps)(dayBlockAttributes?.layout);
  // console.group("getLayoutProps");
  // console.log(dayBlockAttributes);
  // console.log(colorProps.className);
  // console.log(layoutProps.className);
  // console.log(layoutProps.style);
  // console.groupEnd();
  const classNames = ['gatherpress-calendar__day', day.isEmpty ? 'is-empty' : '', day.isToday ? 'is-today' : '', day.posts?.length > 0 ? 'has-posts' : '', day.isWeekend ? 'is-weekend' : '', day.weekday ? `is-${day.weekday}` : '', colorProps.className, borderProps.className
  // layoutProps.className,
  ].filter(Boolean).join(' ');
  const style = {
    ...colorProps.style,
    ...borderProps.style,
    ...spacingProps.style,
    ...shadowProps.style
    // ...layoutProps.style,
  };
  const blockPreviewProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.__experimentalUseBlockPreview)({
    blocks: resolvedBlocks,
    props: {
      className: layoutProps.className ? layoutProps.className : undefined,
      style: {
        ...layoutProps.style,
        gap: (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.__experimentalGetGapCSSValue)(dayBlockAttributes?.style?.spacing?.blockGap)
      }
    }
  });
  if (day.isEmpty) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("td", {
      className: classNames,
      style: style
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.BlockContextProvider, {
    value: dayContext,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("td", {
      className: classNames,
      style: style,
      role: "button",
      tabIndex: 0,
      onClick: onActivate,
      onKeyPress: onActivate,
      children: [!hasDayNumberBlock && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        className: "gatherpress-calendar__day-number",
        children: day.day
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        ...blockPreviewProps
      })]
    })
  });
}

// Memoized: each instance mounts a real, isolated block-editor preview
// (useBlockPreview). Without memoization, every unrelated re-render
// higher up (e.g. selecting any block) would re-render every one of
// these across the whole grid, which is visibly expensive.
const DayPreviewCell = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.memo)(DayPreviewCellComponent);

/***/ },

/***/ "./src/calendar/edit/components/MonthControls.js"
/*!*******************************************************!*\
  !*** ./src/calendar/edit/components/MonthControls.js ***!
  \*******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MonthControls: () => (/* binding */ MonthControls)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _utils_calendar_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/calendar-utils */ "./src/calendar/edit/utils/calendar-utils.js");
/* harmony import */ var _hooks_useMonthOffsetHelp__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../hooks/useMonthOffsetHelp */ "./src/calendar/edit/hooks/useMonthOffsetHelp.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);

/* eslint-disable @wordpress/no-unsafe-wp-apis */





/**
 * MonthControls Component
 *
 * Renders the month selection and offset controls.
 *
 * @since 0.1.0
 *
 * @param {Object}   props                  - Component props.
 * @param {string}   props.selectedMonth    - Currently selected month.
 * @param {number}   props.monthModifier    - Month offset value.
 * @param {Function} props.onMonthChange    - Callback when month changes.
 * @param {Function} props.onModifierChange - Callback when modifier changes.
 * @param {Function} props.onOpenPicker     - Callback to open picker.
 *
 * @return {Element} Month controls component.
 */

function MonthControls({
  selectedMonth,
  monthModifier,
  onMonthChange,
  onModifierChange,
  onOpenPicker
}) {
  const monthOptions = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => (0,_utils_calendar_utils__WEBPACK_IMPORTED_MODULE_3__.generateMonthOptions)(), []);
  const monthOffsetHelp = (0,_hooks_useMonthOffsetHelp__WEBPACK_IMPORTED_MODULE_4__.useMonthOffsetHelp)(monthModifier);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
      style: {
        marginBottom: '12px',
        padding: '8px',
        background: '#f0f0f1',
        borderRadius: '4px'
      },
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("strong", {
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Current Selection:', 'gatherpress-calendar')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("br", {}), selectedMonth ? monthOptions.find(o => o.value === selectedMonth)?.label : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Current Month', 'gatherpress-calendar'), !selectedMonth && monthModifier !== 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.Fragment, {
        children: [' ', monthModifier > 0 ? `+${monthModifier}` : monthModifier, ' ', monthModifier === 1 ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('month', 'gatherpress-calendar') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('months', 'gatherpress-calendar')]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
      isPrimary: true,
      onClick: onOpenPicker,
      style: {
        width: '100%',
        marginBottom: '8px'
      },
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Change Month', 'gatherpress-calendar')
    }), selectedMonth && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
      isSecondary: true,
      onClick: () => onMonthChange(''),
      style: {
        width: '100%'
      },
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Reset to Current Month', 'gatherpress-calendar')
    }), !selectedMonth && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.Fragment, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("hr", {
        style: {
          margin: '16px 0',
          borderTop: '1px solid #ddd'
        }
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
        style: {
          marginTop: '16px',
          marginBottom: '8px',
          fontWeight: '500'
        },
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Month Offset', 'gatherpress-calendar')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
        style: {
          fontSize: '12px',
          color: '#757575',
          marginBottom: '12px'
        },
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Display a month relative to the current month. For example, -1 shows last month, +1 shows next month. The calendar will automatically update as time passes.', 'gatherpress-calendar')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalNumberControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Months from current', 'gatherpress-calendar'),
        value: monthModifier,
        onChange: onModifierChange,
        min: -12,
        max: 12,
        step: 1,
        help: monthOffsetHelp
      }), monthModifier !== 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
        isSecondary: true,
        onClick: () => onModifierChange(0),
        style: {
          width: '100%',
          marginTop: '8px'
        },
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Reset Month Offset', 'gatherpress-calendar')
      })]
    })]
  });
}

/***/ },

/***/ "./src/calendar/edit/components/MonthPicker.js"
/*!*****************************************************!*\
  !*** ./src/calendar/edit/components/MonthPicker.js ***!
  \*****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MonthPicker: () => (/* binding */ MonthPicker)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _utils_calendar_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/calendar-utils */ "./src/calendar/edit/utils/calendar-utils.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);





/**
 * MonthPicker Component
 *
 * Renders a scrollable list of months for selection.
 *
 * @since 0.1.0
 *
 * @param {Object}   props               - Component props.
 * @param {string}   props.selectedMonth - Currently selected month.
 * @param {Function} props.onSelect      - Callback when month is selected.
 * @param {Function} props.onCancel      - Callback when cancelled.
 *
 * @return {Element} Month picker component.
 */

function MonthPicker({
  selectedMonth,
  onSelect,
  onCancel
}) {
  const monthOptions = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => (0,_utils_calendar_utils__WEBPACK_IMPORTED_MODULE_3__.generateMonthOptions)(), []);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
      style: {
        marginBottom: '12px',
        maxHeight: '200px',
        overflowY: 'auto',
        border: '1px solid #ddd',
        borderRadius: '4px'
      },
      children: monthOptions.map(option => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
        isPressed: selectedMonth === option.value,
        onClick: () => onSelect(option.value),
        style: {
          width: '100%',
          justifyContent: 'flex-start',
          padding: '8px 12px'
        },
        children: option.label
      }, option.value))
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
      isSecondary: true,
      onClick: onCancel,
      style: {
        width: '100%'
      },
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Cancel', 'gatherpress-calendar')
    })]
  });
}

/***/ },

/***/ "./src/calendar/edit/components/WeekPreviewRow.js"
/*!********************************************************!*\
  !*** ./src/calendar/edit/components/WeekPreviewRow.js ***!
  \********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   WeekPreviewRow: () => (/* binding */ WeekPreviewRow)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _DayPreviewCell__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./DayPreviewCell */ "./src/calendar/edit/components/DayPreviewCell.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);




/**
 * WeekPreviewRow Component
 *
 * Renders a whole non-active week as a read-only virtual instance: a real
 * `<tr>` (mirroring the real calendar-week block's own color styling) of
 * DayPreviewCell previews, one per day, all built from the same real day
 * template inner blocks. Clicking any day activates it, making that week
 * (and that day) the live/editable one.
 *
 * @since 0.4.0
 *
 * @param {Object}   props                     - Component props.
 * @param {Array}    props.week                - This week's day data entries.
 * @param {Array}    props.dayInnerBlocks      - The real day template's inner blocks, for previews.
 * @param {Object}   props.weekBlockAttributes - The real calendar-week block's own attributes, for style parity.
 * @param {Object}   props.dayBlockAttributes  - The real calendar-day block's own attributes, for style parity.
 * @param {Function} props.onActivateDay       - Called with a day's date when that day is clicked.
 *
 * @return {Element} Week row preview element.
 */

function WeekPreviewRowComponent({
  week,
  dayInnerBlocks,
  weekBlockAttributes,
  dayBlockAttributes,
  onActivateDay
}) {
  // Mirror the real calendar-week block's own color/spacing/shadow
  // styling so every previewed week row looks like the live one.
  const colorProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.__experimentalUseColorProps)(weekBlockAttributes ?? {});
  const classNames = ['gatherpress-calendar__week', colorProps.className].filter(Boolean).join(' ');
  const style = {
    ...colorProps.style
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("tr", {
    className: classNames,
    style: style,
    children: week.map((day, dayIndex) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_DayPreviewCell__WEBPACK_IMPORTED_MODULE_2__.DayPreviewCell, {
      day: day,
      innerBlocks: dayInnerBlocks,
      dayBlockAttributes: dayBlockAttributes,
      onActivateDay: onActivateDay
    }, day.date ?? `empty-${dayIndex}`))
  });
}

// Memoized: this (and each DayPreviewCell inside it) mounts a real,
// isolated block-editor preview instance. Without memoization, every
// unrelated re-render higher up (e.g. selecting any block) would
// re-render every non-active week/day preview in the whole grid.
const WeekPreviewRow = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.memo)(WeekPreviewRowComponent);

/***/ },

/***/ "./src/calendar/edit/constants.js"
/*!****************************************!*\
  !*** ./src/calendar/edit/constants.js ***!
  \****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CALENDAR_TEMPLATE: () => (/* binding */ CALENDAR_TEMPLATE),
/* harmony export */   DATE_FORMAT: () => (/* binding */ DATE_FORMAT),
/* harmony export */   DAY_TEMPLATE: () => (/* binding */ DAY_TEMPLATE),
/* harmony export */   ENTRIES_TEMPLATE: () => (/* binding */ ENTRIES_TEMPLATE),
/* harmony export */   QUERY_VARIATION_INNER_BLOCKS: () => (/* binding */ QUERY_VARIATION_INNER_BLOCKS)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);


/**
 * Default template for inner blocks.
 *
 * Defines the initial blocks that appear when the calendar is first added.
 * Users can modify this template by adding, removing, or reordering blocks.
 *
 * @type {Array<Array>}
 * @since 0.1.0
 */

/**
 * The inner template inside gatherpress/calendar-entries:
 * Modal Manager holding the trigger link and the popover modal content.
 */
const ENTRIES_TEMPLATE = [['gatherpress/modal-manager', {}, [['gatherpress/event-date', {
  displayType: 'start',
  isLink: true,
  startDateFormat: 'G:i',
  className: 'gatherpress-modal--trigger-open',
  style: {
    spacing: {
      padding: {
        top: '0',
        bottom: '0',
        left: '0',
        right: '0'
      },
      margin: {
        top: '0',
        bottom: '0',
        left: '0',
        right: '0'
      }
    }
  },
  fontSize: 'small'
}], ['gatherpress/modal', {}, [['gatherpress/modal-content', {
  style: {
    dimensions: {
      maxWidth: '400px'
    },
    spacing: {
      padding: {
        top: 'var:preset|spacing|30',
        bottom: 'var:preset|spacing|30',
        left: 'var:preset|spacing|30',
        right: 'var:preset|spacing|30'
      }
    }
  },
  backgroundColor: 'base'
}, [['core/group', {
  layout: {
    type: 'flex',
    flexWrap: 'nowrap'
  }
}, [['gatherpress/event-date', {
  style: {
    spacing: {
      padding: {
        top: '0',
        bottom: '0',
        left: '0',
        right: '0'
      },
      margin: {
        top: '0',
        bottom: '0',
        left: '0',
        right: '0'
      }
    }
  },
  fontSize: 'small'
}], ['core/post-title', {
  level: 3,
  isLink: true,
  style: {
    spacing: {
      padding: {
        top: '0',
        bottom: '0',
        left: '0',
        right: '0'
      },
      margin: {
        top: '0',
        bottom: '0',
        left: '0',
        right: '0'
      }
    }
  },
  fontSize: 'small'
}]]], ['core/post-excerpt', {}], ['core/buttons', {
  align: 'center',
  layout: {
    type: 'flex',
    justifyContent: 'center'
  }
}, [['core/button', {
  tagName: 'button',
  className: 'gatherpress-modal--trigger-close',
  text: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Close', 'gatherpress-calendar')
}]]]]]]]]]];

/**
 * The inner template inside gatherpress/calendar-day:
 * Bound Day Number paragraph + Calendar Entries block.
 */
const DAY_TEMPLATE = [['gatherpress/calendar-day', {}, [['core/paragraph', {
  metadata: {
    bindings: {
      content: {
        source: 'gatherpress/calendar-day'
      }
    },
    name: 'Day Number'
  },
  style: {
    spacing: {
      margin: {
        top: '0',
        bottom: '0',
        left: '0',
        right: '0'
      }
    }
  },
  fontSize: 'small',
  placeholder: 'DD',
  content: 'DD',
  className: 'gatherpress-calendar__day-number'
}], ['gatherpress/calendar-entries', {
  layout: {
    type: 'default'
  },
  className: 'is-style-default',
  style: {
    spacing: {
      blockGap: '0',
      padding: {
        top: '0',
        bottom: '0',
        left: '0',
        right: '0'
      },
      margin: {
        top: '0',
        bottom: '0',
        left: '0',
        right: '0'
      }
    },
    layout: {
      selfStretch: 'fill',
      flexSize: null
    }
  }
}, ENTRIES_TEMPLATE]]]];

/**
 * The inner template inside gatherpress/calendar:
 * Week container holding the day template.
 */
const CALENDAR_TEMPLATE = [['gatherpress/calendar-week', {}, DAY_TEMPLATE]];

/**
 * The complete InnerBlocks tree for the core/query block variation:
 * Bound Month Heading + Pagination (Previous/Next Month) + Calendar Block.
 */
const QUERY_VARIATION_INNER_BLOCKS = [['core/heading', {
  level: 2,
  metadata: {
    bindings: {
      content: {
        source: 'gatherpress/calendar-month-heading'
      }
    },
    name: 'Month Heading'
  },
  typography: {
    textAlign: 'center'
  },
  className: 'gatherpress-calendar__month has-text-align-center'
}], ['core/query-pagination', {
  paginationArrow: 'chevron',
  layout: {
    type: 'flex',
    justifyContent: 'space-between'
  }
}, [['core/query-pagination-previous', {
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Previous Month', 'gatherpress-calendar')
}], ['core/query-pagination-next', {
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Next Month', 'gatherpress-calendar')
}]]], ['gatherpress/calendar', {
  style: {
    spacing: {
      padding: {
        top: '0',
        bottom: '0',
        left: '0',
        right: '0'
      }
    }
  }
}, CALENDAR_TEMPLATE]];

/**
 * The date format used throughout the component.
 *
 * @type {string}
 * @since 0.1.0
 */
const DATE_FORMAT = 'Y-m-d';

/***/ },

/***/ "./src/calendar/edit/hooks/useCalendarData.js"
/*!****************************************************!*\
  !*** ./src/calendar/edit/hooks/useCalendarData.js ***!
  \****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useCalendarData: () => (/* binding */ useCalendarData)
/* harmony export */ });
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/core-data */ "@wordpress/core-data");
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_1__);


const EMPTY_ARRAY = [];
/**
 * Hook to fetch posts and site settings for calendar rendering.
 *
 * @since 0.1.0
 *
 * @param {Object|null} query     - Query Loop query configuration.
 * @param {Object}      dateQuery - Date query parameters.
 *
 * @return {Object} Object containing:
 *   - {Array} posts - Array of post objects
 *   - {number} startOfWeek - Start of week setting
 */
function useCalendarData(query, dateQuery) {
  return (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.useSelect)(select => {
    if (!query) {
      return {
        posts: [],
        startOfWeek: 0
      };
    }
    const {
      getEntityRecords
    } = select(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_1__.store);
    const {
      getSite
    } = select(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_1__.store);

    // Create a clean query object.
    const cleanQuery = {
      ...query
    };

    // Build REST API query arguments.
    const queryArgs = {
      per_page: 100,
      _embed: 'wp:term'
    };

    // Add calendar identifier and date query filter.
    if (dateQuery && dateQuery.year && dateQuery.month) {
      queryArgs.gatherpress_calendar_query = true;
      queryArgs.year = dateQuery.year;
      queryArgs.month = dateQuery.month;
    }

    // Add taxonomy query if present.
    if (cleanQuery.taxQuery) {
      Object.keys(cleanQuery.taxQuery).forEach(taxonomy => {
        queryArgs[taxonomy] = cleanQuery.taxQuery[taxonomy];
      });
    }

    // Add author query if present.
    if (cleanQuery.author) {
      queryArgs.author = cleanQuery.author;
    }

    // Add search query if present.
    if (cleanQuery.search) {
      queryArgs.search = cleanQuery.search;
    }
    if (cleanQuery.orderBy) {
      queryArgs.orderBy = cleanQuery.orderBy;
    }
    if (cleanQuery.order) {
      queryArgs.order = cleanQuery.order;
    }

    // Get site settings for start_of_week.
    const site = getSite();
    const weekStartsOn = site?.start_of_week || 0;
    const records = getEntityRecords('postType', query?.postType || 'gatherpress_event', queryArgs);
    return {
      posts: records ?? EMPTY_ARRAY,
      startOfWeek: weekStartsOn
    };
  }, [query, dateQuery]);
}

/***/ },

/***/ "./src/calendar/edit/hooks/useMonthOffsetHelp.js"
/*!*******************************************************!*\
  !*** ./src/calendar/edit/hooks/useMonthOffsetHelp.js ***!
  \*******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useMonthOffsetHelp: () => (/* binding */ useMonthOffsetHelp)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);



/**
 * Hook to calculate month offset help text.
 *
 * @since 0.1.0
 *
 * @param {number} monthModifier - The month offset value.
 *
 * @return {string} Localized help text.
 */
function useMonthOffsetHelp(monthModifier) {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useMemo)(() => {
    if (monthModifier === 0) {
      return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Showing current month', 'gatherpress-calendar');
    }
    if (monthModifier < 0) {
      return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.sprintf)(/* translators: %d: number of months ago */
      (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Showing %d month(s) ago', 'gatherpress-calendar'), Math.abs(monthModifier));
    }
    return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.sprintf)(/* translators: %d: number of months ahead */
    (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Showing %d month(s) ahead', 'gatherpress-calendar'), monthModifier);
  }, [monthModifier]);
}

/***/ },

/***/ "./src/calendar/edit/utils/calendar-utils.js"
/*!***************************************************!*\
  !*** ./src/calendar/edit/utils/calendar-utils.js ***!
  \***************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   WEEKDAY_SLUGS: () => (/* binding */ WEEKDAY_SLUGS),
/* harmony export */   buildWeeks: () => (/* binding */ buildWeeks),
/* harmony export */   generateCalendar: () => (/* binding */ generateCalendar),
/* harmony export */   generateMonthOptions: () => (/* binding */ generateMonthOptions),
/* harmony export */   getDefaultActiveDate: () => (/* binding */ getDefaultActiveDate),
/* harmony export */   getWeekendDays: () => (/* binding */ getWeekendDays),
/* harmony export */   isWeekendDay: () => (/* binding */ isWeekendDay)
/* harmony export */ });
/* harmony import */ var _wordpress_date__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/date */ "@wordpress/date");
/* harmony import */ var _wordpress_date__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_date__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/hooks */ "@wordpress/hooks");
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_hooks__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../constants */ "./src/calendar/edit/constants.js");



// import { calculateTargetDate } from './date-utils';

const WEEKDAY_SLUGS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

/**
 * Retrieves the days of the week considered weekend days in the editor.
 * Defaults to [ 0, 6 ] (Sunday and Saturday).
 *
 * Cultural Context:
 * - Western standard: Saturday (6) and Sunday (0).
 * - Middle East & North Africa (e.g. Egypt, Saudi Arabia): Friday (5) and Saturday (6).
 * - Israel: Friday (5) and Saturday (6).
 * - Iran: Friday (5) only.
 * - Nepal: Saturday (6) only.
 *
 * @return {number[]} Array of weekend day integers (0 = Sunday, 6 = Saturday).
 */
function getWeekendDays() {
  const defaultWeekends = [0, 6];
  return (0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_1__.applyFilters)('gatherpress.calendar.weekendDays', defaultWeekends);
}
function isWeekendDay(dayOfWeek) {
  return getWeekendDays().includes(dayOfWeek);
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
 * @param {number}  startOfWeek  - The start of week (0=Sunday, 1=Monday, 2=Tuesday, etc.).
 * @param {boolean} showWeekends - Whether to include weekend days.
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
function getDayNames(startOfWeek = 0, showWeekends) {
  const days = [];

  // Base date: 2024-01-07 is a Sunday (day 0).
  // We use a fixed date so calculations are consistent.
  const baseSunday = new Date('2024-01-07');
  for (let i = 0; i < 7; i++) {
    // Calculate the day of week (0=Sunday, 6=Saturday).
    // The modulo ensures we wrap around (e.g., day 7 becomes day 0).
    const dayOfWeek = (startOfWeek + i) % 7;
    if (!showWeekends && isWeekendDay(dayOfWeek)) {
      continue;
    }

    // Create a date for this day of week by adding days to base Sunday.
    const dayDate = new Date(baseSunday);
    dayDate.setDate(baseSunday.getDate() + dayOfWeek);

    // Get the abbreviated day name using dateI18n for proper localization.
    // 'D' format returns the abbreviated day name (e.g., 'Mon', 'Tue', etc.).
    // This respects the site's language setting via WordPress core.
    days.push((0,_wordpress_date__WEBPACK_IMPORTED_MODULE_0__.dateI18n)('D', dayDate));
  }
  return days;
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

  // Generate options for current year and next year.
  for (let year = currentYear - 1; year <= currentYear + 1; year++) {
    for (let month = 1; month <= 12; month++) {
      const date = new Date(year, month - 1, 1);
      const value = `${year}-${String(month).padStart(2, '0')}`;
      const label = (0,_wordpress_date__WEBPACK_IMPORTED_MODULE_0__.dateI18n)('F Y', date);
      options.push({
        value,
        label
      });
    }
  }
  return options;
}

/**
 * Build the weeks array for the requested month.
 *
 * @param {number}  year         Target year.
 * @param {number}  month        Target month (1-12).
 * @param {number}  startOfWeek  Start of week (0-6).
 * @param {number}  daysInMonth  Number of days in month (28-31).
 * @param {Object}  postsByDate  Posts grouped by 'YYYY-MM-DD'.
 * @param {boolean} showWeekends Whether to include weekend days.
 * @return {Array[]} Array of week arrays containing day objects.
 */
function buildWeeks(year, month, startOfWeek, daysInMonth, postsByDate = {}, showWeekends = true) {
  // Today's date string, used to flag the current day in the grid.
  const today = (0,_wordpress_date__WEBPACK_IMPORTED_MODULE_0__.dateI18n)(_constants__WEBPACK_IMPORTED_MODULE_2__.DATE_FORMAT, new Date());

  // Determine the ordered active columns (5 or 7 columns)
  const activeDaysOfWeek = [];
  for (let i = 0; i < 7; i++) {
    const dow = (startOfWeek + i) % 7;
    if (!showWeekends && isWeekendDay(dow)) {
      continue;
    }
    activeDaysOfWeek.push(dow);
  }
  const daysPerWeek = activeDaysOfWeek.length; // 5 or 7
  const weeks = [];
  let currentWeek = [];
  let firstDayPlaced = false;
  for (let day = 1; day <= daysInMonth; day++) {
    const dateObj = new Date(year, month - 1, day);
    const dayOfWeek = dateObj.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat

    // Skip weekends if hidden
    if (!showWeekends && isWeekendDay(dayOfWeek)) {
      continue;
    }

    // Pre-pad leading empty days before the first visible day of the month
    if (!firstDayPlaced) {
      firstDayPlaced = true;
      const startCol = activeDaysOfWeek.indexOf(dayOfWeek);
      const emptyDays = startCol !== -1 ? startCol : 0;

      // Fill initial empty days before the month starts.
      for (let i = 0; i < emptyDays; i++) {
        currentWeek.push({
          isEmpty: true,
          posts: []
        });
      }
    }
    const monthStr = String(month).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateStr = `${year}-${monthStr}-${dayStr}`;
    const dayPosts = postsByDate?.[dateStr] ?? [];
    const isWeekend = isWeekendDay(dayOfWeek);
    const weekday = WEEKDAY_SLUGS[dayOfWeek];
    currentWeek.push({
      day,
      date: dateStr,
      posts: dayPosts,
      isEmpty: false,
      isToday: dateStr === today,
      dayOfWeek,
      weekday,
      isWeekend
    });

    // When week is complete (5 or 7 days), start a new week.
    if (currentWeek.length === daysPerWeek) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  // Fill remaining empty days after the month ends.
  while (currentWeek.length > 0 && currentWeek.length < daysPerWeek) {
    currentWeek.push({
      isEmpty: true,
      posts: []
    });
  }
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }
  return weeks;
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
 * @param {boolean}       showWeekends  - Whether to include weekend days.
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
function generateCalendar(posts = [], startOfWeek = 0, selectedMonth = '', monthModifier = 0, showWeekends = true) {
  // 1. Resolve Target Date
  let year, month;
  if (selectedMonth && /^\d{4}-\d{2}$/.test(selectedMonth)) {
    const [y, m] = selectedMonth.split('-').map(Number);
    year = y;
    month = m;
  } else {
    const now = new Date();
    if (monthModifier !== 0) {
      now.setMonth(now.getMonth() + monthModifier);
    }
    year = now.getFullYear();
    month = now.getMonth() + 1;
  }

  // 3. Organize posts by date for quick lookup.
  // Format: { 'YYYY-MM-DD': [post1, post2, ...] }
  const postsByDate = {};
  if (posts && posts.length > 0) {
    posts.forEach(post => {
      let postDate;
      // For GatherPress events, use event start date.
      if (post.type === 'gatherpress_event') {
        postDate = post.meta.gatherpress_datetime_start;
      } else {
        // For other post types, use publication date.
        postDate = post.date;
      }
      if (!postDate) {
        return;
      }
      const dateObj = new Date(postDate);
      const dateStr = (0,_wordpress_date__WEBPACK_IMPORTED_MODULE_0__.dateI18n)(_constants__WEBPACK_IMPORTED_MODULE_2__.DATE_FORMAT, dateObj);
      if (!postsByDate[dateStr]) {
        postsByDate[dateStr] = [];
      }
      postsByDate[dateStr].push(post);
    });
  }
  const daysInMonth = new Date(year, month, 0).getDate();
  return {
    dayNames: getDayNames(startOfWeek, showWeekends),
    weeks: buildWeeks(year, month, startOfWeek, daysInMonth, postsByDate, showWeekends)
  };
}
/**
 * Pick a sensible default "active" (live-editable) day for the calendar
 * preview: today's date when it falls inside the displayed month,
 * otherwise the first non-empty day of the month.
 *
 * @since 0.4.0
 *
 * @param {Object} calendar - Calendar data structure from generateCalendar().
 *
 * @return {string} Date string (Y-m-d) to treat as the active/live day.
 */
function getDefaultActiveDate(calendar) {
  const days = calendar.weeks.flat();
  const todayEntry = days.find(day => !day.isEmpty && day.isToday);
  if (todayEntry) {
    return todayEntry.date;
  }
  const firstDay = days.find(day => !day.isEmpty);
  return firstDay ? firstDay.date : '';
}

/***/ },

/***/ "./src/calendar/edit/utils/date-utils.js"
/*!***********************************************!*\
  !*** ./src/calendar/edit/utils/date-utils.js ***!
  \***********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   calculateDateQuery: () => (/* binding */ calculateDateQuery),
/* harmony export */   calculateTargetDate: () => (/* binding */ calculateTargetDate)
/* harmony export */ });
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
    // Use selected month (ignore monthModifier when explicit month is set).
    const [year, month] = selectedMonth.split('-').map(Number);
    targetDate = new Date(year, month - 1, 1);
  } else {
    // Use current month with modifier.
    targetDate = new Date();

    // Apply month modifier if no explicit month is selected.
    if (monthModifier !== 0) {
      // Set to first day of month first to avoid date overflow issues.
      // This prevents problems like "Jan 31 + 1 month = March 3" instead of "Feb 28/29".
      targetDate.setDate(1);
      // Now apply the month modifier - JavaScript handles year overflow automatically.
      // For example: December (month 11) + 1 = January (month 0) of next year.
      targetDate.setMonth(targetDate.getMonth() + monthModifier);
    }
  }
  return targetDate;
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
 * Always remember: JavaScript months are zero-based.
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
  // Use the single source of truth for date calculation.
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

/***/ },

/***/ "./src/calendar/index.js"
/*!*******************************!*\
  !*** ./src/calendar/index.js ***!
  \*******************************/
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
/* harmony import */ var _wordpress_date__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/date */ "@wordpress/date");
/* harmony import */ var _wordpress_date__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_wordpress_date__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _wordpress_dom_ready__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @wordpress/dom-ready */ "@wordpress/dom-ready");
/* harmony import */ var _wordpress_dom_ready__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_wordpress_dom_ready__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./style.scss */ "./src/calendar/style.scss");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./edit */ "./src/calendar/edit.js");
/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./save */ "./src/calendar/save.js");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./block.json */ "./src/calendar/block.json");
/* harmony import */ var _variation__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./variation */ "./src/calendar/variation.js");
/* harmony import */ var _transforms__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./transforms */ "./src/calendar/transforms.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__);
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

(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_12__.name, {
  /**
   * Edit function for the block
   *
   * @see ./edit.js
   */
  edit: _edit__WEBPACK_IMPORTED_MODULE_10__["default"],
  /**
   * Save function for the block
   *
   * Saves the InnerBlocks template structure to the database.
   *
   * @see ./save.js
   */
  save: _save__WEBPACK_IMPORTED_MODULE_11__["default"],
  transforms: _transforms__WEBPACK_IMPORTED_MODULE_14__["default"]
});

/**
 * Helper to recursively search a block tree for gatherpress/calendar.
 * @param {Object} blocks One block, that may have innerBlocks.
 */
function findCalendarBlock(blocks = []) {
  for (const block of blocks) {
    if (block.name === 'gatherpress/calendar') {
      return block;
    }
    if (block.innerBlocks && block.innerBlocks.length) {
      const found = findCalendarBlock(block.innerBlocks);
      if (found) {
        return found;
      }
    }
  }
  return null;
}
_wordpress_dom_ready__WEBPACK_IMPORTED_MODULE_8___default()(() => {
  if (typeof _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockBindingsSource !== 'function') {
    return;
  }

  /**
   * Register the Month Heading block binding source.
   *
   * Lets a `core/heading` bound to this source (see the "Event Calendar"
   * pattern, placed inside the Query block before the calendar) display the
   * month/year currently shown by the calendar. The PHP-side source
   * (`Setup::get_month_heading_binding_value()`) is the source of truth on
   * the frontend, reading core Query's pagination; the editor canvas has no
   * URL-based pagination to read, so this preview simply shows the current
   * site month.
   *
   * @since 0.6.0
   */
  ;(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockBindingsSource)({
    name: 'gatherpress/calendar-month-heading',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Calendar Month Heading', 'gatherpress-calendar'),
    usesContext: ['query'],
    getValues({
      select,
      clientId
    }) {
      const {
        getBlockParentsByBlockName,
        getBlock,
        getBlocks
      } = select('core/block-editor');
      let calendarBlock = null;

      // 1. First, search inside the same parent Query block (if nested in one)
      const parentQueryIds = getBlockParentsByBlockName(clientId, 'core/query');
      if (parentQueryIds && parentQueryIds.length) {
        const parentQuery = getBlock(parentQueryIds[parentQueryIds.length - 1]);
        if (parentQuery?.innerBlocks) {
          calendarBlock = findCalendarBlock(parentQuery.innerBlocks);
        }
      }

      // 2. Fallback: search all blocks in the editor canvas
      if (!calendarBlock) {
        calendarBlock = findCalendarBlock(getBlocks());
      }
      const {
        selectedMonth = '',
        monthModifier = 0
      } = calendarBlock?.attributes || {};

      // Resolve Target Year and Month
      let year, month;
      if (selectedMonth && /^\d{4}-\d{2}$/.test(selectedMonth)) {
        const [y, m] = selectedMonth.split('-').map(Number);
        year = y;
        month = m;
      } else {
        const now = new Date();
        if (monthModifier !== 0) {
          now.setMonth(now.getMonth() + Number(monthModifier));
        }
        year = now.getFullYear();
        month = now.getMonth() + 1;
      }

      // Format matching PHP's wp_date( 'F Y' ) using WordPress dateI18n
      const targetDate = new Date(year, month - 1, 1);
      const formattedMonth = (0,_wordpress_date__WEBPACK_IMPORTED_MODULE_6__.dateI18n)('F Y', targetDate);
      return {
        content: formattedMonth
      };
    }
  });
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
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(BlockEdit, {
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
      } = select(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_7__.store);
      const block = getBlock(props.clientId);
      if (!block || !block.innerBlocks || block.innerBlocks.length === 0) {
        return {
          hasCalendarChild: false,
          isGatherPressQuery: false
        };
      }
      const hasCalendar = block.innerBlocks.some(innerBlock => innerBlock.name === _block_json__WEBPACK_IMPORTED_MODULE_12__.name);

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
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.Fragment, {
      children: [shouldShowNotice && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_7__.InspectorControls, {
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Notice, {
          status: "info",
          isDismissible: false,
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("p", {
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('The GatherPress Calendar block is active in this Query Loop. The calendar will use date-based filtering for the selected month, overriding the "Upcoming or past events" setting.', 'gatherpress-calendar')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("p", {
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('This ensures the calendar only displays events from the specific month, regardless of whether they are past or upcoming events.', 'gatherpress-calendar')
          })]
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(BlockEdit, {
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

/***/ "./src/calendar/save.js"
/*!******************************!*\
  !*** ./src/calendar/save.js ***!
  \******************************/
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
 * Server-side rendering injects context for calendar-weeks, -days and -entries;
 * this save component preserves the InnerBlocks template structure.
 *
 * @since 0.4.0
 *
 * @return {Element} The React element representing the saved block content.
 */



function save() {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.InnerBlocks.Content, {});
}

/***/ },

/***/ "./src/calendar/transforms.js"
/*!************************************!*\
  !*** ./src/calendar/transforms.js ***!
  \************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/**
 * WordPress dependencies
 */



/**
 * Helper to recursively search an innerBlocks tree for a specific block by name.
 *
 * @param {Array}  blocks    Array of block objects.
 * @param {string} blockName Block name to search for.
 * @return {Object|null} Matching block object or null.
 */
function findBlockByName(blocks = [], blockName) {
  for (const block of blocks) {
    if (block.name === blockName) {
      return block;
    }
    if (block.innerBlocks && block.innerBlocks.length) {
      const found = findBlockByName(block.innerBlocks, blockName);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

/**
 * Wraps content blocks inside the complete calendar template hierarchy.
 *
 * @param {Array} contentBlocks Blocks to preserve inside gatherpress/modal-content.
 * @return {Object} New gatherpress/calendar block.
 */
function createCalendarFromTemplate(contentBlocks = []) {
  // 1. Prepare preserved blocks inside modal content with a Close button
  const modalContentBlocks = [...contentBlocks.map(block => (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.cloneBlock)(block)), (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.createBlock)('core/buttons', {
    align: 'center',
    layout: {
      type: 'flex',
      justifyContent: 'center'
    }
  }, [(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.createBlock)('core/button', {
    tagName: 'button',
    className: 'gatherpress-modal--trigger-close',
    text: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Close', 'gatherpress-calendar')
  })])];
  const modalContent = (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.createBlock)('gatherpress/modal-content', {
    style: {
      dimensions: {
        maxWidth: '400px'
      },
      spacing: {
        padding: {
          top: 'var:preset|spacing|30',
          bottom: 'var:preset|spacing|30',
          left: 'var:preset|spacing|30',
          right: 'var:preset|spacing|30'
        }
      }
    },
    backgroundColor: 'base'
  }, modalContentBlocks);
  const modal = (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.createBlock)('gatherpress/modal', {}, [modalContent]);
  const trigger = (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.createBlock)('gatherpress/event-date', {
    displayType: 'start',
    isLink: true,
    startDateFormat: 'G:i',
    className: 'gatherpress-modal--trigger-open',
    style: {
      spacing: {
        padding: {
          top: '0',
          bottom: '0',
          left: '0',
          right: '0'
        },
        margin: {
          top: '0',
          bottom: '0',
          left: '0',
          right: '0'
        }
      }
    },
    fontSize: 'small'
  });
  const modalManager = (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.createBlock)('gatherpress/modal-manager', {}, [trigger, modal]);
  const entries = (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.createBlock)('gatherpress/calendar-entries', {
    layout: {
      type: 'default'
    },
    className: 'is-style-default',
    style: {
      spacing: {
        blockGap: '0',
        padding: {
          top: '0',
          bottom: '0',
          left: '0',
          right: '0'
        },
        margin: {
          top: '0',
          bottom: '0',
          left: '0',
          right: '0'
        }
      },
      layout: {
        selfStretch: 'fill',
        flexSize: null
      }
    }
  }, [modalManager]);
  const dayNumber = (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.createBlock)('core/paragraph', {
    metadata: {
      bindings: {
        content: {
          source: 'gatherpress/calendar-day'
        }
      },
      name: 'Day Number'
    },
    style: {
      spacing: {
        margin: {
          top: '0',
          bottom: '0',
          left: '0',
          right: '0'
        }
      }
    },
    fontSize: 'small',
    placeholder: 'DD',
    content: 'DD'
  });
  const day = (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.createBlock)('gatherpress/calendar-day', {}, [dayNumber, entries]);
  const week = (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.createBlock)('gatherpress/calendar-week', {}, [day]);
  return (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.createBlock)('gatherpress/calendar', {}, [week]);
}

/**
 * Extracts preserved blocks from modal-content inside the calendar hierarchy.
 *
 * @param {Array} calendarInnerBlocks The gatherpress/calendar innerBlocks.
 * @return {Array} Blocks to place in core/post-template.
 */
function extractModalContentBlocks(calendarInnerBlocks = []) {
  const modalContent = findBlockByName(calendarInnerBlocks, 'gatherpress/modal-content');
  if (!modalContent || !modalContent.innerBlocks?.length) {
    // Fallback: look for calendar-entries or return default template blocks
    const entries = findBlockByName(calendarInnerBlocks, 'gatherpress/calendar-entries');
    if (entries?.innerBlocks?.length) {
      return entries.innerBlocks.map(block => (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.cloneBlock)(block));
    }
    return [(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.createBlock)('core/post-title', {
      isLink: true
    }), (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.createBlock)('core/post-excerpt')];
  }

  // Filter out the modal's Close button since it is no longer inside a modal
  const preservedBlocks = modalContent.innerBlocks.filter(block => {
    const isCloseButtons = block.name === 'core/buttons' && block.innerBlocks?.some(btn => btn.attributes?.className?.includes('gatherpress-modal--trigger-close'));
    return !isCloseButtons;
  }).map(block => (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.cloneBlock)(block));
  return preservedBlocks.length ? preservedBlocks : modalContent.innerBlocks.map(block => (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.cloneBlock)(block));
}
/**
 * Transforming core/post-template ➔ gatherpress/calendar:
 *
 * Clicking the block switcher in the toolbar transforms the list into a calendar.
 * The Post Title, Excerpt, Event Date, and custom blocks are moved inside the popover gatherpress/modal-content.
 *
 * Transforming gatherpress/calendar ➔ core/post-template:
 *
 * Clicking the block switcher transforms the calendar back into a standard core/post-template.
 * All blocks configured inside gatherpress/modal-content are extracted
 * and placed directly in the template loop (with the modal close button cleanly stripped).
 */
const transforms = {
  from: [{
    type: 'block',
    blocks: ['core/post-template'],
    transform: (attributes, innerBlocks) => {
      return createCalendarFromTemplate(innerBlocks);
    }
  }],
  to: [{
    type: 'block',
    blocks: ['core/post-template'],
    transform: (attributes, innerBlocks) => {
      const preservedBlocks = extractModalContentBlocks(innerBlocks);
      return (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.createBlock)('core/post-template', {}, preservedBlocks);
    }
  }]
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (transforms);

/***/ },

/***/ "./src/calendar/variation-controls.js"
/*!********************************************!*\
  !*** ./src/calendar/variation-controls.js ***!
  \********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CalendarQueryControlsPanel: () => (/* binding */ CalendarQueryControlsPanel)
/* harmony export */ });
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/hooks */ "@wordpress/hooks");
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_hooks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _edit_components_MonthPicker__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./edit/components/MonthPicker */ "./src/calendar/edit/components/MonthPicker.js");
/* harmony import */ var _edit_components_MonthControls__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./edit/components/MonthControls */ "./src/calendar/edit/components/MonthControls.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__);
/**
 * WordPress dependencies
 */







/**
 * Internal dependencies
 */
// import { NAME } from './name';
// import EventQueryControls from './slots/query-controls';
// import EventInheritedQueryControls from './slots/inherited-query-controls';
// import {
// 	EventQueryControlsSlotFill,
// 	EventInheritedQueryControlsSlotFill,
// } from './components';
// import { usePostTypeSupports } from '../../../helpers/event';
// import { usePostTypeLabel } from '../../../helpers/editor';




const NAME = 'gatherpress-calendar-query';

/**
 * Determines if the current block instance is the GatherPress event query variation.
 *
 * @param {Object} props - Props passed to the block's edit component.
 * @return {boolean} True if the block's namespace matches NAME, otherwise false.
 */
const isCalendarQueryLoop = props => {
  const namespace = props?.attributes?.namespace;
  return Boolean(namespace && namespace === NAME);
};

/**
 * Renders the "Calendar Query Settings" panel for a GatherPress calendar query block.
 *
 * Extracted into its own component so the `usePostTypeSupports` hook can be
 * called unconditionally at the top of a render (Rules of Hooks) — the HOC
 * has early-return paths for non-query blocks where we don't want to read
 * supports at all.
 *
 * Hides itself when the queried post type doesn't support
 * `gatherpress-event-date`, so changing a loop's post type away from events
 * (without removing the variation) collapses the now-irrelevant panel
 * instead of leaving stale event-only controls visible.
 *
 * @param {Object} props - Block props passed through from the HOC.
 *
 * @return {Element|null} The InspectorControls panel, or null when not applicable.
 */
const CalendarQueryControlsPanel = props => {
  const {
    attributes,
    setAttributes,
    clientId
  } = props;
  const {
    updateBlockAttributes
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_5__.useDispatch)('core/block-editor');
  // const gatherpressEventQuery = props.attributes?.query?.gatherpress_event_query || 'upcoming';

  const query = attributes?.query || {};
  const {
    selectedMonth = '',
    monthModifier = 0,
    inherit = false,
    postType: queryPostType
  } = query;

  // TODO: Use core helper when included in GatherPress.
  // const queryPostTypeSupportsEvents = usePostTypeSupports(
  // 	'gatherpress-event-date',
  // 	queryPostType,
  // );
  const queryPostTypeSupportsEvents = queryPostType === 'gatherpress_event';

  // Read the plural label so the "Block List" label reflects what the currently
  // selected post type is actually called — a custom event-supporting post type with
  // `name => 'Productions'` shows "Upcoming (or Past) Productions".
  // TODO: Use core helper when included in GatherPress.
  // const pluralLabel = usePostTypeLabel(
  // 	'name',
  // 	queryPostType,
  // 	__( 'Events', 'gatherpress' ),
  // );
  const pluralLabel = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Events', 'gatherpress');

  // // Update block name with post type label and query mode
  // useEffect( () => {
  // 	const queryLabel = ( 'upcoming' === gatherpressEventQuery )
  // 		? __( 'Upcoming', 'gatherpress' )
  // 		: __( 'Past', 'gatherpress' );

  // 	let blockName = sprintf(
  // 		/* translators: %1$s: 'Upcoming' or 'Past', %2$s: Plural post type label, e.g. "Events". */
  // 		__( '%1$s %2$s', 'gatherpress' ),
  // 		queryLabel,
  // 		pluralLabel,
  // 	);

  // 	// Unset if not a supporting post type.
  // 	if ( ! queryPostTypeSupportsEvents ) {
  // 		blockName = '';
  // 	}

  // 	updateBlockAttributes( clientId, {
  // 		metadata: {
  // 			name: blockName,
  // 		},
  // 	} );
  // }, [
  // 	queryPostTypeSupportsEvents,
  // 	pluralLabel,
  // 	gatherpressEventQuery,
  // 	clientId,
  // 	updateBlockAttributes,
  // ] );

  // 1. Hooks must ALWAYS be called at the top, before any conditional returns
  const [showMonthPicker, setShowMonthPicker] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)(false);

  // Strip the event-only query vars when the selected post type doesn't
  // support event dates. `orderBy: 'datetime'` (and 'rand') are added to the
  // REST orderby enum only for event-date post types, so leaving them on a
  // plain post/page/venue query makes the core endpoint reject the request
  // (rest_invalid_param) and the Query Loop spins forever (#1756). The
  // gatherpress_event_query / include_unfinished vars are harmless on those
  // endpoints but meaningless there, so drop them too. Guarded on the vars
  // still being present so this doesn't re-fire in a loop.
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useEffect)(() => {
    if (queryPostTypeSupportsEvents) {
      return;
    }
    const hasEventOnlyOrderBy = 'datetime' === query.orderBy || 'rand' === query.orderBy;
    const hasEventOnlyVars = undefined !== query.gatherpress_calendar_query || hasEventOnlyOrderBy;
    if (!hasEventOnlyVars) {
      return;
    }
    const {
      gatherpress_event_query: removedEventQuery,
      include_unfinished: removedIncludeUnfinished,
      ...remainingQuery
    } = query;

    // Reset the GatherPress-only ordering to the core default the
    // posts/pages endpoint accepts; leave any other orderBy intact.
    if (hasEventOnlyOrderBy) {
      remainingQuery.orderBy = 'date';
      remainingQuery.order = 'desc';
    }
    updateBlockAttributes(clientId, {
      query: remainingQuery
    });
  }, [queryPostTypeSupportsEvents, query, clientId, updateBlockAttributes]);

  // Read the singular label so the label reflects what the currently
  // selected post type is actually called — a custom event-supporting post type with
  // `singular_name => 'Production'` shows "Production Query Settings".
  // TODO: Use core helper when included in GatherPress.
  // const singularLabel = usePostTypeLabel(
  // 	'singular_name',
  // 	queryPostType,
  // 	__( 'Event', 'gatherpress' ),
  // );
  const singularLabel = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Event', 'gatherpress');
  if (!queryPostTypeSupportsEvents) {
    return null;
  }
  const handleMonthSelect = value => {
    setAttributes({
      query: {
        ...query,
        selectedMonth: value
      }
    });
    setShowMonthPicker(false);
  };
  const handleMonthChange = value => {
    setAttributes({
      query: {
        ...query,
        selectedMonth: value
      }
    });
  };
  const handleModifierChange = value => {
    const numValue = value === '' ? 0 : parseInt(value, 10);
    setAttributes({
      query: {
        ...query,
        monthModifier: isNaN(numValue) ? 0 : numValue
      }
    });
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, {
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.sprintf)(/* translators: %s: Singular post type label, e.g. "Event". */
      (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('%s Calendar Settings', 'gatherpress'), singularLabel),
      children: !inherit && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.Fragment, {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("p", {
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Select a specific month to display, or leave empty to show the current month.', 'gatherpress-calendar')
        }), showMonthPicker ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_edit_components_MonthPicker__WEBPACK_IMPORTED_MODULE_6__.MonthPicker, {
          selectedMonth: selectedMonth,
          onSelect: handleMonthSelect,
          onCancel: () => setShowMonthPicker(false)
        }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_edit_components_MonthControls__WEBPACK_IMPORTED_MODULE_7__.MonthControls, {
          selectedMonth: selectedMonth,
          monthModifier: monthModifier,
          onMonthChange: handleMonthChange,
          onModifierChange: handleModifierChange,
          onOpenPicker: () => setShowMonthPicker(true)
        })]
      })
    })
  });
};

/**
 * Higher Order Component (HOC) to inject GatherPress-specific controls into core/query blocks.
 *
 * - If the block is not the designated event query or a query block, returns the block unchanged.
 * - For standard query blocks, watches for post type selection to convert into an event query when needed.
 * - For GatherPress event queries, provides the relevant controls in a PanelBody within InspectorControls.
 *
 * @param {Function} BlockEdit - The Query block's BlockEdit component.
 *
 * @return {Function} Enhanced BlockEdit component.
 */
const withEventQueryControls = BlockEdit => props => {
  // Early return if block is not a query or not a supported variation.
  if (!isCalendarQueryLoop(props) && 'core/query' !== props.name) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(BlockEdit, {
      ...props
    });
  }
  /// If it's a generic core/query, observe for transformation to GatherPress event query.
  if (!isCalendarQueryLoop(props)) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.Fragment, {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(BlockEdit, {
        ...props
      })
    });
  }
  // For a GatherPress event query, inject the controls panel (full or inherited controls).
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(BlockEdit, {
      ...props
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(CalendarQueryControlsPanel, {
      ...props
    })]
  });
};

/**
 * Registers the withEventQueryControls HOC as a filter to extend core/query blocks
 * with custom InspectorControls for GatherPress event queries.
 */
(0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_0__.addFilter)('editor.BlockEdit', 'core/query', withEventQueryControls);

/**
 * Registers the Query Controls SlotFills for the plugin interface, allowing
 * the relevant GatherPress query controls and inherited controls to be displayed.
 */
// registerPlugin( 'gatherpress-query-controls-slotfill', {
// 	render: EventQueryControlsSlotFill,
// } );
// registerPlugin( 'gatherpress-inherited-query-controls-slotfill', {
// 	render: EventInheritedQueryControlsSlotFill,
// } );

/***/ },

/***/ "./src/calendar/variation.js"
/*!***********************************!*\
  !*** ./src/calendar/variation.js ***!
  \***********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _edit_constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./edit/constants */ "./src/calendar/edit/constants.js");
/* harmony import */ var _variation_controls__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./variation-controls */ "./src/calendar/variation-controls.js");
/**
 * WordPress dependencies
 */



/**
 * Internal dependencies
 */


(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockVariation)('core/query', {
  name: 'gatherpress-calendar',
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Event Calendar', 'gatherpress-calendar'),
  description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Show GatherPress events in a monthly calendar format.', 'gatherpress-calendar'),
  icon: 'calendar-alt',
  category: 'gatherpress',
  keywords: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('calendar', 'gatherpress-calendar'), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('event', 'gatherpress-calendar'), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('query', 'gatherpress-calendar')],
  attributes: {
    namespace: 'gatherpress-calendar-query',
    enhancedPagination: true,
    // className: 'gatherpress-event-query',
    query: {
      perPage: 5,
      pages: 0,
      offset: 0,
      postType: 'gatherpress_event',
      order: 'asc',
      orderBy: 'datetime',
      inherit: false,
      excludeCurrent: null,
      parents: [],
      sticky: '',
      format: [],
      selectedMonth: null,
      monthModifier: null
    }
  },
  innerBlocks: _edit_constants__WEBPACK_IMPORTED_MODULE_2__.QUERY_VARIATION_INNER_BLOCKS,
  scope: ['inserter'],
  // Gate on `namespace` only. Including `query.postType` here would
  // drop the variation match the moment a user picks a custom event-
  // supporting post type, which in turn drops the "Event Card with
  // RSVP" starter pattern out of the Change design picker since that
  // pattern is scoped to this variation.
  isActive: ['namespace']
});

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

/***/ "./src/utils/use-stable-value.js"
/*!***************************************!*\
  !*** ./src/utils/use-stable-value.js ***!
  \***************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useStableValue: () => (/* binding */ useStableValue)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);


/**
 * Returns a referentially-stable version of `value`, keeping the previous
 * render's reference as long as its JSON-serialized shape hasn't actually
 * changed.
 *
 * `getBlocks()`-based useSelect() results can return new array/object
 * wrappers on *any* block-editor store update - including selection
 * changes that have nothing to do with the blocks being read - even when
 * the underlying data is unchanged. An unstable reference here cascades
 * into consumers (e.g. useBlockPreview, whose internal editor context
 * fully tears down and rebuilds whenever its `blocks` prop's reference
 * changes) causing unnecessary, visible re-renders across the whole grid.
 *
 * @since 0.4.0
 *
 * @param {*} value Value to stabilize.
 *
 * @return {*} The same value, or the previous render's reference if unchanged.
 */
function useStableValue(value) {
  const valueRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(value);
  const serializedRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const serialized = JSON.stringify(value);
  if (serializedRef.current !== serialized) {
    serializedRef.current = serialized;
    valueRef.current = value;
  }
  return valueRef.current;
}

/***/ },

/***/ "./src/calendar/editor.scss"
/*!**********************************!*\
  !*** ./src/calendar/editor.scss ***!
  \**********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "./src/calendar/style.scss"
/*!*********************************!*\
  !*** ./src/calendar/style.scss ***!
  \*********************************/
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

/***/ "@wordpress/dom-ready"
/*!**********************************!*\
  !*** external ["wp","domReady"] ***!
  \**********************************/
(module) {

module.exports = window["wp"]["domReady"];

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

/***/ "./src/calendar/block.json"
/*!*********************************!*\
  !*** ./src/calendar/block.json ***!
  \*********************************/
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"gatherpress/calendar","version":"0.4.0","title":"GatherPress Calendar","category":"gatherpress","icon":"calendar-alt","description":"Display query loop posts in a monthly calendar format.","ancestor":["core/query"],"allowedBlocks":["gatherpress/calendar-week"],"usesContext":["queryId","query","queryContext","displayLayout","templateSlug","previewPostType"],"providesContext":{"gatherpress/showWeekends":"showWeekends"},"attributes":{"selectedMonth":{"type":"string","default":""},"monthModifier":{"type":"number","default":0},"showWeekdays":{"type":"boolean","default":true},"showWeekends":{"type":"boolean","default":true}},"supports":{"interactivity":{"clientNavigation":true},"reusable":false,"html":false,"align":true,"alignWide":true,"customClassName":true,"color":{"gradients":true,"link":false,"text":false,"__experimentalDefaultControls":{"background":true}},"spacing":{"margin":true,"padding":true,"blockGap":["horizontal","vertical"]},"__experimentalBorder":{"color":true,"radius":false,"style":true,"width":true},"layout":{"allowEditing":false}},"styles":[{"name":"default","label":"Classic","isDefault":true},{"name":"minimal","label":"Minimal"},{"name":"bold","label":"Bold"},{"name":"circular","label":"Circular"},{"name":"gradient","label":"Gradient"}],"textdomain":"gatherpress-calendar","editorScript":"file:./index.js","editorStyle":"file:./index.css","style":"file:./style-index.css"}');

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
/******/ 			"calendar/index": 0,
/******/ 			"calendar/style-index": 0
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
/******/ 	let __webpack_exports__ = __webpack_require__.O(undefined, ["calendar/style-index"], () => (__webpack_require__("./src/calendar/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=index.js.map