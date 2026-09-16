import { DayCell } from './DayCell';

/**
 * CalendarTable Component
 *
 * Renders the calendar grid with day names and weeks.
 *
 * @since 0.1.0
 *
 * @param {Object} props          - Component props.
 * @param {Object} props.calendar - Calendar data structure.
 * @param {Object} props.showWeekdays - Bool wether to show the days of the week.
 *
 * @return {Element} Calendar table component.
 */
export function CalendarTable( { calendar, showWeekdays } ) {
	return (
		<table className="gatherpress-calendar__table">
			{ showWeekdays && (
				<thead>
						<tr>
							{ calendar.dayNames.map( ( dayName, index ) => (
								<th key={ index }>{ dayName }</th>
							) ) }
						</tr>
				</thead>
			) }
			<tbody>
				{ calendar.weeks.map( ( week, weekIndex ) => (
					<tr key={ weekIndex }>
						{ week.map( ( day, dayIndex ) => (
							<DayCell key={ dayIndex } day={ day } />
						) ) }
					</tr>
				) ) }
			</tbody>
		</table>
	);
}
