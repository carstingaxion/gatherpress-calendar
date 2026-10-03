/**
 * Date utility functions for GatherPress Calendar.
 *
 * @package
 */

import { dateI18n } from '@wordpress/date';
import { isWeekendDay } from './calendar-utils';

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
		targetDate = new Date( year, month - 1, day );
	} else if ( selectedDate && /^\d{4}-\d{2}$/.test( selectedDate ) ) {
		const [ year, month ] = selectedDate.split( '-' ).map( Number );
		targetDate = new Date( year, month - 1, 1 );
	} else {
		targetDate = new Date();
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
 * Calculate range and boundaries for a given date selection.
 *
 * @param {Object} options     Options containing viewType, selectedDate, showWeekends, etc.
 * @param {number} startOfWeek Start of week index (0-6).
 *
 * @return {Object} Range object.
 */
export function calculateDateRange( options = {}, startOfWeek = 0 ) {
	const targetDate = calculateTargetDate( options );
	const viewType = options.viewType || 'month';
	const unitCount = Math.max( 1, options.unitCount || 1 );
	const showWeekends =
		options.showWeekends !== false && options.showWeekends !== 'false';

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
		startDate = new Date( year, month, 1 );
		endDate = new Date( year, month + unitCount, 0 );
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
		return dateI18n( 'l, F j, Y', startDate );
	}

	const startYear = startDate.getFullYear();
	const endYear = endDate.getFullYear();
	// eslint-disable-next-line @wordpress/no-unused-vars-before-return
	const startMonth = startDate.getMonth();
	// eslint-disable-next-line @wordpress/no-unused-vars-before-return
	const endMonth = endDate.getMonth();

	if ( 'day' === viewType || 'week' === viewType ) {
		if ( startYear !== endYear ) {
			return `${ dateI18n( 'M j, Y', startDate ) } – ${ dateI18n(
				'M j, Y',
				endDate
			) }`;
		}

		if ( startMonth !== endMonth ) {
			return `${ dateI18n( 'M j', startDate ) } – ${ dateI18n(
				'M j, Y',
				endDate
			) }`;
		}

		return `${ dateI18n( 'M', startDate ) } ${ dateI18n(
			'j',
			startDate
		) } – ${ dateI18n( 'j, Y', endDate ) }`;
	}

	// Month view: format a mid-month date so browser-site timezone differences
	// cannot shift the formatted month to an adjacent month.
	const midStart = new Date( startYear, startMonth, 15, 12, 0, 0 );
	const midEnd = new Date( endYear, endMonth, 15, 12, 0, 0 );

	if ( startYear === endYear && startMonth === endMonth ) {
		return dateI18n( 'F Y', midStart );
	}

	if ( startYear !== endYear ) {
		return `${ dateI18n( 'M Y', midStart ) } – ${ dateI18n(
			'M Y',
			midEnd
		) }`;
	}

	return `${ dateI18n( 'F', midStart ) } – ${ dateI18n( 'F Y', midEnd ) }`;
}
