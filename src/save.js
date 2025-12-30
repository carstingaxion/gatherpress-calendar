/**
 * GatherPress Calendar Block Save Component
 *
 * This file defines the save function that determines how the block's
 * content is serialized and saved to the database. For this block,
 * we need to save the InnerBlocks structure which defines the template
 * for how individual events are displayed in the calendar.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @package GatherPressCalendar
 * @since 0.1.0
 */

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * Save Component
 *
 * Saves the block markup with InnerBlocks for the post template.
 * Even though this is a dynamic block (using render.php), we still
 * need to save the InnerBlocks structure so the template is preserved.
 *
 * @since 0.1.0
 *
 * @return {Element} The React element representing the saved block content.
 */
export default function save() {
	const blockProps = useBlockProps.save( {
		className: 'gatherpress-calendar-block',
	} );

	const innerBlocksProps = useInnerBlocksProps.save( {
		className: 'gatherpress-calendar-template',
	} );

	return (
		<div { ...blockProps }>
			<div { ...innerBlocksProps } />
		</div>
	);
}
