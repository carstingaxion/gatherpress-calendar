/**
 * GatherPress Calendar Entries Block Editor Component
 *
 * @package
 * @since 0.4.0
 */

import {
	useBlockProps,
	useInnerBlocksProps,
	InnerBlocks,
} from '@wordpress/block-editor';

import './editor.scss';

export default function Edit( { context, isSelected } ) {
	const dayPosts = context?.[ 'gatherpress/dayPosts' ] ?? [];
	const isEmpty = context?.[ 'gatherpress/isEmpty' ] ?? false;

	const blockProps = useBlockProps( {
		className: 'gatherpress-calendar__events',
	} );

	const innerBlocksProps = useInnerBlocksProps(
		{ className: 'gatherpress-calendar__entry-template' },
		{
			renderAppender: false
		}
	);

	// In the editor, only skip rendering if the cell is explicitly an empty padding day
	if ( isEmpty ) {
		return null;
	}

	// Show at least one placeholder dot so the block is visible and clickable
	const displayDots =
		dayPosts.length > 0 ? dayPosts : [ { id: 'placeholder' } ];

	return (
		<div { ...blockProps }>
			{ displayDots.map( ( post, index ) => (
				<div
					key={ post?.id ?? index }
					className="gatherpress-calendar__event-item"
				>
					<span
						className="gatherpress-calendar__event"
						aria-hidden="true"
					/>
				</div>
			) ) }

			{ /* The template container where inner blocks are inserted */ }
			<div { ...innerBlocksProps } />
		</div>
	);
}
