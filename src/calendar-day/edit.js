/**
 * GatherPress Calendar Day Block Editor Component
 *
 * @package GatherPressCalendar
 * @since 0.4.0
 */

import { __ } from '@wordpress/i18n';
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

import './editor.scss';

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
export default function Edit( { context } ) {
	const dayNumber = context?.[ 'gatherpress/dayNumber' ] ?? 1;
	const isToday = context?.[ 'gatherpress/isToday' ] ?? false;
	const isEmpty = context?.[ 'gatherpress/isEmpty' ] ?? false;
	const posts = context?.[ 'gatherpress/dayPosts' ] ?? [];

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
				<div className="gatherpress-calendar__day-number">
					{ dayNumber }
				</div>
				<div { ...innerBlocksProps } />
			</div>
		</td>
	);
}