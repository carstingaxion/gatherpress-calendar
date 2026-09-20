import { DayPreviewCell } from './DayPreviewCell';

/**
 * WeekPreviewRow Component
 *
 * Renders a whole non-active week as a read-only virtual instance: a real
 * `<tr>` of DayPreviewCell previews, one per day, all built from the same
 * real day template inner blocks. Clicking any day activates it, making
 * that week (and that day) the live/editable one.
 *
 * @since 0.5.0
 *
 * @param {Object}   props                 - Component props.
 * @param {Array}    props.week            - This week's day data entries.
 * @param {Array}    props.dayInnerBlocks  - The real day template's inner blocks, for previews.
 * @param {Function} props.onActivateDay   - Called with a day's date when that day is clicked.
 *
 * @return {Element} Week row preview element.
 */
export function WeekPreviewRow( { week, dayInnerBlocks, onActivateDay } ) {
	return (
		<tr className="gatherpress-calendar__week">
			{ week.map( ( day, dayIndex ) => (
				<DayPreviewCell
					key={ day.date ?? `empty-${ dayIndex }` }
					day={ day }
					innerBlocks={ dayInnerBlocks }
					onActivate={ () => onActivateDay( day.date ) }
				/>
			) ) }
		</tr>
	);
}
