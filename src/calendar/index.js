/**
 * GatherPress Calendar Block Registration
 *
 * Registers the GatherPress Calendar block with WordPress, defining its
 * edit and save functions along with associated metadata.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 *
 * @package GatherPressCalendar
 * @since 0.1.0
 */

import {
	registerBlockType,
	registerBlockBindingsSource,
} from '@wordpress/blocks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { addFilter } from '@wordpress/hooks';
import { Notice } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { dateI18n } from '@wordpress/date';
import {
	store as blockEditorStore,
	InspectorControls,
} from '@wordpress/block-editor';
import domReady from '@wordpress/dom-ready';

/**
 * Internal dependencies
*/
import './style.scss';
import Edit from './edit';
import save from './save';
import metadata from './block.json';
import { calculateDateRange } from './edit/utils/date-utils';

import './variation';
import transforms from './transforms';

/**
 * Register the GatherPress Calendar block type
 */
registerBlockType( metadata.name, {
	edit: Edit,
	save,
	transforms,
} );

/**
 * Helper to recursively search a block tree for gatherpress/calendar.
 *
 * @param {Array} blocks Blocks array to search.
 * @return {Object|null} Matching block or null.
 */
function findCalendarBlock( blocks = [] ) {
	for ( const block of blocks ) {
		if ( block.name === 'gatherpress/calendar' ) {
			return block;
		}
		if ( block.innerBlocks && block.innerBlocks.length ) {
			const found = findCalendarBlock( block.innerBlocks );
			if ( found ) {
				return found;
			}
		}
	}
	return null;
}

/**
 * Format heading based on view type and date range (matches PHP Date_Calculator::format_heading).
 *
 * @param {string} viewType  View type: 'month' | 'week' | 'day'.
 * @param {Date}   startDate Range start date object.
 * @param {Date}   endDate   Range end date object.
 *
 * @return {string} Formatted localized heading string.
 */
function formatHeading( viewType, startDate, endDate ) {
	if ( 'day' === viewType ) {
		return dateI18n( 'l, F j, Y', startDate );
	}

	if ( 'week' === viewType ) {
		const startYear = startDate.getFullYear();
		const endYear = endDate.getFullYear();
		const startMonth = startDate.getMonth();
		const endMonth = endDate.getMonth();

		if ( startYear !== endYear ) {
			return `${ dateI18n( 'M j, Y', startDate ) } – ${ dateI18n( 'M j, Y', endDate ) }`;
		}

		if ( startMonth !== endMonth ) {
			return `${ dateI18n( 'M j', startDate ) } – ${ dateI18n( 'M j, Y', endDate ) }`;
		}

		return `${ dateI18n( 'M', startDate ) } ${ dateI18n( 'j', startDate ) } – ${ dateI18n( 'j, Y', endDate ) }`;
	}

	return dateI18n( 'F Y', startDate );
}

domReady( () => {
	if ( typeof registerBlockBindingsSource !== 'function' ) {
		return;
	}

	/**
	 * Callback to get heading content for bound heading blocks in the editor.
	 */
	const getCalendarHeadingValues = ( { select, clientId } ) => {
		const { getBlockParentsByBlockName, getBlock, getBlocks } =
			select( 'core/block-editor' );

		let calendarBlock = null;

		// 1. Search inside the same parent Query block
		const parentQueryIds = getBlockParentsByBlockName(
			clientId,
			'core/query'
		);

		if ( parentQueryIds && parentQueryIds.length ) {
			const parentQuery = getBlock(
				parentQueryIds[ parentQueryIds.length - 1 ]
			);
			if ( parentQuery?.innerBlocks ) {
				calendarBlock = findCalendarBlock( parentQuery.innerBlocks );
			}
		}

		// 2. Fallback: search all blocks in the editor canvas
		if ( ! calendarBlock ) {
			calendarBlock = findCalendarBlock( getBlocks() );
		}

		// Establish reactive subscription to calendar attributes
		const liveCalendar = calendarBlock
			? getBlock( calendarBlock.clientId )
			: null;

		const {
			viewType = 'month',
			selectedDate = '',
			dateModifier = 0,
			selectedMonth = '',
			monthModifier = 0,
			showWeekends = true,
		} = liveCalendar?.attributes || {};

		const site = select( 'core' )?.getSite?.();
		const startOfWeek = site?.start_of_week ?? 0;

		const range = calculateDateRange(
			{
				viewType,
				selectedDate: selectedDate || selectedMonth,
				dateModifier: dateModifier || monthModifier,
				showWeekends,
			},
			startOfWeek
		);

		return {
			content: formatHeading(
				viewType,
				range.startDateObj,
				range.endDateObj
			),
		};
	};

	// Register current heading binding source
	registerBlockBindingsSource( {
		name: 'gatherpress/calendar-heading',
		label: __( 'Calendar Heading', 'gatherpress-calendar' ),
		usesContext: [ 'query' ],
		getValues: getCalendarHeadingValues,
	} );

	// Register Day Number binding source in editor so active day cells resolve their number
	registerBlockBindingsSource( {
		name: 'gatherpress/calendar-day',
		label: __( 'Calendar Day Number', 'gatherpress-calendar' ),
		usesContext: [ 'gatherpress/dayNumber', 'gatherpress/isEmpty' ],
		getValues( { context } ) {
			if ( context?.[ 'gatherpress/isEmpty' ] ) {
				return { content: '' };
			}
			const dayNumber = context?.[ 'gatherpress/dayNumber' ];
			return {
				content:
					null !== dayNumber && undefined !== dayNumber
						? String( dayNumber )
						: '',
			};
		},
	} );
} );

/**
 * Add calendar notice to Query Loop block inspector controls.
 *
 * This filter wraps the Query Loop block's BlockEdit component to inject
 * a notice when a GatherPress Calendar block is present as a direct child
 * AND the query is for gatherpress_event post type.
 *
 * The notice explains that the calendar will override GatherPress's
 * 'gatherpress_event_query' setting and use date-based filtering instead.
 *
 * Technical approach:
 * - Uses editor.BlockEdit filter to wrap the Query block component
 * - Checks if selected block is core/query
 * - Checks if query is for gatherpress_event post type
 * - Checks if any direct child is gatherpress/calendar
 * - Injects notice into InspectorControls
 *
 * @since 0.1.0
 */
const withCalendarNotice = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		if ( props.name !== 'core/query' ) {
			return <BlockEdit { ...props } />;
		}

		/**
		 * Check if this Query block:
		 * 1. Has a calendar child
		 * 2. Is querying gatherpress_event post type
		 *
		 * Queries the block editor store to check if any direct child
		 * of this block is a GatherPress Calendar block, and if the
		 * query is specifically for GatherPress events.
		 */
		const { hasCalendarChild, isGatherPressQuery } = useSelect(
			( select ) => {
				const { getBlock } = select( blockEditorStore );
				const block = getBlock( props.clientId );

				if (
					! block ||
					! block.innerBlocks ||
					block.innerBlocks.length === 0
				) {
					return {
						hasCalendarChild: false,
						isGatherPressQuery: false,
					};
				}

				const hasCalendar = block.innerBlocks.some(
					( innerBlock ) => innerBlock.name === metadata.name
				);

				// Check if the query is for gatherpress_event post type
				const postType = block.attributes?.query?.postType || 'post';
				const isGatherPress = postType === 'gatherpress_event';

				return {
					hasCalendarChild: hasCalendar,
					isGatherPressQuery: isGatherPress,
				};
			},
			[ props.clientId ]
		);

		// Only show notice if both conditions are met:
		// 1. Calendar block is present
		// 2. Query is for gatherpress_event post type
		const shouldShowNotice = hasCalendarChild && isGatherPressQuery;

		return (
			<>
				{ shouldShowNotice && (
					<InspectorControls>
						<Notice status="info" isDismissible={ false }>
							<p>
								{ __(
									'The GatherPress Calendar block is active in this Query Loop. The calendar will use date-based filtering, overriding the "Upcoming or past events" setting.',
									'gatherpress-calendar'
								) }
							</p>
							<p>
								{ __(
									'This ensures the calendar only displays events from the active calendar date range, regardless of whether they are past or upcoming events.',
									'gatherpress-calendar'
								) }
							</p>
						</Notice>
					</InspectorControls>
				) }
				<BlockEdit { ...props } />
			</>
		);
	};
}, 'withCalendarNotice' );

/**
 * Register the filter to add calendar notices to Query blocks.
 *
 * This filter runs on every Query block render in the editor,
 * checking for calendar children and the post type before injecting notices.
 *
 * Priority 20 ensures it runs after other Query block modifications.
 *
 * @since 0.1.0
 */
addFilter(
	'editor.BlockEdit',
	'gatherpress-calendar/with-calendar-notice',
	withCalendarNotice,
	20
);
