/**
 * GatherPress Calendar Block Bindings and Editor Filters
 *
 * @package
 * @since 0.8.0
 */

import { registerBlockBindingsSource } from '@wordpress/blocks';
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';
import domReady from '@wordpress/dom-ready';
import { InspectorControls } from '@wordpress/block-editor';
import { createHigherOrderComponent } from '@wordpress/compose';
import { PanelBody, SelectControl } from '@wordpress/components';

import {
	calculateDateRange,
	calculatePostSpanUnits,
	formatHeading,
} from './edit/utils/date-utils';
import { getStartOfWeek } from './edit/utils/calendar-utils';
import { findBlockByName } from './edit/utils/block-sync-utils';
import {
	resolveSourceEventDates,
	isPostDateSource,
} from './edit/utils/source-utils';
import { formatDayValue, NAMED_DAY_FORMATS } from '../utils/day-number';

domReady( () => {
	if ( typeof registerBlockBindingsSource !== 'function' ) {
		return;
	}

	/**
	 * Callback to get heading content for bound heading blocks in the editor.
	 *
	 * Subscribes to the calendar block's settings and current post dates,
	 * formatting the active date range.
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
		const parentQueryIds = getBlockParentsByBlockName(
			clientId,
			'core/query'
		);

		// 1. Search inside the same parent Query block.
		if ( parentQueryIds && parentQueryIds.length ) {
			const parentQuery = getBlock(
				parentQueryIds[ parentQueryIds.length - 1 ]
			);
			if ( parentQuery?.innerBlocks ) {
				calendarBlock = findBlockByName(
					parentQuery.innerBlocks,
					'gatherpress/calendar'
				);
			}
		}

		// 2. Fallback: search all blocks in the editor canvas.
		if ( ! calendarBlock ) {
			calendarBlock = findBlockByName(
				getBlocks(),
				'gatherpress/calendar'
			);
		}

		// Establish reactive subscription to calendar attributes.
		const liveCalendar = calendarBlock
			? getBlock( calendarBlock.clientId )
			: null;

		const {
			viewType = 'month',
			unitCount = 1,
			selectedDate = '',
			dateModifier = 0,
			showWeekends = true,
			dateRangeSource = 'default',
			postId = 0,
			sourcePostType = '',
		} = liveCalendar?.attributes || {};

		const startOfWeek = getStartOfWeek();

		const sourceDates = resolveSourceEventDates( registrySelect, {
			dateRangeSource,
			postId,
			sourcePostType,
		} );

		let effectiveSelectedDate = selectedDate;
		let effectiveUnitCount = unitCount;

		if ( sourceDates.hasPost ) {
			effectiveSelectedDate = sourceDates.startDate;
			effectiveUnitCount = calculatePostSpanUnits(
				viewType,
				sourceDates.startDate,
				sourceDates.endDate,
				startOfWeek
			);
		}

		const isPostAnchored = isPostDateSource( dateRangeSource );

		const range = calculateDateRange(
			{
				viewType,
				unitCount: effectiveUnitCount,
				selectedDate: effectiveSelectedDate,
				dateModifier: isPostAnchored ? 0 : dateModifier,
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

	registerBlockBindingsSource( {
		name: 'gatherpress/calendar-heading',
		label: __( 'Calendar Heading', 'gatherpress-calendar' ),
		usesContext: [ 'query' ],
		getValues: getCalendarHeadingValues,
	} );

	registerBlockBindingsSource( {
		name: 'gatherpress/calendar-day',
		label: __( 'Calendar Day Number', 'gatherpress-calendar' ),
		usesContext: [
			'gatherpress/dayNumber',
			'gatherpress/dayDate',
			'gatherpress/isEmpty',
		],
		// One value per bound attribute: 'content', or 'text' and 'url' of the
		// day modal button. The day archive URL is only known on the server.
		getValues( { context, bindings } ) {
			const values = {};

			for ( const [ attribute, binding ] of Object.entries(
				bindings ?? {}
			) ) {
				values[ attribute ] =
					context?.[ 'gatherpress/isEmpty' ] || 'url' === attribute
						? ''
						: formatDayValue(
								context?.[ 'gatherpress/dayDate' ],
								context?.[ 'gatherpress/dayNumber' ],
								binding?.args?.format
							);
			}

			return values;
		},
	} );
} );

// InspectorControls for blocks bound to gatherpress/calendar-day:
const withDayNumberBindingControls = createHigherOrderComponent(
	( BlockEdit ) => {
		return ( props ) => {
			const { attributes, setAttributes } = props;
			const binding = attributes?.metadata?.bindings?.content;

			if (
				binding?.source !== 'gatherpress/calendar-day' ||
				NAMED_DAY_FORMATS.includes( binding?.args?.format )
			) {
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
