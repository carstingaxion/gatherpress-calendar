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
import { dateI18n, getSettings } from '@wordpress/date';
import { InspectorControls } from '@wordpress/block-editor';
import { createHigherOrderComponent } from '@wordpress/compose';
import { PanelBody, SelectControl } from '@wordpress/components';

import { calculateDateRange, formatHeading } from './edit/utils/date-utils';
import { findBlockByName } from './edit/utils/block-sync-utils';
import {
	DAY_MODAL_HEADING_FORMAT,
	DAY_MODAL_TRIGGER_FORMAT,
} from './edit/constants';

// Named formats are translated by PHP, they are not day number formats.
const NAMED_DAY_FORMATS = [
	DAY_MODAL_HEADING_FORMAT,
	DAY_MODAL_TRIGGER_FORMAT,
];

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
		const parentQueryIds = getBlockParentsByBlockName(
			clientId,
			'core/query'
		);

		// 1. Search inside the same parent Query block
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

		// 2. Fallback: search all blocks in the editor canvas
		if ( ! calendarBlock ) {
			calendarBlock = findBlockByName(
				getBlocks(),
				'gatherpress/calendar'
			);
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
