import { CalendarWeek } from './CalendarWeek';

/**
 * CalendarTable Component
 *
 * Renders the calendar grid as virtual instances of the real
 * gatherpress/calendar-week (and, within it, gatherpress/calendar-day)
 * blocks. Supports multi-unit layouts (e.g. multi-month display).
 *
 * @since 0.1.0
 *
 * @param {Object}   props                     Component props.
 * @param {Object}   props.calendar            Calendar data structure.
 * @param {string[]} props.captions            Visually hidden caption of each table.
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
	captions = [],
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
					{ captions[ unitIndex ] && (
						<caption className="gatherpress-calendar__visually-hidden">
							{ captions[ unitIndex ] }
						</caption>
					) }
					{ /* Without "Show Weekdays" the row is hidden on screen only, as on the front end. */ }
					<thead
						className={
							showWeekdays ? undefined : 'is-visually-hidden'
						}
					>
						<tr>
							{ unit.dayNames.map( ( dayName, index ) => (
								<th key={ index } scope="col">
									{ dayName }
								</th>
							) ) }
						</tr>
					</thead>
					<tbody { ...tbodyProps }>
						{ unit.weeks.map( ( week, weekIndex ) => (
							<CalendarWeek
								key={ weekIndex }
								week={ week }
								weekIndex={ weekIndex }
								activeDate={ activeDate }
								setActiveDate={ setActiveDate }
								weekContext={ weekContext }
								liveWeekChildren={ liveWeekChildren }
								dayInnerBlocks={ dayInnerBlocks }
								weekBlockAttributes={ weekBlockAttributes }
								dayBlockAttributes={ dayBlockAttributes }
							/>
						) ) }
					</tbody>
				</table>
			) ) }
		</>
	);
}
