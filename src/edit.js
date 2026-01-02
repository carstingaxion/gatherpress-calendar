/**
 * GatherPress Calendar Block Editor Component
 *
 * This file defines the edit component that renders the block within
 * the WordPress block editor. It provides the interface for users to
 * interact with and configure the calendar block, including:
 * - Visual calendar preview with posts from the query context
 * - Month selection and month modifier controls
 * - Template configuration for how posts appear
 * - Popover styling options
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @package
 * @since 0.1.0
 */

import { __, sprintf } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
	PanelColorSettings,
} from '@wordpress/block-editor';
/* eslint-disable @wordpress/no-unsafe-wp-apis */
import {
	Placeholder,
	PanelBody,
	Button,
	RangeControl,
	BoxControl,
	BorderControl,
	__experimentalNumberControl as NumberControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { dateI18n } from '@wordpress/date';
import { useState } from '@wordpress/element';

/**
 * Editor-specific styles
 *
 * Styles defined here are only applied within the block editor context.
 * They help distinguish the editor view from the frontend display.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * Default template for inner blocks.
 *
 * Defines the initial blocks that appear when the calendar is first added.
 * Users can modify this template by adding, removing, or reordering blocks.
 *
 * @type {Array<Array>}
 * @since 0.1.0
 */
const TEMPLATE = [ [ 'core/post-title', { level: 3 } ], [ 'core/post-date' ] ];

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
function calculateTargetDate( selectedMonth, monthModifier = 0 ) {
	let targetDate;

	if ( selectedMonth && /^\d{4}-\d{2}$/.test( selectedMonth ) ) {
		// Use selected month (ignore monthModifier when explicit month is set)
		const [ year, month ] = selectedMonth.split( '-' ).map( Number );
		targetDate = new Date( year, month - 1, 1 );
	} else {
		// Use current month with modifier
		targetDate = new Date();

		// Apply month modifier if no explicit month is selected
		if ( monthModifier !== 0 ) {
			// Set to first day of month first to avoid date overflow issues
			// This prevents problems like "Jan 31 + 1 month = March 3" instead of "Feb 28/29"
			targetDate.setDate( 1 );
			// Now apply the month modifier - JavaScript handles year overflow automatically
			// For example: December (month 11) + 1 = January (month 0) of next year
			targetDate.setMonth( targetDate.getMonth() + monthModifier );
		}
	}

	return targetDate;
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

	// Base date: 2024-01-07 is a Sunday (day 0)
	// We use a fixed date so calculations are consistent
	const baseSunday = new Date( '2024-01-07' );

	for ( let i = 0; i < 7; i++ ) {
		// Calculate the day of week (0=Sunday, 6=Saturday)
		// The modulo ensures we wrap around (e.g., day 7 becomes day 0)
		const dayOfWeek = ( startOfWeek + i ) % 7;

		// Create a date for this day of week by adding days to base Sunday
		const dayDate = new Date( baseSunday );
		dayDate.setDate( baseSunday.getDate() + dayOfWeek );

		// Get the abbreviated day name using dateI18n for proper localization
		// 'D' format returns the abbreviated day name (e.g., 'Mon', 'Tue', etc.)
		// This respects the site's language setting via WordPress core
		days.push( dateI18n( 'D', dayDate ) );
	}

	return days;
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
function generateCalendar(
	posts,
	startOfWeek = 0,
	selectedMonth = '',
	monthModifier = 0
) {
	// Use the single source of truth for date calculation
	const targetDate = calculateTargetDate( selectedMonth, monthModifier );
	// console.log( 'Generating calendar for date:', targetDate );
	const year = targetDate.getFullYear();
	const month = targetDate.getMonth();

	// Organize posts by date for quick lookup
	// Format: { 'YYYY-MM-DD': [post1, post2, ...] }
	const postsByDate = {};
	if ( posts && posts.length > 0 ) {
		posts.forEach( ( post ) => {
			// console.log( 'Post in Edit Calendar:', post );
			let postDate;
			// For GatherPress events, use event start date
			if ( post.type === 'gatherpress_event' ) {
				postDate = post.meta.gatherpress_datetime_start;
			} else {
				// For other post types, use publication date
				postDate = post.date;
			}
			if ( ! postDate ) {
				return;
			}

			const dateObj = new Date( postDate );
			const dateStr = dateI18n( 'Y-m-d', dateObj );
			if ( ! postsByDate[ dateStr ] ) {
				postsByDate[ dateStr ] = [];
			}
			postsByDate[ dateStr ].push( post );
		} );
	}

	// Calculate calendar dimensions
	const firstDay = new Date( year, month, 1 );
	const lastDay = new Date( year, month + 1, 0 );
	const daysInMonth = lastDay.getDate();
	let startDayOfWeek = firstDay.getDay();

	// Adjust start day based on start_of_week setting
	// This shifts the calendar so it starts on the configured day
	startDayOfWeek = ( startDayOfWeek - startOfWeek + 7 ) % 7;

	// Build the weeks array
	const weeks = [];
	let currentWeek = [];

	// Fill initial empty days before the month starts
	for ( let i = 0; i < startDayOfWeek; i++ ) {
		currentWeek.push( { isEmpty: true } );
	}

	// Fill days with posts
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

		// When week is complete (7 days), start a new week
		if ( currentWeek.length === 7 ) {
			weeks.push( currentWeek );
			currentWeek = [];
		}
	}

	// Fill remaining empty days after the month ends
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
function generateMonthOptions() {
	const options = [];
	const currentDate = new Date();
	const currentYear = currentDate.getFullYear();

	// Generate options for current year and next year
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
 * Always remember: JavaScript months are zero-based, human months are one-based.
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
function calculateDateQuery( selectedMonth, monthModifier = 0 ) {
	// Use the single source of truth for date calculation
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

/**
 * Convert BoxControl value to CSS string.
 *
 * BoxControl can return values in different formats (string or object with
 * individual sides). This function normalizes them to a CSS-compatible string.
 *
 * @since 0.1.0
 *
 * @param {Object|string|undefined} value - The BoxControl value.
 *
 * @return {string} CSS value string (e.g., "10px 20px 10px 20px").
 *
 * @example
 * // String input
 * boxControlToCSS('1rem') // Returns '1rem'
 *
 * @example
 * // Object input
 * boxControlToCSS({ top: '10px', right: '20px', bottom: '10px', left: '20px' })
 * // Returns '10px 20px 10px 20px'
 */
function boxControlToCSS( value ) {
	if ( ! value ) {
		return '';
	}

	if ( typeof value === 'string' ) {
		return value;
	}

	if ( typeof value === 'object' ) {
		const { top = '0', right = '0', bottom = '0', left = '0' } = value;
		return `${ top } ${ right } ${ bottom } ${ left }`;
	}

	return '';
}

/**
 * Convert BorderControl value to CSS strings.
 *
 * BorderControl returns an object with width, style, color, and radius properties.
 * This function converts them to individual CSS property strings that can be
 * applied as inline styles.
 *
 * @since 0.1.0
 *
 * @param {Object|undefined} value - The BorderControl value object.
 *
 * @return {Object} Object containing CSS property strings:
 *   - {string} borderWidth - CSS border-width value
 *   - {string} borderStyle - CSS border-style value
 *   - {string} borderColor - CSS border-color value
 *   - {string} borderRadius - CSS border-radius value
 *
 * @example
 * borderControlToCSS({
 *   width: '2px',
 *   style: 'solid',
 *   color: '#000',
 *   radius: '4px'
 * })
 * // Returns:
 * // {
 * //   borderWidth: '2px',
 * //   borderStyle: 'solid',
 * //   borderColor: '#000',
 * //   borderRadius: '4px'
 * // }
 */
function borderControlToCSS( value ) {
	if ( ! value ) {
		return {};
	}

	const result = {};

	if ( value.width ) {
		result.borderWidth = value.width;
	}

	if ( value.style ) {
		result.borderStyle = value.style;
	}

	if ( value.color ) {
		result.borderColor = value.color;
	}

	if ( value.radius ) {
		if ( typeof value.radius === 'string' ) {
			result.borderRadius = value.radius;
		} else if ( typeof value.radius === 'object' ) {
			const {
				topLeft = '0',
				topRight = '0',
				bottomRight = '0',
				bottomLeft = '0',
			} = value.radius;
			result.borderRadius = `${ topLeft } ${ topRight } ${ bottomRight } ${ bottomLeft }`;
		}
	}

	return result;
}

/**
 * Edit Component
 *
 * Main editor component for the GatherPress Calendar block.
 * Handles:
 * - Rendering the calendar preview with posts
 * - Month selection and month modifier controls
 * - Template configuration interface
 * - Popover styling controls
 * - Query context validation
 *
 * Component Lifecycle:
 * 1. Receives attributes and context from WordPress
 * 2. Uses useSelect to fetch posts based on query context
 * 3. Generates calendar structure from posts
 * 4. Renders calendar preview and controls
 * 5. Updates attributes when user interacts with controls
 *
 * @since 0.1.0
 *
 * @param {Object}   props               - Component props.
 * @param {Object}   props.attributes    - Block attributes containing:
 *                                       - {string} selectedMonth - Selected month in format "YYYY-MM"
 *                                       - {number} monthModifier - Month offset from current month
 *                                       - {Object} templateConfigStyle - Popover styling configuration
 * @param {Function} props.setAttributes - Function to update block attributes.
 * @param {Object}   props.context       - Context from parent blocks, including:
 *                                       - {Object} query - Query Loop query configuration
 *                                       - {number} queryId - Query Loop ID for pagination
 *
 * @return {Element} React element rendered in the editor.
 */
export default function Edit( { attributes, setAttributes, context } ) {
	const {
		selectedMonth,
		monthModifier = 0,
		templateConfigStyle = {},
	} = attributes;
	const { query } = context;
	const [ showMonthPicker, setShowMonthPicker ] = useState( false );

	/**
	 * Calculate date query based on selectedMonth and monthModifier.
	 * This ensures the calendar only fetches posts for the displayed month.
	 */
	const dateQuery = calculateDateQuery( selectedMonth, monthModifier );

	/**
	 * Fetch posts based on query context with date filtering.
	 *
	 * The useSelect hook automatically re-runs when dependencies change,
	 * ensuring the calendar updates when:
	 * - User changes selected month
	 * - User changes month modifier
	 * - Parent Query Loop changes its configuration
	 *
	 * Why we clean the query:
	 * - GatherPress adds 'gatherpress_event_query' parameter
	 * - This parameter conflicts with our date_query
	 * - We remove it and any other GatherPress-specific params
	 * - REST API getEntityRecords doesn't understand these custom params
	 */
	const { posts, startOfWeek } = useSelect(
		( select ) => {
			if ( ! query ) {
				return { posts: [], startOfWeek: 0 };
			}

			const { getEntityRecords } = select( coreStore );
			const { getSite } = select( coreStore );

			// Create a clean query object, removing GatherPress-specific parameters
			// that interfere with the REST API query
			const cleanQuery = { ...query };

			// Remove GatherPress-specific query vars that don't work with getEntityRecords
			delete cleanQuery.gatherpress_event_query;
			delete cleanQuery.include_unfinished;

			// If orderBy is 'datetime' (GatherPress specific), change to 'date'
			if ( cleanQuery.orderBy === 'datetime' ) {
				cleanQuery.orderBy = 'date';
			}

			// console.log( 'Original Query Context:', query );
			// console.log( 'Cleaned Query Context:', cleanQuery );

			// Build REST API query arguments
			const queryArgs = {
				per_page: cleanQuery.perPage || 100,
				order: cleanQuery.order || 'DESC',
				orderby: cleanQuery.orderBy || 'date',
				_embed: 'wp:term',
			};

			// Add date query filter based on the calculated month/year
			// This is what makes the calendar only show posts from the displayed month
			if ( dateQuery && dateQuery.year && dateQuery.month ) {
				queryArgs.year = dateQuery.year;
				queryArgs.month = dateQuery.month;
			}

			// Add taxonomy query if present
			if ( cleanQuery.taxQuery ) {
				Object.keys( cleanQuery.taxQuery ).forEach( ( taxonomy ) => {
					queryArgs[ taxonomy ] = cleanQuery.taxQuery[ taxonomy ];
				} );
			}

			// Add author query if present
			if ( cleanQuery.author ) {
				queryArgs.author = cleanQuery.author;
			}

			// Add search query if present
			if ( cleanQuery.search ) {
				queryArgs.search = cleanQuery.search;
			}

			// Get site settings for start_of_week
			const site = getSite();
			const weekStartsOn = site?.start_of_week || 0;

			// console.log( 'Final Query Args:', queryArgs );

			return {
				posts:
					getEntityRecords(
						'postType',
						cleanQuery.postType || 'post',
						queryArgs
					) || [],
				startOfWeek: weekStartsOn,
			};
		},
		// CRITICAL: Dependencies array ensures query updates when these values change
		[ query, dateQuery ]
	);

	const blockProps = useBlockProps( {
		className: 'gatherpress-calendar-block',
	} );

	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'gatherpress-calendar-template',
		},
		{
			template: TEMPLATE,
			templateLock: false,
		}
	);

	// Show placeholder if block is not inside a Query Loop
	if ( ! query ) {
		return (
			<div { ...blockProps }>
				<Placeholder
					icon="calendar-alt"
					label={ __(
						'GatherPress Calendar',
						'gatherpress-calendar'
					) }
					instructions={ __(
						'This block must be used inside a Query Loop block.',
						'gatherpress-calendar'
					) }
				/>
			</div>
		);
	}

	const calendar = generateCalendar(
		posts,
		startOfWeek,
		selectedMonth,
		monthModifier
	);
	const monthOptions = generateMonthOptions();

	// Build inline styles for template config preview
	const templateConfigStyles = {
		backgroundColor: templateConfigStyle.backgroundColor || undefined,
		padding: boxControlToCSS( templateConfigStyle.padding ) || undefined,
		...borderControlToCSS( {
			width: templateConfigStyle.borderWidth,
			style: templateConfigStyle.borderStyle,
			color: templateConfigStyle.borderColor,
			radius: templateConfigStyle.borderRadius,
		} ),
		boxShadow: templateConfigStyle.boxShadow || undefined,
	};

	/**
	 * Generate dynamic help text for month offset control.
	 *
	 * Uses sprintf to properly format the text based on the current modifier value.
	 * This provides clear, localized feedback about what the current offset means.
	 */
	let monthOffsetHelp;
	if ( monthModifier === 0 ) {
		monthOffsetHelp = __( 'Showing current month', 'gatherpress-calendar' );
	} else if ( monthModifier < 0 ) {
		// For negative values, use absolute value in the message
		monthOffsetHelp = sprintf(
			/* translators: %d: number of months ago */
			__( 'Showing %d month(s) ago', 'gatherpress-calendar' ),
			Math.abs( monthModifier )
		);
	} else {
		// For positive values
		monthOffsetHelp = sprintf(
			/* translators: %d: number of months ahead */
			__( 'Showing %d month(s) ahead', 'gatherpress-calendar' ),
			monthModifier
		);
	}

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Calendar Settings', 'gatherpress-calendar' ) }
				>
					<p>
						{ __(
							'Select a specific month to display, or leave empty to show the current month.',
							'gatherpress-calendar'
						) }
					</p>
					{ showMonthPicker ? (
						<>
							<div
								style={ {
									marginBottom: '12px',
									maxHeight: '200px',
									overflowY: 'auto',
									border: '1px solid #ddd',
									borderRadius: '4px',
								} }
							>
								{ monthOptions.map( ( option ) => (
									<Button
										key={ option.value }
										isPressed={
											selectedMonth === option.value
										}
										onClick={ () => {
											setAttributes( {
												selectedMonth: option.value,
											} );
											setShowMonthPicker( false );
										} }
										style={ {
											width: '100%',
											justifyContent: 'flex-start',
											padding: '8px 12px',
										} }
									>
										{ option.label }
									</Button>
								) ) }
							</div>
							<Button
								isSecondary
								onClick={ () => setShowMonthPicker( false ) }
								style={ { width: '100%' } }
							>
								{ __( 'Cancel', 'gatherpress-calendar' ) }
							</Button>
						</>
					) : (
						<>
							<div
								style={ {
									marginBottom: '12px',
									padding: '8px',
									background: '#f0f0f1',
									borderRadius: '4px',
								} }
							>
								<strong>
									{ __(
										'Current Selection:',
										'gatherpress-calendar'
									) }
								</strong>
								<br />
								{ selectedMonth
									? monthOptions.find(
											( o ) => o.value === selectedMonth
									  )?.label
									: __(
											'Current Month',
											'gatherpress-calendar'
									  ) }
								{ ! selectedMonth && monthModifier !== 0 && (
									<>
										{ ' ' }
										{ monthModifier > 0
											? `+${ monthModifier }`
											: monthModifier }{ ' ' }
										{ monthModifier === 1
											? __(
													'month',
													'gatherpress-calendar'
											  )
											: __(
													'months',
													'gatherpress-calendar'
											  ) }
									</>
								) }
							</div>
							<Button
								isPrimary
								onClick={ () => setShowMonthPicker( true ) }
								style={ { width: '100%', marginBottom: '8px' } }
							>
								{ __( 'Change Month', 'gatherpress-calendar' ) }
							</Button>
							{ selectedMonth && (
								<Button
									isSecondary
									onClick={ () =>
										setAttributes( { selectedMonth: '' } )
									}
									style={ { width: '100%' } }
								>
									{ __(
										'Reset to Current Month',
										'gatherpress-calendar'
									) }
								</Button>
							) }
						</>
					) }

					{ ! selectedMonth && (
						<>
							<hr
								style={ {
									margin: '16px 0',
									borderTop: '1px solid #ddd',
								} }
							/>
							<p
								style={ {
									marginTop: '16px',
									marginBottom: '8px',
									fontWeight: '500',
								} }
							>
								{ __( 'Month Offset', 'gatherpress-calendar' ) }
							</p>
							<p
								style={ {
									fontSize: '12px',
									color: '#757575',
									marginBottom: '12px',
								} }
							>
								{ __(
									'Display a month relative to the current month. For example, -1 shows last month, +1 shows next month. The calendar will automatically update as time passes.',
									'gatherpress-calendar'
								) }
							</p>
							<NumberControl
								label={ __(
									'Months from current',
									'gatherpress-calendar'
								) }
								value={ monthModifier }
								onChange={ ( value ) => {
									const numValue =
										value === ''
											? 0
											: parseInt( value, 10 );
									setAttributes( {
										monthModifier: isNaN( numValue )
											? 0
											: numValue,
									} );
								} }
								min={ -12 }
								max={ 12 }
								step={ 1 }
								help={ monthOffsetHelp }
							/>
							{ monthModifier !== 0 && (
								<Button
									isSecondary
									onClick={ () =>
										setAttributes( { monthModifier: 0 } )
									}
									style={ {
										width: '100%',
										marginTop: '8px',
									} }
								>
									{ __(
										'Reset Month Offset',
										'gatherpress-calendar'
									) }
								</Button>
							) }
						</>
					) }
				</PanelBody>

				<PanelBody
					title={ __( 'Template Style', 'gatherpress-calendar' ) }
					initialOpen={ false }
				>
					<PanelColorSettings
						title={ __( 'Background', 'gatherpress-calendar' ) }
						colorSettings={ [
							{
								value: templateConfigStyle.backgroundColor,
								onChange: ( backgroundColor ) => {
									setAttributes( {
										templateConfigStyle: {
											...templateConfigStyle,
											backgroundColor,
										},
									} );
								},
								label: __(
									'Background Color',
									'gatherpress-calendar'
								),
							},
						] }
					/>

					<BoxControl
						label={ __( 'Padding', 'gatherpress-calendar' ) }
						values={ templateConfigStyle.padding }
						onChange={ ( padding ) => {
							setAttributes( {
								templateConfigStyle: {
									...templateConfigStyle,
									padding,
								},
							} );
						} }
					/>

					<BorderControl
						label={ __( 'Border', 'gatherpress-calendar' ) }
						value={ {
							width: templateConfigStyle.borderWidth,
							style: templateConfigStyle.borderStyle,
							color: templateConfigStyle.borderColor,
							radius: templateConfigStyle.borderRadius,
						} }
						onChange={ ( border ) => {
							setAttributes( {
								templateConfigStyle: {
									...templateConfigStyle,
									borderWidth: border.width,
									borderStyle: border.style,
									borderColor: border.color,
									borderRadius: border.radius,
								},
							} );
						} }
					/>

					<RangeControl
						label={ __(
							'Box Shadow Blur',
							'gatherpress-calendar'
						) }
						value={ parseInt(
							templateConfigStyle.boxShadow?.match(
								/\d+/
							)?.[ 0 ] || 0
						) }
						onChange={ ( blur ) => {
							setAttributes( {
								templateConfigStyle: {
									...templateConfigStyle,
									boxShadow:
										blur > 0
											? `0 8px ${ blur }px rgba(0, 0, 0, 0.15)`
											: undefined,
								},
							} );
						} }
						min={ 0 }
						max={ 50 }
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<div className="gatherpress-calendar">
					<h2 className="gatherpress-calendar__month">
						{ calendar.monthName }
					</h2>
					<table className="gatherpress-calendar__table">
						<thead>
							<tr>
								{ calendar.dayNames.map( ( dayName, index ) => (
									<th key={ index }>{ dayName }</th>
								) ) }
							</tr>
						</thead>
						<tbody>
							{ calendar.weeks.map( ( week, weekIndex ) => (
								<tr key={ weekIndex }>
									{ week.map( ( day, dayIndex ) => (
										<td
											key={ dayIndex }
											className={ `gatherpress-calendar__day ${
												day.isEmpty ? 'is-empty' : ''
											} ${
												day.posts?.length > 0
													? 'has-posts'
													: ''
											}` }
										>
											{ ! day.isEmpty && (
												<>
													<div className="gatherpress-calendar__day-number">
														{ day.day }
													</div>
													{ day.posts?.length > 0 && (
														<div className="gatherpress-calendar__events">
															{ day.posts.map(
																( post ) => (
																	<div
																		key={
																			post.id
																		}
																		className="gatherpress-calendar__event"
																		title={
																			post
																				.title
																				?.rendered ||
																			__(
																				'(No title)',
																				'gatherpress-calendar'
																			)
																		}
																	/>
																)
															) }
														</div>
													) }
												</>
											) }
										</td>
									) ) }
								</tr>
							) ) }
						</tbody>
					</table>

					<div
						className="gatherpress-calendar__template-config"
						style={ templateConfigStyles }
					>
						<p className="gatherpress-calendar__template-label">
							{ __(
								'Configure how events appear in the calendar by adding blocks below:',
								'gatherpress-calendar'
							) }
						</p>
						<div { ...innerBlocksProps } />
					</div>
				</div>
			</div>
		</>
	);
}
