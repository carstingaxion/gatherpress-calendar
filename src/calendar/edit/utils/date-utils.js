/**
 * Date utility functions for GatherPress Calendar.
 *
 * @package
 */

import { dateI18n } from '@wordpress/date';
import { _x, sprintf } from '@wordpress/i18n';
import { isWeekendDay } from './calendar-utils';

/**
 * Normalizes a Date object to 12:00:00 noon to prevent midnight timezone shifts.
 *
 * @param {Date} date Calendar date object.
 * @return {Date} Date object set to noon.
 */
function atNoon( date ) {
	return new Date(
		date.getFullYear(),
		date.getMonth(),
		date.getDate(),
		12,
		0,
		0
	);
}

/**
 * Formats a calendar Date object into YYYY-MM-DD without timezone shifting.
 *
 * @param {Date} date Calendar date object.
 * @return {string} YYYY-MM-DD date string.
 */
export function formatDate( date ) {
	const year = date.getFullYear();
	const month = String( date.getMonth() + 1 ).padStart( 2, '0' );
	const day = String( date.getDate() ).padStart( 2, '0' );
	return `${ year }-${ month }-${ day }`;
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
export function calculateTargetDate( {
	viewType = 'month',
	selectedDate = '',
	dateModifier = 0,
} = {} ) {
	let targetDate;

	if ( selectedDate && /^\d{4}-\d{2}-\d{2}$/.test( selectedDate ) ) {
		const [ year, month, day ] = selectedDate.split( '-' ).map( Number );
		targetDate = new Date( year, month - 1, day, 12, 0, 0 );
	} else if ( selectedDate && /^\d{4}-\d{2}$/.test( selectedDate ) ) {
		const [ year, month ] = selectedDate.split( '-' ).map( Number );
		targetDate = new Date( year, month - 1, 1, 12, 0, 0 );
	} else {
		const now = new Date();
		targetDate = new Date(
			now.getFullYear(),
			now.getMonth(),
			now.getDate(),
			12,
			0,
			0
		);
	}

	if ( 'month' === viewType ) {
		targetDate.setDate( 1 );
	}

	if ( 0 !== dateModifier ) {
		if ( 'week' === viewType ) {
			targetDate.setDate( targetDate.getDate() + dateModifier * 7 );
		} else if ( 'day' === viewType ) {
			targetDate.setDate( targetDate.getDate() + dateModifier );
		} else {
			targetDate.setDate( 1 );
			targetDate.setMonth( targetDate.getMonth() + dateModifier );
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
export function calculatePostSpanUnits(
	viewType,
	startDateStr,
	endDateStr,
	startOfWeek = 0
) {
	if ( ! startDateStr || ! endDateStr ) {
		return 1;
	}

	const [ sY, sM, sD ] = startDateStr.split( '-' ).map( Number );
	const [ eY, eM, eD ] = endDateStr.split( '-' ).map( Number );
	const startObj = new Date( sY, sM - 1, sD, 12, 0, 0 );
	const endObj = new Date( eY, eM - 1, eD, 12, 0, 0 );

	if ( 'day' === viewType ) {
		const daysDiff = Math.max(
			1,
			Math.round( ( endObj - startObj ) / ( 1000 * 60 * 60 * 24 ) ) + 1
		);
		return Math.min( 7, daysDiff );
	}

	if ( 'week' === viewType ) {
		const currentDow = startObj.getDay();
		const diff = ( currentDow - startOfWeek + 7 ) % 7;
		const rawWeekStart = new Date( startObj );
		rawWeekStart.setDate( startObj.getDate() - diff );

		const endDow = endObj.getDay();
		const endDiff = ( endDow - startOfWeek + 7 ) % 7;
		const rawWeekEnd = new Date( endObj );
		rawWeekEnd.setDate( endObj.getDate() - endDiff );

		const weeksDiff = Math.max(
			1,
			Math.round(
				( rawWeekEnd - rawWeekStart ) / ( 1000 * 60 * 60 * 24 * 7 )
			) + 1
		);
		return Math.min( 5, weeksDiff );
	}

	const monthsDiff =
		( endObj.getFullYear() - startObj.getFullYear() ) * 12 +
		( endObj.getMonth() - startObj.getMonth() ) +
		1;

	return Math.max( 1, Math.min( 12, monthsDiff ) );
}

/**
 * Calculate range and boundaries for a given date selection.
 *
 * @param {Object} options     Options containing viewType, selectedDate, unitCount, dateModifier, etc.
 * @param {number} startOfWeek Start of week index (0-6).
 *
 * @return {Object} Range object.
 */
export function calculateDateRange( options = {}, startOfWeek = 0 ) {
	const viewType = options.viewType || 'month';
	const showWeekends =
		options.showWeekends !== false && options.showWeekends !== 'false';
	const unitCount = Math.max( 1, options.unitCount || 1 );
	const targetDate = calculateTargetDate( options );

	let startDate;
	let endDate;
	let rawWeekStart;

	if ( 'week' === viewType ) {
		const currentDow = targetDate.getDay();
		const diff = ( currentDow - startOfWeek + 7 ) % 7;
		rawWeekStart = new Date( targetDate );
		rawWeekStart.setDate( targetDate.getDate() - diff );

		const totalDays = unitCount * 7;
		const visibleDays = [];
		for ( let i = 0; i < totalDays; i++ ) {
			const d = new Date( rawWeekStart );
			d.setDate( rawWeekStart.getDate() + i );
			if ( showWeekends || ! isWeekendDay( d.getDay() ) ) {
				visibleDays.push( d );
			}
		}

		if ( visibleDays.length > 0 ) {
			startDate = visibleDays[ 0 ];
			endDate = visibleDays[ visibleDays.length - 1 ];
		} else {
			startDate = rawWeekStart;
			endDate = new Date( rawWeekStart );
			endDate.setDate( rawWeekStart.getDate() + totalDays - 1 );
		}
	} else if ( 'day' === viewType ) {
		startDate = new Date( targetDate );
		endDate = new Date( targetDate );
		endDate.setDate( targetDate.getDate() + unitCount - 1 );
	} else {
		const year = targetDate.getFullYear();
		const month = targetDate.getMonth();
		startDate = new Date( year, month, 1, 12, 0, 0 );
		endDate = new Date( year, month + unitCount, 0, 12, 0, 0 );
	}

	return {
		startDate: formatDate( startDate ),
		endDate: formatDate( endDate ),
		startDateObj: startDate,
		endDateObj: endDate,
		rawWeekStart: rawWeekStart || startDate,
		year: targetDate.getFullYear(),
		month: targetDate.getMonth() + 1,
		targetDate,
		viewType,
		unitCount,
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
export function calculateDateQuery( options = {}, startOfWeek = 0 ) {
	const range = calculateDateRange( options, startOfWeek );

	return {
		year: range.year,
		month: range.month,
		startDate: range.startDate,
		endDate: range.endDate,
		viewType: range.viewType,
		unitCount: range.unitCount,
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
export function formatHeading( viewType, startDate, endDate ) {
	const isSameDay = startDate.toDateString() === endDate.toDateString();

	if ( 'day' === viewType && isSameDay ) {
		return dateI18n(
			/* translators: Date format, see https://www.php.net/manual/datetime.format.php */
			_x(
				'l, F j, Y',
				'Calendar heading: single day',
				'gatherpress-calendar'
			),
			atNoon( startDate )
		);
	}

	let start = atNoon( startDate );
	let end = atNoon( endDate );

	const startYear = start.getFullYear();
	const endYear = end.getFullYear();
	const startMonth = start.getMonth();
	const endMonth = end.getMonth();

	let startFormat;
	let endFormat;

	if ( 'day' === viewType || 'week' === viewType ) {
		if ( startYear !== endYear ) {
			startFormat = _x(
				/* translators: Date format, see https://www.php.net/manual/datetime.format.php */
				'M j, Y',
				'Calendar heading: start of date range across years',
				'gatherpress-calendar'
			);
			endFormat = _x(
				/* translators: Date format, see https://www.php.net/manual/datetime.format.php */
				'M j, Y',
				'Calendar heading: end of date range',
				'gatherpress-calendar'
			);
		} else if ( startMonth !== endMonth ) {
			startFormat = _x(
				/* translators: Date format, see https://www.php.net/manual/datetime.format.php */
				'M j',
				'Calendar heading: start of date range across months',
				'gatherpress-calendar'
			);
			endFormat = _x(
				/* translators: Date format, see https://www.php.net/manual/datetime.format.php */
				'M j, Y',
				'Calendar heading: end of date range',
				'gatherpress-calendar'
			);
		} else {
			startFormat = _x(
				/* translators: Date format, see https://www.php.net/manual/datetime.format.php */
				'M j',
				'Calendar heading: start of date range within a month',
				'gatherpress-calendar'
			);
			endFormat = _x(
				/* translators: Date format, see https://www.php.net/manual/datetime.format.php */
				'j, Y',
				'Calendar heading: end of date range within a month',
				'gatherpress-calendar'
			);
		}
	} else {
		// Month view: format a mid-month date so browser-site timezone differences
		// cannot shift the formatted month to an adjacent month.
		start = new Date( startYear, startMonth, 15, 12, 0, 0 );
		end = new Date( endYear, endMonth, 15, 12, 0, 0 );

		if ( startYear === endYear && startMonth === endMonth ) {
			return dateI18n(
				/* translators: Date format, see https://www.php.net/manual/datetime.format.php */
				_x(
					'F Y',
					'Calendar heading: single month',
					'gatherpress-calendar'
				),
				start
			);
		}

		if ( startYear !== endYear ) {
			startFormat = _x(
				/* translators: Date format, see https://www.php.net/manual/datetime.format.php */
				'M Y',
				'Calendar heading: month range across years',
				'gatherpress-calendar'
			);
			endFormat = startFormat;
		} else {
			startFormat = _x(
				/* translators: Date format, see https://www.php.net/manual/datetime.format.php */
				'F',
				'Calendar heading: start of month range within a year',
				'gatherpress-calendar'
			);
			endFormat = _x(
				/* translators: Date format, see https://www.php.net/manual/datetime.format.php */
				'F Y',
				'Calendar heading: end of month range within a year',
				'gatherpress-calendar'
			);
		}
	}

	return sprintf(
		/* translators: %1$s: start date, %2$s: end date. */
		_x(
			'%1$s – %2$s',
			'Calendar heading: date range',
			'gatherpress-calendar'
		),
		dateI18n( startFormat, start ),
		dateI18n( endFormat, end )
	);
}
