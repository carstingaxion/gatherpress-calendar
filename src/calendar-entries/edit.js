/**
 * GatherPress Calendar Entries Block Editor Component
 *
 * @package GatherPressCalendar
 * @since 0.5.0
 */

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

import './editor.scss';

/**
 * Edit Component for Calendar Entries
 *
 * Works like core/post-template: this block's own inner blocks are the
 * *template* used to render each of this day's events - for now, only
 * for the event's hidden popover content (see class-calendar-entries.php
 * on the PHP side).
 *
 * There isn't a real "current event" to render the template against in
 * the editor canvas, so for now this doesn't build a per-event preview:
 * it shows one placeholder dot per event (matching the frontend's dots
 * before a dot is clicked), and renders the template inner blocks in a
 * hidden container that's only reachable through the List View - editing
 * an event's popover content live in the canvas is a later step.
 *
 * @param {Object} props         Component props.
 * @param {Object} props.context Context provided by the Calendar Day block.
 *
 * @return {Element|null} Calendar Entries editor element.
 */
export default function Edit( { context } ) {
	const dayPosts = context?.[ 'gatherpress/dayPosts' ] ?? [];
	const isEmpty = context?.[ 'gatherpress/isEmpty' ] ?? false;

	const blockProps = useBlockProps( {
		className: 'gatherpress-calendar__events',
	} );

	const innerBlocksProps = useInnerBlocksProps(
		{ className: 'gatherpress-calendar__entry-template' },
		{ renderAppender: false }
	);

	if ( isEmpty || ! dayPosts.length ) {
		return null;
	}

	return (
		<div { ...blockProps }>
			{ dayPosts.map( ( post, index ) => (
				<div
					key={ post?.id ?? index }
					className="gatherpress-calendar__event-item"
				/>
			) ) }
			<div { ...innerBlocksProps } />
		</div>
	);
}
