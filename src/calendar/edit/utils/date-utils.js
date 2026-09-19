/**
 * Calculate target date based on selectedMonth and monthModifier.
 *
 * This is the SINGLE SOURCE OF TRUTH for date calculation throughout the block.
 * It's used by both the date query (for fetching posts) and the calendar generation
 * (for displaying the grid). This ensures consistency between what posts are fetched
 * and where they appear in the calendar.
 *
 * Logic:
 * 1. If selectedMonth is set (format: "YYYY-MM"), use that specific month
 * 2. Otherwise, use current month + monthModifier
 * 3. JavaScript Date handles year overflow automatically (e.g., month 13 becomes January of next year)
 *
 * Why we set date to 1 first:
 * Setting the date to 1 before applying monthModifier prevents issues with months
 * that have different numbers of days. For example, if today is Jan 31 and we add
 * 1 month without this, JavaScript would try to create Feb 31, which doesn't exist.
 *
 * @since 0.1.0
 *
 * @param {string} selectedMonth - The selected month in format "YYYY-MM" (e.g., "2025-07").
 * @param {number} monthModifier - The month offset from current month (e.g., -1 for last month, +1 for next month).
 *
 * @return {Date} The calculated target date object.
 *
 * @example
 * // Get a specific month
 * calculateTargetDate('2025-07', 0) // Returns July 2025
 *
 * @example
 * // Get last month relative to today
 * calculateTargetDate('', -1) // Returns last month's date
 *
 * @example
 * // Get next month relative to today
 * calculateTargetDate('', 1) // Returns next month's date
 */
export function calculateTargetDate( selectedMonth, monthModifier = 0 ) {
	let targetDate;

	if ( selectedMonth && /^\d{4}-\d{2}$/.test( selectedMonth ) ) {
		// Use selected month (ignore monthModifier when explicit month is set).
		const [ year, month ] = selectedMonth.split( '-' ).map( Number );
		targetDate = new Date( year, month - 1, 1 );
	} else {
		// Use current month with modifier.
		targetDate = new Date();

		// Apply month modifier if no explicit month is selected.
		if ( monthModifier !== 0 ) {
			// Set to first day of month first to avoid date overflow issues.
			// This prevents problems like "Jan 31 + 1 month = March 3" instead of "Feb 28/29".
			targetDate.setDate( 1 );
			// Now apply the month modifier - JavaScript handles year overflow automatically.
			// For example: December (month 11) + 1 = January (month 0) of next year.
			targetDate.setMonth( targetDate.getMonth() + monthModifier );
		}
	}

	return targetDate;
}

/**
 * Calculate date query parameters for the selected month.
 *
 * Converts the selectedMonth attribute (or current month with modifier) to year
 * and month values that can be used in a WP_Query date_query or REST API request.
 *
 * JavaScript Date Month Behavior:
 * - Date.getMonth() returns 0-11 (January=0, December=11) - zero-based index
 * - WP_Query expects 1-12 (January=1, December=12) - one-based index
 * - Therefore we must add 1 to getMonth() result for WordPress compatibility
 *
 * This is a common source of off-by-one errors in JavaScript date handling.
 * Always remember: JavaScript months are zero-based.
 *
 * @since 0.1.0
 *
 * @param {string} selectedMonth - The selected month in format "YYYY-MM".
 * @param {number} monthModifier - The month offset from current month.
 *
 * @return {Object} Date query object containing:
 *   - {number} year - Four-digit year (e.g., 2025)
 *   - {number} month - Month number 1-12 (January=1, December=12)
 *
 * @example
 * // Calculate for January 2025
 * calculateDateQuery('2025-01', 0)
 * // Returns: { year: 2025, month: 1 }
 *
 * @example
 * // Calculate for last month (if current is Feb 2025)
 * calculateDateQuery('', -1)
 * // Returns: { year: 2025, month: 1 }
 */
export function calculateDateQuery( selectedMonth, monthModifier = 0 ) {
	// Use the single source of truth for date calculation.
	const targetDate = calculateTargetDate( selectedMonth, monthModifier );

	const year = targetDate.getFullYear();
	/**
	 * CRITICAL: JavaScript's getMonth() returns 0-11 (January=0, December=11)
	 * We MUST add 1 to convert to human-readable/WP_Query format (January=1, December=12)
	 *
	 * Why this matters:
	 * - Without +1: December would be month 11, January would be month 0
	 * - WP_Query interprets month 0 as "all months"
	 * - WP_Query expects month 1-12 to match specific months
	 *
	 * Example:
	 * const dec = new Date('2025-12-01');
	 * dec.getMonth()     // Returns 11 (zero-based)
	 * dec.getMonth() + 1 // Returns 12 (one-based, correct for WP_Query)
	 */
	const month = targetDate.getMonth() + 1;

	return {
		year,
		month,
	};
}
