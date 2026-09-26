/**
 * GatherPress Calendar Block Registration
 *
 * Registers the GatherPress Calendar block with WordPress, defining its
 * edit and save functions along with associated metadata.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 *
 * @package
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
 * Style imports
 *
 * Imports SCSS files that contain styles applied to both the frontend
 * and the editor. The webpack configuration processes these files.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './style.scss';

/**
 * Internal dependencies
 */
import Edit from './edit';
import save from './save';
import metadata from './block.json';

import './variation';
import transforms from './transforms';

/**
 * Register the GatherPress Calendar block type
 *
 * This registration connects the block metadata with its edit and save
 * implementations. Even though this is a dynamic block that uses render.php,
 * the save function is needed to preserve the InnerBlocks template structure.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
registerBlockType( metadata.name, {
	/**
	 * Edit function for the block
	 *
	 * @see ./edit.js
	 */
	edit: Edit,

	/**
	 * Save function for the block
	 *
	 * Saves the InnerBlocks template structure to the database.
	 *
	 * @see ./save.js
	 */
	save,
	transforms,
} );

/**
 * Helper to recursively search a block tree for gatherpress/calendar.
 * @param {Object} blocks One block, that may have innerBlocks.
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

domReady( () => {
	if ( typeof registerBlockBindingsSource !== 'function' ) {
		return;
	}

	/**
	 * Register the Month Heading block binding source.
	 *
	 * Lets a `core/heading` bound to this source (see the "Event Calendar"
	 * pattern, placed inside the Query block before the calendar) display the
	 * month/year currently shown by the calendar. The PHP-side source
	 * (`Setup::get_month_heading_binding_value()`) is the source of truth on
	 * the frontend, reading core Query's pagination; the editor canvas has no
	 * URL-based pagination to read, so this preview simply shows the current
	 * site month.
	 *
	 * @since 0.6.0
	 */
	registerBlockBindingsSource( {
		name: 'gatherpress/calendar-month-heading',
		label: __( 'Calendar Month Heading', 'gatherpress-calendar' ),
		usesContext: [ 'query' ],
		getValues( { select, clientId } ) {
			const { getBlockParentsByBlockName, getBlock, getBlocks } =
				select( 'core/block-editor' );

			let calendarBlock = null;

			// 1. First, search inside the same parent Query block (if nested in one)
			const parentQueryIds = getBlockParentsByBlockName(
				clientId,
				'core/query'
			);

			if ( parentQueryIds && parentQueryIds.length ) {
				const parentQuery = getBlock(
					parentQueryIds[ parentQueryIds.length - 1 ]
				);
				if ( parentQuery?.innerBlocks ) {
					calendarBlock = findCalendarBlock(
						parentQuery.innerBlocks
					);
				}
			}

			// 2. Fallback: search all blocks in the editor canvas
			if ( ! calendarBlock ) {
				calendarBlock = findCalendarBlock( getBlocks() );
			}

			const { selectedMonth = '', monthModifier = 0 } =
				calendarBlock?.attributes || {};

			// Resolve Target Year and Month
			let year, month;
			if ( selectedMonth && /^\d{4}-\d{2}$/.test( selectedMonth ) ) {
				const [ y, m ] = selectedMonth.split( '-' ).map( Number );
				year = y;
				month = m;
			} else {
				const now = new Date();
				if ( monthModifier !== 0 ) {
					now.setMonth( now.getMonth() + Number( monthModifier ) );
				}
				year = now.getFullYear();
				month = now.getMonth() + 1;
			}

			// Format matching PHP's wp_date( 'F Y' ) using WordPress dateI18n
			const targetDate = new Date( year, month - 1, 1 );
			const formattedMonth = dateI18n( 'F Y', targetDate );

			return {
				content: formattedMonth,
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
		// Only apply to Query Loop blocks
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
									'The GatherPress Calendar block is active in this Query Loop. The calendar will use date-based filtering for the selected month, overriding the "Upcoming or past events" setting.',
									'gatherpress-calendar'
								) }
							</p>
							<p>
								{ __(
									'This ensures the calendar only displays events from the specific month, regardless of whether they are past or upcoming events.',
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
