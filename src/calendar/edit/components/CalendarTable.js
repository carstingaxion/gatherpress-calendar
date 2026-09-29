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
 * @param {Object}   props                     Component props.
 * @param {Object}   props.calendar            Calendar data structure.
 * @param {boolean}  props.showWeekdays        Whether to show weekday headers.
 * @param {Object}   props.style               Table style.
 * @param {string}   props.activeDate          Currently live/editable date.
 * @param {Function} props.setActiveDate       Setter for active date.
 * @param {Object}   props.weekContext         Base context shared by all weeks.
 * @param {Element}  props.liveWeekChildren    Live week inner blocks.
 * @param {Array}    props.dayInnerBlocks      Day template inner blocks.
 * @param {Object}   props.weekBlockAttributes Attributes of week block.
 * @param {Object}   props.dayBlockAttributes  Attributes of day block.
 * @param {Object}   props.tbodyProps          Tbody element props.
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
	const units = calendar.units || [
		{ dayNames: calendar.dayNames, weeks: calendar.weeks },
	];

	return (
		<>
			{ units.map( ( unit, unitIndex ) => (
				<table
					key={ unitIndex }
					className="gatherpress-calendar__table"
					style={ style }
				>
					{ showWeekdays && (
						<thead>
							<tr>
								{ unit.dayNames.map( ( dayName, index ) => (
									<th key={ index }>{ dayName }</th>
								) ) }
							</tr>
						</thead>
					) }
					<tbody { ...tbodyProps }>
						{ unit.weeks.map( ( week, weekIndex ) => {
							const isActiveWeek = week.some(
								( day ) => day.date === activeDate
							);

							const weekContextValue = {
								...weekContext,
								'gatherpress/weekIndex': weekIndex,
								'gatherpress/weekDays': week,
								'gatherpress/activeDate': activeDate,
								'gatherpress/setActiveDate': setActiveDate,
							};

							return (
								<BlockContextProvider
									key={ weekIndex }
									value={ weekContextValue }
								>
									{ isActiveWeek ? (
										liveWeekChildren
									) : (
										<WeekPreviewRow
											week={ week }
											dayInnerBlocks={ dayInnerBlocks }
											weekBlockAttributes={
												weekBlockAttributes
											}
											dayBlockAttributes={
												dayBlockAttributes
											}
											onActivateDay={ setActiveDate }
										/>
									) }
								</BlockContextProvider>
							);
						} ) }
					</tbody>
				</table>
			) ) }
		</>
	);
}
