/**
 * GatherPress Calendar Day Block Editor Component
 *
 * @package
 * @since 0.4.0
 */

import {
	BlockContextProvider,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { useMemo, memo } from '@wordpress/element';

import './editor.scss';

import { findDayNumberBlock } from '../utils/day-number';

const EMPTY_ARRAY = [];

/**
 * Edit Component for Calendar Day
 *
 * Renders an individual calendar cell with date information and event dots/content.
 *
 * @param {Object} props          Component props.
 * @param {Object} props.context  Context provided by parent Calendar / query.
 * @param {string} props.clientId This block's client ID.
 * @return {Element} Day cell preview element.
 */
export default memo( function Edit( { context, clientId } ) {
	const dayDate = context?.[ 'gatherpress/dayDate' ] ?? '';
	const dayNumber = context?.[ 'gatherpress/dayNumber' ] ?? 1;
	const isToday = context?.[ 'gatherpress/isToday' ] ?? false;
	const isEmpty = context?.[ 'gatherpress/isEmpty' ] ?? false;
	const weekday = context?.[ 'gatherpress/weekday' ] ?? '';
	const isWeekend = context?.[ 'gatherpress/isWeekend' ] ?? false;

	const rawPosts = context?.[ 'gatherpress/dayPosts' ];
	const posts = useMemo( () => rawPosts ?? EMPTY_ARRAY, [ rawPosts ] );

	// block.json's own providesContext only re-exposes values stored in
	// this block's *attributes*, which we never set (day number etc. are
	// purely derived from context, not persisted). That means descendants
	// - like a Day Number block bound to our binding source, which reads
	// this same context to resolve its value - would only ever see stale
	// attribute defaults. Re-provide the real, current values explicitly
	// so bindings and any other context-aware child resolve correctly.
	const dayContext = useMemo(
		() => ( {
			'gatherpress/dayDate': dayDate,
			'gatherpress/dayNumber': dayNumber,
			'gatherpress/dayPosts': posts,
			'gatherpress/isEmpty': isEmpty,
			'gatherpress/isToday': isToday,
			'gatherpress/weekday': weekday,
			'gatherpress/isWeekend': isWeekend,
		} ),
		[ dayDate, dayNumber, posts, isEmpty, isToday, weekday, isWeekend ]
	);

	// If a real Day Number block (a paragraph bound to the calendar-day
	// binding source) already exists among this day's own inner blocks,
	// it renders the day number itself - skip the plain fallback below to
	// avoid showing the number twice, and mirror its own text alignment.
	const { hasDayNumberBlock } = useSelect(
		( select ) => {
			const blocks = select( blockEditorStore ).getBlocks( clientId );
			return {
				hasDayNumberBlock: !! findDayNumberBlock( blocks ),
			};
		},
		[ clientId ]
	);

	const classNames = [
		'gatherpress-calendar__day',
		isEmpty ? 'is-empty' : '',
		isToday ? 'is-today' : '',
		posts.length > 0 ? 'has-posts' : '',
		isWeekend ? 'is-weekend' : '',
		weekday ? `is-${ weekday }` : '',
	]
		.filter( Boolean )
		.join( ' ' );

	const blockProps = useBlockProps( {
		className: classNames,
	} );

	const { children, ...innerBlocksWrapperProps } = useInnerBlocksProps(
		{},
		{
			templateLock: false,
			renderAppender: false,
		}
	);

	if ( isEmpty ) {
		return <td { ...blockProps } />;
	}

	return (
		<td { ...blockProps }>
			{ ! hasDayNumberBlock && (
				<div className="gatherpress-calendar__day-number">
					{ dayNumber }
				</div>
			) }
			<div { ...innerBlocksWrapperProps }>
				<BlockContextProvider value={ dayContext }>
					{ children }
				</BlockContextProvider>
			</div>
		</td>
	);
} );
