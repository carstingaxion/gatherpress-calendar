/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/calendar/bindings.js"
/*!**********************************!*\
  !*** ./src/calendar/bindings.js ***!
  \**********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/hooks */ "@wordpress/hooks");
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_hooks__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_dom_ready__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/dom-ready */ "@wordpress/dom-ready");
/* harmony import */ var _wordpress_dom_ready__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_dom_ready__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_date__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/date */ "@wordpress/date");
/* harmony import */ var _wordpress_date__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_date__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/compose */ "@wordpress/compose");
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_wordpress_compose__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _edit_utils_date_utils__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./edit/utils/date-utils */ "./src/calendar/edit/utils/date-utils.js");
/* harmony import */ var _edit_utils_calendar_utils__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./edit/utils/calendar-utils */ "./src/calendar/edit/utils/calendar-utils.js");
/* harmony import */ var _edit_utils_block_sync_utils__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./edit/utils/block-sync-utils */ "./src/calendar/edit/utils/block-sync-utils.js");
/* harmony import */ var _edit_utils_source_utils__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./edit/utils/source-utils */ "./src/calendar/edit/utils/source-utils.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__);
/**
 * GatherPress Calendar Block Bindings and Editor Filters
 *
 * @package
 * @since 0.8.0
 */














_wordpress_dom_ready__WEBPACK_IMPORTED_MODULE_3___default()(() => {
  if (typeof _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockBindingsSource !== 'function') {
    return;
  }

  /**
   * Callback to get heading content for bound heading blocks in the editor.
   *
   * Subscribes to the calendar block's settings and current post dates,
   * formatting the active date range.
   *
   * @param {Object}   root0          Parameters object.
   * @param {Function} root0.select   Block editor select function.
   * @param {string}   root0.clientId Current block client ID.
   * @return {Object} Content object.
   */
  const getCalendarHeadingValues = ({
    select: registrySelect,
    clientId
  }) => {
    const {
      getBlockParentsByBlockName,
      getBlock,
      getBlocks
    } = registrySelect('core/block-editor');
    let calendarBlock = null;
    const parentQueryIds = getBlockParentsByBlockName(clientId, 'core/query');

    // 1. Search inside the same parent Query block.
    if (parentQueryIds && parentQueryIds.length) {
      const parentQuery = getBlock(parentQueryIds[parentQueryIds.length - 1]);
      if (parentQuery?.innerBlocks) {
        calendarBlock = (0,_edit_utils_block_sync_utils__WEBPACK_IMPORTED_MODULE_10__.findBlockByName)(parentQuery.innerBlocks, 'gatherpress/calendar');
      }
    }

    // 2. Fallback: search all blocks in the editor canvas.
    if (!calendarBlock) {
      calendarBlock = (0,_edit_utils_block_sync_utils__WEBPACK_IMPORTED_MODULE_10__.findBlockByName)(getBlocks(), 'gatherpress/calendar');
    }

    // Establish reactive subscription to calendar attributes.
    const liveCalendar = calendarBlock ? getBlock(calendarBlock.clientId) : null;
    const {
      viewType = 'month',
      unitCount = 1,
      selectedDate = '',
      dateModifier = 0,
      showWeekends = true,
      dateRangeSource = 'default',
      postId = 0,
      sourcePostType = ''
    } = liveCalendar?.attributes || {};
    const startOfWeek = (0,_edit_utils_calendar_utils__WEBPACK_IMPORTED_MODULE_9__.getStartOfWeek)();
    const sourceDates = (0,_edit_utils_source_utils__WEBPACK_IMPORTED_MODULE_11__.resolveSourceEventDates)(registrySelect, {
      dateRangeSource,
      postId,
      sourcePostType
    });
    let effectiveSelectedDate = selectedDate;
    let effectiveUnitCount = unitCount;
    if (sourceDates.hasPost) {
      effectiveSelectedDate = sourceDates.startDate;
      effectiveUnitCount = (0,_edit_utils_date_utils__WEBPACK_IMPORTED_MODULE_8__.calculatePostSpanUnits)(viewType, sourceDates.startDate, sourceDates.endDate, startOfWeek);
    }
    const isPostAnchored = (0,_edit_utils_source_utils__WEBPACK_IMPORTED_MODULE_11__.isPostDateSource)(dateRangeSource);
    const range = (0,_edit_utils_date_utils__WEBPACK_IMPORTED_MODULE_8__.calculateDateRange)({
      viewType,
      unitCount: effectiveUnitCount,
      selectedDate: effectiveSelectedDate,
      dateModifier: isPostAnchored ? 0 : dateModifier,
      showWeekends
    }, startOfWeek);
    return {
      content: (0,_edit_utils_date_utils__WEBPACK_IMPORTED_MODULE_8__.formatHeading)(viewType, range.startDateObj, range.endDateObj)
    };
  };
  (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockBindingsSource)({
    name: 'gatherpress/calendar-heading',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Calendar Heading', 'gatherpress-calendar'),
    usesContext: ['query'],
    getValues: getCalendarHeadingValues
  });
  (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockBindingsSource)({
    name: 'gatherpress/calendar-day',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Calendar Day Number', 'gatherpress-calendar'),
    usesContext: ['gatherpress/dayNumber', 'gatherpress/dayDate', 'gatherpress/isEmpty'],
    getValues({
      context,
      args
    }) {
      if (context?.['gatherpress/isEmpty']) {
        return {
          content: ''
        };
      }
      const dayDate = context?.['gatherpress/dayDate'];
      const format = args?.format || '';
      if (dayDate && format !== '') {
        const dateObj = new Date(`${dayDate}T12:00:00Z`);
        return {
          content: (0,_wordpress_date__WEBPACK_IMPORTED_MODULE_4__.dateI18n)(format, dateObj, 'UTC')
        };
      }
      const dayNumber = context?.['gatherpress/dayNumber'];
      return {
        content: null !== dayNumber && undefined !== dayNumber ? String(dayNumber) : ''
      };
    }
  });
});

// InspectorControls for blocks bound to gatherpress/calendar-day:
const withDayNumberBindingControls = (0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_6__.createHigherOrderComponent)(BlockEdit => {
  return props => {
    const {
      attributes,
      setAttributes
    } = props;
    const binding = attributes?.metadata?.bindings?.content;
    if (binding?.source !== 'gatherpress/calendar-day') {
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)(BlockEdit, {
        ...props
      });
    }
    const currentFormat = binding?.args?.format || '';
    const updateFormat = newFormat => {
      setAttributes({
        metadata: {
          ...attributes.metadata,
          bindings: {
            ...attributes.metadata.bindings,
            content: {
              ...binding,
              args: {
                ...binding.args,
                format: newFormat
              }
            }
          }
        }
      });
    };
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.Fragment, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)(BlockEdit, {
        ...props
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_5__.InspectorControls, {
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_7__.PanelBody, {
          title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Day Number Settings', 'gatherpress-calendar'),
          initialOpen: true,
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_7__.SelectControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Date Format', 'gatherpress-calendar'),
            value: currentFormat,
            options: [{
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Default (1, 2, 3…)', 'gatherpress-calendar'),
              value: 'j'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Leading zero (01, 02, 03…)', 'gatherpress-calendar'),
              value: 'd'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Ordinal (1st, 2nd, 3rd…)', 'gatherpress-calendar'),
              value: 'jS'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Dot suffix (1., 2., 3…)', 'gatherpress-calendar'),
              value: 'j.'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Weekday and day (Mon 1…)', 'gatherpress-calendar'),
              value: 'D j'
            }],
            onChange: updateFormat
          })
        })
      })]
    });
  };
}, 'withDayNumberBindingControls');
(0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_1__.addFilter)('editor.BlockEdit', 'gatherpress-calendar/day-number-binding-controls', withDayNumberBindingControls);

/***/ },

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
/* harmony import */ var _edit_constants__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./edit/constants */ "./src/calendar/edit/constants.js");
/* harmony import */ var _edit_utils_date_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./edit/utils/date-utils */ "./src/calendar/edit/utils/date-utils.js");
/* harmony import */ var _edit_utils_source_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./edit/utils/source-utils */ "./src/calendar/edit/utils/source-utils.js");
/* harmony import */ var _edit_utils_calendar_utils__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./edit/utils/calendar-utils */ "./src/calendar/edit/utils/calendar-utils.js");
/* harmony import */ var _edit_hooks_useCalendarSync__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./edit/hooks/useCalendarSync */ "./src/calendar/edit/hooks/useCalendarSync.js");
/* harmony import */ var _edit_hooks_useCalendarData__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./edit/hooks/useCalendarData */ "./src/calendar/edit/hooks/useCalendarData.js");
/* harmony import */ var _edit_hooks_useCalendarDayTemplate__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./edit/hooks/useCalendarDayTemplate */ "./src/calendar/edit/hooks/useCalendarDayTemplate.js");
/* harmony import */ var _edit_hooks_useDateRangeSourceSync__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./edit/hooks/useDateRangeSourceSync */ "./src/calendar/edit/hooks/useDateRangeSourceSync.js");
/* harmony import */ var _edit_components_MonthPicker__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./edit/components/MonthPicker */ "./src/calendar/edit/components/MonthPicker.js");
/* harmony import */ var _edit_components_DateControls__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./edit/components/DateControls */ "./src/calendar/edit/components/DateControls.js");
/* harmony import */ var _edit_components_CalendarTable__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./edit/components/CalendarTable */ "./src/calendar/edit/components/CalendarTable.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__);
/**
 * GatherPress Calendar Block Editor Component
 *
 * @package
 * @since 0.1.0
 */

















/**
 * Edit Component
 *
 * Main editor component for the GatherPress Calendar block.
 *
 * @since 0.1.0
 *
 * @param {Object}   props               Component props.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Function to update block attributes.
 * @param {Object}   props.context       Context from parent blocks.
 * @param {string}   props.clientId      This block's client ID.
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
    viewType = 'month',
    unitCount = 1,
    selectedDate = '',
    dateModifier = 0,
    showWeekdays = true,
    showWeekends = true,
    dateRangeSource = 'default',
    postId = 0,
    sourcePostType = ''
  } = attributes;
  const {
    query
  } = context;
  const [showMonthPicker, setShowMonthPicker] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useState)(false);
  const [activeDate, setActiveDate] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useState)('');
  const startOfWeek = (0,_edit_utils_calendar_utils__WEBPACK_IMPORTED_MODULE_7__.getStartOfWeek)();

  // Coordinate dateRangeSource resolution, attribute synchronization, and presets.
  const {
    sourcePostDates,
    hasPostDates,
    effectiveUnitCount,
    effectiveSelectedDate,
    effectiveDateModifier,
    hasCurrentSupport
  } = (0,_edit_hooks_useDateRangeSourceSync__WEBPACK_IMPORTED_MODULE_11__.useDateRangeSourceSync)({
    attributes,
    setAttributes,
    context,
    startOfWeek
  });

  // Synchronize parent Query block name, Heading name, and pagination labels.
  (0,_edit_hooks_useCalendarSync__WEBPACK_IMPORTED_MODULE_8__.useCalendarSync)({
    clientId,
    viewType,
    unitCount: effectiveUnitCount
  });
  const dateRange = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useMemo)(() => (0,_edit_utils_date_utils__WEBPACK_IMPORTED_MODULE_5__.calculateDateRange)({
    viewType,
    unitCount: effectiveUnitCount,
    selectedDate: effectiveSelectedDate,
    dateModifier: effectiveDateModifier,
    showWeekends
  }, startOfWeek), [viewType, effectiveUnitCount, effectiveSelectedDate, effectiveDateModifier, showWeekends, startOfWeek]);
  const {
    posts
  } = (0,_edit_hooks_useCalendarData__WEBPACK_IMPORTED_MODULE_9__.useCalendarData)(query, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useMemo)(() => (0,_edit_utils_date_utils__WEBPACK_IMPORTED_MODULE_5__.calculateDateQuery)({
    viewType,
    unitCount: effectiveUnitCount,
    selectedDate: effectiveSelectedDate,
    dateModifier: effectiveDateModifier,
    showWeekends
  }, startOfWeek), [viewType, effectiveUnitCount, effectiveSelectedDate, effectiveDateModifier, showWeekends, startOfWeek]));
  const calendar = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useMemo)(() => (0,_edit_utils_calendar_utils__WEBPACK_IMPORTED_MODULE_7__.generateCalendar)(posts, startOfWeek, dateRange, showWeekends), [posts, startOfWeek, dateRange, showWeekends]);

  // Table captions, as on the front end: the name of each month grid, or
  // the heading of the week or day range.
  const captions = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useMemo)(() => {
    const start = dateRange.startDateObj || new Date(dateRange.startDate);
    const end = dateRange.endDateObj || new Date(dateRange.endDate);
    if ('month' !== viewType) {
      return [(0,_edit_utils_date_utils__WEBPACK_IMPORTED_MODULE_5__.formatHeading)(viewType, start, end)];
    }
    return (calendar.units || [calendar]).map((unit, index) => {
      // The 15th: a timezone offset cannot move it to another month.
      const mid = new Date(start.getFullYear(), start.getMonth() + index, 15);
      return (0,_edit_utils_date_utils__WEBPACK_IMPORTED_MODULE_5__.formatHeading)('month', mid, mid);
    });
  }, [viewType, dateRange, calendar]);

  // Resolve which day is currently "live"/editable: keep the previously
  // active date if it still exists in this month, otherwise fall back to
  // today (or the 1st) so the preview always has a live cell to show.
  const resolvedActiveDate = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useMemo)(() => {
    const days = calendar.weeks.flat();
    if (days.some(day => day.date === activeDate)) {
      return activeDate;
    }
    return (0,_edit_utils_calendar_utils__WEBPACK_IMPORTED_MODULE_7__.getDefaultActiveDate)(calendar);
  }, [calendar, activeDate]);

  // Retrieve the real week/day template blocks so previews can clone their
  // actual inner content (Day Number, Post Title, Event Date, etc.) and
  // mirror their own color/border styling (e.g. a custom background).
  const {
    dayInnerBlocks,
    dayBlockAttributes,
    weekBlockAttributes
  } = (0,_edit_hooks_useCalendarDayTemplate__WEBPACK_IMPORTED_MODULE_10__.useCalendarDayTemplate)(clientId);
  const blockClasses = [`is-view-${viewType}`, dateRange.unitCount > 1 ? 'has-multiple-units' : ''].filter(Boolean).join(' ');
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
    className: blockClasses,
    style: {
      '--gatherpress-calendar-units': dateRange.unitCount
    }
  });

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
    template: _edit_constants__WEBPACK_IMPORTED_MODULE_4__.CALENDAR_TEMPLATE,
    templateLock: false,
    // TODO: Consider 'contentOnly', which is nice here.
    renderAppender: false
  });
  const blockGap = attributes.style?.spacing?.blockGap;
  const tableGap = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.__experimentalGetGapCSSValue)(blockGap);
  // Day cells subtract the column gaps to stay square (calendar-day/style.scss),
  // so pass one length: the 'left' side of a split gap, and '0px' for '0'.
  const columnGap = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.__experimentalGetGapCSSValue)(blockGap && 'object' === typeof blockGap ? blockGap.left ?? '1px' : blockGap);
  const tableStyle = {
    gap: tableGap,
    ...(columnGap ? {
      '--gatherpress-calendar-column-gap': '0' === columnGap ? '0px' : columnGap
    } : {}),
    '--gatherpress-calendar-columns': (0,_edit_utils_calendar_utils__WEBPACK_IMPORTED_MODULE_7__.getColumnsCount)(viewType, showWeekends, dateRange.unitCount)
  };
  const weekContext = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useMemo)(() => ({
    'gatherpress/viewType': viewType,
    'gatherpress/year': dateRange.year,
    'gatherpress/month': dateRange.month,
    'gatherpress/startDate': dateRange.startDate,
    'gatherpress/endDate': dateRange.endDate
  }), [viewType, dateRange]);
  if (!query) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("div", {
      ...blockProps,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Placeholder, {
        icon: "calendar-alt",
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('GatherPress Calendar', 'gatherpress-calendar'),
        instructions: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('This block must be used inside a Query Loop block.', 'gatherpress-calendar')
      })
    });
  }
  const handleDateChange = value => {
    setAttributes({
      selectedDate: value
    });
    setShowMonthPicker(false);
  };
  const handleModifierChange = value => {
    const numValue = value === '' ? 0 : parseInt(value, 10);
    setAttributes({
      dateModifier: isNaN(numValue) ? 0 : numValue
    });
  };
  const handleUnitCountChange = value => {
    const count = parseInt(value, 10);
    setAttributes({
      unitCount: isNaN(count) || count < 1 ? 1 : count
    });
  };
  const handleSourcePostTypeChange = newType => {
    setAttributes({
      sourcePostType: newType,
      postId: 0
    });
  };
  const separator = (0,_edit_utils_source_utils__WEBPACK_IMPORTED_MODULE_6__.getDatetimeSeparator)();
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Calendar Settings', 'gatherpress-calendar'),
        children: [showMonthPicker ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_edit_components_MonthPicker__WEBPACK_IMPORTED_MODULE_12__.MonthPicker, {
          selectedMonth: selectedDate,
          onSelect: handleDateChange,
          onCancel: () => setShowMonthPicker(false)
        }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_edit_components_DateControls__WEBPACK_IMPORTED_MODULE_13__.DateControls, {
          clientId: clientId,
          context: context,
          viewType: viewType,
          onViewTypeChange: val => setAttributes({
            viewType: val
          }),
          unitCount: unitCount,
          onUnitCountChange: handleUnitCountChange,
          selectedDate: hasPostDates ? `${dateRange.startDate} ${separator} ${dateRange.endDate}` : selectedDate,
          dateModifier: dateModifier,
          onDateChange: handleDateChange,
          onModifierChange: handleModifierChange,
          onOpenPicker: () => setShowMonthPicker(true),
          dateRangeSource: dateRangeSource,
          onSourceChange: val => setAttributes({
            dateRangeSource: val
          }),
          postId: postId,
          onPostIdChange: val => setAttributes({
            postId: val
          }),
          sourcePostType: sourcePostType,
          onPostTypeChange: handleSourcePostTypeChange,
          postTitle: sourcePostDates.postTitle,
          hasPostDates: hasPostDates,
          hasCurrentSupport: hasCurrentSupport
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Weekdays', 'gatherpress-calendar'),
          checked: showWeekdays,
          onChange: value => setAttributes({
            showWeekdays: value
          }),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Display the days of the week inside the calendar header.', 'gatherpress-calendar')
        }), 'day' !== viewType && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Weekends', 'gatherpress-calendar'),
          checked: showWeekends,
          onChange: value => setAttributes({
            showWeekends: value
          }),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Display weekend days in the calendar grid.', 'gatherpress-calendar')
        })]
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("div", {
      ...blockProps,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_edit_components_CalendarTable__WEBPACK_IMPORTED_MODULE_14__.CalendarTable, {
        calendar: calendar,
        captions: captions,
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
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _CalendarWeek__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CalendarWeek */ "./src/calendar/edit/components/CalendarWeek.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);



/**
 * CalendarTable Component
 *
 * Renders the calendar grid as virtual instances of the real
 * gatherpress/calendar-week (and, within it, gatherpress/calendar-day)
 * blocks. Supports multi-unit layouts (e.g. multi-month display).
 *
 * @since 0.1.0
 *
 * @param {Object}   props                     Component props.
 * @param {Object}   props.calendar            Calendar data structure.
 * @param {string[]} props.captions            Visually hidden caption of each table.
 * @param {boolean}  props.showWeekdays        Whether to show weekday headers.
 * @param {Object}   props.style               Table style.
 * @param {string}   props.activeDate          Currently live/editable date.
 * @param {Function} props.setActiveDate       Setter for active date.
 * @param {Object}   props.weekContext         Base context shared by all weeks.
 * @param {Element}  props.liveWeekChildren    Live week inner blocks.
 * @param {Array}    props.dayInnerBlocks      Day template inner blocks.
 * @param {Object}   props.weekBlockAttributes Attributes of week block.
 * @param {Object}   props.dayBlockAttributes  Attributes of day block.
 * @param {Object}   props.tbodyProps          Tbody element props.
 *
 * @return {Element} Calendar table component.
 */

function CalendarTable({
  calendar,
  captions = [],
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
  const units = calendar.units || [{
    dayNames: calendar.dayNames,
    weeks: calendar.weeks
  }];
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.Fragment, {
    children: units.map((unit, unitIndex) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("table", {
      className: "gatherpress-calendar__table",
      style: style,
      children: [captions[unitIndex] && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("caption", {
        className: "gatherpress--screen-reader-text",
        children: captions[unitIndex]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("thead", {
        className: showWeekdays ? undefined : 'gatherpress--screen-reader-text',
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("tr", {
          children: [unit.weekNumbers && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("th", {
            scope: "col",
            className: "gatherpress--screen-reader-text",
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__._x)('Week', 'week number column header', 'gatherpress-calendar')
          }), unit.dayNames.map((dayName, index) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("th", {
            scope: "col",
            children: dayName
          }, index))]
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("tbody", {
        ...tbodyProps,
        children: unit.weeks.map((week, weekIndex) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_CalendarWeek__WEBPACK_IMPORTED_MODULE_1__.CalendarWeek, {
          week: week,
          weekIndex: weekIndex,
          weekNumber: unit.weekNumbers?.[weekIndex] ?? 0,
          activeDate: activeDate,
          setActiveDate: setActiveDate,
          weekContext: weekContext,
          liveWeekChildren: liveWeekChildren,
          dayInnerBlocks: dayInnerBlocks,
          weekBlockAttributes: weekBlockAttributes,
          dayBlockAttributes: dayBlockAttributes
        }, weekIndex))
      })]
    }, unitIndex))
  });
}

/***/ },

/***/ "./src/calendar/edit/components/CalendarWeek.js"
/*!******************************************************!*\
  !*** ./src/calendar/edit/components/CalendarWeek.js ***!
  \******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CalendarWeek: () => (/* binding */ CalendarWeek)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _WeekPreviewRow__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./WeekPreviewRow */ "./src/calendar/edit/components/WeekPreviewRow.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);




/**
 * CalendarWeek Component
 *
 * Renders an individual week row within the calendar table.
 *
 * One week is rendered live/editable using `liveWeekChildren`, while all
 * other weeks render as a read-only `WeekPreviewRow`. The context value
 * is memoized per-week so inactive preview rows keep their context reference
 * and bail out of re-rendering during unrelated editor state updates.
 *
 * @since 0.5.0
 *
 * @param {Object}   props                     Component props.
 * @param {Array}    props.week                Week day entries.
 * @param {number}   props.weekIndex           Index of this week in the unit.
 * @param {number}   props.weekNumber          ISO week number, 0 for none.
 * @param {string}   props.activeDate          Currently live/editable date.
 * @param {Function} props.setActiveDate       Setter for active date.
 * @param {Object}   props.weekContext         Base context shared by all weeks.
 * @param {Element}  props.liveWeekChildren    Live week inner blocks.
 * @param {Array}    props.dayInnerBlocks      Day template inner blocks.
 * @param {Object}   props.weekBlockAttributes Attributes of week block.
 * @param {Object}   props.dayBlockAttributes  Attributes of day block.
 *
 * @return {Element} Calendar week element.
 */

function CalendarWeek({
  week,
  weekIndex,
  weekNumber,
  activeDate,
  setActiveDate,
  weekContext,
  liveWeekChildren,
  dayInnerBlocks,
  weekBlockAttributes,
  dayBlockAttributes
}) {
  // Annotate week days with row boundary wrap flags for multi-day events.
  const annotatedWeek = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    const totalCols = week.length;
    return week.map((day, colIndex) => {
      if (!day.posts || !day.posts.length) {
        return day;
      }

      // First column of row OR first day after leading padding cells.
      const isFirstCol = colIndex === 0 || Boolean(week[colIndex - 1]?.isEmpty);

      // Last column of row OR last day before trailing padding cells.
      const isLastCol = colIndex === totalCols - 1 || Boolean(week[colIndex + 1]?.isEmpty);
      const annotatedPosts = day.posts.map(post => {
        const totalDays = post.totalDays ?? 1;
        const dayIndex = post.dayIndex ?? 1;
        if (totalDays <= 1) {
          return {
            ...post,
            rowSpan: 1
          };
        }
        let colsLeft = 0;
        for (let c = colIndex; c < totalCols; c++) {
          if (!week[c]?.isEmpty) {
            colsLeft++;
          }
        }
        const rowSpan = Math.max(1, Math.min(totalDays - dayIndex + 1, colsLeft));
        return {
          ...post,
          isContinued: isFirstCol && dayIndex > 1,
          isContinues: isLastCol && dayIndex < totalDays,
          rowSpan
        };
      });
      return {
        ...day,
        posts: annotatedPosts
      };
    });
  }, [week]);
  const isActiveWeek = annotatedWeek.some(day => day.date === activeDate);

  // Memoized so each week's context object keeps its reference across renders
  // that don't change the calendar or active date.
  const weekContextValue = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => ({
    ...weekContext,
    'gatherpress/weekIndex': weekIndex,
    'gatherpress/weekDays': annotatedWeek,
    'gatherpress/weekNumber': weekNumber,
    'gatherpress/activeDate': activeDate,
    'gatherpress/setActiveDate': setActiveDate
  }), [weekContext, weekIndex, annotatedWeek, weekNumber, activeDate, setActiveDate]);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.BlockContextProvider, {
    value: weekContextValue,
    children: isActiveWeek ? liveWeekChildren : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_WeekPreviewRow__WEBPACK_IMPORTED_MODULE_2__.WeekPreviewRow, {
      week: annotatedWeek,
      weekNumber: weekNumber,
      dayInnerBlocks: dayInnerBlocks,
      weekBlockAttributes: weekBlockAttributes,
      dayBlockAttributes: dayBlockAttributes,
      onActivateDay: setActiveDate
    })
  });
}

/***/ },

/***/ "./src/calendar/edit/components/DateControls.js"
/*!******************************************************!*\
  !*** ./src/calendar/edit/components/DateControls.js ***!
  \******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DateControls: () => (/* binding */ DateControls)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _utils_calendar_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/calendar-utils */ "./src/calendar/edit/utils/calendar-utils.js");
/* harmony import */ var _hooks_useDateOffsetHelp__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../hooks/useDateOffsetHelp */ "./src/calendar/edit/hooks/useDateOffsetHelp.js");
/* harmony import */ var _SourcePostControls__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./SourcePostControls */ "./src/calendar/edit/components/SourcePostControls.js");
/* harmony import */ var _ShadowSourceFilterControls__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./ShadowSourceFilterControls */ "./src/calendar/edit/components/ShadowSourceFilterControls.js");
/* harmony import */ var _utils_source_utils__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/source-utils */ "./src/calendar/edit/utils/source-utils.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__);
/**
 * DateControls component managing calendar navigation and settings.
 *
 * @package
 * @since 0.1.0
 */


/* eslint-disable @wordpress/no-unsafe-wp-apis */

/* eslint-enable @wordpress/no-unsafe-wp-apis */







const MAX_UNITS = {
  month: 12,
  week: 5,
  day: 7
};

/**
 * DateControls Component.
 *
 * @param {Object}   props                   Component props.
 * @param {string}   props.clientId          Calendar block client ID.
 * @param {Object}   props.context           Block context dictionary.
 * @param {string}   props.viewType          View type ('month', 'week', 'day').
 * @param {Function} props.onViewTypeChange  Callback when viewType changes.
 * @param {number}   props.unitCount         Number of units to show.
 * @param {Function} props.onUnitCountChange Callback when unitCount changes.
 * @param {string}   props.selectedDate      Selected date/month.
 * @param {number}   props.dateModifier      Date offset value.
 * @param {Function} props.onDateChange      Callback when date changes.
 * @param {Function} props.onModifierChange  Callback when modifier changes.
 * @param {Function} props.onOpenPicker      Callback to open month picker.
 * @param {string}   props.dateRangeSource   Source mode ('default', 'context', 'selected').
 * @param {Function} props.onSourceChange    Callback when source changes.
 * @param {number}   props.postId            Selected post ID.
 * @param {Function} props.onPostIdChange    Callback when post ID changes.
 * @param {string}   props.sourcePostType    Selected post type.
 * @param {Function} props.onPostTypeChange  Callback when post type changes.
 * @param {string}   props.postTitle         Resolved post title.
 * @param {boolean}  props.hasPostDates      Whether post dates are actively driving the range.
 * @param {boolean}  props.hasCurrentSupport Whether context post type supports events.
 *
 * @return {Element} Date controls component.
 */
function DateControls({
  clientId,
  context = {},
  viewType,
  onViewTypeChange,
  unitCount,
  onUnitCountChange,
  selectedDate,
  dateModifier,
  onDateChange,
  onModifierChange,
  onOpenPicker,
  dateRangeSource = _utils_source_utils__WEBPACK_IMPORTED_MODULE_7__.DATE_SOURCE_DEFAULT,
  onSourceChange,
  postId = 0,
  onPostIdChange,
  sourcePostType = '',
  onPostTypeChange,
  postTitle = '',
  hasPostDates = false,
  hasCurrentSupport = false
}) {
  const monthOptions = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => (0,_utils_calendar_utils__WEBPACK_IMPORTED_MODULE_3__.generateMonthOptions)(), []);
  const offsetHelp = (0,_hooks_useDateOffsetHelp__WEBPACK_IMPORTED_MODULE_4__.useDateOffsetHelp)(dateModifier, viewType);
  const maxUnits = MAX_UNITS[viewType] || 12;
  const isPostAnchored = (0,_utils_source_utils__WEBPACK_IMPORTED_MODULE_7__.isPostDateSource)(dateRangeSource);
  const isDefaultMode = !isPostAnchored;
  const handleViewTypeChange = newViewType => {
    const newMax = MAX_UNITS[newViewType] || 12;
    if (Number(unitCount) > newMax) {
      onUnitCountChange(newMax);
    }
    onViewTypeChange(newViewType);
  };
  const handleUnitCountChange = nextValue => {
    const num = Number(nextValue);
    if (!Number.isNaN(num) && num > maxUnits) {
      onUnitCountChange(maxUnits);
      return;
    }
    onUnitCountChange(nextValue);
  };
  const stepLabel = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => {
    if ('day' === viewType) {
      return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Days from current', 'gatherpress-calendar');
    }
    if ('week' === viewType) {
      return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Weeks from current', 'gatherpress-calendar');
    }
    return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Months from current', 'gatherpress-calendar');
  }, [viewType]);
  const unitCountLabel = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => {
    if ('day' === viewType) {
      return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Number of days to show', 'gatherpress-calendar');
    }
    if ('week' === viewType) {
      return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Number of weeks to show', 'gatherpress-calendar');
    }
    return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Number of months to show', 'gatherpress-calendar');
  }, [viewType]);
  const selectionLabel = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => {
    if ((0,_utils_source_utils__WEBPACK_IMPORTED_MODULE_7__.isSelectedDateSource)(dateRangeSource)) {
      if (hasPostDates) {
        let label = selectedDate;
        if (postTitle) {
          label = `${postTitle} (${selectedDate})`;
        }
        return label;
      }
      if (postId > 0) {
        return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Loading event dates…', 'gatherpress-calendar');
      }
      return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('No source post selected.', 'gatherpress-calendar');
    }
    if ((0,_utils_source_utils__WEBPACK_IMPORTED_MODULE_7__.isContextDateSource)(dateRangeSource)) {
      if (hasPostDates) {
        let label = selectedDate;
        if (postTitle) {
          label = `${postTitle} (${selectedDate})`;
        }
        return label;
      }
      return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('No event dates detected on the current post.', 'gatherpress-calendar');
    }
    if (selectedDate) {
      if ('month' === viewType) {
        const match = monthOptions.find(o => o.value === selectedDate);
        return match?.label || selectedDate;
      }
      return selectedDate;
    }
    if ('day' === viewType) {
      return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Current Day', 'gatherpress-calendar');
    }
    if ('week' === viewType) {
      return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Current Week', 'gatherpress-calendar');
    }
    return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Current Month', 'gatherpress-calendar');
  }, [dateRangeSource, hasPostDates, postTitle, selectedDate, postId, viewType, monthOptions]);
  const unitLabel = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => {
    if ('day' === viewType) {
      return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('day(s)', 'gatherpress-calendar');
    }
    if ('week' === viewType) {
      return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('week(s)', 'gatherpress-calendar');
    }
    return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('month(s)', 'gatherpress-calendar');
  }, [viewType]);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_SourcePostControls__WEBPACK_IMPORTED_MODULE_5__.SourcePostControls, {
      dateRangeSource: dateRangeSource,
      onSourceChange: onSourceChange,
      postId: postId,
      onPostIdChange: onPostIdChange,
      sourcePostType: sourcePostType,
      onPostTypeChange: onPostTypeChange,
      hasCurrentSupport: hasCurrentSupport
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_ShadowSourceFilterControls__WEBPACK_IMPORTED_MODULE_6__.ShadowSourceFilterControls, {
      clientId: clientId,
      context: context,
      dateRangeSource: dateRangeSource,
      postId: postId,
      sourcePostType: sourcePostType
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.SelectControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Calendar View', 'gatherpress-calendar'),
      value: viewType,
      options: [{
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Month', 'gatherpress-calendar'),
        value: 'month'
      }, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Week', 'gatherpress-calendar'),
        value: 'week'
      }, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Day', 'gatherpress-calendar'),
        value: 'day'
      }],
      onChange: handleViewTypeChange
    }), isDefaultMode && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalNumberControl, {
      label: unitCountLabel,
      labelPosition: "side",
      type: "number",
      value: unitCount,
      onChange: handleUnitCountChange,
      min: 1,
      max: maxUnits,
      step: 1,
      style: {
        marginBottom: '16px'
      }
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
      style: {
        marginBottom: '16px',
        padding: '8px',
        background: '#f0f0f1',
        borderRadius: '4px'
      },
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("strong", {
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Current Selection:', 'gatherpress-calendar')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("br", {}), selectionLabel, !selectedDate && isDefaultMode && 0 !== dateModifier && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.Fragment, {
        children: [' ', dateModifier > 0 ? `+${dateModifier}` : dateModifier, ' ', unitLabel]
      })]
    }), isDefaultMode && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.Fragment, {
      children: ['month' === viewType ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
        variant: "primary",
        onClick: onOpenPicker,
        __next40pxDefaultSize: true,
        style: {
          width: '100%',
          marginBottom: '8px'
        },
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Change Month', 'gatherpress-calendar')
      }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.TextControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Specific Date (YYYY-MM-DD)', 'gatherpress-calendar'),
        type: "date",
        value: selectedDate,
        onChange: onDateChange,
        style: {
          marginBottom: '8px'
        }
      }), selectedDate && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
        onClick: () => onDateChange(''),
        variant: "secondary",
        __next40pxDefaultSize: true,
        style: {
          width: '100%',
          marginBottom: '8px'
        },
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Reset to Current', 'gatherpress-calendar')
      }), !selectedDate && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.Fragment, {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("p", {
          style: {
            marginTop: '16px',
            marginBottom: '8px',
            fontWeight: '500'
          },
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Date Offset', 'gatherpress-calendar')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalNumberControl, {
          label: stepLabel,
          labelPosition: "side",
          type: "number",
          value: dateModifier,
          onChange: onModifierChange,
          min: -52,
          max: 52,
          step: 1,
          help: offsetHelp
        }), 0 !== dateModifier && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
          onClick: () => onModifierChange(0),
          variant: "secondary",
          __next40pxDefaultSize: true,
          style: {
            width: '100%',
            marginBottom: '8px'
          },
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Reset Offset', 'gatherpress-calendar')
        })]
      })]
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
/* harmony import */ var _wordpress_date__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/date */ "@wordpress/date");
/* harmony import */ var _wordpress_date__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_date__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _utils_day_number__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../utils/day-number */ "./src/utils/day-number.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);
/**
 * DayPreviewCell Component
 *
 * @package
 * @since 0.4.0
 */






/**
 * Strips top-level event-date blocks from entries on multi-day/all-day spans.
 *
 * @param {Array} blocks Day template inner blocks.
 * @return {Array} Sanitized blocks.
 */

function stripMultiDayEventDates(blocks = []) {
  return (blocks ?? []).map(block => {
    if (block.name === 'gatherpress/calendar-entries' && block.innerBlocks) {
      return {
        ...block,
        innerBlocks: block.innerBlocks.map(inner => {
          if (inner.name === 'gatherpress/modal-manager' && inner.innerBlocks) {
            return {
              ...inner,
              innerBlocks: inner.innerBlocks.filter(b => b.name !== 'gatherpress/event-date')
            };
          }
          return inner;
        })
      };
    }
    return block;
  });
}

/**
 * Clones inner blocks, resolving the Day Number bound block's content.
 * Filters out entries on empty days and strips multi-day start times.
 *
 * @param {Array}  blocks Real inner blocks to preview.
 * @param {Object} day    Day data (day, isEmpty, posts).
 * @param {boolean} isRibbon Whether the day block is in ribbon style.
 * @return {Array} Resolved blocks.
 */
function withResolvedDayContent(blocks, day, isRibbon) {
  const hasPosts = (day.posts?.length ?? 0) > 0;
  const hasMultiDay = day.posts?.some(p => (p.totalDays ?? 1) > 1 || p.isAllDay);
  let processedBlocks = (blocks ?? []).filter(block => {
    if (!hasPosts) {
      return (0,_utils_day_number__WEBPACK_IMPORTED_MODULE_3__.isDayNumberBindingBlock)(block);
    }
    return true;
  });
  if (isRibbon && hasMultiDay) {
    processedBlocks = stripMultiDayEventDates(processedBlocks);
  }
  return processedBlocks.map(block => {
    if (!(0,_utils_day_number__WEBPACK_IMPORTED_MODULE_3__.isDayNumberBindingBlock)(block)) {
      return block;
    }
    const format = block.attributes?.metadata?.bindings?.content?.args?.format || '';
    let content = '';
    if (!day.isEmpty) {
      if (day.date && format !== '') {
        const dateObj = new Date(`${day.date}T12:00:00Z`);
        content = (0,_wordpress_date__WEBPACK_IMPORTED_MODULE_2__.dateI18n)(format, dateObj, 'UTC');
      } else {
        content = String(day.day ?? '');
      }
    }
    return {
      ...block,
      attributes: {
        ...block.attributes,
        content,
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

  // Directly check if gatherpress/calendar-day has the ribbon style
  const isRibbon = Boolean(dayBlockAttributes?.className?.includes('is-style-ribbon'));
  const hasDayNumberBlock = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => (innerBlocks ?? []).some(_utils_day_number__WEBPACK_IMPORTED_MODULE_3__.isDayNumberBindingBlock), [innerBlocks]);
  const resolvedBlocks = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => withResolvedDayContent(innerBlocks, day, isRibbon), [innerBlocks, day, isRibbon]);

  // Mirror the real calendar-day block's own color/border/spacing/shadow
  // styling (e.g. a custom background, padding, or drop-shadow) so every
  // previewed day looks like the live one.
  const colorProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.__experimentalUseColorProps)(dayBlockAttributes ?? {});
  const borderProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.__experimentalUseBorderProps)(dayBlockAttributes ?? {});
  const spacingProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.__experimentalGetSpacingClassesAndStyles)(dayBlockAttributes ?? {});
  const shadowProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.__experimentalGetShadowClassesAndStyles)(dayBlockAttributes ?? {});
  const layoutProps = (0,_utils_day_number__WEBPACK_IMPORTED_MODULE_3__.getLayoutProps)(dayBlockAttributes?.layout);
  // console.group("getLayoutProps");
  // console.log(dayBlockAttributes);
  // console.log(colorProps.className);
  // console.log(layoutProps.className);
  // console.log(layoutProps.style);
  // console.groupEnd();
  const isPast = !day.isEmpty && !day.isToday && day.isPast;
  const isFuture = !day.isEmpty && !day.isToday && day.isFuture;
  const classNames = ['gatherpress-calendar__day', day.isEmpty ? 'is-empty' : '', day.isToday ? 'is-today' : '', isPast ? 'is-past' : '', isFuture ? 'is-future' : '', day.posts?.length > 0 ? 'has-posts' : '', day.posts?.some(p => (p.totalDays ?? 1) > 1 || p.isAllDay) ? 'has-multi-day-event' : '', day.isWeekend ? 'is-weekend' : '', day.weekday ? `is-${day.weekday}` : '', isRibbon ? 'is-style-ribbon' : '', colorProps.className, borderProps.className].filter(Boolean).join(' ');
  const style = {
    ...colorProps.style,
    ...borderProps.style,
    ...spacingProps.style,
    ...shadowProps.style
    // ...layoutProps.style,
  };

  // Ribbon mode locks layout to column; Classic mode uses user/default layoutProps
  const previewLayoutStyles = isRibbon ? {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    width: '100%',
    minWidth: 0
  } : {
    ...layoutProps.style,
    gap: (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.__experimentalGetGapCSSValue)(dayBlockAttributes?.style?.spacing?.blockGap)
  };
  const blockPreviewProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.__experimentalUseBlockPreview)({
    blocks: resolvedBlocks,
    props: {
      className: isRibbon ? 'gatherpress-calendar__day-preview' : layoutProps.className || undefined,
      style: previewLayoutStyles
    }
  });
  if (day.isEmpty) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("td", {
      className: classNames,
      style: style
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.BlockContextProvider, {
    value: dayContext,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("td", {
      className: classNames,
      style: style,
      role: "button",
      tabIndex: 0,
      onClick: onActivate,
      onKeyPress: onActivate,
      children: [!hasDayNumberBlock && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
        className: "gatherpress-calendar__day-number",
        children: day.day
      }), resolvedBlocks.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
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

/***/ "./src/calendar/edit/components/ShadowSourceFilterControls.js"
/*!********************************************************************!*\
  !*** ./src/calendar/edit/components/ShadowSourceFilterControls.js ***!
  \********************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ShadowSourceFilterControls: () => (/* binding */ ShadowSourceFilterControls)
/* harmony export */ });
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _gatherpress_query_controls__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @gatherpress/query-controls */ "@gatherpress/query-controls");
/* harmony import */ var _gatherpress_query_controls__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_gatherpress_query_controls__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _utils_source_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/source-utils */ "./src/calendar/edit/utils/source-utils.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);
/**
 * ShadowSourceFilterControls component.
 *
 * Reuses GatherPress's published ShadowSourceFilterControls from `@gatherpress/query-controls`
 * to expose "Filter by current {source}" in the Calendar inspector panel.
 *
 * @package
 * @since 0.8.0
 */





// eslint-disable-next-line import/no-unresolved



/**
 * Renders GatherPress's ShadowSourceFilterControls scoped to the calendar's parent Query block.
 *
 * All hooks are called unconditionally at the top of the component to preserve React 18 fiber stability.
 *
 * @param {Object} props                 Component props.
 * @param {string} props.clientId        Calendar block client ID.
 * @param {string} props.dateRangeSource Source mode ('default', 'context', 'selected').
 * @param {number} props.postId          Selected post ID in 'selected' mode.
 * @param {string} props.sourcePostType  Selected post type in 'selected' mode.
 * @param {Object} props.context         Block context dictionary.
 *
 * @return {Element|null} The GatherPress control or null.
 */

function ShadowSourceFilterControls({
  clientId,
  dateRangeSource = 'default',
  postId = 0,
  sourcePostType = '',
  context = {}
}) {
  const isContext = (0,_utils_source_utils__WEBPACK_IMPORTED_MODULE_4__.isContextDateSource)(dateRangeSource);
  const isSelected = (0,_utils_source_utils__WEBPACK_IMPORTED_MODULE_4__.isSelectedDateSource)(dateRangeSource);
  const isPostAnchored = isContext || isSelected && Number(postId) > 0;
  const {
    parentQueryId,
    parentQueryAttributes
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.useSelect)(select => {
    const {
      getBlockParentsByBlockName,
      getBlock
    } = select(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.store);
    const parents = getBlockParentsByBlockName(clientId, 'core/query');
    const pId = parents?.at(-1);
    const pBlock = pId ? getBlock(pId) : null;
    return {
      parentQueryId: pId,
      parentQueryAttributes: pBlock?.attributes
    };
  }, [clientId]);
  const {
    updateBlockAttributes
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.useDispatch)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.store);
  const setParentQueryAttributes = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useCallback)(newAttributes => {
    if (parentQueryId) {
      updateBlockAttributes(parentQueryId, newAttributes);
    }
  }, [parentQueryId, updateBlockAttributes]);
  const effectiveContext = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => {
    if (isSelected) {
      return {
        ...context,
        postId,
        postType: sourcePostType
      };
    }
    return context;
  }, [isSelected, context, postId, sourcePostType]);

  // Guard checks and early exits are strictly performed after all hooks have executed:
  if (!isPostAnchored || !parentQueryId || !parentQueryAttributes) {
    return null;
  }
  const Control = _gatherpress_query_controls__WEBPACK_IMPORTED_MODULE_3__.ShadowSourceFilterControls || window.gatherpress?.queryControls?.ShadowSourceFilterControls;
  if (!Control) {
    return null;
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
    style: {
      marginBottom: '16px'
    },
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(Control, {
      attributes: parentQueryAttributes,
      setAttributes: setParentQueryAttributes,
      context: effectiveContext
    })
  });
}

/***/ },

/***/ "./src/calendar/edit/components/SourcePostControls.js"
/*!************************************************************!*\
  !*** ./src/calendar/edit/components/SourcePostControls.js ***!
  \************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SourcePostControls: () => (/* binding */ SourcePostControls)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/core-data */ "@wordpress/core-data");
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _hooks_useEventPostTypes__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../hooks/useEventPostTypes */ "./src/calendar/edit/hooks/useEventPostTypes.js");
/* harmony import */ var _utils_source_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils/source-utils */ "./src/calendar/edit/utils/source-utils.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__);
/**
 * Inspector controls for date range source selection.
 *
 * @package
 * @since 0.8.0
 */


/* eslint-disable @wordpress/no-unsafe-wp-apis */

/* eslint-enable @wordpress/no-unsafe-wp-apis */






const EMPTY_RECORDS = [];

/**
 * SourcePostControls component.
 *
 * @param {Object}   props                   Component props.
 * @param {string}   props.dateRangeSource   Source mode ('default', 'context', 'selected').
 * @param {Function} props.onSourceChange    Callback when source changes.
 * @param {number}   props.postId            Selected post ID.
 * @param {Function} props.onPostIdChange    Callback when post ID changes.
 * @param {string}   props.sourcePostType    Selected source post type.
 * @param {Function} props.onPostTypeChange  Callback when post type changes.
 * @param {boolean}  props.hasCurrentSupport Whether context post type supports events.
 *
 * @return {Element} Source controls component.
 */
function SourcePostControls({
  dateRangeSource = _utils_source_utils__WEBPACK_IMPORTED_MODULE_6__.DATE_SOURCE_DEFAULT,
  onSourceChange,
  postId = 0,
  onPostIdChange,
  sourcePostType = '',
  onPostTypeChange,
  hasCurrentSupport = false
}) {
  const [searchFilter, setSearchFilter] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)('');
  const eventPostTypes = (0,_hooks_useEventPostTypes__WEBPACK_IMPORTED_MODULE_5__.useEventPostTypes)();
  const activeValue = (0,_utils_source_utils__WEBPACK_IMPORTED_MODULE_6__.normalizeDateSource)(dateRangeSource);
  const isSelected = (0,_utils_source_utils__WEBPACK_IMPORTED_MODULE_6__.isSelectedDateSource)(activeValue);
  let activePostType = sourcePostType;
  if (!activePostType) {
    activePostType = (0,_utils_source_utils__WEBPACK_IMPORTED_MODULE_6__.getDefaultEventPostType)(eventPostTypes);
  }
  const query = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useMemo)(() => {
    const baseQuery = {
      per_page: 100,
      // context: 'edit',
      status: ['publish'],
      // gatherpress_event_query: 'all',
      orderby: 'title',
      order: 'asc'
    };
    if (searchFilter) {
      return {
        ...baseQuery,
        search: searchFilter
      };
    }
    return baseQuery;
  }, [searchFilter]);
  const {
    records,
    isLoading
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.useSelect)(select => {
    if (!isSelected || !activePostType) {
      return {
        records: EMPTY_RECORDS,
        isLoading: false
      };
    }
    const {
      getEntityRecords,
      isResolving
    } = select(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_3__.store);
    const items = getEntityRecords('postType', activePostType, query);
    let resultRecords = EMPTY_RECORDS;
    if (items) {
      resultRecords = items;
    }
    return {
      records: resultRecords,
      isLoading: isResolving('getEntityRecords', ['postType', activePostType, query])
    };
  }, [isSelected, activePostType, query]);
  const postOptions = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useMemo)(() => {
    return records.map(post => {
      let title = `#${post.id}`;
      if (post.title?.raw) {
        title = post.title.raw;
      } else if (post.title?.rendered) {
        title = post.title.rendered;
      }
      let statusSuffix = '';
      if (post.status && 'publish' !== post.status) {
        statusSuffix = ` (${post.status})`;
      }
      return {
        value: String(post.id),
        label: `${title}${statusSuffix}`
      };
    });
  }, [records]);
  const handlePostTypeSelect = newType => {
    onPostTypeChange(newType);
  };
  const handleSourceChange = nextValue => {
    if (nextValue) {
      onSourceChange(nextValue);
    }
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
    style: {
      marginBottom: '16px'
    },
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.BaseControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Date Range Source', 'gatherpress-calendar'),
      id: "gatherpress-calendar-date-source",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalToggleGroupControl, {
        __nextHasNoMarginBottom: true,
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Date Range Source', 'gatherpress-calendar'),
        hideLabelFromVision: true,
        value: activeValue,
        onChange: handleSourceChange,
        isBlock: true,
        isDeselectable: false,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalToggleGroupControlOption, {
          value: _utils_source_utils__WEBPACK_IMPORTED_MODULE_6__.DATE_SOURCE_DEFAULT,
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Default', 'gatherpress-calendar')
        }), hasCurrentSupport && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalToggleGroupControlOption, {
          value: _utils_source_utils__WEBPACK_IMPORTED_MODULE_6__.DATE_SOURCE_CONTEXT,
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Current', 'gatherpress-calendar')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalToggleGroupControlOption, {
          value: _utils_source_utils__WEBPACK_IMPORTED_MODULE_6__.DATE_SOURCE_SELECTED,
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Specific', 'gatherpress-calendar')
        })]
      })
    }), isSelected && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
      style: {
        marginTop: '12px'
      },
      children: [eventPostTypes.length > 1 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.SelectControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Post Type', 'gatherpress-calendar'),
        value: activePostType,
        options: eventPostTypes.map(type => ({
          label: type.name || type.slug,
          value: type.slug
        })),
        onChange: handlePostTypeSelect
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ComboboxControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Source Post', 'gatherpress-calendar'),
        value: postId ? String(postId) : '',
        options: postOptions,
        onChange: val => onPostIdChange(val ? Number(val) : 0),
        onFilterValueChange: setSearchFilter,
        isLoading: isLoading
      })]
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
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _DayPreviewCell__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./DayPreviewCell */ "./src/calendar/edit/components/DayPreviewCell.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);





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
 * @param {number}   props.weekNumber          - ISO week number, 0 for none.
 * @param {Array}    props.dayInnerBlocks      - The real day template's inner blocks, for previews.
 * @param {Object}   props.weekBlockAttributes - The real calendar-week block's own attributes, for style parity.
 * @param {Object}   props.dayBlockAttributes  - The real calendar-day block's own attributes, for style parity.
 * @param {Function} props.onActivateDay       - Called with a day's date when that day is clicked.
 *
 * @return {Element} Week row preview element.
 */

function WeekPreviewRowComponent({
  week,
  weekNumber,
  dayInnerBlocks,
  weekBlockAttributes,
  dayBlockAttributes,
  onActivateDay
}) {
  // Mirror the real calendar-week block's own color/spacing/shadow
  // styling so every previewed week row looks like the live one.
  const colorProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.__experimentalUseColorProps)(weekBlockAttributes ?? {});
  const classNames = ['gatherpress-calendar__week', colorProps.className].filter(Boolean).join(' ');
  const style = {
    ...colorProps.style
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("tr", {
    className: classNames,
    style: style,
    children: [weekNumber > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("th", {
      scope: "row",
      className: "gatherpress--screen-reader-text",
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.sprintf)(/* translators: %d: ISO 8601 week number. */
      (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Week %d', 'gatherpress-calendar'), weekNumber)
    }), week.map((day, dayIndex) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_DayPreviewCell__WEBPACK_IMPORTED_MODULE_3__.DayPreviewCell, {
      day: day,
      innerBlocks: dayInnerBlocks,
      dayBlockAttributes: dayBlockAttributes,
      onActivateDay: onActivateDay
    }, day.date ?? `empty-${dayIndex}`))]
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
/* harmony export */   ENTRY_MODAL_MANAGER_ATTRIBUTES: () => (/* binding */ ENTRY_MODAL_MANAGER_ATTRIBUTES),
/* harmony export */   ENTRY_START_TIME: () => (/* binding */ ENTRY_START_TIME),
/* harmony export */   ENTRY_TITLE_TRIGGER: () => (/* binding */ ENTRY_TITLE_TRIGGER),
/* harmony export */   QUERY_VARIATION_INNER_BLOCKS: () => (/* binding */ QUERY_VARIATION_INNER_BLOCKS)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);


/**
 * The start time of an entry, as plain text.
 * Shared by ENTRIES_TEMPLATE and the transform in ../transforms.js.
 */
const ENTRY_START_TIME = ['gatherpress/event-date', {
  displayType: 'start',
  startDateFormat: 'G:i',
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
}];

/**
 * The linked event title that opens the modal.
 * Shared by ENTRIES_TEMPLATE and the transform in ../transforms.js.
 */
/**
 * Attributes of the Modal Manager in an entry: the time above the title,
 * with no gap between them. The default flex row with the theme's block gap
 * leaves a large space in a narrow day cell.
 * Shared by ENTRIES_TEMPLATE and the transform in ../transforms.js.
 */
const ENTRY_MODAL_MANAGER_ATTRIBUTES = {
  layout: {
    type: 'flex',
    orientation: 'vertical',
    justifyContent: 'center'
  },
  style: {
    spacing: {
      blockGap: '0'
    }
  }
};
const ENTRY_TITLE_TRIGGER = ['core/post-title', {
  level: 0,
  isLink: true,
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
}];

/**
 * The inner template inside gatherpress/calendar-entries:
 * Modal Manager holding the start time, the linked event title that opens
 * the modal, and the popover modal content.
 *
 * The title is the trigger, so every event shows and announces its name.
 * The trigger class goes on core/post-title: GatherPress's Modal Manager
 * binds the element with the class or the tag right after it, and here
 * that tag is the title's link.
 */
const ENTRIES_TEMPLATE = [['gatherpress/modal-manager', ENTRY_MODAL_MANAGER_ATTRIBUTES, [ENTRY_START_TIME, ENTRY_TITLE_TRIGGER, ['gatherpress/modal', {}, [['gatherpress/modal-content', {
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
  className: 'gatherpress-calendar__day-number',
  fontSize: 'small',
  placeholder: 'DD',
  content: 'DD',
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
  metadata: {
    bindings: {
      content: {
        source: 'gatherpress/calendar-day'
      }
    },
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__._x)('Day Number', 'Block variation name', 'gatherpress-calendar')
  }
}], ['gatherpress/calendar-entries', {
  layout: {
    type: 'default'
  },
  className: 'is-style-default',
  style: {
    spacing: {
      blockGap: '0'
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
  className: 'gatherpress-calendar__heading has-text-align-center',
  typography: {
    textAlign: 'center'
  },
  metadata: {
    bindings: {
      content: {
        source: 'gatherpress/calendar-heading'
      }
    },
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__._x)('Calendar Heading', 'Query template heading block name', 'gatherpress-calendar')
  }
}], ['core/query-pagination', {
  className: 'gatherpress-calendar-pagination',
  paginationArrow: 'chevron',
  layout: {
    type: 'flex',
    justifyContent: 'space-between'
  },
  metadata: {
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__._x)('Calendar Pagination', 'Query template pagination block name', 'gatherpress-calendar')
  }
}, [['core/query-pagination-previous', {
  className: 'gatherpress-calendar-pagination-previous',
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Previous Month', 'gatherpress-calendar'),
  metadata: {
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__._x)('Previous Calendar Period', 'Query template previous pagination block name', 'gatherpress-calendar')
  }
}], ['core/query-pagination-next', {
  className: 'gatherpress-calendar-pagination-next',
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Next Month', 'gatherpress-calendar'),
  metadata: {
    name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__._x)('Next Calendar Period', 'Query template next pagination block name', 'gatherpress-calendar')
  }
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
/* harmony import */ var _wordpress_date__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/date */ "@wordpress/date");
/* harmony import */ var _wordpress_date__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_date__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/core-data */ "@wordpress/core-data");
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _utils_calendar_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/calendar-utils */ "./src/calendar/edit/utils/calendar-utils.js");




const EMPTY_ARRAY = [];

/**
 * Hook to fetch posts and site settings for calendar rendering.
 *
 * @param {Object|null} query     Query Loop configuration.
 * @param {Object}      dateQuery Date query parameters.
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
    } = select(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_2__.store);

    // Create a clean query object.
    const cleanQuery = {
      ...query
    };

    // Build REST API query arguments.
    const queryArgs = {
      per_page: (0,_utils_calendar_utils__WEBPACK_IMPORTED_MODULE_3__.getPostsPerPage)(),
      _embed: 'wp:term'
    };
    if (dateQuery && dateQuery.startDate && dateQuery.endDate) {
      queryArgs.gatherpress_calendar_query = true;
      queryArgs.start_date = dateQuery.startDate;
      queryArgs.end_date = dateQuery.endDate;
    }

    // Forward shadow source filter parameters to scope events by source.
    if (cleanQuery.shadow_filter) {
      queryArgs.shadow_filter = cleanQuery.shadow_filter;
    }
    if (cleanQuery.gatherpress_shadow_source_post_id) {
      queryArgs.gatherpress_shadow_source_post_id = cleanQuery.gatherpress_shadow_source_post_id;
    }
    if (cleanQuery.gatherpress_shadow_source_post_type) {
      queryArgs.gatherpress_shadow_source_post_type = cleanQuery.gatherpress_shadow_source_post_type;
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
    const dateSettings = (0,_wordpress_date__WEBPACK_IMPORTED_MODULE_1__.getSettings)();
    const weekStartsOn = dateSettings?.l10n.startOfWeek || 0;
    const records = getEntityRecords('postType', query?.postType || 'post', queryArgs);
    return {
      posts: records ?? EMPTY_ARRAY,
      startOfWeek: weekStartsOn
    };
  }, [query, dateQuery]);
}

/***/ },

/***/ "./src/calendar/edit/hooks/useCalendarDayTemplate.js"
/*!***********************************************************!*\
  !*** ./src/calendar/edit/hooks/useCalendarDayTemplate.js ***!
  \***********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useCalendarDayTemplate: () => (/* binding */ useCalendarDayTemplate)
/* harmony export */ });
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utils_use_stable_value__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../utils/use-stable-value */ "./src/utils/use-stable-value.js");
/**
 * Hook to retrieve and stabilize the calendar-week and calendar-day template blocks.
 *
 * @package
 * @since 0.8.0
 */





/**
 * Returns stable references to the week and day template blocks inside the calendar.
 *
 * @param {string} clientId Calendar block client ID.
 * @return {Object} Day template blocks and attributes.
 */
function useCalendarDayTemplate(clientId) {
  return (0,_utils_use_stable_value__WEBPACK_IMPORTED_MODULE_2__.useStableValue)((0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.useSelect)(select => {
    const {
      getBlocks
    } = select(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.store);
    const weekBlock = getBlocks(clientId)[0];
    const dayBlock = weekBlock ? getBlocks(weekBlock.clientId)[0] : null;
    return {
      dayInnerBlocks: dayBlock ? getBlocks(dayBlock.clientId) : [],
      dayBlockAttributes: dayBlock?.attributes ?? {},
      weekBlockAttributes: weekBlock?.attributes ?? {}
    };
  }, [clientId]));
}

/***/ },

/***/ "./src/calendar/edit/hooks/useCalendarSync.js"
/*!****************************************************!*\
  !*** ./src/calendar/edit/hooks/useCalendarSync.js ***!
  \****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useCalendarSync: () => (/* binding */ useCalendarSync)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _utils_block_sync_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/block-sync-utils */ "./src/calendar/edit/utils/block-sync-utils.js");
/**
 * Hook to synchronize parent Query Loop, Heading, and Pagination names/labels.
 *
 * @package
 * @since 0.8.0
 */







/**
 * Synchronizes parent Query and child helper blocks with calendar settings.
 *
 * @param {Object} props           Hook properties.
 * @param {string} props.clientId  Client ID of the calendar block.
 * @param {string} props.viewType  Current view type ('month', 'week', 'day').
 * @param {number} props.unitCount Number of calendar units to show.
 */
function useCalendarSync({
  clientId,
  viewType,
  unitCount
}) {
  const {
    parentQueryClientId,
    parentQueryMetadata,
    headingClientId,
    headingMetadata,
    paginationContainerClientId,
    paginationContainerMetadata,
    paginationPrevClientId,
    paginationPrevMetadata,
    paginationNextClientId,
    paginationNextMetadata
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.useSelect)(select => {
    const {
      getBlockParentsByBlockName,
      getBlock
    } = select(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.store);
    const parents = getBlockParentsByBlockName(clientId, 'core/query');
    const parentId = parents?.[parents.length - 1];
    const parentBlock = parentId ? getBlock(parentId) : null;
    const headingBlock = parentBlock?.innerBlocks ? (0,_utils_block_sync_utils__WEBPACK_IMPORTED_MODULE_4__.findHeadingBlock)(parentBlock.innerBlocks) : null;
    const paginationBlock = parentBlock?.innerBlocks ? (0,_utils_block_sync_utils__WEBPACK_IMPORTED_MODULE_4__.findBlockByName)(parentBlock.innerBlocks, 'core/query-pagination') : null;
    const prevBlock = parentBlock?.innerBlocks ? (0,_utils_block_sync_utils__WEBPACK_IMPORTED_MODULE_4__.findBlockByName)(parentBlock.innerBlocks, 'core/query-pagination-previous') : null;
    const nextBlock = parentBlock?.innerBlocks ? (0,_utils_block_sync_utils__WEBPACK_IMPORTED_MODULE_4__.findBlockByName)(parentBlock.innerBlocks, 'core/query-pagination-next') : null;
    return {
      parentQueryClientId: parentId ?? null,
      parentQueryMetadata: parentBlock?.attributes?.metadata,
      headingClientId: headingBlock?.clientId ?? null,
      headingMetadata: headingBlock?.attributes?.metadata,
      paginationContainerClientId: paginationBlock?.clientId ?? null,
      paginationContainerMetadata: paginationBlock?.attributes?.metadata,
      paginationPrevClientId: prevBlock?.clientId ?? null,
      paginationPrevMetadata: prevBlock?.attributes?.metadata,
      paginationNextClientId: nextBlock?.clientId ?? null,
      paginationNextMetadata: nextBlock?.attributes?.metadata
    };
  }, [clientId]);
  const {
    updateBlockAttributes
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.useDispatch)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.store);
  const targetQueryName = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useMemo)(() => (0,_utils_block_sync_utils__WEBPACK_IMPORTED_MODULE_4__.getCalendarBlockName)(viewType, unitCount), [viewType, unitCount]);
  const targetHeadingName = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useMemo)(() => (0,_utils_block_sync_utils__WEBPACK_IMPORTED_MODULE_4__.getCalendarBlockName)(viewType, unitCount, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Heading', 'gatherpress-calendar')), [viewType, unitCount]);
  const targetPaginationContainerName = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useMemo)(() => (0,_utils_block_sync_utils__WEBPACK_IMPORTED_MODULE_4__.getPaginationContainerName)(viewType, unitCount), [viewType, unitCount]);
  const targetPrevLabel = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useMemo)(() => (0,_utils_block_sync_utils__WEBPACK_IMPORTED_MODULE_4__.getPaginationLabel)('previous', viewType, unitCount), [viewType, unitCount]);
  const targetNextLabel = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useMemo)(() => (0,_utils_block_sync_utils__WEBPACK_IMPORTED_MODULE_4__.getPaginationLabel)('next', viewType, unitCount), [viewType, unitCount]);

  // Track previous view configuration so names and labels are only reset when config changes.
  const prevConfigRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useRef)({
    viewType,
    unitCount
  });
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useEffect)(() => {
    // Hard overwrite the parent Query block's name,
    // so the Query block is always named after the calendar it contains.
    if (parentQueryClientId && parentQueryMetadata?.name !== targetQueryName) {
      updateBlockAttributes(parentQueryClientId, {
        metadata: {
          ...parentQueryMetadata,
          name: targetQueryName
        }
      });
    }

    // Only overwrite block names and pagination labels when unitCount or viewType changes.
    const hasConfigChanged = prevConfigRef.current.viewType !== viewType || prevConfigRef.current.unitCount !== unitCount;
    if (!hasConfigChanged) {
      return;
    }
    prevConfigRef.current = {
      viewType,
      unitCount
    };
    if (headingClientId) {
      updateBlockAttributes(headingClientId, {
        metadata: {
          ...headingMetadata,
          name: targetHeadingName
        }
      });
    }
    if (paginationContainerClientId) {
      updateBlockAttributes(paginationContainerClientId, {
        metadata: {
          ...paginationContainerMetadata,
          name: targetPaginationContainerName
        }
      });
    }
    if (paginationPrevClientId) {
      updateBlockAttributes(paginationPrevClientId, {
        label: targetPrevLabel,
        metadata: {
          ...paginationPrevMetadata,
          name: targetPrevLabel
        }
      });
    }
    if (paginationNextClientId) {
      updateBlockAttributes(paginationNextClientId, {
        label: targetNextLabel,
        metadata: {
          ...paginationNextMetadata,
          name: targetNextLabel
        }
      });
    }
  }, [parentQueryClientId, parentQueryMetadata, targetQueryName, headingClientId, headingMetadata, targetHeadingName, paginationContainerClientId, paginationContainerMetadata, targetPaginationContainerName, viewType, unitCount, targetPrevLabel, targetNextLabel, paginationPrevClientId, paginationPrevMetadata, paginationNextClientId, paginationNextMetadata, updateBlockAttributes]);
}

/***/ },

/***/ "./src/calendar/edit/hooks/useDateOffsetHelp.js"
/*!******************************************************!*\
  !*** ./src/calendar/edit/hooks/useDateOffsetHelp.js ***!
  \******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useDateOffsetHelp: () => (/* binding */ useDateOffsetHelp)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);



/**
 * Hook to calculate date offset help text for month, week, or day view.
 *
 * @param {number} dateModifier Offset integer.
 * @param {string} viewType     View type: 'month' | 'week' | 'day'.
 *
 * @return {string} Localized help text.
 */
function useDateOffsetHelp(dateModifier = 0, viewType = 'month') {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useMemo)(() => {
    if (0 === dateModifier) {
      if ('day' === viewType) {
        return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Showing today', 'gatherpress-calendar');
      }
      if ('week' === viewType) {
        return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Showing current week', 'gatherpress-calendar');
      }
      return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Showing current month', 'gatherpress-calendar');
    }
    const absVal = Math.abs(dateModifier);
    if ('day' === viewType) {
      return dateModifier < 0 ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.sprintf)(/* translators: %d: number of days ago */
      (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Showing %d day(s) ago', 'gatherpress-calendar'), absVal) : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.sprintf)(/* translators: %d: number of days ahead */
      (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Showing %d day(s) ahead', 'gatherpress-calendar'), dateModifier);
    }
    if ('week' === viewType) {
      return dateModifier < 0 ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.sprintf)(/* translators: %d: number of weeks ago */
      (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Showing %d week(s) ago', 'gatherpress-calendar'), absVal) : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.sprintf)(/* translators: %d: number of weeks ahead */
      (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Showing %d week(s) ahead', 'gatherpress-calendar'), dateModifier);
    }
    return dateModifier < 0 ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.sprintf)(/* translators: %d: number of months ago */
    (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Showing %d month(s) ago', 'gatherpress-calendar'), absVal) : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.sprintf)(/* translators: %d: number of months ahead */
    (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Showing %d month(s) ahead', 'gatherpress-calendar'), dateModifier);
  }, [dateModifier, viewType]);
}

/***/ },

/***/ "./src/calendar/edit/hooks/useDateRangeSourceSync.js"
/*!***********************************************************!*\
  !*** ./src/calendar/edit/hooks/useDateRangeSourceSync.js ***!
  \***********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useDateRangeSourceSync: () => (/* binding */ useDateRangeSourceSync)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils_post_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../utils/post-types */ "./src/utils/post-types.js");
/* harmony import */ var _useSourcePostDates__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./useSourcePostDates */ "./src/calendar/edit/hooks/useSourcePostDates.js");
/* harmony import */ var _utils_date_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/date-utils */ "./src/calendar/edit/utils/date-utils.js");
/* harmony import */ var _utils_source_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/source-utils */ "./src/calendar/edit/utils/source-utils.js");
/**
 * Hook to manage dateRangeSource synchronization, view-presets, and attribute persistence.
 *
 * Separates date-anchoring concerns from the Edit layout component.
 *
 * @package
 * @since 0.8.0
 */







/**
 * Coordinates date source resolution, attribute synchronization, and duration presets.
 *
 * @param {Object}   params               Hook parameters.
 * @param {Object}   params.attributes    Block attributes.
 * @param {Function} params.setAttributes Block setAttributes dispatcher.
 * @param {Object}   params.context       Block context.
 * @param {number}   params.startOfWeek   Start of week index (0-6).
 *
 * @return {Object} Synchronized dates state.
 */
function useDateRangeSourceSync({
  attributes,
  setAttributes,
  context,
  startOfWeek
}) {
  const {
    viewType = 'month',
    unitCount = 1,
    selectedDate = '',
    dateModifier = 0,
    dateRangeSource = _utils_source_utils__WEBPACK_IMPORTED_MODULE_4__.DATE_SOURCE_DEFAULT,
    postId = 0,
    sourcePostType = ''
  } = attributes;
  const {
    postId: contextPostId = 0,
    postType: contextPostType = ''
  } = context;

  // Verify if the current host post type supports gatherpress-event-date.
  const hasCurrentSupport = (0,_utils_post_types__WEBPACK_IMPORTED_MODULE_1__.usePostTypeSupports)('gatherpress-event-date', contextPostType || null);

  // Fallback to default if context mode is requested on a non-event post type.
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if ((0,_utils_source_utils__WEBPACK_IMPORTED_MODULE_4__.isContextDateSource)(dateRangeSource) && !hasCurrentSupport) {
      setAttributes({
        dateRangeSource: _utils_source_utils__WEBPACK_IMPORTED_MODULE_4__.DATE_SOURCE_DEFAULT
      });
    }
  }, [dateRangeSource, hasCurrentSupport, setAttributes]);
  const sourcePostDates = (0,_useSourcePostDates__WEBPACK_IMPORTED_MODULE_2__.useSourcePostDates)({
    dateRangeSource,
    postId,
    sourcePostType,
    contextPostId,
    contextPostType
  });
  const hasPostDates = Boolean(sourcePostDates.hasPost && sourcePostDates.startDate && sourcePostDates.endDate);
  const effectiveUnitCount = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (!hasPostDates) {
      return unitCount;
    }
    return (0,_utils_date_utils__WEBPACK_IMPORTED_MODULE_3__.calculatePostSpanUnits)(viewType, sourcePostDates.startDate, sourcePostDates.endDate, startOfWeek);
  }, [hasPostDates, viewType, sourcePostDates.startDate, sourcePostDates.endDate, startOfWeek, unitCount]);
  const effectiveSelectedDate = hasPostDates ? sourcePostDates.startDate : selectedDate;
  const effectiveDateModifier = hasPostDates ? 0 : dateModifier;

  // Synchronize unitCount, selectedDate, and dateModifier attributes with the event post span.
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!hasPostDates) {
      return;
    }
    const updates = {};
    if (unitCount !== effectiveUnitCount) {
      updates.unitCount = effectiveUnitCount;
    }
    if (selectedDate !== effectiveSelectedDate) {
      updates.selectedDate = effectiveSelectedDate;
    }
    if (dateModifier !== 0) {
      updates.dateModifier = 0;
    }
    if (Object.keys(updates).length > 0) {
      setAttributes(updates);
    }
  }, [hasPostDates, effectiveUnitCount, effectiveSelectedDate, unitCount, selectedDate, dateModifier, setAttributes]);

  // Preset viewType based on post duration when a new source post is selected.
  const lastPresetPostIdRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(0);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!hasPostDates || !sourcePostDates.effectivePostId) {
      return;
    }
    if (lastPresetPostIdRef.current === sourcePostDates.effectivePostId) {
      return;
    }
    lastPresetPostIdRef.current = sourcePostDates.effectivePostId;
    const startObj = new Date(sourcePostDates.startDate);
    const endObj = new Date(sourcePostDates.endDate);
    const durationDays = Math.round((endObj - startObj) / (1000 * 60 * 60 * 24)) + 1;
    let recommendedView = 'month';
    if (durationDays <= 3) {
      recommendedView = 'day';
    } else if (durationDays <= 28) {
      recommendedView = 'week';
    }
    if (viewType !== recommendedView) {
      setAttributes({
        viewType: recommendedView
      });
    }
  }, [hasPostDates, sourcePostDates.effectivePostId, sourcePostDates.startDate, sourcePostDates.endDate, viewType, setAttributes]);
  return {
    sourcePostDates,
    hasPostDates,
    effectiveUnitCount,
    effectiveSelectedDate,
    effectiveDateModifier,
    hasCurrentSupport
  };
}

/***/ },

/***/ "./src/calendar/edit/hooks/useEventPostTypes.js"
/*!******************************************************!*\
  !*** ./src/calendar/edit/hooks/useEventPostTypes.js ***!
  \******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useEventPostTypes: () => (/* binding */ useEventPostTypes)
/* harmony export */ });
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/core-data */ "@wordpress/core-data");
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_1__);
/**
 * Hook to discover registered post types supporting gatherpress-event-date.
 *
 * @package
 * @since 0.8.0
 */



const EMPTY_TYPES = [];

/**
 * Returns an array of post type objects that declare gatherpress-event-date support.
 *
 * Queries with context: 'edit' so WordPress REST API includes the supports dictionary.
 *
 * @return {Array<Object>} Event-supporting post type objects.
 */
function useEventPostTypes() {
  return (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.useSelect)(select => {
    const {
      getPostTypes
    } = select(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_1__.store);
    const types = getPostTypes({
      per_page: -1,
      context: 'edit'
    });
    if (!Array.isArray(types)) {
      return EMPTY_TYPES;
    }
    return types.filter(postType => !!postType.supports?.['gatherpress-event-date']);
  }, []);
}

/***/ },

/***/ "./src/calendar/edit/hooks/useSourcePostDates.js"
/*!*******************************************************!*\
  !*** ./src/calendar/edit/hooks/useSourcePostDates.js ***!
  \*******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useSourcePostDates: () => (/* binding */ useSourcePostDates)
/* harmony export */ });
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _useEventPostTypes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./useEventPostTypes */ "./src/calendar/edit/hooks/useEventPostTypes.js");
/* harmony import */ var _utils_source_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/source-utils */ "./src/calendar/edit/utils/source-utils.js");
/**
 * Hook to resolve start and end dates from a target event post.
 *
 * @package
 * @since 0.8.0
 */





/**
 * Hook to resolve start and end dates from a target event post.
 *
 * @param {Object} props                 Parameters object.
 * @param {string} props.dateRangeSource Source mode ('default', 'context', 'selected').
 * @param {number} props.postId          Explicit post ID.
 * @param {string} props.sourcePostType  Explicit post type.
 * @param {number} props.contextPostId   Post ID from block context.
 * @param {string} props.contextPostType Post type from block context.
 *
 * @return {Object} Resolved post dates object { startDate, endDate, postTitle, hasPost, effectivePostId }.
 */
function useSourcePostDates(props) {
  const eventPostTypes = (0,_useEventPostTypes__WEBPACK_IMPORTED_MODULE_1__.useEventPostTypes)();
  const defaultPostType = (0,_utils_source_utils__WEBPACK_IMPORTED_MODULE_2__.getDefaultEventPostType)(eventPostTypes);
  const {
    dateRangeSource = 'default',
    postId = 0,
    sourcePostType = '',
    contextPostId = 0,
    contextPostType = ''
  } = props;
  return (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.useSelect)(select => {
    return (0,_utils_source_utils__WEBPACK_IMPORTED_MODULE_2__.resolveSourceEventDates)(select, {
      dateRangeSource,
      postId,
      sourcePostType,
      contextPostId,
      contextPostType,
      defaultPostType
    });
  }, [dateRangeSource, postId, sourcePostType, contextPostId, contextPostType, defaultPostType]);
}

/***/ },

/***/ "./src/calendar/edit/utils/block-sync-utils.js"
/*!*****************************************************!*\
  !*** ./src/calendar/edit/utils/block-sync-utils.js ***!
  \*****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   findBlockByName: () => (/* binding */ findBlockByName),
/* harmony export */   findHeadingBlock: () => (/* binding */ findHeadingBlock),
/* harmony export */   getCalendarBlockName: () => (/* binding */ getCalendarBlockName),
/* harmony export */   getPaginationContainerName: () => (/* binding */ getPaginationContainerName),
/* harmony export */   getPaginationLabel: () => (/* binding */ getPaginationLabel)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/**
 * Block tree navigation and localized name/label resolution helpers.
 *
 * @package
 * @since 0.8.0
 */



/**
 * Recursively find a block by name within an array of blocks.
 *
 * @param {Array}  blocks    Array of parsed blocks.
 * @param {string} blockName Block name to search for.
 * @return {Object|null} Matching block or null.
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
 * Recursively find the block bound to the calendar heading source.
 *
 * @param {Array} blocks Array of parsed blocks to search.
 * @return {Object|null} Matching heading block or null.
 */
function findHeadingBlock(blocks = []) {
  for (const block of blocks) {
    const source = block.attributes?.metadata?.bindings?.content?.source;
    if ('gatherpress/calendar-heading' === source) {
      return block;
    }
    if (block.innerBlocks && block.innerBlocks.length) {
      const found = findHeadingBlock(block.innerBlocks);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

/**
 * Resolves the calendar block name based on viewType and unitCount.
 *
 * @param {string} viewType  View type: 'month' | 'week' | 'day'.
 * @param {number} unitCount Number of units.
 * @param {string} name      Block name.
 * @return {string} Formatted name (e.g. "Month Calendar" or "3 Month Calendar").
 */
function getCalendarBlockName(viewType = 'month', unitCount = 1, name = 'Calendar') {
  const count = Number(unitCount) || 1;
  const viewLabels = {
    month: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Month', 'gatherpress-calendar'),
    week: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Week', 'gatherpress-calendar'),
    day: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Day', 'gatherpress-calendar')
  };
  const label = viewLabels[viewType] || viewLabels.month;
  if (count > 1) {
    return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.sprintf)(/* translators: %1$d: unit count, %2$s: view type label (Month, Week, Day), %3$s: block name. */
    (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__._x)('%1$d %2$s %3$s', 'Calendar block name', 'gatherpress-calendar'), count, label, name);
  }
  return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.sprintf)(/* translators: %1$s: view type label (Month, Week, Day), %2$s: block name. */
  (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__._x)('%1$s %2$s', 'Calendar block name', 'gatherpress-calendar'), label, name);
}

/**
 * Resolves the pagination container block name in List View.
 *
 * @param {string} viewType  'month' | 'week' | 'day'.
 * @param {number} unitCount Number of units.
 * @return {string} Localized block name (e.g. "Month Pagination", "3 Month Pagination").
 */
function getPaginationContainerName(viewType = 'month', unitCount = 1) {
  return getCalendarBlockName(viewType, unitCount, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__._x)('Pagination', 'Pagination block name', 'gatherpress-calendar'));
}

/**
 * Resolves the pagination block label based on direction, viewType, and unitCount.
 * Omits the number when unitCount is 1 (e.g. "Previous Month", "Next 3 Months").
 *
 * @param {string} direction 'previous' | 'next'.
 * @param {string} viewType  'month' | 'week' | 'day'.
 * @param {number} unitCount Number of units.
 * @return {string} Formatted label (e.g. "Previous Month", "Next 3 Months").
 */
function getPaginationLabel(direction = 'next', viewType = 'month', unitCount = 1) {
  const count = Number(unitCount) || 1;
  const directionLabels = {
    next: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Next', 'gatherpress-calendar'),
    previous: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Previous', 'gatherpress-calendar')
  };
  const unitLabels = {
    month: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__._n)('Month', 'Months', count, 'gatherpress-calendar'),
    week: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__._n)('Week', 'Weeks', count, 'gatherpress-calendar'),
    day: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__._n)('Day', 'Days', count, 'gatherpress-calendar')
  };
  const directionLabel = directionLabels[direction] || directionLabels.next;
  const unitLabel = unitLabels[viewType] || unitLabels.month;
  if (count > 1) {
    return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.sprintf)(/* translators: %1$s: direction label (Next, Previous), %2$d: unit count, %3$s: unit label (Months, Weeks, Days). */
    (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__._x)('%1$s %2$d %3$s', 'Pagination label', 'gatherpress-calendar'), directionLabel, count, unitLabel);
  }
  return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.sprintf)(/* translators: %1$s: direction label (Next, Previous), %2$s: unit label (Month, Week, Day). */
  (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__._x)('%1$s %2$s', 'Pagination label', 'gatherpress-calendar'), directionLabel, unitLabel);
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
/* harmony export */   buildConsecutiveDays: () => (/* reexport safe */ _grid_builder__WEBPACK_IMPORTED_MODULE_3__.buildConsecutiveDays),
/* harmony export */   buildConsecutiveWeeks: () => (/* reexport safe */ _grid_builder__WEBPACK_IMPORTED_MODULE_3__.buildConsecutiveWeeks),
/* harmony export */   buildWeeks: () => (/* reexport safe */ _grid_builder__WEBPACK_IMPORTED_MODULE_3__.buildWeeks),
/* harmony export */   createDayEntry: () => (/* reexport safe */ _grid_builder__WEBPACK_IMPORTED_MODULE_3__.createDayEntry),
/* harmony export */   determineSpanType: () => (/* reexport safe */ _grid_builder__WEBPACK_IMPORTED_MODULE_3__.determineSpanType),
/* harmony export */   findAvailableSlot: () => (/* reexport safe */ _grid_builder__WEBPACK_IMPORTED_MODULE_3__.findAvailableSlot),
/* harmony export */   findBlockByName: () => (/* reexport safe */ _block_sync_utils__WEBPACK_IMPORTED_MODULE_4__.findBlockByName),
/* harmony export */   findHeadingBlock: () => (/* reexport safe */ _block_sync_utils__WEBPACK_IMPORTED_MODULE_4__.findHeadingBlock),
/* harmony export */   generateCalendar: () => (/* reexport safe */ _grid_builder__WEBPACK_IMPORTED_MODULE_3__.generateCalendar),
/* harmony export */   generateMonthOptions: () => (/* binding */ generateMonthOptions),
/* harmony export */   getCalendarBlockName: () => (/* reexport safe */ _block_sync_utils__WEBPACK_IMPORTED_MODULE_4__.getCalendarBlockName),
/* harmony export */   getColumnsCount: () => (/* binding */ getColumnsCount),
/* harmony export */   getDayNames: () => (/* binding */ getDayNames),
/* harmony export */   getDefaultActiveDate: () => (/* reexport safe */ _grid_builder__WEBPACK_IMPORTED_MODULE_3__.getDefaultActiveDate),
/* harmony export */   getPaginationContainerName: () => (/* reexport safe */ _block_sync_utils__WEBPACK_IMPORTED_MODULE_4__.getPaginationContainerName),
/* harmony export */   getPaginationLabel: () => (/* reexport safe */ _block_sync_utils__WEBPACK_IMPORTED_MODULE_4__.getPaginationLabel),
/* harmony export */   getPostsPerPage: () => (/* binding */ getPostsPerPage),
/* harmony export */   getStartOfWeek: () => (/* binding */ getStartOfWeek),
/* harmony export */   getWeekNumber: () => (/* reexport safe */ _grid_builder__WEBPACK_IMPORTED_MODULE_3__.getWeekNumber),
/* harmony export */   getWeekendDays: () => (/* binding */ getWeekendDays),
/* harmony export */   groupPostsByDate: () => (/* reexport safe */ _grid_builder__WEBPACK_IMPORTED_MODULE_3__.groupPostsByDate),
/* harmony export */   isWeekendDay: () => (/* binding */ isWeekendDay),
/* harmony export */   resolvePostDateSpan: () => (/* reexport safe */ _grid_builder__WEBPACK_IMPORTED_MODULE_3__.resolvePostDateSpan)
/* harmony export */ });
/* harmony import */ var _wordpress_date__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/date */ "@wordpress/date");
/* harmony import */ var _wordpress_date__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_date__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _grid_builder__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./grid-builder */ "./src/calendar/edit/utils/grid-builder.js");
/* harmony import */ var _block_sync_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./block-sync-utils */ "./src/calendar/edit/utils/block-sync-utils.js");
/**
 * Core calendar calculation and configuration utilities.
 *
 * @package
 * @since 0.1.0
 */





// Re-export decomposed helpers so existing imports remain backward-compatible:


const WEEKDAY_SLUGS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

/**
 * Retrieves the start of week setting, syncing directly with PHP's setting.
 *
 * @return {number} Start of week index (0 = Sunday, 1 = Monday).
 */
function getStartOfWeek() {
  const settings = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.select)('core/editor')?.getEditorSettings?.();
  const wpStartOfWeek = Number(settings?.gatherpress?.startOfWeek);
  if (!Number.isNaN(wpStartOfWeek)) {
    return wpStartOfWeek;
  }
  const dateSettings = (0,_wordpress_date__WEBPACK_IMPORTED_MODULE_0__.getSettings)();
  return Number(dateSettings?.l10n?.startOfWeek ?? 0);
}

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
  const settings = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.select)('core/editor')?.getEditorSettings?.();
  return Array.isArray(settings?.gatherpress?.weekendDays) ? settings.gatherpress.weekendDays : [0, 6];
}

/**
 * Checks whether a day of the week is considered a weekend day.
 *
 * @param {number} dayOfWeek Day of the week integer (0-6).
 * @return {boolean} True if weekend.
 */
function isWeekendDay(dayOfWeek) {
  return getWeekendDays().includes(dayOfWeek);
}

/**
 * Retrieves the maximum number of posts to query for calendar display.
 *
 * @return {number} Maximum number of posts to query.
 */
function getPostsPerPage() {
  const settings = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.select)('core/editor')?.getEditorSettings?.();
  const postsPerPage = Number(settings?.gatherpress?.postsPerPage);
  return !Number.isNaN(postsPerPage) && postsPerPage > 0 ? postsPerPage : 500;
}

/**
 * Computes table grid column count based on view type and weekend visibility.
 *
 * @param {string}  viewType     View type.
 * @param {boolean} showWeekends Whether weekends are shown.
 * @param {number}  unitCount    Number of units.
 * @return {number} Column count.
 */
function getColumnsCount(viewType, showWeekends, unitCount = 1) {
  if ('day' === viewType) {
    return Math.max(1, unitCount);
  }
  const workdayCount = 7 - getWeekendDays().length;
  return showWeekends ? 7 : workdayCount;
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
 * @param {number}  startOfWeek  - Start of week (0=Sunday, 1=Monday, 2=Tuesday, etc.).
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
function getDayNames(startOfWeek = 0, showWeekends = true) {
  const days = [];

  // Base date: 2024-01-07 is a Sunday (day 0).
  // We use a fixed date at noon UTC and format in UTC so timezone shifts
  // never change the day name.
  const baseSunday = new Date('2024-01-07T12:00:00Z');
  for (let i = 0; i < 7; i++) {
    // Calculate the day of week (0=Sunday, 6=Saturday).
    // The modulo ensures we wrap around (e.g., day 7 becomes day 0).
    const dayOfWeek = (startOfWeek + i) % 7;
    if (!showWeekends && isWeekendDay(dayOfWeek)) {
      continue;
    }

    // Create a date for this day of week by adding days to base Sunday in UTC.
    const dayDate = new Date(baseSunday);
    dayDate.setUTCDate(baseSunday.getUTCDate() + dayOfWeek);

    // Get the abbreviated day name using dateI18n for proper localization.
    // 'D' format returns the abbreviated day name (e.g., 'Mon', 'Tue', etc.).
    // This respects the site's language setting via WordPress core.
    // Format in UTC for proper localization without site timezone shift.
    days.push((0,_wordpress_date__WEBPACK_IMPORTED_MODULE_0__.dateI18n)('D', dayDate, 'UTC'));
  }
  return days;
}

/**
 * Generate month options for month picker.
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
      const date = new Date(year, month - 1, 15, 12, 0, 0);
      const value = `${year}-${String(month).padStart(2, '0')}`;
      const label = (0,_wordpress_date__WEBPACK_IMPORTED_MODULE_0__.dateI18n)(/* translators: Date format, see https://www.php.net/manual/datetime.format.php */
      (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__._x)('F Y', 'Month picker option', 'gatherpress-calendar'), date);
      options.push({
        value,
        label
      });
    }
  }
  return options;
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
/* harmony export */   calculateDateRange: () => (/* binding */ calculateDateRange),
/* harmony export */   calculatePostSpanUnits: () => (/* binding */ calculatePostSpanUnits),
/* harmony export */   calculateTargetDate: () => (/* binding */ calculateTargetDate),
/* harmony export */   formatDate: () => (/* binding */ formatDate),
/* harmony export */   formatHeading: () => (/* binding */ formatHeading)
/* harmony export */ });
/* harmony import */ var _wordpress_date__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/date */ "@wordpress/date");
/* harmony import */ var _wordpress_date__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_date__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _calendar_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./calendar-utils */ "./src/calendar/edit/utils/calendar-utils.js");
/* harmony import */ var _source_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./source-utils */ "./src/calendar/edit/utils/source-utils.js");
/**
 * Date utility functions for GatherPress Calendar.
 *
 * @package
 */






/**
 * Normalizes a Date object to 12:00:00 noon to prevent midnight timezone shifts.
 *
 * @param {Date} date Calendar date object.
 * @return {Date} Date object set to noon.
 */
function atNoon(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);
}

/**
 * Formats a calendar Date object into YYYY-MM-DD without timezone shifting.
 *
 * @param {Date} date Calendar date object.
 * @return {string} YYYY-MM-DD date string.
 */
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calculate the target date based on viewType, selectedDate, and modifiers.
 *
 * @param {Object} [options]              Options object.
 * @param {string} [options.viewType]     One of 'month', 'week', or 'day'.
 * @param {string} [options.selectedDate] The date string.
 * @param {number} [options.dateModifier] Modifier offset.
 * @return {Date} Calculated target date.
 */
function calculateTargetDate({
  viewType = 'month',
  selectedDate = '',
  dateModifier = 0
} = {}) {
  let targetDate;
  if (selectedDate && /^\d{4}-\d{2}-\d{2}$/.test(selectedDate)) {
    const [year, month, day] = selectedDate.split('-').map(Number);
    targetDate = new Date(year, month - 1, day, 12, 0, 0);
  } else if (selectedDate && /^\d{4}-\d{2}$/.test(selectedDate)) {
    const [year, month] = selectedDate.split('-').map(Number);
    targetDate = new Date(year, month - 1, 1, 12, 0, 0);
  } else {
    const now = new Date();
    targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0);
  }
  if ('month' === viewType) {
    targetDate.setDate(1);
  }
  if (0 !== dateModifier) {
    if ('week' === viewType) {
      targetDate.setDate(targetDate.getDate() + dateModifier * 7);
    } else if ('day' === viewType) {
      targetDate.setDate(targetDate.getDate() + dateModifier);
    } else {
      targetDate.setDate(1);
      targetDate.setMonth(targetDate.getMonth() + dateModifier);
    }
  }
  return targetDate;
}

/**
 * Calculates the number of calendar units spanned by an event's date range.
 *
 * @param {string} viewType     View type ('month', 'week', 'day').
 * @param {string} startDateStr Start date (YYYY-MM-DD).
 * @param {string} endDateStr   End date (YYYY-MM-DD).
 * @param {number} startOfWeek  Start of week (0-6).
 *
 * @return {number} Clamped unit count.
 */
function calculatePostSpanUnits(viewType, startDateStr, endDateStr, startOfWeek = 0) {
  if (!startDateStr || !endDateStr) {
    return 1;
  }
  const [sY, sM, sD] = startDateStr.split('-').map(Number);
  const [eY, eM, eD] = endDateStr.split('-').map(Number);
  const startObj = new Date(sY, sM - 1, sD, 12, 0, 0);
  const endObj = new Date(eY, eM - 1, eD, 12, 0, 0);
  if ('day' === viewType) {
    const daysDiff = Math.max(1, Math.round((endObj - startObj) / (1000 * 60 * 60 * 24)) + 1);
    return Math.min(7, daysDiff);
  }
  if ('week' === viewType) {
    const currentDow = startObj.getDay();
    const diff = (currentDow - startOfWeek + 7) % 7;
    const rawWeekStart = new Date(startObj);
    rawWeekStart.setDate(startObj.getDate() - diff);
    const endDow = endObj.getDay();
    const endDiff = (endDow - startOfWeek + 7) % 7;
    const rawWeekEnd = new Date(endObj);
    rawWeekEnd.setDate(endObj.getDate() - endDiff);
    const weeksDiff = Math.max(1, Math.round((rawWeekEnd - rawWeekStart) / (1000 * 60 * 60 * 24 * 7)) + 1);
    return Math.min(5, weeksDiff);
  }
  const monthsDiff = (endObj.getFullYear() - startObj.getFullYear()) * 12 + (endObj.getMonth() - startObj.getMonth()) + 1;
  return Math.max(1, Math.min(12, monthsDiff));
}

/**
 * Calculate range and boundaries for a given date selection.
 *
 * @param {Object} options     Options containing viewType, selectedDate, unitCount, dateModifier, etc.
 * @param {number} startOfWeek Start of week index (0-6).
 *
 * @return {Object} Range object.
 */
function calculateDateRange(options = {}, startOfWeek = 0) {
  const viewType = options.viewType || 'month';
  const showWeekends = options.showWeekends !== false && options.showWeekends !== 'false';
  const unitCount = Math.max(1, options.unitCount || 1);
  const targetDate = calculateTargetDate(options);
  let startDate;
  let endDate;
  let rawWeekStart;
  if ('week' === viewType) {
    const currentDow = targetDate.getDay();
    const diff = (currentDow - startOfWeek + 7) % 7;
    rawWeekStart = new Date(targetDate);
    rawWeekStart.setDate(targetDate.getDate() - diff);
    const totalDays = unitCount * 7;
    const visibleDays = [];
    for (let i = 0; i < totalDays; i++) {
      const d = new Date(rawWeekStart);
      d.setDate(rawWeekStart.getDate() + i);
      if (showWeekends || !(0,_calendar_utils__WEBPACK_IMPORTED_MODULE_2__.isWeekendDay)(d.getDay())) {
        visibleDays.push(d);
      }
    }
    if (visibleDays.length > 0) {
      startDate = visibleDays[0];
      endDate = visibleDays[visibleDays.length - 1];
    } else {
      startDate = rawWeekStart;
      endDate = new Date(rawWeekStart);
      endDate.setDate(rawWeekStart.getDate() + totalDays - 1);
    }
  } else if ('day' === viewType) {
    startDate = new Date(targetDate);
    endDate = new Date(targetDate);
    endDate.setDate(targetDate.getDate() + unitCount - 1);
  } else {
    const year = targetDate.getFullYear();
    const month = targetDate.getMonth();
    startDate = new Date(year, month, 1, 12, 0, 0);
    endDate = new Date(year, month + unitCount, 0, 12, 0, 0);
  }
  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
    startDateObj: startDate,
    endDateObj: endDate,
    rawWeekStart: rawWeekStart || startDate,
    year: targetDate.getFullYear(),
    month: targetDate.getMonth() + 1,
    targetDate,
    viewType,
    unitCount
  };
}

/**
 * Calculate date query parameters for REST requests.
 *
 * @param {Object} options     Configuration.
 * @param {number} startOfWeek Start of week index.
 *
 * @return {Object} Query parameters.
 */
function calculateDateQuery(options = {}, startOfWeek = 0) {
  const range = calculateDateRange(options, startOfWeek);
  return {
    year: range.year,
    month: range.month,
    startDate: range.startDate,
    endDate: range.endDate,
    viewType: range.viewType,
    unitCount: range.unitCount
  };
}

/**
 * Format calendar heading string (matches PHP Date_Calculator::format_heading).
 *
 * @param {string} viewType  View type: 'month' | 'week' | 'day'.
 * @param {Date}   startDate Range start date object.
 * @param {Date}   endDate   Range end date object.
 *
 * @return {string} Formatted localized heading string.
 */
function formatHeading(viewType, startDate, endDate) {
  const isSameDay = startDate.toDateString() === endDate.toDateString();
  if ('day' === viewType && isSameDay) {
    return (0,_wordpress_date__WEBPACK_IMPORTED_MODULE_0__.dateI18n)(/* translators: Date format, see https://www.php.net/manual/datetime.format.php */
    (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__._x)('l, F j, Y', 'Calendar heading: single day', 'gatherpress-calendar'), atNoon(startDate));
  }
  let start = atNoon(startDate);
  let end = atNoon(endDate);
  const startYear = start.getFullYear();
  const endYear = end.getFullYear();
  const startMonth = start.getMonth();
  const endMonth = end.getMonth();
  let startFormat;
  let endFormat;
  if ('day' === viewType || 'week' === viewType) {
    if (startYear !== endYear) {
      startFormat = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__._x)(/* translators: Date format, see https://www.php.net/manual/datetime.format.php */
      'M j, Y', 'Calendar heading: start of date range across years', 'gatherpress-calendar');
      endFormat = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__._x)(/* translators: Date format, see https://www.php.net/manual/datetime.format.php */
      'M j, Y', 'Calendar heading: end of date range', 'gatherpress-calendar');
    } else if (startMonth !== endMonth) {
      startFormat = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__._x)(/* translators: Date format, see https://www.php.net/manual/datetime.format.php */
      'M j', 'Calendar heading: start of date range across months', 'gatherpress-calendar');
      endFormat = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__._x)(/* translators: Date format, see https://www.php.net/manual/datetime.format.php */
      'M j, Y', 'Calendar heading: end of date range', 'gatherpress-calendar');
    } else {
      startFormat = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__._x)(/* translators: Date format, see https://www.php.net/manual/datetime.format.php */
      'M j', 'Calendar heading: start of date range within a month', 'gatherpress-calendar');
      endFormat = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__._x)(/* translators: Date format, see https://www.php.net/manual/datetime.format.php */
      'j, Y', 'Calendar heading: end of date range within a month', 'gatherpress-calendar');
    }
  } else {
    // Month view: format a mid-month date so browser-site timezone differences
    // cannot shift the formatted month to an adjacent month.
    start = new Date(startYear, startMonth, 15, 12, 0, 0);
    end = new Date(endYear, endMonth, 15, 12, 0, 0);
    if (startYear === endYear && startMonth === endMonth) {
      return (0,_wordpress_date__WEBPACK_IMPORTED_MODULE_0__.dateI18n)(/* translators: Date format, see https://www.php.net/manual/datetime.format.php */
      (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__._x)('F Y', 'Calendar heading: single month', 'gatherpress-calendar'), start);
    }
    if (startYear !== endYear) {
      startFormat = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__._x)(/* translators: Date format, see https://www.php.net/manual/datetime.format.php */
      'M Y', 'Calendar heading: month range across years', 'gatherpress-calendar');
      endFormat = startFormat;
    } else {
      startFormat = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__._x)(/* translators: Date format, see https://www.php.net/manual/datetime.format.php */
      'F', 'Calendar heading: start of month range within a year', 'gatherpress-calendar');
      endFormat = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__._x)(/* translators: Date format, see https://www.php.net/manual/datetime.format.php */
      'F Y', 'Calendar heading: end of month range within a year', 'gatherpress-calendar');
    }
  }
  const separator = (0,_source_utils__WEBPACK_IMPORTED_MODULE_3__.getDatetimeSeparator)();
  return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.sprintf)(/* translators: %1$s: start date, %2$s: separator, %3$s: end date. */
  (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__._x)('%1$s %2$s %3$s', 'Calendar heading: date range', 'gatherpress-calendar'), (0,_wordpress_date__WEBPACK_IMPORTED_MODULE_0__.dateI18n)(startFormat, start), separator, (0,_wordpress_date__WEBPACK_IMPORTED_MODULE_0__.dateI18n)(endFormat, end));
}

/***/ },

/***/ "./src/calendar/edit/utils/grid-builder.js"
/*!*************************************************!*\
  !*** ./src/calendar/edit/utils/grid-builder.js ***!
  \*************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   buildConsecutiveDays: () => (/* binding */ buildConsecutiveDays),
/* harmony export */   buildConsecutiveWeeks: () => (/* binding */ buildConsecutiveWeeks),
/* harmony export */   buildWeeks: () => (/* binding */ buildWeeks),
/* harmony export */   createDayEntry: () => (/* binding */ createDayEntry),
/* harmony export */   determineSpanType: () => (/* binding */ determineSpanType),
/* harmony export */   findAvailableSlot: () => (/* binding */ findAvailableSlot),
/* harmony export */   generateCalendar: () => (/* binding */ generateCalendar),
/* harmony export */   getDefaultActiveDate: () => (/* binding */ getDefaultActiveDate),
/* harmony export */   getWeekNumber: () => (/* binding */ getWeekNumber),
/* harmony export */   groupPostsByDate: () => (/* binding */ groupPostsByDate),
/* harmony export */   resolvePostDateSpan: () => (/* binding */ resolvePostDateSpan)
/* harmony export */ });
/* harmony import */ var _wordpress_date__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/date */ "@wordpress/date");
/* harmony import */ var _wordpress_date__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_date__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants */ "./src/calendar/edit/constants.js");
/* harmony import */ var _date_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./date-utils */ "./src/calendar/edit/utils/date-utils.js");
/* harmony import */ var _calendar_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./calendar-utils */ "./src/calendar/edit/utils/calendar-utils.js");
/* harmony import */ var _utils_post_types__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../utils/post-types */ "./src/utils/post-types.js");
/**
 * Grid builder functions for calendar units, weeks, and days.
 *
 * @package
 * @since 0.8.0
 */







/**
 * Classifies the span position for a day within a multi-day event.
 *
 * @param {number} dayIndex  1-based day index.
 * @param {number} totalDays Total days of the event.
 * @return {string} 'single', 'start', 'middle', or 'end'.
 */
function determineSpanType(dayIndex, totalDays) {
  if (totalDays <= 1) {
    return 'single';
  }
  if (dayIndex === 1) {
    return 'start';
  }
  if (dayIndex === totalDays) {
    return 'end';
  }
  return 'middle';
}

/**
 * Calculates start object, total days, and string dates for a post.
 *
 * @param {Object} post Post entity record.
 * @return {Object|null} PostDateSpan descriptor object.
 */
function resolvePostDateSpan(post) {
  const isEvent = (0,_utils_post_types__WEBPACK_IMPORTED_MODULE_4__.isEventPostType)(post.type);
  const postDate = isEvent ? post.meta?.gatherpress_datetime_start : post.date;
  if (!postDate) {
    return null;
  }
  const isAllDay = Boolean(post.meta?.gatherpress_is_all_day === true || post.meta?.gatherpress_is_all_day === '1' || post.meta?.gatherpress_is_all_day === 1 || post.meta?.gatherpress_is_all_day === 'true');

  // When post supports gatherpress-event-date, postDate from meta is a string like:
  // "2026-09-30 23:30:00" (an event starting at 11:30 PM in its local timezone).
  // Here is why new Date( postDate ) causes the bug in the editor:
  // new Date( "2026-09-30 23:30:00" ) creates a JavaScript Date object at 23:30 in the browser's timezone.
  // dateI18n( DATE_FORMAT, ... ) converts that Date object into the WordPress site's timezone.
  // If the site is just 1 hour ahead of the browser (or the event's local time), 23:30 becomes 00:30 on 2026-10-01.
  // As a result, dateStr becomes "2026-10-01". The event gets placed into October 1st in the editor grid instead of September 30th!
  //
  // We directly take the first 10 characters ("YYYY-MM-DD") from the event's local datetime string,
  // preventing JavaScript's browser/site timezone conversion from pushing a late-night event into the wrong day.
  const startDateStr = isEvent && post.meta?.gatherpress_datetime_start ? post.meta.gatherpress_datetime_start.slice(0, 10) : (0,_wordpress_date__WEBPACK_IMPORTED_MODULE_0__.dateI18n)(_constants__WEBPACK_IMPORTED_MODULE_1__.DATE_FORMAT, new Date(postDate));
  let endDateStr = startDateStr;
  if (isEvent && post.meta?.gatherpress_datetime_end) {
    const rawEnd = post.meta.gatherpress_datetime_end.slice(0, 10);
    if (rawEnd >= startDateStr) {
      endDateStr = rawEnd;
    }
  }
  const [sY, sM, sD] = startDateStr.split('-').map(Number);
  const [eY, eM, eD] = endDateStr.split('-').map(Number);
  const startObj = new Date(sY, sM - 1, sD, 12, 0, 0);
  const endObj = new Date(eY, eM - 1, eD, 12, 0, 0);
  const totalDays = Math.min(366, Math.max(1, Math.round((endObj - startObj) / (1000 * 60 * 60 * 24)) + 1));
  return {
    post,
    startObj,
    startDateStr,
    totalDays,
    isAllDay
  };
}

/**
 * Finds the lowest 0-indexed vertical slot free across all dates of an event's span.
 *
 * @param {string[]} dates         Array of YYYY-MM-DD date strings.
 * @param {Object}   occupiedSlots Map of date strings to Set of occupied slots.
 * @return {number} Lowest available slot index.
 */
function findAvailableSlot(dates, occupiedSlots) {
  let slot = 0;
  while (true) {
    const isFree = dates.every(date => !occupiedSlots[date]?.has(slot));
    if (isFree) {
      return slot;
    }
    slot++;
  }
}

/**
 * Organizes posts by YYYY-MM-DD date string, spanning multi-day events across all active days.
 *
 * @param {Array} posts Raw post entities.
 * @return {Object} Posts grouped by date string.
 */
function groupPostsByDate(posts = []) {
  const grouped = {};
  if (!posts?.length) {
    return grouped;
  }
  const rawEvents = posts.map(resolvePostDateSpan).filter(Boolean);

  // Multi-day and all-day events first (descending totalDays), then start date, then ID.
  rawEvents.sort((a, b) => {
    const aPromoted = a.totalDays > 1 || a.isAllDay ? 1 : 0;
    const bPromoted = b.totalDays > 1 || b.isAllDay ? 1 : 0;
    if (aPromoted !== bPromoted) {
      return bPromoted - aPromoted;
    }
    if (b.totalDays !== a.totalDays) {
      return b.totalDays - a.totalDays;
    }
    if (a.startDateStr !== b.startDateStr) {
      return a.startDateStr.localeCompare(b.startDateStr);
    }
    return (a.post.id || 0) - (b.post.id || 0);
  });
  const occupiedSlots = {};
  rawEvents.forEach(({
    post,
    startObj,
    totalDays,
    isAllDay
  }) => {
    const eventDates = [];
    for (let i = 0; i < totalDays; i++) {
      const current = new Date(startObj);
      current.setDate(startObj.getDate() + i);
      eventDates.push((0,_date_utils__WEBPACK_IMPORTED_MODULE_2__.formatDate)(current));
    }
    const slot = findAvailableSlot(eventDates, occupiedSlots);
    eventDates.forEach((dateStr, i) => {
      if (!occupiedSlots[dateStr]) {
        occupiedSlots[dateStr] = new Set();
      }
      occupiedSlots[dateStr].add(slot);
      const dayIndex = i + 1;
      const span = determineSpanType(dayIndex, totalDays);
      if (!grouped[dateStr]) {
        grouped[dateStr] = [];
      }
      grouped[dateStr].push({
        ...post,
        span,
        dayIndex,
        totalDays,
        slot,
        isAllDay
      });
    });
  });
  Object.keys(grouped).forEach(dateStr => {
    grouped[dateStr].sort((a, b) => (a.slot || 0) - (b.slot || 0));
  });
  return grouped;
}

/**
 * Helper to build an active day descriptor object.
 *
 * @param {Date}   dateObj     Date object.
 * @param {Object} postsByDate Posts grouped by date string.
 * @param {string} todayStr    Today's date string.
 * @return {Object} Day descriptor object.
 */
function createDayEntry(dateObj, postsByDate, todayStr) {
  const dayOfWeek = dateObj.getDay();
  const dateStr = (0,_date_utils__WEBPACK_IMPORTED_MODULE_2__.formatDate)(dateObj);
  return {
    day: dateObj.getDate(),
    date: dateStr,
    posts: postsByDate?.[dateStr] ?? [],
    isEmpty: false,
    isToday: dateStr === todayStr,
    isPast: dateStr < todayStr,
    isFuture: dateStr > todayStr,
    dayOfWeek,
    weekday: _calendar_utils__WEBPACK_IMPORTED_MODULE_3__.WEEKDAY_SLUGS[dayOfWeek],
    isWeekend: (0,_calendar_utils__WEBPACK_IMPORTED_MODULE_3__.isWeekendDay)(dayOfWeek)
  };
}

/**
 * Build the weeks array for the requested month.
 *
 * @param {number}  year         Target year.
 * @param {number}  month        Target month (1-12).
 * @param {number}  startOfWeek  Start of week (0-6).
 * @param {number}  daysInMonth  Number of days in month.
 * @param {Object}  postsByDate  Posts grouped by date.
 * @param {boolean} showWeekends Weekend visibility.
 *
 * @return {Array[]} Weeks array.
 */
function buildWeeks(year, month, startOfWeek, daysInMonth, postsByDate = {}, showWeekends = true) {
  const today = (0,_wordpress_date__WEBPACK_IMPORTED_MODULE_0__.dateI18n)(_constants__WEBPACK_IMPORTED_MODULE_1__.DATE_FORMAT, new Date());
  const activeDaysOfWeek = [];
  for (let i = 0; i < 7; i++) {
    const dow = (startOfWeek + i) % 7;
    if (!showWeekends && (0,_calendar_utils__WEBPACK_IMPORTED_MODULE_3__.isWeekendDay)(dow)) {
      continue;
    }
    activeDaysOfWeek.push(dow);
  }
  const daysPerWeek = activeDaysOfWeek.length;
  const weeks = [];
  let currentWeek = [];
  let firstDayPlaced = false;
  for (let day = 1; day <= daysInMonth; day++) {
    const dateObj = new Date(year, month - 1, day);
    const dayOfWeek = dateObj.getDay();

    // Skip weekends if hidden
    if (!showWeekends && (0,_calendar_utils__WEBPACK_IMPORTED_MODULE_3__.isWeekendDay)(dayOfWeek)) {
      continue;
    }

    // Pre-pad leading empty days before the first visible day of the month
    if (!firstDayPlaced) {
      firstDayPlaced = true;
      const startCol = activeDaysOfWeek.indexOf(dayOfWeek);
      const emptyDays = -1 !== startCol ? startCol : 0;

      // Fill initial empty days before the month starts.
      for (let i = 0; i < emptyDays; i++) {
        currentWeek.push({
          isEmpty: true,
          posts: []
        });
      }
    }
    currentWeek.push(createDayEntry(dateObj, postsByDate, today));

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
 * Build continuous weeks without artificial empty padding.
 *
 * @param {Date}    weekStartObj Start date of the week.
 * @param {number}  unitCount    Number of units to show.
 * @param {Object}  postsByDate  Posts grouped by date.
 * @param {boolean} showWeekends Weekend visibility.
 *
 * @return {Array[]} Consecutive weeks array.
 */
function buildConsecutiveWeeks(weekStartObj, unitCount, postsByDate = {}, showWeekends = true) {
  const today = (0,_wordpress_date__WEBPACK_IMPORTED_MODULE_0__.dateI18n)(_constants__WEBPACK_IMPORTED_MODULE_1__.DATE_FORMAT, new Date());
  const weeks = [];
  for (let w = 0; w < unitCount; w++) {
    const week = [];
    const currentWeekStart = new Date(weekStartObj);
    currentWeekStart.setDate(weekStartObj.getDate() + w * 7);
    for (let i = 0; i < 7; i++) {
      const dateObj = new Date(currentWeekStart);
      dateObj.setDate(currentWeekStart.getDate() + i);
      if (!showWeekends && (0,_calendar_utils__WEBPACK_IMPORTED_MODULE_3__.isWeekendDay)(dateObj.getDay())) {
        continue;
      }
      week.push(createDayEntry(dateObj, postsByDate, today));
    }
    weeks.push(week);
  }
  return weeks;
}

/**
 * Build single or multi-day continuous rows.
 *
 * @param {Date}   startDayObj Day Date object.
 * @param {number} unitCount   Number of units to show.
 * @param {Object} postsByDate Posts grouped by date.
 *
 * @return {Array[]} Single-element array with consecutive days.
 */
function buildConsecutiveDays(startDayObj, unitCount, postsByDate = {}) {
  const today = (0,_wordpress_date__WEBPACK_IMPORTED_MODULE_0__.dateI18n)(_constants__WEBPACK_IMPORTED_MODULE_1__.DATE_FORMAT, new Date());
  const days = [];
  for (let i = 0; i < unitCount; i++) {
    const dateObj = new Date(startDayObj);
    dateObj.setDate(startDayObj.getDate() + i);
    days.push(createDayEntry(dateObj, postsByDate, today));
  }
  return [days];
}

/**
 * Get the ISO 8601 week number of a calendar row.
 *
 * Mirrors Date_Calculator::get_week_number(). A row that does not start on
 * Monday spans two ISO weeks, and its fourth day is always in the one that
 * holds most of the row.
 *
 * @since 0.8.0
 *
 * @param {Array}  week        Day entries of the row.
 * @param {number} startOfWeek Start of week (0-6).
 *
 * @return {number} Week number, or 0 when the row has no dated day.
 */
function getWeekNumber(week, startOfWeek = 0) {
  const day = week.find(entry => entry.date);
  if (!day) {
    return 0;
  }
  const [year, month, dayOfMonth] = day.date.split('-').map(Number);
  const offset = (day.dayOfWeek - startOfWeek + 7) % 7;

  // format() keeps the local date, dateI18n() would shift it to the site timezone.
  return Number((0,_wordpress_date__WEBPACK_IMPORTED_MODULE_0__.format)('W', new Date(year, month - 1, dayOfMonth - offset + 3)));
}

/**
 * Generate calendar structure for any viewType.
 *
 * @param {Array<Object>} posts        Posts from the query.
 * @param {number}        startOfWeek  Start of week (0-6).
 * @param {Object}        dateRange    Resolved date range.
 * @param {boolean}       showWeekends Weekend visibility.
 *
 * @return {Object} Calendar data structure.
 */
function generateCalendar(posts = [], startOfWeek = 0, dateRange, showWeekends = true) {
  const postsByDate = groupPostsByDate(posts);
  const viewType = dateRange.viewType || 'month';
  const unitCount = Math.max(1, dateRange.unitCount || 1);
  const units = [];
  if ('day' === viewType) {
    const startObj = dateRange.startDateObj || new Date(dateRange.startDate);
    const dayNames = [];
    for (let i = 0; i < unitCount; i++) {
      const d = new Date(startObj);
      d.setDate(startObj.getDate() + i);
      dayNames.push((0,_wordpress_date__WEBPACK_IMPORTED_MODULE_0__.dateI18n)('D', d));
    }
    const weeks = buildConsecutiveDays(startObj, unitCount, postsByDate);
    units.push({
      dayNames,
      weeks
    });
    return {
      dayNames,
      weeks,
      units,
      viewType,
      unitCount
    };
  }
  if ('week' === viewType) {
    const weekStart = dateRange.rawWeekStart || dateRange.startDateObj || new Date(dateRange.startDate);
    const dayNames = (0,_calendar_utils__WEBPACK_IMPORTED_MODULE_3__.getDayNames)(startOfWeek, showWeekends);
    const weeks = buildConsecutiveWeeks(weekStart, unitCount, postsByDate, showWeekends);
    // Only several week rows need a week number to tell them apart.
    const weekNumbers = unitCount > 1 ? weeks.map(week => getWeekNumber(week, startOfWeek)) : undefined;
    units.push({
      dayNames,
      weeks,
      weekNumbers
    });
    return {
      dayNames,
      weeks,
      units,
      viewType,
      unitCount
    };
  }

  // Month view: construct unitCount distinct month objects
  const startObj = dateRange.startDateObj || new Date(dateRange.startDate);
  for (let i = 0; i < unitCount; i++) {
    const monthDate = new Date(startObj.getFullYear(), startObj.getMonth() + i, 1);
    const mYear = monthDate.getFullYear();
    const mMonth = monthDate.getMonth() + 1;
    const daysInMonth = new Date(mYear, mMonth, 0).getDate();
    const mWeeks = buildWeeks(mYear, mMonth, startOfWeek, daysInMonth, postsByDate, showWeekends);
    const mDayNames = (0,_calendar_utils__WEBPACK_IMPORTED_MODULE_3__.getDayNames)(startOfWeek, showWeekends);
    units.push({
      dayNames: mDayNames,
      weeks: mWeeks,
      weekNumbers: mWeeks.map(week => getWeekNumber(week, startOfWeek))
    });
  }
  return {
    dayNames: units[0].dayNames,
    weeks: units[0].weeks,
    units,
    viewType,
    unitCount
  };
}

/**
 * Pick a sensible default "active" (live-editable) day for the calendar
 * preview: today's date when it falls inside the displayed month,
 * otherwise the first non-empty day of the month.
 *
 * @param {Object} calendar Calendar structure.
 * @return {string} Date string.
 */
function getDefaultActiveDate(calendar) {
  const allWeeks = calendar.units ? calendar.units.flatMap(u => u.weeks) : calendar.weeks;
  const days = allWeeks.flat();
  const todayEntry = days.find(day => !day.isEmpty && day.isToday);
  if (todayEntry) {
    return todayEntry.date;
  }
  const firstDay = days.find(day => !day.isEmpty);
  return firstDay ? firstDay.date : '';
}

/***/ },

/***/ "./src/calendar/edit/utils/source-utils.js"
/*!*************************************************!*\
  !*** ./src/calendar/edit/utils/source-utils.js ***!
  \*************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DATE_SOURCE_CONTEXT: () => (/* binding */ DATE_SOURCE_CONTEXT),
/* harmony export */   DATE_SOURCE_DEFAULT: () => (/* binding */ DATE_SOURCE_DEFAULT),
/* harmony export */   DATE_SOURCE_SELECTED: () => (/* binding */ DATE_SOURCE_SELECTED),
/* harmony export */   getDatetimeSeparator: () => (/* binding */ getDatetimeSeparator),
/* harmony export */   getDefaultEventPostType: () => (/* binding */ getDefaultEventPostType),
/* harmony export */   getLiveEventDates: () => (/* binding */ getLiveEventDates),
/* harmony export */   isContextDateSource: () => (/* binding */ isContextDateSource),
/* harmony export */   isPostDateSource: () => (/* binding */ isPostDateSource),
/* harmony export */   isSelectedDateSource: () => (/* binding */ isSelectedDateSource),
/* harmony export */   normalizeDateSource: () => (/* binding */ normalizeDateSource),
/* harmony export */   resolveSourceEventDates: () => (/* binding */ resolveSourceEventDates),
/* harmony export */   toDateString: () => (/* binding */ toDateString)
/* harmony export */ });
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/core-data */ "@wordpress/core-data");
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_2__);
/**
 * Utility functions and constants for calendar date range sources.
 *
 * @package
 * @since 0.8.0
 */




const DATE_SOURCE_DEFAULT = 'default';
const DATE_SOURCE_CONTEXT = 'context';
const DATE_SOURCE_SELECTED = 'selected';

/**
 * Retrieves the datetime separator published by GatherPress core.
 *
 * Falls back to the calendar's localized default if not configured.
 *
 * @return {string} Separator string.
 */
function getDatetimeSeparator() {
  const editorSettings = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.select)('core/editor')?.getEditorSettings?.();
  const configSeparator = editorSettings?.gatherpress?.config?.datetimeSeparator;
  if (typeof configSeparator === 'string' && configSeparator.trim() !== '') {
    return configSeparator.trim();
  }
  return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__._x)('–', 'Calendar heading date range separator', 'gatherpress-calendar');
}

/**
 * Normalizes any date source attribute value into canonical form.
 *
 * @param {string} source Raw dateRangeSource attribute value.
 * @return {string} 'default', 'context', or 'selected'.
 */
function normalizeDateSource(source) {
  if ('context' === source || 'current_post' === source || 'current' === source) {
    return DATE_SOURCE_CONTEXT;
  }
  if ('selected' === source || 'specific_post' === source || 'specific' === source) {
    return DATE_SOURCE_SELECTED;
  }
  return DATE_SOURCE_DEFAULT;
}

/**
 * Checks whether the date range source is driven by an event post.
 *
 * @param {string} source Raw source value.
 * @return {boolean} True if anchored to an event post.
 */
function isPostDateSource(source) {
  return DATE_SOURCE_DEFAULT !== normalizeDateSource(source);
}

/**
 * Checks whether the date range source is anchored to the context post.
 *
 * @param {string} source Raw source value.
 * @return {boolean} True if context mode.
 */
function isContextDateSource(source) {
  return DATE_SOURCE_CONTEXT === normalizeDateSource(source);
}

/**
 * Checks whether the date range source is anchored to a specific post.
 *
 * @param {string} source Raw source value.
 * @return {boolean} True if selected mode.
 */
function isSelectedDateSource(source) {
  return DATE_SOURCE_SELECTED === normalizeDateSource(source);
}

/**
 * Resolves the fallback event post type slug from available types.
 *
 * @param {Array<Object>} eventPostTypes Array of post type objects.
 * @return {string} Post type slug.
 */
function getDefaultEventPostType(eventPostTypes = []) {
  if (Array.isArray(eventPostTypes) && eventPostTypes.length > 0) {
    return eventPostTypes[0].slug || 'gatherpress_event';
  }
  return 'gatherpress_event';
}

/**
 * Normalizes any datetime value (string, Date, timestamp, object) into YYYY-MM-DD.
 *
 * @param {*} val Raw datetime value.
 * @return {string} YYYY-MM-DD date string or empty string.
 */
function toDateString(val) {
  if (!val) {
    return '';
  }
  if (typeof val === 'string' && val.length >= 10) {
    return val.slice(0, 10);
  }
  if (typeof val === 'number') {
    const ms = val < 1e11 ? val * 1000 : val;
    const d = new Date(ms);
    if (!Number.isNaN(d.getTime())) {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    }
  }
  if (val instanceof Date && !Number.isNaN(val.getTime())) {
    const y = val.getFullYear();
    const m = String(val.getMonth() + 1).padStart(2, '0');
    const day = String(val.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
  if (typeof val === 'object') {
    if (typeof val.date === 'string' && val.date.length >= 10) {
      return val.date.slice(0, 10);
    }
    if (typeof val.dateTime === 'string' && val.dateTime.length >= 10) {
      return val.dateTime.slice(0, 10);
    }
  }
  return '';
}

/**
 * Extracts live event start and end dates from GatherPress's datetime store or edited meta.
 *
 * @param {Function} select WordPress data select function.
 * @return {Object|null} { startDate, endDate } or null.
 */
function getLiveEventDates(select) {
  if (typeof select !== 'function') {
    return null;
  }
  const editorStore = select('core/editor');
  const datetimeStore = select('gatherpress/datetime');
  const editedMeta = editorStore?.getEditedPostAttribute?.('meta');
  let liveStart = toDateString(datetimeStore?.getDateTimeStart?.());
  if (!liveStart) {
    liveStart = toDateString(editedMeta?.gatherpress_datetime_start);
  }
  let liveEnd = toDateString(datetimeStore?.getDateTimeEnd?.());
  if (!liveEnd) {
    liveEnd = toDateString(editedMeta?.gatherpress_datetime_end);
  }
  if (!liveEnd) {
    liveEnd = liveStart;
  }
  if (liveStart) {
    let finalEnd = liveEnd;
    if (finalEnd < liveStart) {
      finalEnd = liveStart;
    }
    return {
      startDate: liveStart,
      endDate: finalEnd
    };
  }
  return null;
}

/**
 * Pure resolver to extract start/end dates and title from an event post or active editor session.
 *
 * Shared between useSourcePostDates (block preview/inspector) and bindings.js (bound heading).
 *
 * @param {Function} select                   WordPress data select function.
 * @param {Object}   params                   Resolution parameters.
 * @param {string}   params.dateRangeSource   Source mode ('default', 'context', 'selected').
 * @param {number}   [params.postId]          Explicit post ID.
 * @param {string}   [params.sourcePostType]  Explicit post type slug.
 * @param {number}   [params.contextPostId]   Context post ID.
 * @param {string}   [params.contextPostType] Context post type slug.
 * @param {string}   [params.defaultPostType] Default fallback post type slug.
 *
 * @return {Object} { startDate: string, endDate: string, postTitle: string, hasPost: boolean, effectivePostId: number }
 */
function resolveSourceEventDates(select, params = {}) {
  const {
    dateRangeSource = DATE_SOURCE_DEFAULT,
    postId = 0,
    sourcePostType = '',
    contextPostId = 0,
    contextPostType = '',
    defaultPostType = 'gatherpress_event'
  } = params;
  const canonicalSource = normalizeDateSource(dateRangeSource);
  if (DATE_SOURCE_DEFAULT === canonicalSource) {
    return {
      startDate: '',
      endDate: '',
      postTitle: '',
      hasPost: false,
      effectivePostId: 0
    };
  }
  const editorStore = select('core/editor');
  const currentEditorPostId = editorStore?.getCurrentPostId?.();
  const editorPostType = editorStore?.getCurrentPostType?.();
  const isSelected = DATE_SOURCE_SELECTED === canonicalSource;
  const isContext = DATE_SOURCE_CONTEXT === canonicalSource;
  let effectivePostId = 0;
  if (isSelected) {
    effectivePostId = Number(postId) || 0;
  } else if (isContext) {
    effectivePostId = Number(contextPostId) || currentEditorPostId || 0;
  }
  let effectivePostType = defaultPostType;
  if (isSelected && sourcePostType) {
    effectivePostType = sourcePostType;
  } else if (isContext) {
    effectivePostType = contextPostType || editorPostType || defaultPostType;
  }
  if (!effectivePostId) {
    return {
      startDate: '',
      endDate: '',
      postTitle: '',
      hasPost: false,
      effectivePostId: 0
    };
  }

  // 1. Direct-editing: listen live to gatherpress/datetime store and core/editor edited meta.
  const isTargetCurrentEditorPost = isContext || effectivePostId === currentEditorPostId;
  if (isTargetCurrentEditorPost) {
    const liveDates = getLiveEventDates(select);
    if (liveDates) {
      const currentTitle = editorStore?.getEditedPostAttribute?.('title') || '';
      return {
        startDate: liveDates.startDate,
        endDate: liveDates.endDate,
        postTitle: currentTitle || `#${effectivePostId}`,
        hasPost: true,
        effectivePostId
      };
    }
  }

  // 2. Query loop, site editor template, or different target post: fetch via core entity record.
  const post = select(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_2__.store).getEntityRecord('postType', effectivePostType, effectivePostId);
  if (!post) {
    return {
      startDate: '',
      endDate: '',
      postTitle: '',
      hasPost: false,
      effectivePostId
    };
  }
  const meta = post.meta;
  const startDate = toDateString(meta?.gatherpress_datetime_start);
  let endDate = startDate;
  if (toDateString(meta?.gatherpress_datetime_end)) {
    endDate = toDateString(meta?.gatherpress_datetime_end);
  }
  if (endDate < startDate) {
    endDate = startDate;
  }
  let title = `#${effectivePostId}`;
  if (post.title?.rendered) {
    title = post.title.rendered;
  } else if (post.title?.raw) {
    title = post.title.raw;
  }
  return {
    startDate,
    endDate,
    postTitle: title,
    hasPost: Boolean(startDate),
    effectivePostId
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
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/hooks */ "@wordpress/hooks");
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_hooks__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./style.scss */ "./src/calendar/style.scss");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./edit */ "./src/calendar/edit.js");
/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./save */ "./src/calendar/save.js");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./block.json */ "./src/calendar/block.json");
/* harmony import */ var _transforms__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./transforms */ "./src/calendar/transforms.js");
/* harmony import */ var _variation__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./variation */ "./src/calendar/variation.js");
/* harmony import */ var _variations_pagination__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./variations/pagination */ "./src/calendar/variations/pagination.js");
/* harmony import */ var _variations_bound_blocks__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./variations/bound-blocks */ "./src/calendar/variations/bound-blocks.js");
/* harmony import */ var _bindings__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./bindings */ "./src/calendar/bindings.js");
/**
 * GatherPress Calendar Block Registration
 *
 * @package
 * @since 0.1.0
 */















/**
 * Register the GatherPress Calendar block type
 */
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_7__.name, {
  edit: _edit__WEBPACK_IMPORTED_MODULE_5__["default"],
  save: _save__WEBPACK_IMPORTED_MODULE_6__["default"],
  transforms: _transforms__WEBPACK_IMPORTED_MODULE_8__["default"]
});

/**
 * Reduce UI of GatherPress core query controls.
 *
 * Removes controls, that are not needed by a calendar-view, those are espceially:
 * - Upcoming / Past
 * - include unfinished events
 * - Offset number
 * - Max. count of events to query
 *
 * @see https://github.com/GatherPress/gatherpress/blob/main/docs/developer/blocks/slot-fills/README.md#add-or-remove-ui-elements
 *
 * @since 0.6.0
 */
(0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_1__.addFilter)('gatherpress.eventQueryControls', 'gatherpress-calendar/reduce-query-controls', (controls, {
  clientId
}) => {
  const hasCalendar = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.select)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.store).getBlock(clientId)?.innerBlocks.some(block => 'gatherpress/calendar' === block.name);
  return hasCalendar ? controls.filter(({
    name
  }) => !['listType', 'includeUnfinished', 'offset', 'count'].includes(name)) : controls;
});

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
/* harmony import */ var _edit_constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./edit/constants */ "./src/calendar/edit/constants.js");
/**
 * WordPress dependencies
 */



/**
 * Internal dependencies
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

  // Same blocks as ENTRIES_TEMPLATE; the linked title opens the modal.
  const startTime = (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.createBlock)(..._edit_constants__WEBPACK_IMPORTED_MODULE_2__.ENTRY_START_TIME);
  const trigger = (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.createBlock)(..._edit_constants__WEBPACK_IMPORTED_MODULE_2__.ENTRY_TITLE_TRIGGER);
  const modalManager = (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.createBlock)('gatherpress/modal-manager', _edit_constants__WEBPACK_IMPORTED_MODULE_2__.ENTRY_MODAL_MANAGER_ATTRIBUTES, [startTime, trigger, modal]);
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
    // namespace: 'gatherpress-event-query',
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
      gatherpress_event_query: 'upcoming',
      include_unfinished: 1
    }
  },
  innerBlocks: _edit_constants__WEBPACK_IMPORTED_MODULE_2__.QUERY_VARIATION_INNER_BLOCKS,
  scope: ['inserter']
});

/***/ },

/***/ "./src/calendar/variations/bound-blocks.js"
/*!*************************************************!*\
  !*** ./src/calendar/variations/bound-blocks.js ***!
  \*************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/**
 * GatherPress Calendar Bound Block Variations
 *
 * Registers variations of core/heading and core/paragraph bound to
 * calendar block-bindings sources.
 *
 * @package
 * @since 0.8.0
 */




/**
 * Register variation for core/paragraph bound to gatherpress/calendar-day.
 */
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockVariation)('core/paragraph', {
  name: 'gatherpress-calendar-day-number',
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__._x)('Calendar Day Number', 'Block variation name', 'gatherpress-calendar'),
  description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__._x)('Displays the day number inside a calendar day cell.', 'Block variation description', 'gatherpress-calendar'),
  category: 'gatherpress',
  keywords: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('day', 'gatherpress-calendar'), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('number', 'gatherpress-calendar'), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('calendar', 'gatherpress-calendar')],
  attributes: {
    className: 'gatherpress-calendar__day-number',
    fontSize: 'small',
    placeholder: 'DD',
    content: 'DD',
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
    metadata: {
      bindings: {
        content: {
          source: 'gatherpress/calendar-day'
        }
      },
      name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__._x)('Day Number', 'Block variation name', 'gatherpress-calendar')
    }
  },
  isActive: (blockAttributes, variationAttributes) => Boolean(blockAttributes?.className?.split(' ').includes(variationAttributes.className)),
  scope: ['inserter']
});

/***/ },

/***/ "./src/calendar/variations/pagination.js"
/*!***********************************************!*\
  !*** ./src/calendar/variations/pagination.js ***!
  \***********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/**
 * GatherPress Calendar Pagination Block Variations
 *
 * Registers calendar variations of core/query-pagination,
 * core/query-pagination-previous, and core/query-pagination-next.
 *
 * @package
 * @since 0.8.0
 */




/**
 * Register variation for core/query-pagination.
 */
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockVariation)('core/query-pagination', {
  name: 'gatherpress-calendar-pagination',
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__._x)('Calendar Pagination', 'Block variation name', 'gatherpress-calendar'),
  description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__._x)('Displays navigation controls to step through calendar time spans.', 'Block variation description', 'gatherpress-calendar'),
  category: 'gatherpress',
  keywords: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('calendar', 'gatherpress-calendar'), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('pagination', 'gatherpress-calendar'), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('navigation', 'gatherpress-calendar')],
  attributes: {
    className: 'gatherpress-calendar-pagination',
    paginationArrow: 'chevron',
    layout: {
      type: 'flex',
      justifyContent: 'space-between'
    },
    metadata: {
      name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__._x)('Calendar Pagination', 'Block variation name', 'gatherpress-calendar')
    }
  },
  innerBlocks: [['core/query-pagination-previous', {
    className: 'gatherpress-calendar-pagination-previous',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Previous Month', 'gatherpress-calendar'),
    metadata: {
      name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Previous Period', 'gatherpress-calendar')
    }
  }], ['core/query-pagination-next', {
    className: 'gatherpress-calendar-pagination-next',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Next Month', 'gatherpress-calendar'),
    metadata: {
      name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Next Period', 'gatherpress-calendar')
    }
  }]],
  isActive: (blockAttributes, variationAttributes) => Boolean(blockAttributes?.className?.split(' ').includes(variationAttributes.className)),
  scope: ['inserter']
});

/**
 * Register variation for core/query-pagination-previous.
 */
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockVariation)('core/query-pagination-previous', {
  name: 'gatherpress-calendar-pagination-previous',
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__._x)('Previous Calendar Period', 'Block variation name', 'gatherpress-calendar'),
  description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__._x)('Displays the link to navigate to the previous calendar period (month, week, or day).', 'Block variation description', 'gatherpress-calendar'),
  category: 'gatherpress',
  keywords: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('previous', 'gatherpress-calendar'), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('calendar', 'gatherpress-calendar')],
  attributes: {
    className: 'gatherpress-calendar-pagination-previous',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Previous Month', 'gatherpress-calendar'),
    metadata: {
      name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__._x)('Previous Calendar Period', 'Block variation name', 'gatherpress-calendar')
    }
  },
  isActive: (blockAttributes, variationAttributes) => Boolean(blockAttributes?.className?.split(' ').includes(variationAttributes.className)),
  scope: ['inserter']
});

/**
 * Register variation for core/query-pagination-next.
 */
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockVariation)('core/query-pagination-next', {
  name: 'gatherpress-calendar-pagination-next',
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__._x)('Next Calendar Period', 'Block variation name', 'gatherpress-calendar'),
  description: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__._x)('Displays the link to navigate to the next calendar period (month, week, or day).', 'Block variation description', 'gatherpress-calendar'),
  category: 'gatherpress',
  keywords: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('next', 'gatherpress-calendar'), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('calendar', 'gatherpress-calendar')],
  attributes: {
    className: 'gatherpress-calendar-pagination-next',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Next Month', 'gatherpress-calendar'),
    metadata: {
      name: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__._x)('Next Calendar Period', 'Block variation name', 'gatherpress-calendar')
    }
  },
  isActive: (blockAttributes, variationAttributes) => Boolean(blockAttributes?.className?.split(' ').includes(variationAttributes.className)),
  scope: ['inserter']
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

/***/ "./src/utils/post-types.js"
/*!*********************************!*\
  !*** ./src/utils/post-types.js ***!
  \*********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DISABLED_FIELD_OPACITY: () => (/* binding */ DISABLED_FIELD_OPACITY),
/* harmony export */   isEventPostType: () => (/* binding */ isEventPostType),
/* harmony export */   isPostTypeSupporting: () => (/* binding */ isPostTypeSupporting),
/* harmony export */   usePostTypeSupports: () => (/* binding */ usePostTypeSupports)
/* harmony export */ });
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_0__);


/**
 * Opacity value for disabled form fields and elements.
 *
 * This constant defines the opacity level applied to form fields and UI elements
 * when they are disabled due to event settings (e.g., when guest limits are 0
 * or anonymous RSVP is disabled).
 *
 * @since 0.27.0
 * @type {number}
 */
const DISABLED_FIELD_OPACITY = 0.3;

/**
 * Checks if a post type has a given GatherPress post type support.
 *
 * If a postType argument is provided, checks against that value.
 * Otherwise, queries the current post type using the `select` function from the `core/editor` package.
 * Uses the WordPress data store to check post type supports.
 *
 * @since 0.27.0
 *
 * @param {string}      support  The post type support to check (e.g. 'gatherpress-event-date').
 * @param {string|null} postType Optional post type to check. If not provided, checks current editor post type.
 *
 * @return {boolean} True if the post type has the given support, false otherwise.
 */
function isPostTypeSupporting(support, postType = null) {
  const typeToCheck = postType ?? (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.select)('core/editor')?.getCurrentPostType();
  if (!typeToCheck) {
    return false;
  }
  const postTypeObject = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.select)('core').getPostType(typeToCheck);
  return !!postTypeObject?.supports?.[support];
}

/**
 * Reactive variant of `isPostTypeSupporting` for use in React components.
 *
 * `isPostTypeSupporting` reads `getPostType()` non-reactively, so when the
 * post-type definition isn't yet cached at render time the support gate
 * resolves to `false` and the component never re-renders once it loads.
 * This hook subscribes via `useSelect` so the component re-renders the moment
 * the supports become known — which is the difference between a permanently
 * dimmed block in a Query Loop and one that lights up correctly.
 *
 * @since 0.27.0
 *
 * @param {string}      support  The post type support to check.
 * @param {string|null} postType Optional post type to check. Falls back to the editor post type.
 *
 * @return {boolean} True if the resolved post type has the given support, false otherwise.
 */
function usePostTypeSupports(support, postType = null) {
  return (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.useSelect)(wpSelect => {
    const typeToCheck = postType ?? wpSelect('core/editor')?.getCurrentPostType();
    if (!typeToCheck) {
      return false;
    }
    return !!wpSelect('core').getPostType(typeToCheck)?.supports?.[support];
  }, [support, postType]);
}

/**
 * Checks if a post type supports event_date in the GatherPress application.
 *
 * @since 0.27.0
 *
 * @param {string|null} postType Optional post type to check. If not provided, checks current editor post type.
 *
 * @return {boolean} True if the post type supports event_date, false otherwise.
 */
function isEventPostType(postType = null) {
  return isPostTypeSupporting('gatherpress-event-date', postType);
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

/***/ "@gatherpress/query-controls"
/*!************************************************!*\
  !*** external ["gatherpress","queryControls"] ***!
  \************************************************/
(module) {

module.exports = window["gatherpress"]["queryControls"];

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

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"gatherpress/calendar","version":"0.5.0","title":"GatherPress Calendar","category":"gatherpress","icon":"calendar-alt","description":"Display query loop posts in a monthly, weekly, or daily calendar format.","ancestor":["core/query"],"allowedBlocks":["gatherpress/calendar-week"],"usesContext":["queryId","query","queryContext","displayLayout","templateSlug","previewPostType","postId","postType"],"providesContext":{"gatherpress/viewType":"viewType","gatherpress/showWeekends":"showWeekends"},"attributes":{"viewType":{"type":"string","enum":["month","week","day"],"default":"month"},"unitCount":{"type":"number","default":1},"selectedDate":{"type":"string","default":""},"dateModifier":{"type":"number","default":0},"showWeekdays":{"type":"boolean","default":true},"showWeekends":{"type":"boolean","default":true},"dateRangeSource":{"type":"string","enum":["default","context","selected"],"default":"default"},"postId":{"type":"number","default":0},"sourcePostType":{"type":"string","default":""}},"supports":{"interactivity":true,"reusable":false,"html":false,"align":true,"alignWide":true,"customClassName":true,"color":{"gradients":true,"link":false,"text":false,"__experimentalDefaultControls":{"background":true}},"spacing":{"margin":true,"padding":true,"blockGap":["horizontal","vertical"]},"__experimentalBorder":{"color":true,"radius":false,"style":true,"width":true},"layout":{"allowEditing":false}},"styles":[{"name":"default","label":"Classic","isDefault":true},{"name":"minimal","label":"Minimal"},{"name":"bold","label":"Bold"},{"name":"circular","label":"Circular"},{"name":"gradient","label":"Gradient"}],"textdomain":"gatherpress-calendar","editorScript":"file:./index.js","style":"file:./style-index.css","viewScriptModule":"file:./view.js"}');

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