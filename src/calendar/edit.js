/**
 * GatherPress Calendar Block Editor Component
 *
 * @package
 * @since 0.1.0
 */

import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
	store as blockEditorStore,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalGetGapCSSValue as getGapCSSValue,
} from '@wordpress/block-editor';
import { Placeholder, PanelBody, ToggleControl } from '@wordpress/components';
import { useEffect, useState, useMemo, useRef } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';

import { CALENDAR_TEMPLATE } from './edit/constants';
import {
	calculateDateRange,
	calculateDateQuery,
	formatHeading,
} from './edit/utils/date-utils';
import {
	findHeadingBlock,
	findBlockByName,
	getCalendarBlockName,
	getPaginationLabel,
	generateCalendar,
	getDefaultActiveDate,
	getColumnsCount,
} from './edit/utils/calendar-utils';
import { useStableValue } from '../utils/use-stable-value';
import { useCalendarData } from './edit/hooks/useCalendarData';
import { MonthPicker } from './edit/components/MonthPicker';
import { DateControls } from './edit/components/DateControls';
import { CalendarTable } from './edit/components/CalendarTable';

/**
 * Edit Component
 *
 * Main editor component for the GatherPress Calendar block.
 *
 * @since 0.1.0
 *
 * @param {Object}   props               - Component props.
 * @param {Object}   props.attributes    - Block attributes.
 * @param {Function} props.setAttributes - Function to update block attributes.
 * @param {Object}   props.context       - Context from parent blocks.
 * @param {string}   props.clientId      - This block's client ID.
 *
 * @return {Element} React element rendered in the editor.
 */
export default function Edit( {
	attributes,
	setAttributes,
	context,
	clientId,
} ) {
	const {
		viewType = 'month',
		unitCount = 1,
		selectedDate = '',
		dateModifier = 0,
		showWeekdays = true,
		showWeekends = true,
	} = attributes;

	const { query } = context;
	const [ showMonthPicker, setShowMonthPicker ] = useState( false );
	const [ activeDate, setActiveDate ] = useState( '' );

	const { posts, startOfWeek } = useCalendarData(
		query,
		useMemo(
			() =>
				calculateDateQuery(
					{
						viewType,
						unitCount,
						selectedDate,
						dateModifier,
						showWeekends,
					},
					0
				),
			[ viewType, unitCount, selectedDate, dateModifier, showWeekends ]
		)
	);

	const dateRange = useMemo(
		() =>
			calculateDateRange(
				{
					viewType,
					unitCount,
					selectedDate,
					dateModifier,
					showWeekends,
				},
				startOfWeek
			),
		[
			viewType,
			unitCount,
			selectedDate,
			dateModifier,
			showWeekends,
			startOfWeek,
		]
	);

	const calendar = useMemo(
		() => generateCalendar( posts, startOfWeek, dateRange, showWeekends ),
		[ posts, startOfWeek, dateRange, showWeekends ]
	);

	// Locate parent Query block, heading block, and pagination blocks.
	const {
		parentQueryClientId,
		parentQueryMetadata,
		headingClientId,
		headingMetadata,
		paginationPrevClientId,
		paginationNextClientId,
	} = useSelect(
		( select ) => {
			const { getBlockParentsByBlockName, getBlock } =
				select( blockEditorStore );

			const parents = getBlockParentsByBlockName(
				clientId,
				'core/query'
			);
			const parentId = parents?.[ parents.length - 1 ];
			const parentBlock = parentId ? getBlock( parentId ) : null;

			const headingBlock = parentBlock?.innerBlocks
				? findHeadingBlock( parentBlock.innerBlocks )
				: null;

			const prevBlock = parentBlock?.innerBlocks
				? findBlockByName(
						parentBlock.innerBlocks,
						'core/query-pagination-previous'
					)
				: null;

			const nextBlock = parentBlock?.innerBlocks
				? findBlockByName(
						parentBlock.innerBlocks,
						'core/query-pagination-next'
					)
				: null;

			return {
				parentQueryClientId: parentId ?? null,
				parentQueryMetadata: parentBlock?.attributes?.metadata,
				headingClientId: headingBlock?.clientId ?? null,
				headingMetadata: headingBlock?.attributes?.metadata,
				paginationPrevClientId: prevBlock?.clientId ?? null,
				paginationNextClientId: nextBlock?.clientId ?? null,
			};
		},
		[ clientId ]
	);

	const { updateBlockAttributes } = useDispatch( blockEditorStore );

	const targetQueryName = useMemo(
		() => getCalendarBlockName( viewType, unitCount ),
		[ viewType, unitCount ]
	);

	const targetHeadingName = useMemo(
		() =>
			getCalendarBlockName(
				viewType,
				unitCount,
				__( 'Heading', 'gatherpress-calendar' )
			),
		[ viewType, unitCount ]
	);

	const targetPrevLabel = useMemo(
		() => getPaginationLabel( 'previous', viewType, unitCount ),
		[ viewType, unitCount ]
	);

	const targetNextLabel = useMemo(
		() => getPaginationLabel( 'next', viewType, unitCount ),
		[ viewType, unitCount ]
	);

	// Track previous view configuration so names and labels are only reset when config changes.
	const prevConfigRef = useRef( { viewType, unitCount } );

	useEffect( () => {
		// Hard overwrite the parent Query block's name,
		// so the Query block is always named after the calendar it contains.
		if (
			parentQueryClientId &&
			parentQueryMetadata?.name !== targetQueryName
		) {
			updateBlockAttributes( parentQueryClientId, {
				metadata: {
					...parentQueryMetadata,
					name: targetQueryName,
				},
			} );
		}

		// Only overwrite block names and pagination labels when unitCount or viewType changes.
		const hasConfigChanged =
			prevConfigRef.current.viewType !== viewType ||
			prevConfigRef.current.unitCount !== unitCount;

		if ( ! hasConfigChanged ) {
			return;
		}

		prevConfigRef.current = { viewType, unitCount };

		if ( headingClientId ) {
			updateBlockAttributes( headingClientId, {
				metadata: {
					...headingMetadata,
					name: targetHeadingName,
				},
			} );
		}

		if ( paginationPrevClientId ) {
			updateBlockAttributes( paginationPrevClientId, {
				label: targetPrevLabel,
			} );
		}

		if ( paginationNextClientId ) {
			updateBlockAttributes( paginationNextClientId, {
				label: targetNextLabel,
			} );
		}
	}, [
		parentQueryClientId,
		parentQueryMetadata,
		targetQueryName,
		headingClientId,
		headingMetadata,
		targetHeadingName,
		viewType,
		unitCount,
		targetPrevLabel,
		targetNextLabel,
		paginationPrevClientId,
		paginationNextClientId,
		updateBlockAttributes,
	] );

	// Table captions, as on the front end: the name of each month grid, or
	// the heading of the week or day range.
	const captions = useMemo( () => {
		const start = dateRange.startDateObj || new Date( dateRange.startDate );
		const end = dateRange.endDateObj || new Date( dateRange.endDate );
		if ( 'month' !== viewType ) {
			return [ formatHeading( viewType, start, end ) ];
		}
		return ( calendar.units || [ calendar ] ).map( ( unit, index ) => {
			// The 15th: a timezone offset cannot move it to another month.
			const mid = new Date(
				start.getFullYear(),
				start.getMonth() + index,
				15
			);
			return formatHeading( 'month', mid, mid );
		} );
	}, [ viewType, dateRange, calendar ] );

	// Resolve which day is currently "live"/editable: keep the previously
	// active date if it still exists in this month, otherwise fall back to
	// today (or the 1st) so the preview always has a live cell to show.
	const resolvedActiveDate = useMemo( () => {
		const days = calendar.weeks.flat();
		if ( days.some( ( day ) => day.date === activeDate ) ) {
			return activeDate;
		}
		return getDefaultActiveDate( calendar );
	}, [ calendar, activeDate ] );

	// Locate the real week/day template blocks so previews can clone their
	// actual inner content (Day Number, Post Title, Event Date, etc.) and
	// mirror their own color/border styling (e.g. a custom background).
	const { dayInnerBlocks, dayBlockAttributes, weekBlockAttributes } =
		useStableValue(
			useSelect(
				( select ) => {
					const { getBlocks } = select( blockEditorStore );
					const weekBlock = getBlocks( clientId )[ 0 ];
					const dayBlock = weekBlock
						? getBlocks( weekBlock.clientId )[ 0 ]
						: null;
					return {
						dayInnerBlocks: dayBlock
							? getBlocks( dayBlock.clientId )
							: [],
						dayBlockAttributes: dayBlock?.attributes ?? {},
						weekBlockAttributes: weekBlock?.attributes ?? {},
					};
				},
				[ clientId ]
			)
		);

	const blockClasses = [
		`is-view-${ viewType }`,
		unitCount > 1 ? 'has-multiple-units' : '',
	]
		.filter( Boolean )
		.join( ' ' );

	const blockProps = useBlockProps( {
		className: blockClasses,
		style: {
			'--gatherpress-calendar-units': unitCount,
		},
	} );

	// The real, live-editable week+day+content InnerBlocks tree. Rendered
	// inside <tbody> at whichever week row contains resolvedActiveDate;
	// every other week is a read-only preview (see CalendarTable).
	const { children: liveWeekChildren, ...tbodyProps } = useInnerBlocksProps(
		{
			className: 'gatherpress-calendar__weeks',
		},
		{
			allowedBlocks: [ 'gatherpress/calendar-week' ],
			template: CALENDAR_TEMPLATE,
			templateLock: false, // TODO: Consider 'contentOnly', which is nice here.
			renderAppender: false,
		}
	);

	const blockGap = attributes.style?.spacing?.blockGap;
	const tableGap = getGapCSSValue( blockGap );
	// Day cells subtract the column gaps to stay square (calendar-day/style.scss),
	// so pass one length: the 'left' side of a split gap, and '0px' for '0'.
	const columnGap = getGapCSSValue(
		blockGap && 'object' === typeof blockGap
			? ( blockGap.left ?? '1px' )
			: blockGap
	);
	const tableStyle = {
		gap: tableGap,
		...( columnGap
			? {
					'--gatherpress-calendar-column-gap':
						'0' === columnGap ? '0px' : columnGap,
				}
			: {} ),
		'--gatherpress-calendar-columns': getColumnsCount(
			viewType,
			showWeekends,
			unitCount
		),
	};

	const weekContext = useMemo(
		() => ( {
			'gatherpress/viewType': viewType,
			'gatherpress/year': dateRange.year,
			'gatherpress/month': dateRange.month,
			'gatherpress/startDate': dateRange.startDate,
			'gatherpress/endDate': dateRange.endDate,
		} ),
		[ viewType, dateRange ]
	);

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

	const handleDateChange = ( value ) => {
		setAttributes( { selectedDate: value } );
		setShowMonthPicker( false );
	};

	const handleModifierChange = ( value ) => {
		const numValue = value === '' ? 0 : parseInt( value, 10 );
		setAttributes( {
			dateModifier: isNaN( numValue ) ? 0 : numValue,
		} );
	};

	const handleUnitCountChange = ( value ) => {
		const count = parseInt( value, 10 );
		setAttributes( {
			unitCount: isNaN( count ) || count < 1 ? 1 : count,
		} );
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Calendar Settings', 'gatherpress-calendar' ) }
				>
					{ showMonthPicker ? (
						<MonthPicker
							selectedMonth={ selectedDate }
							onSelect={ handleDateChange }
							onCancel={ () => setShowMonthPicker( false ) }
						/>
					) : (
						<DateControls
							viewType={ viewType }
							onViewTypeChange={ ( val ) =>
								setAttributes( { viewType: val } )
							}
							unitCount={ unitCount }
							onUnitCountChange={ handleUnitCountChange }
							selectedDate={ selectedDate }
							dateModifier={ dateModifier }
							onDateChange={ handleDateChange }
							onModifierChange={ handleModifierChange }
							onOpenPicker={ () => setShowMonthPicker( true ) }
						/>
					) }

					<ToggleControl
						label={ __( 'Show Weekdays', 'gatherpress-calendar' ) }
						checked={ showWeekdays }
						onChange={ ( value ) =>
							setAttributes( { showWeekdays: value } )
						}
						help={ __(
							'Display the days of the week inside the calendar header.',
							'gatherpress-calendar'
						) }
					/>
					{ 'day' !== viewType && (
						<ToggleControl
							label={ __(
								'Show Weekends',
								'gatherpress-calendar'
							) }
							checked={ showWeekends }
							onChange={ ( value ) =>
								setAttributes( { showWeekends: value } )
							}
							help={ __(
								'Display weekend days in the calendar grid.',
								'gatherpress-calendar'
							) }
						/>
					) }
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<CalendarTable
					calendar={ calendar }
					captions={ captions }
					showWeekdays={ showWeekdays }
					style={ tableStyle }
					activeDate={ resolvedActiveDate }
					setActiveDate={ setActiveDate }
					weekContext={ weekContext }
					liveWeekChildren={ liveWeekChildren }
					dayInnerBlocks={ dayInnerBlocks }
					weekBlockAttributes={ weekBlockAttributes }
					dayBlockAttributes={ dayBlockAttributes }
					tbodyProps={ tbodyProps }
				/>
			</div>
		</>
	);
}
