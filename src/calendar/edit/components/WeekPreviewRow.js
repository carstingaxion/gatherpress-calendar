import { memo } from '@wordpress/element';
import {
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUseColorProps as useColorProps,
} from '@wordpress/block-editor';

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
 * @since 0.4.0
 *
 * @param {Object}   props                     - Component props.
 * @param {Array}    props.week                - This week's day data entries.
 * @param {Array}    props.dayInnerBlocks      - The real day template's inner blocks, for previews.
 * @param {Object}   props.weekBlockAttributes - The real calendar-week block's own attributes, for style parity.
 * @param {Object}   props.dayBlockAttributes  - The real calendar-day block's own attributes, for style parity.
 * @param {Function} props.onActivateDay       - Called with a day's date when that day is clicked.
 *
 * @return {Element} Week row preview element.
 */
function WeekPreviewRowComponent( {
	week,
	dayInnerBlocks,
	weekBlockAttributes,
	dayBlockAttributes,
	onActivateDay,
} ) {
	// Mirror the real calendar-week block's own color/spacing/shadow
	// styling so every previewed week row looks like the live one.
	const colorProps = useColorProps( weekBlockAttributes ?? {} );

	const classNames = [ 'gatherpress-calendar__week', colorProps.className ]
		.filter( Boolean )
		.join( ' ' );

	const style = {
		...colorProps.style,
	};

	return (
		<tr className={ classNames } style={ style }>
			{ week.map( ( day, dayIndex ) => (
				<DayPreviewCell
					key={ day.date ?? `empty-${ dayIndex }` }
					day={ day }
					innerBlocks={ dayInnerBlocks }
					dayBlockAttributes={ dayBlockAttributes }
					onActivateDay={ onActivateDay }
				/>
			) ) }
		</tr>
	);
}

// Memoized: this (and each DayPreviewCell inside it) mounts a real,
// isolated block-editor preview instance. Without memoization, every
// unrelated re-render higher up (e.g. selecting any block) would
// re-render every non-active week/day preview in the whole grid.
export const WeekPreviewRow = memo( WeekPreviewRowComponent );
