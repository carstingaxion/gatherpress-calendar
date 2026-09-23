/**
 * GatherPress Calendar Block Editor Component
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @package
 * @since 0.1.0
 */

import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
	PanelColorSettings,
	store as blockEditorStore,
	__experimentalGetGapCSSValue as getGapCSSValue,
} from '@wordpress/block-editor';
import {
	Placeholder,
	PanelBody,
	RangeControl,
	BoxControl,
	BorderControl,
	ToggleControl,
} from '@wordpress/components';
import { useState, useMemo } from '@wordpress/element';
import { useSelect } from '@wordpress/data';

/**
 * Editor-specific styles
 *
 * Styles defined here are only applied within the block editor context.
 * They help distinguish the editor view from the frontend display.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

import { CALENDAR_TEMPLATE } from './edit/constants';

import { calculateDateQuery } from './edit/utils/date-utils';
import {
	generateCalendar,
	getDefaultActiveDate,
} from './edit/utils/calendar-utils';
import { useStableValue } from '../utils/use-stable-value';

import { useCalendarData } from './edit/hooks/useCalendarData';

import { MonthPicker } from './edit/components/MonthPicker';
import { MonthControls } from './edit/components/MonthControls';
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
		selectedMonth,
		monthModifier = 0,
		showWeekdays = true,
		showWeekends = true,
	} = attributes;
	const { query } = context;
	const [ showMonthPicker, setShowMonthPicker ] = useState( false );
	const [ activeDate, setActiveDate ] = useState( '' );

	// Calculate date query based on selectedMonth and monthModifier.
	const dateQuery = useMemo(
		() => calculateDateQuery( selectedMonth, monthModifier ),
		[ selectedMonth, monthModifier ]
	);

	// Fetch posts and site settings.
	const { posts, startOfWeek } = useCalendarData( query, dateQuery );

	// Generate calendar structure.
	const calendar = useMemo(
		() =>
			generateCalendar(
				posts,
				startOfWeek,
				selectedMonth,
				monthModifier,
				showWeekends
			),
		[ posts, startOfWeek, selectedMonth, monthModifier, showWeekends ]
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
		className: 'gatherpress-calendar-block',
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
			templateLock: false,
			renderAppender: false,
		}
	);

	// Dynamic grid columns style and modifier class
	const tableClasses = [
		'gatherpress-calendar__table',
		! showWeekends ? 'is-hidden-weekends' : '',
	].filter( Boolean ).join( ' ' );

	const tableStyle = {
		gap: getGapCSSValue( attributes.style?.spacing?.blockGap ),
		'--gatherpress-calendar-columns': showWeekends ? 7 : 5,
	};

	// Stable reference: every week's BlockContextProvider value is built on
	// top of this, and an unstable base object here would force a fresh
	// context (and a cascading re-render of every preview cell) on every
	// render, even ones unrelated to the calendar's own data (e.g. simply
	// selecting a block).
	const weekContext = useMemo(
		() => ( {
			'gatherpress/year': dateQuery.year,
			'gatherpress/month': dateQuery.month,
		} ),
		[ dateQuery ]
	);

	// Show placeholder if block is not inside a Query Loop.
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

	// Handlers
	const handleMonthSelect = ( value ) => {
		setAttributes( { selectedMonth: value } );
		setShowMonthPicker( false );
	};

	const handleMonthChange = ( value ) => {
		setAttributes( { selectedMonth: value } );
	};

	const handleModifierChange = ( value ) => {
		const numValue = value === '' ? 0 : parseInt( value, 10 );
		setAttributes( {
			monthModifier: isNaN( numValue ) ? 0 : numValue,
		} );
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Calendar Settings', 'gatherpress-calendar' ) }
				>
					<p>
						{ __(
							'Select a specific month to display, or leave empty to show the current month.',
							'gatherpress-calendar'
						) }
					</p>
					{ showMonthPicker ? (
						<MonthPicker
							selectedMonth={ selectedMonth }
							onSelect={ handleMonthSelect }
							onCancel={ () => setShowMonthPicker( false ) }
						/>
					) : (
						<MonthControls
							selectedMonth={ selectedMonth }
							monthModifier={ monthModifier }
							onMonthChange={ handleMonthChange }
							onModifierChange={ handleModifierChange }
							onOpenPicker={ () => setShowMonthPicker( true ) }
						/>
					) }

					<hr
						style={ {
							margin: '16px 0',
							borderTop: '1px solid #ddd',
						} }
					/>

					<ToggleControl
						label={ __( 'Show Weekdays', 'gatherpress-calendar' ) }
						checked={ showWeekdays }
						onChange={ ( value ) =>
							setAttributes( { showWeekdays: value } )
						}
						help={ __(
							'Display the days of the week inside the calendars header.',
							'gatherpress-calendar'
						) }
					/>
					<ToggleControl
						label={ __( 'Show Weekends', 'gatherpress-calendar' ) }
						checked={ showWeekends }
						onChange={ ( value ) => setAttributes( { showWeekends: value } ) }
						help={ __(
							'Display weekend days in the calendar grid.',
							'gatherpress-calendar'
						) }
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<div className="gatherpress-calendar">
					<CalendarTable
						calendar={ calendar }
						showWeekdays={ showWeekdays }
						style={ tableStyle }
						tableClasses={ tableClasses }
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
			</div>
		</>
	);
}
