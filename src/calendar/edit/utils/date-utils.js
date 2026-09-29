/**
 * Date utility functions for GatherPress Calendar.
 *
 * @package GatherPressCalendar
 */

import { dateI18n } from '@wordpress/date';
import { DATE_FORMAT } from '../constants';
import { isWeekendDay } from './calendar-utils';

/**
 * Format a Date object to YYYY-MM-DD.
 *
 * @param {Date} date Date instance.
 * @return {string} Formatted date.
 */
export function formatDate( date ) {
	return dateI18n( DATE_FORMAT, date );
}

/**
 * Calculate the target date based on viewType, selectedDate and modifiers.
 *
 * @param {string} viewType One of 'month', 'week' or'day'.
 * @param {string} selectedDate The date string.
 * @param {number} dateModifier Modifier offset.
 *
 * @return {Date} Calculated target date.
 */
export function calculateTargetDate( { viewType = 'month', selectedDate = '', dateModifier = 0 } = {} ) {
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
export function calculateDateRange( options, startOfWeek = 0 ) {
	const targetDate = calculateTargetDate( options );
	const viewType = options.viewType || 'month';
	const showWeekends = options.showWeekends !== false && options.showWeekends !== 'false';

	let startDate;
	let endDate;
	let rawWeekStart;

	if ( 'week' === viewType ) {
		const currentDow = targetDate.getDay();
		const diff = ( currentDow - startOfWeek + 7 ) % 7;
		rawWeekStart = new Date( targetDate );
		rawWeekStart.setDate( targetDate.getDate() - diff );

		const visibleDays = [];
		for ( let i = 0; i < 7; i++ ) {
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
			endDate.setDate( rawWeekStart.getDate() + 6 );
		}
	} else if ( 'day' === viewType ) {
		startDate = new Date( targetDate );
		endDate = new Date( targetDate );
	} else {
		const year = targetDate.getFullYear();
		const month = targetDate.getMonth();
		startDate = new Date( year, month, 1 );
		endDate = new Date( year, month + 1, 0 );
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
	};
}

/**
 * Calculate date query parameters for REST requests.
 *
 * @param {Object} options Configuration.
 * @param {number}        startOfWeek            Start of week index.
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
	};
}