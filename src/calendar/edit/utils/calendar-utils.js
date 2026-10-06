/**
 * Core calendar calculation and configuration utilities.
 *
 * @package
 * @since 0.1.0
 */

import { dateI18n } from '@wordpress/date';
import { select } from '@wordpress/data';

// Re-export decomposed helpers so existing imports remain backward-compatible:
export * from './grid-builder';
export * from './block-sync-utils';

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
 * Checks whether a day of the week is considered a weekend day.
 *
 * @param {number} dayOfWeek Day of the week integer (0-6).
 * @return {boolean} True if weekend.
 */
export function isWeekendDay( dayOfWeek ) {
	return getWeekendDays().includes( dayOfWeek );
}

/**
 * Retrieves the maximum number of posts to query for calendar display.
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

/**
 * Computes table grid column count based on view type and weekend visibility.
 *
 * @param {string}  viewType     View type.
 * @param {boolean} showWeekends Whether weekends are shown.
 * @param {number}  unitCount    Number of units.
 * @return {number} Column count.
 */
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
