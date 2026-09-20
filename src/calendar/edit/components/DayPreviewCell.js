import { useMemo } from '@wordpress/element';
import {
	BlockContextProvider,
	__experimentalUseColorProps as useColorProps,
	__experimentalUseBorderProps as useBorderProps,
	__experimentalUseBlockPreview as useBlockPreview,
} from '@wordpress/block-editor';

const DAY_NUMBER_BINDING_SOURCE = 'gatherpress/calendar-day';

/**
 * Returns true when a block's `content` attribute is bound to the
 * gatherpress/calendar-day "Day Number" binding source.
 *
 * @param {Object} block Block object.
 *
 * @return {boolean} Whether the block is the Day Number bound block.
 */
function isDayNumberBinding( block ) {
	return (
		block?.attributes?.metadata?.bindings?.content?.source ===
		DAY_NUMBER_BINDING_SOURCE
	);
}

/**
 * Clones inner blocks, resolving the Day Number bound block's content to
 * this specific day's number directly, instead of relying on the binding
 * being (re-)evaluated inside the preview's own isolated editor context.
 * Keeps the block's own typography/color so it still looks identical to
 * the live version - just guarantees the correct value shows every time.
 *
 * @param {Array}  blocks - Real inner blocks to preview.
 * @param {Object} day    - Day data (day, isEmpty).
 *
 * @return {Array} Inner blocks with the Day Number block's value resolved.
 */
function withResolvedDayNumber( blocks, day ) {
	return ( blocks ?? [] ).map( ( block ) => {
		if ( ! isDayNumberBinding( block ) ) {
			return block;
		}

		return {
			...block,
			attributes: {
				...block.attributes,
				content: day.isEmpty ? '' : String( day.day ?? '' ),
				metadata: {
					...block.attributes?.metadata,
					bindings: undefined,
				},
			},
		};
	} );
}

/**
 * DayPreviewCell Component
 *
 * Renders a single, non-editable calendar day cell as a virtual instance:
 * a real `<td>` (matching gatherpress/calendar-day's own markup, including
 * its own color/border block-support styling) wrapping a read-only editor
 * preview of that day's real inner blocks (e.g. Day Number, Post Title,
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
 * @param {Object}   props                  - Component props.
 * @param {Object}   props.day              - Day data (day, date, posts, isEmpty, isToday).
 * @param {Array}    props.innerBlocks      - The real calendar-day block's inner blocks to preview.
 * @param {Object}   props.dayBlockAttributes - The real calendar-day block's own attributes, for style parity.
 * @param {Function} props.onActivate       - Called when the cell is clicked.
 *
 * @return {Element} Day cell preview element.
 */
export function DayPreviewCell( {
	day,
	innerBlocks,
	dayBlockAttributes,
	onActivate,
} ) {
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

	const hasDayNumberBlock = useMemo(
		() => ( innerBlocks ?? [] ).some( isDayNumberBinding ),
		[ innerBlocks ]
	);

	const resolvedBlocks = useMemo(
		() => withResolvedDayNumber( innerBlocks, day ),
		[ innerBlocks, day ]
	);

	const blockPreviewProps = useBlockPreview( {
		blocks: resolvedBlocks,
		props: { className: 'gatherpress-calendar__events' },
	} );

	// Mirror the real calendar-day block's own color/border styling (e.g. a
	// custom background) so every previewed day looks like the live one.
	const colorProps = useColorProps( dayBlockAttributes ?? {} );
	const borderProps = useBorderProps( dayBlockAttributes ?? {} );

	const classNames = [
		'gatherpress-calendar__day',
		day.isEmpty ? 'is-empty' : '',
		day.isToday ? 'is-today' : '',
		day.posts?.length > 0 ? 'has-posts' : '',
		colorProps.className,
		borderProps.className,
	]
		.filter( Boolean )
		.join( ' ' );

	const style = { ...colorProps.style, ...borderProps.style };

	if ( day.isEmpty ) {
		return <td className={ classNames } style={ style } />;
	}

	return (
		<BlockContextProvider value={ dayContext }>
			<td
				className={ classNames }
				style={ style }
				role="button"
				tabIndex={ 0 }
				onClick={ onActivate }
				onKeyPress={ onActivate }
			>
				<div className="gatherpress-calendar__day-content">
					{ ! hasDayNumberBlock && (
						<div className="gatherpress-calendar__day-number">
							{ day.day }
						</div>
					) }
					<div { ...blockPreviewProps } />
				</div>
			</td>
		</BlockContextProvider>
	);
}
