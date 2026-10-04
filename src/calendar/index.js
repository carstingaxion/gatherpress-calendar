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
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';
import domReady from '@wordpress/dom-ready';
import { select } from '@wordpress/data';
import { dateI18n, getSettings } from '@wordpress/date';
import {
	InspectorControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { createHigherOrderComponent } from '@wordpress/compose';
import { PanelBody, SelectControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import './style.scss';
import Edit from './edit';
import save from './save';
import metadata from './block.json';
import { calculateDateRange, formatHeading } from './edit/utils/date-utils';

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

domReady( () => {
	if ( typeof registerBlockBindingsSource !== 'function' ) {
		return;
	}

	/**
	 * Callback to get heading content for bound heading blocks in the editor.
	 *
	 * @param {Object}   root0          Parameters object.
	 * @param {Function} root0.select   Block editor select function.
	 * @param {string}   root0.clientId Current block client ID.
	 * @return {Object} Content object.
	 */
	const getCalendarHeadingValues = ( {
		select: registrySelect,
		clientId,
	} ) => {
		const { getBlockParentsByBlockName, getBlock, getBlocks } =
			registrySelect( 'core/block-editor' );

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
			unitCount = 1,
			selectedDate = '',
			dateModifier = 0,
			showWeekends = true,
		} = liveCalendar?.attributes || {};

		// Get site settings for start_of_week.
		const dateSettings = getSettings();
		const startOfWeek = dateSettings?.l10n.startOfWeek || 0;

		const range = calculateDateRange(
			{
				viewType,
				unitCount,
				selectedDate,
				dateModifier,
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
		usesContext: [
			'gatherpress/dayNumber',
			'gatherpress/dayDate',
			'gatherpress/isEmpty',
		],
		getValues( { context, args } ) {
			if ( context?.[ 'gatherpress/isEmpty' ] ) {
				return { content: '' };
			}
			const dayDate = context?.[ 'gatherpress/dayDate' ];
			const format = args?.format || '';

			if ( dayDate && format !== '' ) {
				const dateObj = new Date( `${ dayDate }T12:00:00Z` );
				return { content: dateI18n( format, dateObj, 'UTC' ) };
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

// Add InspectorControls for blocks bound to gatherpress/calendar-day:
const withDayNumberBindingControls = createHigherOrderComponent(
	( BlockEdit ) => {
		return ( props ) => {
			const { attributes, setAttributes } = props;
			const binding = attributes?.metadata?.bindings?.content;

			if ( binding?.source !== 'gatherpress/calendar-day' ) {
				return <BlockEdit { ...props } />;
			}

			const currentFormat = binding?.args?.format || '';

			const updateFormat = ( newFormat ) => {
				setAttributes( {
					metadata: {
						...attributes.metadata,
						bindings: {
							...attributes.metadata.bindings,
							content: {
								...binding,
								args: {
									...binding.args,
									format: newFormat,
								},
							},
						},
					},
				} );
			};

			return (
				<>
					<BlockEdit { ...props } />
					<InspectorControls>
						<PanelBody
							title={ __(
								'Day Number Settings',
								'gatherpress-calendar'
							) }
							initialOpen={ true }
						>
							<SelectControl
								label={ __(
									'Date Format',
									'gatherpress-calendar'
								) }
								value={ currentFormat }
								options={ [
									{
										label: __(
											'Default (1, 2, 3…)',
											'gatherpress-calendar'
										),
										value: 'j',
									},
									{
										label: __(
											'Leading zero (01, 02, 03…)',
											'gatherpress-calendar'
										),
										value: 'd',
									},
									{
										label: __(
											'Ordinal (1st, 2nd, 3rd…)',
											'gatherpress-calendar'
										),
										value: 'jS',
									},
									{
										label: __(
											'Dot suffix (1., 2., 3…)',
											'gatherpress-calendar'
										),
										value: 'j.',
									},
									{
										label: __(
											'Weekday and day (Mon 1…)',
											'gatherpress-calendar'
										),
										value: 'D j',
									},
								] }
								onChange={ updateFormat }
							/>
						</PanelBody>
					</InspectorControls>
				</>
			);
		};
	},
	'withDayNumberBindingControls'
);

addFilter(
	'editor.BlockEdit',
	'gatherpress-calendar/day-number-binding-controls',
	withDayNumberBindingControls
);

/**
 * Reduce UI of GatherPress core query controls.
 *
 * Removes controls, that are not needed by a calendar-view, those are espceially:
 * - Upcoming / Past
 * - include unfinished events
 * - Offset number
 * - Max. count of events to query
 *
 * @see https://github.com/GatherPress/gatherpress/blob/main/docs/developer/blocks/slot-fills/README.md#add-or-remove-ui-elements
 *
 * @since 0.6.0
 */
addFilter(
	'gatherpress.eventQueryControls',
	'gatherpress-calendar/reduce-query-controls',
	( controls, { clientId } ) => {
		const hasCalendar = select( blockEditorStore )
			.getBlock( clientId )
			?.innerBlocks.some(
				( block ) => 'gatherpress/calendar' === block.name
			);

		return hasCalendar
			? controls.filter(
					( { name } ) =>
						! [
							'listType',
							'includeUnfinished',
							'offset',
							'count',
						].includes( name )
				)
			: controls;
	}
);
