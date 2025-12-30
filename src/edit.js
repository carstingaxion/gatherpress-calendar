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
import { useBlockProps, useInnerBlocksProps, BlockContextProvider } from '@wordpress/block-editor';
import { Placeholder } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { dateI18n } from '@wordpress/date';

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
 * Generate calendar structure
 *
 * Creates a monthly calendar grid with posts placed on their dates.
 *
 * @since 0.1.0
 *
 * @param {Array} posts - Array of post objects.
 *
 * @return {Object} Calendar data structure with weeks and days.
 */
function generateCalendar( posts ) {
	if ( ! posts || posts.length === 0 ) {
		const now = new Date();
		const year = now.getFullYear();
		const month = now.getMonth();
		const firstDay = new Date( year, month, 1 );
		
		return {
			monthName: dateI18n( 'F Y', firstDay ),
			weeks: [],
		};
	}

	// Find the earliest post date to determine which month to display
	let earliestDate = null;
	const postsByDate = {};

	posts.forEach( ( post ) => {
		const postDate = post.date;
		if ( ! postDate ) {
			return;
		}

		const dateObj = new Date( postDate );
		if ( ! earliestDate || dateObj < earliestDate ) {
			earliestDate = dateObj;
		}

		const dateStr = dateI18n( 'Y-m-d', dateObj );
		if ( ! postsByDate[ dateStr ] ) {
			postsByDate[ dateStr ] = [];
		}
		postsByDate[ dateStr ].push( post );
	} );

	const targetDate = earliestDate || new Date();
	const year = targetDate.getFullYear();
	const month = targetDate.getMonth();

	// Get first day of month and total days
	const firstDay = new Date( year, month, 1 );
	const lastDay = new Date( year, month + 1, 0 );
	const daysInMonth = lastDay.getDate();
	const startDayOfWeek = firstDay.getDay();

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
	};
}

/**
 * Edit Component
 *
 * Renders the block's edit interface in the WordPress editor.
 *
 * @since 0.1.0
 *
 * @param {Object} props - The component props.
 * @param {Object} props.context - Context from parent blocks.
 * @param {string} props.clientId - The block's client ID.
 *
 * @return {Element} The React element to be rendered in the editor.
 */
export default function Edit( { context, clientId } ) {
	const { query, queryId } = context;

	/**
	 * Fetch posts based on query context
	 */
	const posts = useSelect(
		( select ) => {
			if ( ! query ) {
				return [];
			}

			const { getEntityRecords } = select( coreStore );
			
			const queryArgs = {
				per_page: query.perPage || 100,
				order: query.order || 'DESC',
				orderby: query.orderBy || 'date',
				_embed: 'wp:term',
			};

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

			return (
				getEntityRecords( 'postType', query.postType || 'post', queryArgs ) || []
			);
		},
		[ query ]
	);

	const blockProps = useBlockProps( {
		className: 'gatherpress-calendar-block',
	} );

	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'gatherpress-calendar-template',
		},
		{
			allowedBlocks: ALLOWED_BLOCKS,
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

	const calendar = generateCalendar( posts );

	return (
		<div { ...blockProps }>
			<div className="gatherpress-calendar">
				<h2 className="gatherpress-calendar__month">{ calendar.monthName }</h2>
				<table className="gatherpress-calendar__table">
					<thead>
						<tr>
							<th>{ __( 'Sun', 'gatherpress-calendar' ) }</th>
							<th>{ __( 'Mon', 'gatherpress-calendar' ) }</th>
							<th>{ __( 'Tue', 'gatherpress-calendar' ) }</th>
							<th>{ __( 'Wed', 'gatherpress-calendar' ) }</th>
							<th>{ __( 'Thu', 'gatherpress-calendar' ) }</th>
							<th>{ __( 'Fri', 'gatherpress-calendar' ) }</th>
							<th>{ __( 'Sat', 'gatherpress-calendar' ) }</th>
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
															<BlockContextProvider
																key={ post.id }
																value={ {
																	postId: post.id,
																	postType: post.type,
																	queryId,
																} }
															>
																<div className="gatherpress-calendar__event">
																	{ post.title?.rendered || __( '(No title)', 'gatherpress-calendar' ) }
																</div>
															</BlockContextProvider>
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

				<div className="gatherpress-calendar__template" style={ { display: 'none' } }>
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
	);
}