/**
 * GatherPress Calendar Block Editor Component
 *
 * This file defines the edit component that renders the block within
 * the WordPress block editor. It provides the interface for users to
 * interact with and configure the calendar block.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @package GatherPressCalendar
 * @since 0.1.0
 */

import { __ } from '@wordpress/i18n';
import { useBlockProps, useInnerBlocksProps, BlockContextProvider, InspectorControls, PanelColorSettings } from '@wordpress/block-editor';
import { Placeholder, PanelBody, Button, RangeControl, __experimentalBoxControl as BoxControl, __experimentalBorderControl as BorderControl, __experimentalNumberControl as NumberControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { dateI18n } from '@wordpress/date';
import { useState, useEffect } from '@wordpress/element';

/**
 * Editor-specific styles
 *
 * Styles defined here are only applied within the block editor context.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * Allowed inner blocks
 *
 * List of core post blocks that can be used within the calendar.
 *
 * @type {Array<string>}
 */
const ALLOWED_BLOCKS = [
	'core/post-title',
	'core/post-date',
	'core/post-excerpt',
	'core/post-featured-image',
	'core/post-terms',
	'core/post-author',
	'core/post-author-name',
	'core/post-author-biography',
	'core/avatar',
];

/**
 * Default template for inner blocks
 *
 * @type {Array}
 */
const TEMPLATE = [
	['core/post-title', { level: 3 }],
	['core/post-date'],
];

/**
 * Get day names based on start of week setting
 *
 * Uses WordPress dateI18n to get properly localized day names.
 *
 * @since 0.1.0
 *
 * @param {number} startOfWeek - The start of week (0=Sunday, 1=Monday, etc.).
 *
 * @return {Array<string>} Array of day name labels.
 */
function getDayNames( startOfWeek = 0 ) {
	const days = [];
	
	// Base date: 2024-01-07 is a Sunday (day 0)
	const baseSunday = new Date( '2024-01-07' );
	
	for ( let i = 0; i < 7; i++ ) {
		// Calculate the day of week (0=Sunday, 6=Saturday)
		const dayOfWeek = ( startOfWeek + i ) % 7;
		
		// Create a date for this day of week
		const dayDate = new Date( baseSunday );
		dayDate.setDate( baseSunday.getDate() + dayOfWeek );
		
		// Get the abbreviated day name using dateI18n for proper localization
		// 'D' format returns the abbreviated day name (e.g., 'Mon', 'Tue', etc.)
		days.push( dateI18n( 'D', dayDate ) );
	}

	return days;
}

/**
 * Generate calendar structure
 *
 * Creates a monthly calendar grid with posts placed on their dates.
 *
 * @since 0.1.0
 *
 * @param {Array} posts - Array of post objects.
 * @param {number} startOfWeek - The start of week (0=Sunday, 1=Monday, etc.).
 * @param {string} selectedMonth - The selected month in format YYYY-MM (e.g., "2025-07").
 * @param {number} monthModifier - The month offset from current month (e.g., -1 for last month, +1 for next month).
 *
 * @return {Object} Calendar data structure with weeks and days.
 */
function generateCalendar( posts, startOfWeek = 0, selectedMonth = '', monthModifier = 0 ) {
	// Determine which month to display
	let targetDate;
	if ( selectedMonth && /^\d{4}-\d{2}$/.test( selectedMonth ) ) {
		// Use selected month (ignore monthModifier when explicit month is set)
		const [year, month] = selectedMonth.split('-').map(Number);
		targetDate = new Date( year, month - 1, 1 );
	} else {
		// Use current month with modifier
		targetDate = new Date();
		if ( monthModifier !== 0 ) {
			targetDate.setMonth( targetDate.getMonth() + monthModifier );
		}
	}

	const year = targetDate.getFullYear();
	const month = targetDate.getMonth();

	// Organize posts by date
	const postsByDate = {};
	if ( posts && posts.length > 0 ) {
		posts.forEach( ( post ) => {
			console.log( 'Post in Edit Calendar:', post );
			let postDate;
			if ( post.type === 'gatherpress_event' ) {
				postDate = post.meta.gatherpress_datetime_start;
			} else {
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

	// Get first day of month and total days
	const firstDay = new Date( year, month, 1 );
	const lastDay = new Date( year, month + 1, 0 );
	const daysInMonth = lastDay.getDate();
	let startDayOfWeek = firstDay.getDay();

	// Adjust start day based on start_of_week setting
	startDayOfWeek = ( startDayOfWeek - startOfWeek + 7 ) % 7;

	// Create weeks array
	const weeks = [];
	let currentWeek = [];

	// Fill initial empty days
	for ( let i = 0; i < startDayOfWeek; i++ ) {
		currentWeek.push( { isEmpty: true } );
	}

	// Fill days with posts
	for ( let day = 1; day <= daysInMonth; day++ ) {
		const dateStr = `${ year }-${ String( month + 1 ).padStart( 2, '0' ) }-${ String( day ).padStart( 2, '0' ) }`;
		const dayPosts = postsByDate[ dateStr ] || [];

		currentWeek.push( {
			day,
			date: dateStr,
			posts: dayPosts,
			isEmpty: false,
		} );

		if ( currentWeek.length === 7 ) {
			weeks.push( currentWeek );
			currentWeek = [];
		}
	}

	// Fill remaining empty days
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
 * Generate month options for the picker
 *
 * @since 0.1.0
 *
 * @return {Array} Array of month options.
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
 * Calculate date query parameters for the selected month
 *
 * This function converts the selectedMonth attribute (or current month with modifier)
 * to year and month values that can be used in a WP_Query date_query. It handles the
 * JavaScript-specific behavior where Date.getMonth() returns a zero-based index (0-11)
 * that must be incremented by 1 to get the human-readable month number (1-12).
 *
 * JavaScript Date Months:
 * - January = 0, February = 1, ..., December = 11 (zero-based)
 * 
 * Human-Readable/WP_Query Months:
 * - January = 1, February = 2, ..., December = 12 (one-based)
 *
 * @since 0.1.0
 *
 * @param {string} selectedMonth - The selected month in format YYYY-MM.
 * @param {number} monthModifier - The month offset from current month.
 *
 * @return {Object} Date query object for WP_Query with year and month properties.
 */
function calculateDateQuery( selectedMonth, monthModifier = 0 ) {
	let year, month;

	if ( selectedMonth && /^\d{4}-\d{2}$/.test( selectedMonth ) ) {
		[year, month] = selectedMonth.split('-').map(Number);
	} else {
		const now = new Date();
		
		// Apply month modifier if no explicit month is selected
		if ( monthModifier !== 0 ) {
			now.setMonth( now.getMonth() + monthModifier );
		}
		
		year = now.getFullYear();
		/**
		 * IMPORTANT: JavaScript's getMonth() returns 0-11 (January=0, December=11)
		 * We add 1 to convert to human-readable format (January=1, December=12)
		 * which matches WordPress WP_Query's expected month parameter format.
		 */
		month = now.getMonth() + 1;
	}

	return {
		year: year,
		month: month,
	};
}

/**
 * Convert BoxControl value to CSS string
 *
 * @since 0.1.0
 *
 * @param {Object|string} value - The BoxControl value.
 *
 * @return {string} CSS value string.
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
		return `${top} ${right} ${bottom} ${left}`;
	}
	
	return '';
}

/**
 * Convert BorderControl value to CSS strings
 *
 * @since 0.1.0
 *
 * @param {Object} value - The BorderControl value.
 *
 * @return {Object} CSS value strings.
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
			const { topLeft = '0', topRight = '0', bottomRight = '0', bottomLeft = '0' } = value.radius;
			result.borderRadius = `${topLeft} ${topRight} ${bottomRight} ${bottomLeft}`;
		}
	}
	
	return result;
}

/**
 * Edit Component
 *
 * Renders the block's edit interface in the WordPress editor.
 *
 * @since 0.1.0
 *
 * @param {Object} props - The component props.
 * @param {Object} props.attributes - The block attributes.
 * @param {Function} props.setAttributes - Function to update attributes.
 * @param {Object} props.context - Context from parent blocks.
 * @param {string} props.clientId - The block's client ID.
 *
 * @return {Element} The React element to be rendered in the editor.
 */
export default function Edit( { attributes, setAttributes, context, clientId } ) {
	const { selectedMonth, monthModifier = 0, templateConfigStyle = {} } = attributes;
	const { query, queryId } = context;
	const [showMonthPicker, setShowMonthPicker] = useState(false);

	/**
	 * Calculate date query based on selectedMonth and monthModifier
	 */
	const dateQuery = calculateDateQuery( selectedMonth, monthModifier );

	/**
	 * Fetch posts based on query context with date filtering
	 * The useSelect hook will automatically re-run when selectedMonth or monthModifier changes
	 */
	const { posts, startOfWeek } = useSelect(
		( select ) => {
			if ( ! query ) {
				return { posts: [], startOfWeek: 0 };
			}

			const { getEntityRecords } = select( coreStore );
			const { getSite } = select( coreStore );
			// Create a new query var, excluding 'gatherpress_event_query'
			// const newQuery = { ...query };
			// if ( query.gatherpress_event_query ) {
			// 	delete query.gatherpress_event_query;
			// }
			// if ( query.include_unfinished ) {
			// 	delete query.include_unfinished;
			// }
			console.log( 'Query Context in Edit:', query );
/* 
			const queryArgs = {
				// context: 'view',
				gatherpress_event_query: 'past', // !!! Super weird temporary hack.
				per_page: query.perPage || 100,
				order: query.order || 'DESC',
				// orderby: query.orderBy || 'date',
				orderby: 'title',
				_embed: 'wp:term',
			}; */
			const queryArgs = { ...query }; // Trying to debug .... with no luck yet!

			// Add date query filter based on the calculated month/year
			if ( dateQuery && dateQuery.year && dateQuery.month ) {
				queryArgs.year = dateQuery.year;
				queryArgs.month = dateQuery.month;
			}

			// Add taxonomy query if present
			if ( query.taxQuery ) {
				Object.keys( query.taxQuery ).forEach( ( taxonomy ) => {
					queryArgs[ taxonomy ] = query.taxQuery[ taxonomy ];
				} );
			}

			// Add author query if present
			if ( query.author ) {
				queryArgs.author = query.author;
			}

			// Add search query if present
			if ( query.search ) {
				queryArgs.search = query.search;
			}

			// Get site settings for start_of_week
			const site = getSite();
			const weekStartsOn = site?.start_of_week || 0;

			return {
				posts: getEntityRecords( 'postType', query.postType || 'post', queryArgs ) || [],
				startOfWeek: weekStartsOn,
			};
		},
		// CRITICAL: Add selectedMonth and monthModifier as dependencies so the query updates when they change
		[ query, selectedMonth, monthModifier, dateQuery.year, dateQuery.month ]
	);

	const blockProps = useBlockProps( {
		className: 'gatherpress-calendar-block',
	} );

	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'gatherpress-calendar-template',
		},
		{
			// allowedBlocks: ALLOWED_BLOCKS,
			template: TEMPLATE,
			templateLock: false,
		}
	);

	if ( ! query ) {
		return (
			<div { ...blockProps }>
				<Placeholder
					icon="calendar-alt"
					label={ __( 'GatherPress Calendar', 'gatherpress-calendar' ) }
					instructions={ __(
						'This block must be used inside a Query Loop block.',
						'gatherpress-calendar'
					) }
				/>
			</div>
		);
	}

	const calendar = generateCalendar( posts, startOfWeek, selectedMonth, monthModifier );
	const monthOptions = generateMonthOptions();

	// Build inline styles for template config
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

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Calendar Settings', 'gatherpress-calendar' ) }>
					<p>
						{ __( 'Select a specific month to display, or leave empty to show the current month.', 'gatherpress-calendar' ) }
					</p>
					{ showMonthPicker ? (
						<>
							<div style={{ marginBottom: '12px', maxHeight: '200px', overflowY: 'auto', border: '1px solid #ddd', borderRadius: '4px' }}>
								{ monthOptions.map( ( option ) => (
									<Button
										key={ option.value }
										isPressed={ selectedMonth === option.value }
										onClick={ () => {
											setAttributes( { selectedMonth: option.value } );
											setShowMonthPicker( false );
										} }
										style={{ width: '100%', justifyContent: 'flex-start', padding: '8px 12px' }}
									>
										{ option.label }
									</Button>
								) ) }
							</div>
							<Button
								isSecondary
								onClick={ () => setShowMonthPicker( false ) }
								style={{ width: '100%' }}
							>
								{ __( 'Cancel', 'gatherpress-calendar' ) }
							</Button>
						</>
					) : (
						<>
							<div style={{ marginBottom: '12px', padding: '8px', background: '#f0f0f1', borderRadius: '4px' }}>
								<strong>{ __( 'Current Selection:', 'gatherpress-calendar' ) }</strong>
								<br />
								{ selectedMonth ? monthOptions.find( o => o.value === selectedMonth )?.label : __( 'Current Month', 'gatherpress-calendar' ) }
								{ ! selectedMonth && monthModifier !== 0 && (
									<>
										{ ' ' }
										{ monthModifier > 0 ? `+${monthModifier}` : monthModifier }
										{ ' ' }
										{ monthModifier === 1 ? __( 'month', 'gatherpress-calendar' ) : __( 'months', 'gatherpress-calendar' ) }
									</>
								) }
							</div>
							<Button
								isPrimary
								onClick={ () => setShowMonthPicker( true ) }
								style={{ width: '100%', marginBottom: '8px' }}
							>
								{ __( 'Change Month', 'gatherpress-calendar' ) }
							</Button>
							{ selectedMonth && (
								<Button
									isSecondary
									onClick={ () => setAttributes( { selectedMonth: '' } ) }
									style={{ width: '100%' }}
								>
									{ __( 'Reset to Current Month', 'gatherpress-calendar' ) }
								</Button>
							) }
						</>
					) }
					
					{ ! selectedMonth && (
						<>
							<hr style={{ margin: '16px 0', borderTop: '1px solid #ddd' }} />
							<p style={{ marginTop: '16px', marginBottom: '8px', fontWeight: '500' }}>
								{ __( 'Month Offset', 'gatherpress-calendar' ) }
							</p>
							<p style={{ fontSize: '12px', color: '#757575', marginBottom: '12px' }}>
								{ __( 'Display a month relative to the current month. For example, -1 shows last month, +1 shows next month. The calendar will automatically update as time passes.', 'gatherpress-calendar' ) }
							</p>
							<NumberControl
								label={ __( 'Months from current', 'gatherpress-calendar' ) }
								value={ monthModifier }
								onChange={ ( value ) => {
									const numValue = value === '' ? 0 : parseInt( value, 10 );
									setAttributes( { monthModifier: isNaN( numValue ) ? 0 : numValue } );
								} }
								min={ -12 }
								max={ 12 }
								step={ 1 }
								help={ monthModifier === 0 ? __( 'Showing current month', 'gatherpress-calendar' ) : ( monthModifier < 0 ? __( `Showing ${Math.abs(monthModifier)} month(s) ago`, 'gatherpress-calendar' ) : __( `Showing ${monthModifier} month(s) ahead`, 'gatherpress-calendar' ) ) }
							/>
							{ monthModifier !== 0 && (
								<Button
									isSecondary
									onClick={ () => setAttributes( { monthModifier: 0 } ) }
									style={{ width: '100%', marginTop: '8px' }}
								>
									{ __( 'Reset Month Offset', 'gatherpress-calendar' ) }
								</Button>
							) }
						</>
					) }
				</PanelBody>

				<PanelBody title={ __( 'Template Style', 'gatherpress-calendar' ) } initialOpen={ false }>
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
								label: __( 'Background Color', 'gatherpress-calendar' ),
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
						label={ __( 'Box Shadow Blur', 'gatherpress-calendar' ) }
						value={ parseInt( templateConfigStyle.boxShadow?.match(/\d+/)?.[0] || 0 ) }
						onChange={ ( blur ) => {
							setAttributes( {
								templateConfigStyle: {
									...templateConfigStyle,
									boxShadow: blur > 0 ? `0 8px ${blur}px rgba(0, 0, 0, 0.15)` : undefined,
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
					<h2 className="gatherpress-calendar__month">{ calendar.monthName }</h2>
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
											} ${ day.posts?.length > 0 ? 'has-posts' : '' }` }
										>
											{ ! day.isEmpty && (
												<>
													<div className="gatherpress-calendar__day-number">
														{ day.day }
													</div>
													{ day.posts?.length > 0 && (
														<div className="gatherpress-calendar__events">
															{ day.posts.map( ( post ) => (
																<div
																	key={ post.id }
																	className="gatherpress-calendar__event"
																	title={ post.title?.rendered || __( '(No title)', 'gatherpress-calendar' ) }
																/>
															) ) }
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

					<div className="gatherpress-calendar__template-config" style={ templateConfigStyles }>
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