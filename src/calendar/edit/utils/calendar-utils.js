/**
 * Calendar generation utility functions.
 *
 * @package
 */
import { __, _n, _x, sprintf } from '@wordpress/i18n';
import { dateI18n, format } from '@wordpress/date';
import { select } from '@wordpress/data';

import { DATE_FORMAT } from '../constants';
import { formatDate } from './date-utils';
import { isEventPostType } from '../../../utils/post-types';

export const WEEKDAY_SLUGS = [
	'sunday',
	'monday',
	'tuesday',
	'wednesday',
	'thursday',
	'friday',
	'saturday',
];

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
export function getWeekendDays() {
	const settings = select( 'core/editor' )?.getEditorSettings?.();
	return Array.isArray( settings?.gatherpress?.weekendDays )
		? settings.gatherpress.weekendDays
		: [ 0, 6 ];
}

/**
 * Retrieves the maximum number of posts to query for calendar display in the editor.
 * Defaults to 500.
 *
 * @return {number} Maximum number of posts to query.
 */
export function getPostsPerPage() {
	const settings = select( 'core/editor' )?.getEditorSettings?.();
	const postsPerPage = Number( settings?.gatherpress?.postsPerPage );
	return ! Number.isNaN( postsPerPage ) && postsPerPage > 0
		? postsPerPage
		: 500;
}

export function isWeekendDay( dayOfWeek ) {
	return getWeekendDays().includes( dayOfWeek );
}

export function getColumnsCount( viewType, showWeekends, unitCount = 1 ) {
	if ( 'day' === viewType ) {
		return Math.max( 1, unitCount );
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
export function getDayNames( startOfWeek = 0, showWeekends = true ) {
	const days = [];

	// Base date: 2024-01-07 is a Sunday (day 0).
	// We use a fixed date at noon UTC and format in UTC so timezone shifts
	// never change the day name.
	const baseSunday = new Date( '2024-01-07T12:00:00Z' );

	for ( let i = 0; i < 7; i++ ) {
		// Calculate the day of week (0=Sunday, 6=Saturday).
		// The modulo ensures we wrap around (e.g., day 7 becomes day 0).
		const dayOfWeek = ( startOfWeek + i ) % 7;

		if ( ! showWeekends && isWeekendDay( dayOfWeek ) ) {
			continue;
		}

		// Create a date for this day of week by adding days to base Sunday in UTC.
		const dayDate = new Date( baseSunday );
		dayDate.setUTCDate( baseSunday.getUTCDate() + dayOfWeek );

		// Get the abbreviated day name using dateI18n for proper localization.
		// 'D' format returns the abbreviated day name (e.g., 'Mon', 'Tue', etc.).
		// This respects the site's language setting via WordPress core.
		// Format in UTC for proper localization without site timezone shift.
		days.push( dateI18n( 'D', dayDate, 'UTC' ) );
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
export function generateMonthOptions() {
	const options = [];
	const currentDate = new Date();
	const currentYear = currentDate.getFullYear();

	// Generate options for current year and next year.
	for ( let year = currentYear - 1; year <= currentYear + 1; year++ ) {
		for ( let month = 1; month <= 12; month++ ) {
			const date = new Date( year, month - 1, 15, 12, 0, 0 );
			const value = `${ year }-${ String( month ).padStart( 2, '0' ) }`;
			const label = dateI18n( 'F Y', date );
			options.push( { value, label } );
		}
	}

	return options;
}

/**
 * Organizes posts by YYYY-MM-DD date string.
 *
 * @param {Array} posts Raw post entities.
 * @return {Object} Posts grouped by date string.
 */
export function groupPostsByDate( posts = [] ) {
	const grouped = {};
	if ( ! posts || ! posts.length ) {
		return grouped;
	}

	posts.forEach( ( post ) => {
		const isEvent = isEventPostType( post.type );
		const postDate = isEvent
			? post.meta?.gatherpress_datetime_start
			: post.date;

		if ( ! postDate ) {
			return;
		}

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
		const dateStr =
			isEvent && post.meta?.gatherpress_datetime_start
				? post.meta.gatherpress_datetime_start.slice( 0, 10 )
				: dateI18n( DATE_FORMAT, new Date( postDate ) );

		if ( ! grouped[ dateStr ] ) {
			grouped[ dateStr ] = [];
		}
		grouped[ dateStr ].push( post );
	} );

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
function createDayEntry( dateObj, postsByDate, todayStr ) {
	const dayOfWeek = dateObj.getDay();
	const dateStr = formatDate( dateObj );
	const isToday = dateStr === todayStr;
	const isPast = dateStr < todayStr;
	const isFuture = dateStr > todayStr;

	return {
		day: dateObj.getDate(),
		date: dateStr,
		posts: postsByDate?.[ dateStr ] ?? [],
		isEmpty: false,
		isToday,
		isPast,
		isFuture,
		dayOfWeek,
		weekday: WEEKDAY_SLUGS[ dayOfWeek ],
		isWeekend: isWeekendDay( dayOfWeek ),
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
export function buildWeeks(
	year,
	month,
	startOfWeek,
	daysInMonth,
	postsByDate = {},
	showWeekends = true
) {
	// Today's date string, used to flag the current day in the grid.
	const today = dateI18n( DATE_FORMAT, new Date() );
	const activeDaysOfWeek = [];

	for ( let i = 0; i < 7; i++ ) {
		const dow = ( startOfWeek + i ) % 7;
		if ( ! showWeekends && isWeekendDay( dow ) ) {
			continue;
		}
		activeDaysOfWeek.push( dow );
	}

	const daysPerWeek = activeDaysOfWeek.length;
	const weeks = [];
	let currentWeek = [];
	let firstDayPlaced = false;

	for ( let day = 1; day <= daysInMonth; day++ ) {
		const dateObj = new Date( year, month - 1, day );
		const dayOfWeek = dateObj.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat

		// Skip weekends if hidden
		if ( ! showWeekends && isWeekendDay( dayOfWeek ) ) {
			continue;
		}

		// Pre-pad leading empty days before the first visible day of the month
		if ( ! firstDayPlaced ) {
			firstDayPlaced = true;
			const startCol = activeDaysOfWeek.indexOf( dayOfWeek );
			const emptyDays = -1 !== startCol ? startCol : 0;

			// Fill initial empty days before the month starts.
			for ( let i = 0; i < emptyDays; i++ ) {
				currentWeek.push( { isEmpty: true, posts: [] } );
			}
		}

		currentWeek.push( createDayEntry( dateObj, postsByDate, today ) );

		// When week is complete (5 or 7 days), start a new week.
		if ( currentWeek.length === daysPerWeek ) {
			weeks.push( currentWeek );
			currentWeek = [];
		}
	}

	// Fill remaining empty days after the month ends.
	while ( currentWeek.length > 0 && currentWeek.length < daysPerWeek ) {
		currentWeek.push( { isEmpty: true, posts: [] } );
	}

	if ( currentWeek.length > 0 ) {
		weeks.push( currentWeek );
	}

	return weeks;
}

/**
 * Build single week view without artificial empty padding.
 *
 * @param {Date}    weekStartObj Start date of the week.
 * @param {number}  unitCount    Number of units to show.
 * @param {Object}  postsByDate  Posts grouped by date.
 * @param {boolean} showWeekends Weekend visibility.
 *
 * @return {Array[]} Single-element array containing the week days.
 */
export function buildConsecutiveWeeks(
	weekStartObj,
	unitCount,
	postsByDate = {},
	showWeekends = true
) {
	const today = dateI18n( DATE_FORMAT, new Date() );
	const weeks = [];

	for ( let w = 0; w < unitCount; w++ ) {
		const week = [];
		const currentWeekStart = new Date( weekStartObj );
		currentWeekStart.setDate( weekStartObj.getDate() + w * 7 );

		for ( let i = 0; i < 7; i++ ) {
			const dateObj = new Date( currentWeekStart );
			dateObj.setDate( currentWeekStart.getDate() + i );

			if ( ! showWeekends && isWeekendDay( dateObj.getDay() ) ) {
				continue;
			}

			week.push( createDayEntry( dateObj, postsByDate, today ) );
		}

		weeks.push( week );
	}

	return weeks;
}

/**
 * Build single day view.
 *
 * @param {Date}   startDayObj Day Date object.
 * @param {number} unitCount   Number of units to show.
 * @param {Object} postsByDate Posts grouped by date.
 *
 * @return {Array[]} Single-element array with single-day week.
 */
export function buildConsecutiveDays(
	startDayObj,
	unitCount,
	postsByDate = {}
) {
	const today = dateI18n( DATE_FORMAT, new Date() );
	const days = [];

	for ( let i = 0; i < unitCount; i++ ) {
		const dateObj = new Date( startDayObj );
		dateObj.setDate( startDayObj.getDate() + i );
		days.push( createDayEntry( dateObj, postsByDate, today ) );
	}

	return [ days ];
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
export function getWeekNumber( week, startOfWeek = 0 ) {
	const day = week.find( ( entry ) => entry.date );
	if ( ! day ) {
		return 0;
	}

	const [ year, month, dayOfMonth ] = day.date.split( '-' ).map( Number );
	const offset = ( day.dayOfWeek - startOfWeek + 7 ) % 7;

	// format() keeps the local date, dateI18n() would shift it to the site timezone.
	return Number(
		format( 'W', new Date( year, month - 1, dayOfMonth - offset + 3 ) )
	);
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
export function generateCalendar(
	posts = [],
	startOfWeek = 0,
	dateRange,
	showWeekends = true
) {
	const postsByDate = groupPostsByDate( posts );
	const viewType = dateRange.viewType || 'month';
	const unitCount = Math.max( 1, dateRange.unitCount || 1 );
	const units = [];

	if ( 'day' === viewType ) {
		const startObj =
			dateRange.startDateObj || new Date( dateRange.startDate );
		const dayNames = [];
		for ( let i = 0; i < unitCount; i++ ) {
			const d = new Date( startObj );
			d.setDate( startObj.getDate() + i );
			dayNames.push( dateI18n( 'D', d ) );
		}
		const weeks = buildConsecutiveDays( startObj, unitCount, postsByDate );
		units.push( { dayNames, weeks } );

		return { dayNames, weeks, units, viewType, unitCount };
	}

	if ( 'week' === viewType ) {
		const weekStart =
			dateRange.rawWeekStart ||
			dateRange.startDateObj ||
			new Date( dateRange.startDate );
		const dayNames = getDayNames( startOfWeek, showWeekends );
		const weeks = buildConsecutiveWeeks(
			weekStart,
			unitCount,
			postsByDate,
			showWeekends
		);
		// Only several week rows need a week number to tell them apart.
		const weekNumbers =
			unitCount > 1
				? weeks.map( ( week ) => getWeekNumber( week, startOfWeek ) )
				: undefined;
		units.push( { dayNames, weeks, weekNumbers } );

		return { dayNames, weeks, units, viewType, unitCount };
	}

	// Month view: construct unitCount distinct month objects
	const startObj = dateRange.startDateObj || new Date( dateRange.startDate );
	for ( let i = 0; i < unitCount; i++ ) {
		const monthDate = new Date(
			startObj.getFullYear(),
			startObj.getMonth() + i,
			1
		);
		const mYear = monthDate.getFullYear();
		const mMonth = monthDate.getMonth() + 1;
		const daysInMonth = new Date( mYear, mMonth, 0 ).getDate();
		const mWeeks = buildWeeks(
			mYear,
			mMonth,
			startOfWeek,
			daysInMonth,
			postsByDate,
			showWeekends
		);
		const mDayNames = getDayNames( startOfWeek, showWeekends );

		units.push( {
			dayNames: mDayNames,
			weeks: mWeeks,
			weekNumbers: mWeeks.map( ( week ) =>
				getWeekNumber( week, startOfWeek )
			),
		} );
	}

	return {
		dayNames: units[ 0 ].dayNames,
		weeks: units[ 0 ].weeks,
		units,
		viewType,
		unitCount,
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
export function getDefaultActiveDate( calendar ) {
	const allWeeks = calendar.units
		? calendar.units.flatMap( ( u ) => u.weeks )
		: calendar.weeks;
	const days = allWeeks.flat();
	const todayEntry = days.find( ( day ) => ! day.isEmpty && day.isToday );

	if ( todayEntry ) {
		return todayEntry.date;
	}

	const firstDay = days.find( ( day ) => ! day.isEmpty );
	return firstDay ? firstDay.date : '';
}

/**
 * Resolves the calendar block name based on viewType and unitCount.
 *
 * @param {string} viewType  View type: 'month' | 'week' | 'day'.
 * @param {number} unitCount Number of units.
 * @param {string} name      Block name.
 * @return {string} Formatted name (e.g. "Month Calendar" or "3 Month Calendar").
 */
export function getCalendarBlockName(
	viewType = 'month',
	unitCount = 1,
	name = 'Calendar'
) {
	const count = Number( unitCount ) || 1;

	const viewLabels = {
		month: __( 'Month', 'gatherpress-calendar' ),
		week: __( 'Week', 'gatherpress-calendar' ),
		day: __( 'Day', 'gatherpress-calendar' ),
	};

	const label = viewLabels[ viewType ] || viewLabels.month;

	if ( count > 1 ) {
		return sprintf(
			/* translators: %1$d: unit count, %2$s: view type label (Month, Week, Day), %3$s: block name. */
			_x(
				'%1$d %2$s %3$s',
				'Calendar block name',
				'gatherpress-calendar'
			),
			count,
			label,
			name
		);
	}

	return sprintf(
		/* translators: %1$s: view type label (Month, Week, Day), %2$s: block name. */
		_x( '%1$s %2$s', 'Calendar block name', 'gatherpress-calendar' ),
		label,
		name
	);
}

/**
 * Resolves the pagination block label based on direction, viewType, and unitCount.
 * Omits the number when unitCount is 1 (e.g. "Previous Month", "Next 3 Months").
 *
 * @param {string} direction 'previous' | 'next'.
 * @param {string} viewType  'month' | 'week' | 'day'.
 * @param {number} unitCount Number of units.
 * @return {string} Localized label.
 */
export function getPaginationLabel(
	direction = 'next',
	viewType = 'month',
	unitCount = 1
) {
	const count = Number( unitCount ) || 1;

	const directionLabels = {
		next: __( 'Next', 'gatherpress-calendar' ),
		previous: __( 'Previous', 'gatherpress-calendar' ),
	};

	const unitLabels = {
		month: _n( 'Month', 'Months', count, 'gatherpress-calendar' ),
		week: _n( 'Week', 'Weeks', count, 'gatherpress-calendar' ),
		day: _n( 'Day', 'Days', count, 'gatherpress-calendar' ),
	};

	const directionLabel = directionLabels[ direction ] || directionLabels.next;
	const unitLabel = unitLabels[ viewType ] || unitLabels.month;

	if ( count > 1 ) {
		return sprintf(
			/* translators: %1$s: direction label (Next, Previous), %2$d: unit count, %3$s: unit label (Months, Weeks, Days). */
			_x( '%1$s %2$d %3$s', 'Pagination label', 'gatherpress-calendar' ),
			directionLabel,
			count,
			unitLabel
		);
	}

	return sprintf(
		/* translators: %1$s: direction label (Next, Previous), %2$s: unit label (Month, Week, Day). */
		_x( '%1$s %2$s', 'Pagination label', 'gatherpress-calendar' ),
		directionLabel,
		unitLabel
	);
}

/**
 * Recursively find the block bound to the calendar heading source.
 *
 * @param {Array} blocks Array of parsed blocks to search.
 * @return {Object|null} Matching heading block or null.
 */
export function findHeadingBlock( blocks = [] ) {
	for ( const block of blocks ) {
		const source = block.attributes?.metadata?.bindings?.content?.source;
		if ( 'gatherpress/calendar-heading' === source ) {
			return block;
		}
		if ( block.innerBlocks && block.innerBlocks.length ) {
			const found = findHeadingBlock( block.innerBlocks );
			if ( found ) {
				return found;
			}
		}
	}
	return null;
}

/**
 * Recursively find a block by name within an array of blocks.
 *
 * @param {Array}  blocks    Array of parsed blocks.
 * @param {string} blockName Block name to search for.
 * @return {Object|null} Matching block or null.
 */
export function findBlockByName( blocks = [], blockName ) {
	for ( const block of blocks ) {
		if ( block.name === blockName ) {
			return block;
		}
		if ( block.innerBlocks && block.innerBlocks.length ) {
			const found = findBlockByName( block.innerBlocks, blockName );
			if ( found ) {
				return found;
			}
		}
	}
	return null;
}
