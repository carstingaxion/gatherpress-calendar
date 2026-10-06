/**
 * Grid builder functions for calendar units, weeks, and days.
 *
 * @package
 * @since 0.8.0
 */

import { dateI18n, format } from '@wordpress/date';

import { DATE_FORMAT } from '../constants';
import { formatDate } from './date-utils';
import { WEEKDAY_SLUGS, isWeekendDay, getDayNames } from './calendar-utils';
import { isEventPostType } from '../../../utils/post-types';

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
export function createDayEntry( dateObj, postsByDate, todayStr ) {
	const dayOfWeek = dateObj.getDay();
	const dateStr = formatDate( dateObj );

	return {
		day: dateObj.getDate(),
		date: dateStr,
		posts: postsByDate?.[ dateStr ] ?? [],
		isEmpty: false,
		isToday: dateStr === todayStr,
		isPast: dateStr < todayStr,
		isFuture: dateStr > todayStr,
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
		const dayOfWeek = dateObj.getDay();

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
 * Build continuous weeks without artificial empty padding.
 *
 * @param {Date}    weekStartObj Start date of the week.
 * @param {number}  unitCount    Number of units to show.
 * @param {Object}  postsByDate  Posts grouped by date.
 * @param {boolean} showWeekends Weekend visibility.
 *
 * @return {Array[]} Consecutive weeks array.
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
 * Build single or multi-day continuous rows.
 *
 * @param {Date}   startDayObj Day Date object.
 * @param {number} unitCount   Number of units to show.
 * @param {Object} postsByDate Posts grouped by date.
 *
 * @return {Array[]} Single-element array with consecutive days.
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
