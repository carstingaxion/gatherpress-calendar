import { useMemo } from '@wordpress/element';
import { BlockContextProvider } from '@wordpress/block-editor';

import { WeekPreviewRow } from './WeekPreviewRow';

/**
 * CalendarTable Component
 *
 * Renders the calendar grid as virtual instances of the real
 * gatherpress/calendar-week (and, within it, gatherpress/calendar-day)
 * blocks: one week is rendered live/editable, matching the week that
 * contains the current `activeDate`; every other week is a read-only
 * preview built from the same underlying template blocks. This mirrors
 * what Calendar_Structure_Builder + Calendar_Week::render() do server-side.
 *
 * @since 0.1.0
 *
 * @param {Object}   props                     - Component props.
 * @param {Object}   props.calendar            - Calendar data structure.
 * @param {boolean}  props.showWeekdays        - Whether to show the days-of-week header row.
 * @param {Object}   props.style               - Inline style for the <table> (e.g. gap).
 * @param {string}   props.activeDate          - The currently live/editable day's date.
 * @param {Function} props.setActiveDate       - Setter to change the active day.
 * @param {Object}   props.weekContext         - Base context shared by every week (year, month, popoverStyles).
 * @param {Element}  props.liveWeekChildren    - The real, live-rendered week InnerBlocks content.
 * @param {Array}    props.dayInnerBlocks      - The real day template's inner blocks, for previews.
 * @param {Object}   props.weekBlockAttributes - The real calendar-week block's own attributes, for style parity.
 * @param {Object}   props.dayBlockAttributes  - The real calendar-day block's own attributes, for style parity.
 * @param {Object}   props.tbodyProps          - Props (ref/className) tying <tbody> to the live week's InnerBlocks.
 *
 * @return {Element} Calendar table component.
 */
export function CalendarTable( {
	calendar,
	showWeekdays,
	style,
	activeDate,
	setActiveDate,
	weekContext,
	liveWeekChildren,
	dayInnerBlocks,
	weekBlockAttributes,
	dayBlockAttributes,
	tbodyProps,
} ) {
	// Memoized so each week's context object keeps its reference across
	// renders that don't actually change the calendar/active day - an
	// unstable BlockContextProvider value would otherwise re-render every
	// descendant (live and previewed) on every unrelated render.
	const weekContexts = useMemo(
		() =>
			calendar.weeks.map( ( week, weekIndex ) => ( {
				...weekContext,
				'gatherpress/weekIndex': weekIndex,
				'gatherpress/weekDays': week,
				'gatherpress/activeDate': activeDate,
				'gatherpress/setActiveDate': setActiveDate,
			} ) ),
		[ calendar, weekContext, activeDate, setActiveDate ]
	);

	return (
		<table className="gatherpress-calendar__table" style={ style }>
			{ showWeekdays && (
				<thead>
					<tr>
						{ calendar.dayNames.map( ( dayName, index ) => (
							<th key={ index }>{ dayName }</th>
						) ) }
					</tr>
				</thead>
			) }
			<tbody { ...tbodyProps }>
				{ calendar.weeks.map( ( week, weekIndex ) => {
					const isActiveWeek = week.some(
						( day ) => day.date === activeDate
					);

					return (
						<BlockContextProvider
							key={ weekIndex }
							value={ weekContexts[ weekIndex ] }
						>
							{ isActiveWeek ? (
								liveWeekChildren
							) : (
								<WeekPreviewRow
									week={ week }
									dayInnerBlocks={ dayInnerBlocks }
									weekBlockAttributes={ weekBlockAttributes }
									dayBlockAttributes={ dayBlockAttributes }
									onActivateDay={ setActiveDate }
								/>
							) }
						</BlockContextProvider>
					);
				} ) }
			</tbody>
		</table>
	);
}
