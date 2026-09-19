import { dateI18n } from '@wordpress/date';

import { calculateTargetDate } from './date-utils';
import { DATE_FORMAT } from '../constants';

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
 * @param {number} startOfWeek - The start of week (0=Sunday, 1=Monday, 2=Tuesday, etc.).
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
function getDayNames( startOfWeek = 0 ) {
	const days = [];

	// Base date: 2024-01-07 is a Sunday (day 0).
	// We use a fixed date so calculations are consistent.
	const baseSunday = new Date( '2024-01-07' );

	for ( let i = 0; i < 7; i++ ) {
		// Calculate the day of week (0=Sunday, 6=Saturday).
		// The modulo ensures we wrap around (e.g., day 7 becomes day 0).
		const dayOfWeek = ( startOfWeek + i ) % 7;

		// Create a date for this day of week by adding days to base Sunday.
		const dayDate = new Date( baseSunday );
		dayDate.setDate( baseSunday.getDate() + dayOfWeek );

		// Get the abbreviated day name using dateI18n for proper localization.
		// 'D' format returns the abbreviated day name (e.g., 'Mon', 'Tue', etc.).
		// This respects the site's language setting via WordPress core.
		days.push( dateI18n( 'D', dayDate ) );
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
export function generateMonthOptions() {
	const options = [];
	const currentDate = new Date();
	const currentYear = currentDate.getFullYear();

	// Generate options for current year and next year.
	for ( let year = currentYear - 1; year <= currentYear + 1; year++ ) {
		for ( let month = 1; month <= 12; month++ ) {
			const date = new Date( year, month - 1, 1 );
			const value = `${ year }-${ String( month ).padStart( 2, '0' ) }`;
			const label = dateI18n( 'F Y', date );
			options.push( { value, label } );
		}
	}

	return options;
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
 * //   monthName: 'January 2025',
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
export function generateCalendar(
	posts,
	startOfWeek = 0,
	selectedMonth = '',
	monthModifier = 0
) {
	// Use the single source of truth for date calculation.
	const targetDate = calculateTargetDate( selectedMonth, monthModifier );
	const year = targetDate.getFullYear();
	const month = targetDate.getMonth();

	// Organize posts by date for quick lookup.
	// Format: { 'YYYY-MM-DD': [post1, post2, ...] }
	const postsByDate = {};
	if ( posts && posts.length > 0 ) {
		posts.forEach( ( post ) => {
			let postDate;
			// For GatherPress events, use event start date.
			if ( post.type === 'gatherpress_event' ) {
				postDate = post.meta.gatherpress_datetime_start;
			} else {
				// For other post types, use publication date.
				postDate = post.date;
			}
			if ( ! postDate ) {
				return;
			}

			const dateObj = new Date( postDate );
			const dateStr = dateI18n( DATE_FORMAT, dateObj );
			if ( ! postsByDate[ dateStr ] ) {
				postsByDate[ dateStr ] = [];
			}
			postsByDate[ dateStr ].push( post );
		} );
	}

	// Calculate calendar dimensions.
	const firstDay = new Date( year, month, 1 );
	const lastDay = new Date( year, month + 1, 0 );
	const daysInMonth = lastDay.getDate();
	let startDayOfWeek = firstDay.getDay();

	// Adjust start day based on start_of_week setting.
	// This shifts the calendar so it starts on the configured day.
	startDayOfWeek = ( startDayOfWeek - startOfWeek + 7 ) % 7;

	// Build the weeks array.
	const weeks = [];
	let currentWeek = [];

	// Fill initial empty days before the month starts.
	for ( let i = 0; i < startDayOfWeek; i++ ) {
		currentWeek.push( { isEmpty: true } );
	}

	// Fill days with posts.
	for ( let day = 1; day <= daysInMonth; day++ ) {
		const dateStr = `${ year }-${ String( month + 1 ).padStart(
			2,
			'0'
		) }-${ String( day ).padStart( 2, '0' ) }`;
		const dayPosts = postsByDate[ dateStr ] || [];

		currentWeek.push( {
			day,
			date: dateStr,
			posts: dayPosts,
			isEmpty: false,
		} );

		// When week is complete (7 days), start a new week.
		if ( currentWeek.length === 7 ) {
			weeks.push( currentWeek );
			currentWeek = [];
		}
	}

	// Fill remaining empty days after the month ends.
	while ( currentWeek.length > 0 && currentWeek.length < 7 ) {
		currentWeek.push( { isEmpty: true } );
	}

	if ( currentWeek.length > 0 ) {
		weeks.push( currentWeek );
	}

	return {
		monthName: dateI18n( 'F Y', firstDay ),
		weeks,
		dayNames: getDayNames( startOfWeek ),
	};
}
