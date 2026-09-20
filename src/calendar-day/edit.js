import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import './editor.scss';

export default function Edit( { context } ) {
	const isEmpty = context?.[ 'gatherpress/isEmpty' ] ?? false;
	const isToday = context?.[ 'gatherpress/isToday' ] ?? false;
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
			className: 'gatherpress-calendar__day-content',
		},
		{
			allowedBlocks: [ 'core/paragraph', 'gatherpress/calendar-entries' ],
			templateLock: false,
		}
	);

	if ( isEmpty ) {
		return <td { ...blockProps } />;
	}

	return (
		<td { ...blockProps }>
			<div { ...innerBlocksProps } />
		</td>
	);
}