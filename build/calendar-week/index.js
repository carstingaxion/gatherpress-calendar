/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/calendar-week/edit.js"
/*!***********************************!*\
  !*** ./src/calendar-week/edit.js ***!
  \***********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./editor.scss */ "./src/calendar-week/editor.scss");
/* harmony import */ var _calendar_edit_constants__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../calendar/edit/constants */ "./src/calendar/edit/constants.js");
/* harmony import */ var _calendar_edit_components_DayPreviewCell__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../calendar/edit/components/DayPreviewCell */ "./src/calendar/edit/components/DayPreviewCell.js");
/* harmony import */ var _utils_use_stable_value__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils/use-stable-value */ "./src/utils/use-stable-value.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__);








const EMPTY_ARRAY = [];
const NOOP = () => {};

/**
 * Edit Component for Calendar Week
 *
 * Renders one week row. Exactly one day (the one matching the
 * `gatherpress/activeDate` context) is mounted as the real, live/editable
 * gatherpress/calendar-day block via InnerBlocks. The other days in the
 * row are read-only virtual previews of that same day template, rendered
 * with their own date/day-number/posts context - mirroring what
 * Calendar_Week::render() does on the frontend.
 *
 * @param {Object} props          Component props.
 * @param {Object} props.context  Context provided by the Calendar block.
 * @param {string} props.clientId This week block's client ID.
 *
 * @return {Element} Week row element.
 */
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.memo)(function Edit({
  context,
  clientId
}) {
  const rawWeekDays = context?.['gatherpress/weekDays'];
  const weekDays = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => rawWeekDays ?? EMPTY_ARRAY, [rawWeekDays]);
  const activeDate = context?.['gatherpress/activeDate'] ?? '';
  const setActiveDate = context?.['gatherpress/setActiveDate'] ?? NOOP;

  // The real day template's inner blocks (Day Number, Post Title, Event
  // Date, etc.) and the real day block's own attributes (for color/border
  // style parity), used to render the non-active days as previews.
  const {
    dayInnerBlocks,
    dayBlockAttributes
  } = (0,_utils_use_stable_value__WEBPACK_IMPORTED_MODULE_6__.useStableValue)((0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.useSelect)(select => {
    const {
      getBlocks
    } = select(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.store);
    const dayBlock = getBlocks(clientId)[0];
    return {
      dayInnerBlocks: dayBlock ? getBlocks(dayBlock.clientId) : [],
      dayBlockAttributes: dayBlock?.attributes ?? {}
    };
  }, [clientId]));
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)({
    className: 'gatherpress-calendar__week'
  });
  const {
    children,
    ...innerBlocksWrapperProps
  } = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useInnerBlocksProps)(blockProps, {
    allowedBlocks: ['gatherpress/calendar-day'],
    template: _calendar_edit_constants__WEBPACK_IMPORTED_MODULE_4__.DAY_TEMPLATE,
    templateLock: false,
    renderAppender: false
  });
  const activeDayIndex = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => weekDays.findIndex(day => day.date === activeDate), [weekDays, activeDate]);
  const activeDay = weekDays[activeDayIndex];

  // The live day block doesn't have real calendar-week/calendar-day
  // ancestors providing dayDate/dayNumber/etc., so we supply them here,
  // exactly like the preview cells do.
  const activeDayContext = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => activeDay ? {
    'gatherpress/dayDate': activeDay.date ?? '',
    'gatherpress/dayNumber': activeDay.day ?? 0,
    'gatherpress/dayPosts': activeDay.posts ?? [],
    'gatherpress/isEmpty': !!activeDay.isEmpty,
    'gatherpress/isToday': !!activeDay.isToday,
    'gatherpress/weekday': activeDay.weekday ?? '',
    'gatherpress/isWeekend': !!activeDay.isWeekend
  } : {}, [activeDay]);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("tr", {
    ...innerBlocksWrapperProps,
    children: weekDays.map((day, dayIndex) => dayIndex === activeDayIndex ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.BlockContextProvider, {
      value: activeDayContext,
      children: children
    }, day.date ?? `empty-${dayIndex}`) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_calendar_edit_components_DayPreviewCell__WEBPACK_IMPORTED_MODULE_5__.DayPreviewCell, {
      day: day,
      innerBlocks: dayInnerBlocks,
      dayBlockAttributes: dayBlockAttributes,
      onActivateDay: setActiveDate
    }, day.date ?? `empty-${dayIndex}`))
  });
}));

/***/ },

/***/ "./src/calendar-week/index.js"
/*!************************************!*\
  !*** ./src/calendar-week/index.js ***!
  \************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./block.json */ "./src/calendar-week/block.json");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./edit */ "./src/calendar-week/edit.js");
/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./save */ "./src/calendar-week/save.js");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./style.scss */ "./src/calendar-week/style.scss");





(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_1__.name, {
  edit: _edit__WEBPACK_IMPORTED_MODULE_2__["default"],
  save: _save__WEBPACK_IMPORTED_MODULE_3__["default"]
});

/***/ },

/***/ "./src/calendar-week/save.js"
/*!***********************************!*\
  !*** ./src/calendar-week/save.js ***!
  \***********************************/
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
 * GatherPress Calendar Week Block Save Component
 *
 * Server-side rendering generates the <tr> container and injects context;
 * this save component preserves the InnerBlocks template structure.
 *
 * @package
 * @since 0.4.0
 */


function save() {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.InnerBlocks.Content, {});
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

/***/ "./src/calendar-week/editor.scss"
/*!***************************************!*\
  !*** ./src/calendar-week/editor.scss ***!
  \***************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "./src/calendar-week/style.scss"
/*!**************************************!*\
  !*** ./src/calendar-week/style.scss ***!
  \**************************************/
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

/***/ "./src/calendar-week/block.json"
/*!**************************************!*\
  !*** ./src/calendar-week/block.json ***!
  \**************************************/
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"gatherpress/calendar-week","version":"0.4.0","title":"Calendar Week","category":"gatherpress","icon":"table-row-after","description":"A week row container in the GatherPress Calendar grid.","parent":["gatherpress/calendar"],"allowedBlocks":["gatherpress/calendar-day"],"usesContext":["queryId","gatherpress/year","gatherpress/month","gatherpress/weekIndex","gatherpress/weekDays","gatherpress/activeDate","gatherpress/setActiveDate","gatherpress/showWeekends"],"providesContext":{"gatherpress/weekIndex":"weekIndex"},"attributes":{"weekIndex":{"type":"number","default":0}},"supports":{"interactivity":{"clientNavigation":true},"html":false,"reusable":false,"customClassName":true,"color":{"background":false,"text":true,"gradients":false}},"textdomain":"gatherpress-calendar","editorScript":"file:./index.js","editorStyle":"file:./index.css","style":"file:./style-index.css"}');

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
/******/ 			"calendar-week/index": 0,
/******/ 			"calendar-week/style-index": 0
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
/******/ 	let __webpack_exports__ = __webpack_require__.O(undefined, ["calendar-week/style-index"], () => (__webpack_require__("./src/calendar-week/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=index.js.map