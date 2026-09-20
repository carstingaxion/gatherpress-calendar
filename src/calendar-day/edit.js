/**
 * GatherPress Calendar Day Block Editor Component
 *
 * @package GatherPressCalendar
 * @since 0.4.0
 */

import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';

import './editor.scss';

import {
	findDayNumberBlock,
	getDayNumberJustifyContent,
} from '../utils/day-number';

/**
 * Edit Component for Calendar Day
 *
 * Renders an individual calendar cell with date information and event dots/content.
 *
 * @param {Object} props         Component props.
 * @param {Object} props.context Context provided by parent Calendar / query.
 *
 * @return {Element} Day cell preview element.
 */
export default function Edit( { context, clientId } ) {
	const dayNumber = context?.[ 'gatherpress/dayNumber' ] ?? 1;
	const isToday = context?.[ 'gatherpress/isToday' ] ?? false;
	const isEmpty = context?.[ 'gatherpress/isEmpty' ] ?? false;
	const posts = context?.[ 'gatherpress/dayPosts' ] ?? [];

	// If a real Day Number block (a paragraph bound to the calendar-day
	// binding source) already exists among this day's own inner blocks,
	// it renders the day number itself - skip the plain fallback below to
	// avoid showing the number twice, and mirror its own text alignment.
	const { hasDayNumberBlock, justifyContent } = useSelect(
		( select ) => {
			const blocks = select( blockEditorStore ).getBlocks( clientId );
			return {
				hasDayNumberBlock: !! findDayNumberBlock( blocks ),
				justifyContent: getDayNumberJustifyContent( blocks ),
			};
		},
		[ clientId ]
	);

	const classNames = [
		'gatherpress-calendar__day',
		isEmpty ? 'is-empty' : '',
		isToday ? 'is-today' : '',
		posts.length > 0 ? 'has-posts' : '',
	]
		.filter( Boolean )
		.join( ' ' );

	const blockProps = useBlockProps( {
		className: classNames,
	} );

	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'gatherpress-calendar__events',
			style: justifyContent ? { justifyContent } : undefined,
		},
		{
			templateLock: false,
		}
	);

	if ( isEmpty ) {
		return <td { ...blockProps } />;
	}

	return (
		<td { ...blockProps }>
			<div className="gatherpress-calendar__day-content">
				{ ! hasDayNumberBlock && (
					<div className="gatherpress-calendar__day-number">
						{ dayNumber }
					</div>
				) }
				<div { ...innerBlocksProps } />
			</div>
		</td>
	);
}