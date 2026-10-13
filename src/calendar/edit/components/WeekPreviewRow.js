import { memo } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import {
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUseColorProps as useColorProps,
} from '@wordpress/block-editor';

import { DayPreviewCell } from './DayPreviewCell';

/**
 * WeekPreviewRow Component
 *
 * @param {Object}   props                     Component props.
 * @param {Array}    props.week                This week's day data entries.
 * @param {number}   props.weekNumber          ISO week number, 0 for none.
 * @param {Array}    props.dayInnerBlocks      Day template inner blocks.
 * @param {Object}   props.weekBlockAttributes Attributes of week block.
 * @param {Object}   props.dayBlockAttributes  Attributes of day block.
 * @param {Function} props.onActivateDay       Callback when day is activated.
 *
 * @return {Element} Week row preview element.
 */
function WeekPreviewRowComponent( {
	week,
	weekNumber,
	dayInnerBlocks,
	weekBlockAttributes = {},
	dayBlockAttributes,
	onActivateDay,
} ) {
	const colorProps = useColorProps( weekBlockAttributes ?? {} );

	const zebraColor = weekBlockAttributes?.zebraColor;
	const isZebra =
		Boolean( weekBlockAttributes?.className?.includes( 'is-style-zebra' ) );

	const style = {
		...colorProps.style,
	};

	if ( isZebra && zebraColor ) {
		style[ '--gatherpress-calendar-zebra-color' ] = zebraColor;
	}

	const classNames = [
		'gatherpress-calendar__week',
		weekBlockAttributes?.className,
		colorProps.className,
	]
		.filter( Boolean )
		.join( ' ' );

	return (
		<tr className={ classNames } style={ style }>
			{ weekNumber > 0 && (
				<th scope="row" className="gatherpress--screen-reader-text">
					{ sprintf(
						/* translators: %d: ISO 8601 week number. */
						__( 'Week %d', 'gatherpress-calendar' ),
						weekNumber
					) }
				</th>
			) }
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

export const WeekPreviewRow = memo( WeekPreviewRowComponent );