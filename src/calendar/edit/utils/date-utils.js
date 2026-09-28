/**
 * Date utility functions for GatherPress Calendar.
 *
 * @package GatherPressCalendar
 */

import { dateI18n } from '@wordpress/date';
import { DATE_FORMAT } from '../constants';

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
 * Calculate the target date based on viewType, selectedDate/Month, and modifiers.
 *
 * @param {Object|string} selectedDateOrOptions Options object or legacy selectedMonth string.
 * @param {number}        modifier              Legacy modifier offset.
 *
 * @return {Date} Calculated target date.
 */
export function calculateTargetDate( selectedDateOrOptions, modifier = 0 ) {
	let viewType = 'month';
	let selectedDate = '';
	let dateModifier = 0;

	if ( typeof selectedDateOrOptions === 'object' && null !== selectedDateOrOptions ) {
		viewType = selectedDateOrOptions.viewType || 'month';
		selectedDate = selectedDateOrOptions.selectedDate || selectedDateOrOptions.selectedMonth || '';
		dateModifier = selectedDateOrOptions.dateModifier ?? selectedDateOrOptions.monthModifier ?? 0;
	} else {
		selectedDate = selectedDateOrOptions || '';
		dateModifier = modifier;
	}

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
 * @param {Object} options     Options containing viewType, selectedDate, etc.
 * @param {number} startOfWeek Start of week index (0-6).
 *
 * @return {Object} Range object with startDate, endDate, year, month, and viewType.
 */
export function calculateDateRange( options, startOfWeek = 0 ) {
	const targetDate = calculateTargetDate( options );
	const viewType = options.viewType || 'month';

	let startDate;
	let endDate;

	if ( 'week' === viewType ) {
		const currentDow = targetDate.getDay();
		const diff = ( currentDow - startOfWeek + 7 ) % 7;
		startDate = new Date( targetDate );
		startDate.setDate( targetDate.getDate() - diff );

		endDate = new Date( startDate );
		endDate.setDate( startDate.getDate() + 6 );
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
		year: targetDate.getFullYear(),
		month: targetDate.getMonth() + 1,
		targetDate,
		viewType,
	};
}

/**
 * Calculate date query parameters for REST requests.
 *
 * @param {Object|string} selectedMonthOrOptions Configuration or legacy selectedMonth.
 * @param {number}        monthModifier          Legacy modifier.
 * @param {number}        startOfWeek            Start of week index.
 *
 * @return {Object} Query parameters.
 */
export function calculateDateQuery( selectedMonthOrOptions, monthModifier = 0, startOfWeek = 0 ) {
	let options;
	if ( typeof selectedMonthOrOptions === 'object' && null !== selectedMonthOrOptions ) {
		options = selectedMonthOrOptions;
	} else {
		options = {
			selectedMonth: selectedMonthOrOptions,
			monthModifier,
			viewType: 'month',
		};
	}

	const range = calculateDateRange( options, startOfWeek );

	return {
		year: range.year,
		month: range.month,
		startDate: range.startDate,
		endDate: range.endDate,
		viewType: range.viewType,
	};
}