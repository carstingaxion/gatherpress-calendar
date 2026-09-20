import { useMemo } from '@wordpress/element';
import {
	BlockContextProvider,
	__experimentalUseBlockPreview as useBlockPreview,
} from '@wordpress/block-editor';

/**
 * DayPreviewCell Component
 *
 * Renders a single, non-editable calendar day cell as a virtual instance:
 * a real `<td>` (matching gatherpress/calendar-day's own markup) wrapping a
 * read-only editor preview of that day's real inner blocks (e.g. Post Title,
 * Event Date), rendered under the day's own context (date, day number,
 * posts, isToday, isEmpty).
 *
 * We deliberately preview only the day's *inner* blocks rather than the
 * gatherpress/calendar-day block itself, because previewing a block that
 * renders its own <td> would nest an extra wrapper element inside this
 * <td>, producing invalid table markup.
 *
 * Clicking the cell activates it, making it the live/editable day.
 *
 * @since 0.5.0
 *
 * @param {Object}   props            - Component props.
 * @param {Object}   props.day        - Day data (day, date, posts, isEmpty, isToday).
 * @param {Array}    props.innerBlocks - The real calendar-day block's inner blocks to preview.
 * @param {Function} props.onActivate - Called when the cell is clicked.
 *
 * @return {Element} Day cell preview element.
 */
export function DayPreviewCell( { day, innerBlocks, onActivate } ) {
	const dayContext = useMemo(
		() => ( {
			'gatherpress/dayDate': day.date ?? '',
			'gatherpress/dayNumber': day.day ?? 0,
			'gatherpress/dayPosts': day.posts ?? [],
			'gatherpress/isEmpty': !! day.isEmpty,
			'gatherpress/isToday': !! day.isToday,
		} ),
		[ day ]
	);

	const blockPreviewProps = useBlockPreview( {
		blocks: innerBlocks ?? [],
		props: { className: 'gatherpress-calendar__events' },
	} );

	const classNames = [
		'gatherpress-calendar__day',
		day.isEmpty ? 'is-empty' : '',
		day.isToday ? 'is-today' : '',
		day.posts?.length > 0 ? 'has-posts' : '',
	]
		.filter( Boolean )
		.join( ' ' );

	if ( day.isEmpty ) {
		return <td className={ classNames } />;
	}

	return (
		<BlockContextProvider value={ dayContext }>
			<td
				className={ classNames }
				role="button"
				tabIndex={ 0 }
				onClick={ onActivate }
				onKeyPress={ onActivate }
			>
				<div className="gatherpress-calendar__day-content">
					<div className="gatherpress-calendar__day-number">
						{ day.day }
					</div>
					<div { ...blockPreviewProps } />
				</div>
			</td>
		</BlockContextProvider>
	);
}
