import { memo, useCallback, useMemo } from '@wordpress/element';
import {
	BlockContextProvider,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUseColorProps as useColorProps,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUseBorderProps as useBorderProps,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalGetSpacingClassesAndStyles as getSpacingClassesAndStyles,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalGetShadowClassesAndStyles as getShadowClassesAndStyles,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUseBlockPreview as useBlockPreview,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalGetGapCSSValue as getGapCSSValue,
} from '@wordpress/block-editor';

import {
	isDayNumberBindingBlock,
	getDayNumberJustifyContent,
	getLayoutProps,
} from '../../../utils/day-number';

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
		if ( ! isDayNumberBindingBlock( block ) ) {
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
 * @since 0.4.0
 *
 * @param {Object}   props                    - Component props.
 * @param {Object}   props.day                - Day data (day, date, posts, isEmpty, isToday).
 * @param {Array}    props.innerBlocks        - The real calendar-day block's inner blocks to preview.
 * @param {Object}   props.dayBlockAttributes - The real calendar-day block's own attributes, for style parity.
 * @param {Function} props.onActivateDay      - Called with this day's date when the cell is clicked.
 *
 * @return {Element} Day cell preview element.
 */
function DayPreviewCellComponent( {
	day,
	innerBlocks,
	dayBlockAttributes,
	onActivateDay,
} ) {
	const onActivate = useCallback(
		() => onActivateDay( day.date ),
		[ onActivateDay, day.date ]
	);
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
		() => ( innerBlocks ?? [] ).some( isDayNumberBindingBlock ),
		[ innerBlocks ]
	);

	const resolvedBlocks = useMemo(
		() => withResolvedDayNumber( innerBlocks, day ),
		[ innerBlocks, day ]
	);


	// Mirror the real calendar-day block's own color/border/spacing/shadow
	// styling (e.g. a custom background, padding, or drop-shadow) so every
	// previewed day looks like the live one.
	const colorProps = useColorProps( dayBlockAttributes ?? {} );
	const borderProps = useBorderProps( dayBlockAttributes ?? {} );
	const spacingProps = getSpacingClassesAndStyles( dayBlockAttributes ?? {} );
	const shadowProps = getShadowClassesAndStyles( dayBlockAttributes ?? {} );
	const layoutProps = getLayoutProps( dayBlockAttributes?.layout );
	// console.group("getLayoutProps");
	// console.log(dayBlockAttributes);
	// console.log(colorProps.className);
	// console.log(layoutProps.className);
	// console.log(layoutProps.style);
	// console.groupEnd();
	const classNames = [
		'gatherpress-calendar__day',
		day.isEmpty ? 'is-empty' : '',
		day.isToday ? 'is-today' : '',
		day.posts?.length > 0 ? 'has-posts' : '',
		day.isWeekend ? 'is-weekend' : '',
		day.weekday ? `is-${ day.weekday }` : '',
		colorProps.className,
		borderProps.className,
		// layoutProps.className,
	]
		.filter( Boolean )
		.join( ' ' );

	const style = {
		...colorProps.style,
		...borderProps.style,
		...spacingProps.style,
		...shadowProps.style,
		// ...layoutProps.style,
	};

	// The events row is a flex container; a block's own text-align has no
	// visible effect on its shrink-wrapped position within that row, so
	// mirror the Day Number block's alignment via justify-content instead.
	// const justifyContent = useMemo(
	// 	() => getDayNumberJustifyContent( innerBlocks ),
	// 	[ innerBlocks ]
	// );

	const blockPreviewProps = useBlockPreview( {
		blocks: resolvedBlocks,
		props: {
			// className: 'gatherpress-calendar__events',
			// className: 'block-editor-block-list__layout',
			className: layoutProps.className ? layoutProps.className : undefined,
			style: {
				...layoutProps.style,
				gap: getGapCSSValue( dayBlockAttributes?.style?.spacing?.blockGap ),
			},
		},
	} );

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
				{ ! hasDayNumberBlock && (
					<div className="gatherpress-calendar__day-number">
						{ day.day }
					</div>
				) }
				<div { ...blockPreviewProps } />
			</td>
		</BlockContextProvider>
	);
}

// Memoized: each instance mounts a real, isolated block-editor preview
// (useBlockPreview). Without memoization, every unrelated re-render
// higher up (e.g. selecting any block) would re-render every one of
// these across the whole grid, which is visibly expensive.
export const DayPreviewCell = memo( DayPreviewCellComponent );
