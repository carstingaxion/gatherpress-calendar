import { __experimentalUseColorProps as useColorProps } from '@wordpress/block-editor';

import { DayPreviewCell } from './DayPreviewCell';

/**
 * WeekPreviewRow Component
 *
 * Renders a whole non-active week as a read-only virtual instance: a real
 * `<tr>` (mirroring the real calendar-week block's own color styling) of
 * DayPreviewCell previews, one per day, all built from the same real day
 * template inner blocks. Clicking any day activates it, making that week
 * (and that day) the live/editable one.
 *
 * @since 0.5.0
 *
 * @param {Object}   props                     - Component props.
 * @param {Array}    props.week                - This week's day data entries.
 * @param {Array}    props.dayInnerBlocks       - The real day template's inner blocks, for previews.
 * @param {Object}   props.weekBlockAttributes  - The real calendar-week block's own attributes, for style parity.
 * @param {Object}   props.dayBlockAttributes   - The real calendar-day block's own attributes, for style parity.
 * @param {Function} props.onActivateDay        - Called with a day's date when that day is clicked.
 *
 * @return {Element} Week row preview element.
 */
export function WeekPreviewRow( {
	week,
	dayInnerBlocks,
	weekBlockAttributes,
	dayBlockAttributes,
	onActivateDay,
} ) {
	// Mirror the real calendar-week block's own color styling so every
	// previewed week row looks like the live one.
	const colorProps = useColorProps( weekBlockAttributes ?? {} );

	const classNames = [
		'gatherpress-calendar__week',
		colorProps.className,
	]
		.filter( Boolean )
		.join( ' ' );

	return (
		<tr className={ classNames } style={ colorProps.style }>
			{ week.map( ( day, dayIndex ) => (
				<DayPreviewCell
					key={ day.date ?? `empty-${ dayIndex }` }
					day={ day }
					innerBlocks={ dayInnerBlocks }
					dayBlockAttributes={ dayBlockAttributes }
					onActivate={ () => onActivateDay( day.date ) }
				/>
			) ) }
		</tr>
	);
}
