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
import { useState, useMemo } from '@wordpress/element';
import { useSelect } from '@wordpress/data';

import { CALENDAR_TEMPLATE } from './edit/constants';
import {
	calculateDateRange,
	calculateDateQuery,
} from './edit/utils/date-utils';
import {
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
						selectedDate,
						dateModifier,
						showWeekends,
					},
					0
				),
			[ viewType, selectedDate, dateModifier, showWeekends ]
		)
	);

	const dateRange = useMemo(
		() =>
			calculateDateRange(
				{
					viewType,
					selectedDate,
					dateModifier,
					showWeekends,
				},
				startOfWeek
			),
		[ viewType, selectedDate, dateModifier, showWeekends, startOfWeek ]
	);

	const calendar = useMemo(
		() => generateCalendar( posts, startOfWeek, dateRange, showWeekends ),
		[ posts, startOfWeek, dateRange, showWeekends ]
	);

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

	const blockProps = useBlockProps( {
		className: `is-view-${ viewType }`,
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

	const tableStyle = {
		gap: getGapCSSValue( attributes.style?.spacing?.blockGap ),
		'--gatherpress-calendar-columns': getColumnsCount(
			viewType,
			showWeekends
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
