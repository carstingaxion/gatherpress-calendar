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
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalGetGapCSSValue as getGapCSSValue,
} from '@wordpress/block-editor';
import { Placeholder, PanelBody, ToggleControl } from '@wordpress/components';
import { useState, useMemo } from '@wordpress/element';

import { CALENDAR_TEMPLATE } from './edit/constants';
import {
	calculateDateRange,
	calculateDateQuery,
	formatHeading,
} from './edit/utils/date-utils';
import { getDatetimeSeparator } from './edit/utils/source-utils';
import {
	generateCalendar,
	getDefaultActiveDate,
	getColumnsCount,
	getStartOfWeek,
} from './edit/utils/calendar-utils';
import { useCalendarSync } from './edit/hooks/useCalendarSync';
import { useCalendarData } from './edit/hooks/useCalendarData';
import { useCalendarDayTemplate } from './edit/hooks/useCalendarDayTemplate';
import { useDateRangeSourceSync } from './edit/hooks/useDateRangeSourceSync';
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
 * @param {Object}   props               Component props.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Function to update block attributes.
 * @param {Object}   props.context       Context from parent blocks.
 * @param {string}   props.clientId      This block's client ID.
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
		showScheduled = false,
		dateRangeSource = 'default',
		postId = 0,
		sourcePostType = '',
	} = attributes;

	const { query } = context;

	const [ showMonthPicker, setShowMonthPicker ] = useState( false );
	const [ activeDate, setActiveDate ] = useState( '' );

	const startOfWeek = getStartOfWeek();

	// Coordinate dateRangeSource resolution, attribute synchronization, and presets.
	const {
		sourcePostDates,
		hasPostDates,
		effectiveUnitCount,
		effectiveSelectedDate,
		effectiveDateModifier,
		hasCurrentSupport,
	} = useDateRangeSourceSync( {
		attributes,
		setAttributes,
		context,
		startOfWeek,
	} );

	// Synchronize parent Query block name, Heading name, and pagination labels.
	useCalendarSync( {
		clientId,
		viewType,
		unitCount: effectiveUnitCount,
	} );

	const dateRange = useMemo(
		() =>
			calculateDateRange(
				{
					viewType,
					unitCount: effectiveUnitCount,
					selectedDate: effectiveSelectedDate,
					dateModifier: effectiveDateModifier,
					showWeekends,
				},
				startOfWeek
			),
		[
			viewType,
			effectiveUnitCount,
			effectiveSelectedDate,
			effectiveDateModifier,
			showWeekends,
			startOfWeek,
		]
	);

	const { posts } = useCalendarData(
		query,
		useMemo(
			() =>
				calculateDateQuery(
					{
						viewType,
						unitCount: effectiveUnitCount,
						selectedDate: effectiveSelectedDate,
						dateModifier: effectiveDateModifier,
						showWeekends,
					},
					startOfWeek
				),
			[
				viewType,
				effectiveUnitCount,
				effectiveSelectedDate,
				effectiveDateModifier,
				showWeekends,
				startOfWeek,
			]
		),
		showScheduled
	);

	const calendar = useMemo(
		() => generateCalendar( posts, startOfWeek, dateRange, showWeekends ),
		[ posts, startOfWeek, dateRange, showWeekends ]
	);

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

	// Retrieve the real week/day template blocks so previews can clone their
	// actual inner content (Day Number, Post Title, Event Date, etc.) and
	// mirror their own color/border styling (e.g. a custom background).
	const { dayInnerBlocks, dayBlockAttributes, weekBlockAttributes } =
		useCalendarDayTemplate( clientId );

	const blockClasses = [
		`is-view-${ viewType }`,
		dateRange.unitCount > 1 ? 'has-multiple-units' : '',
	]
		.filter( Boolean )
		.join( ' ' );

	const blockProps = useBlockProps( {
		className: blockClasses,
		style: {
			'--gatherpress-calendar-units': dateRange.unitCount,
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
			dateRange.unitCount
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

	const handleSourcePostTypeChange = ( newType ) => {
		setAttributes( {
			sourcePostType: newType,
			postId: 0,
		} );
	};

	const separator = getDatetimeSeparator();

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
							clientId={ clientId }
							context={ context }
							viewType={ viewType }
							onViewTypeChange={ ( val ) =>
								setAttributes( { viewType: val } )
							}
							unitCount={ unitCount }
							onUnitCountChange={ handleUnitCountChange }
							selectedDate={
								hasPostDates
									? `${ dateRange.startDate } ${ separator } ${ dateRange.endDate }`
									: selectedDate
							}
							dateModifier={ dateModifier }
							onDateChange={ handleDateChange }
							onModifierChange={ handleModifierChange }
							onOpenPicker={ () => setShowMonthPicker( true ) }
							dateRangeSource={ dateRangeSource }
							onSourceChange={ ( val ) =>
								setAttributes( { dateRangeSource: val } )
							}
							postId={ postId }
							onPostIdChange={ ( val ) =>
								setAttributes( { postId: val } )
							}
							sourcePostType={ sourcePostType }
							onPostTypeChange={ handleSourcePostTypeChange }
							postTitle={ sourcePostDates.postTitle }
							hasPostDates={ hasPostDates }
							hasCurrentSupport={ hasCurrentSupport }
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
					<ToggleControl
						label={ __(
							'Show Scheduled Posts',
							'gatherpress-calendar'
						) }
						checked={ showScheduled }
						onChange={ ( value ) =>
							setAttributes( { showScheduled: value } )
						}
						help={ __(
							'Include posts that are scheduled to publish later. All visitors can see what the calendar shows for them, such as title and excerpt, but their links only work once they are published.',
							'gatherpress-calendar'
						) }
					/>
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
