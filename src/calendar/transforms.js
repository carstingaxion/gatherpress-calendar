/**
 * WordPress dependencies
 */
import { createBlock, cloneBlock } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

/**
 * Helper to recursively search an innerBlocks tree for a specific block by name.
 *
 * @param {Array}  blocks    Array of block objects.
 * @param {string} blockName Block name to search for.
 * @return {Object|null} Matching block object or null.
 */
function findBlockByName( blocks = [], blockName ) {
	for ( const block of blocks ) {
		if ( block.name === blockName ) {
			return block;
		}
		if ( block.innerBlocks && block.innerBlocks.length ) {
			const found = findBlockByName( block.innerBlocks, blockName );
			if ( found ) {
				return found;
			}
		}
	}
	return null;
}

/**
 * Wraps content blocks inside the complete calendar template hierarchy.
 *
 * @param {Array} contentBlocks Blocks to preserve inside gatherpress/modal-content.
 * @return {Object} New gatherpress/calendar block.
 */
function createCalendarFromTemplate( contentBlocks = [] ) {
	// 1. Prepare preserved blocks inside modal content with a Close button
	const modalContentBlocks = [
		...contentBlocks.map( ( block ) => cloneBlock( block ) ),
		createBlock(
			'core/buttons',
			{
				align: 'center',
				layout: { type: 'flex', justifyContent: 'center' },
			},
			[
				createBlock( 'core/button', {
					tagName: 'button',
					className: 'gatherpress-modal--trigger-close',
					text: __( 'Close', 'gatherpress-calendar' ),
				} ),
			]
		),
	];

	const modalContent = createBlock(
		'gatherpress/modal-content',
		{
			style: {
				dimensions: { maxWidth: '400px' },
				spacing: {
					padding: {
						top: 'var:preset|spacing|30',
						bottom: 'var:preset|spacing|30',
						left: 'var:preset|spacing|30',
						right: 'var:preset|spacing|30',
					},
				},
			},
			backgroundColor: 'base',
		},
		modalContentBlocks
	);

	const modal = createBlock( 'gatherpress/modal', {}, [ modalContent ] );

	const trigger = createBlock( 'gatherpress/event-date', {
		displayType: 'start',
		isLink: true,
		startDateFormat: 'G:i',
		className: 'gatherpress-modal--trigger-open',
		style: {
			spacing: {
				padding: { top: '0', bottom: '0', left: '0', right: '0' },
				margin: { top: '0', bottom: '0', left: '0', right: '0' },
			},
		},
		fontSize: 'small',
	} );

	const modalManager = createBlock( 'gatherpress/modal-manager', {}, [
		trigger,
		modal,
	] );

	const entries = createBlock(
		'gatherpress/calendar-entries',
		{
			layout: { type: 'default' },
			className: 'is-style-default',
			style: {
				spacing: {
					blockGap: '0',
					padding: { top: '0', bottom: '0', left: '0', right: '0' },
					margin: { top: '0', bottom: '0', left: '0', right: '0' },
				},
				layout: {
					selfStretch: 'fill',
					flexSize: null,
				},
			},
		},
		[ modalManager ]
	);

	const dayNumber = createBlock( 'core/paragraph', {
		metadata: {
			bindings: {
				content: {
					source: 'gatherpress/calendar-day',
				},
			},
			name: 'Day Number',
		},
		style: {
			spacing: {
				margin: { top: '0', bottom: '0', left: '0', right: '0' },
			},
		},
		fontSize: 'small',
		placeholder: 'DD',
		content: 'DD',
	} );

	const day = createBlock( 'gatherpress/calendar-day', {}, [
		dayNumber,
		entries,
	] );

	const week = createBlock( 'gatherpress/calendar-week', {}, [ day ] );

	return createBlock( 'gatherpress/calendar', {}, [ week ] );
}

/**
 * Extracts preserved blocks from modal-content inside the calendar hierarchy.
 *
 * @param {Array} calendarInnerBlocks The gatherpress/calendar innerBlocks.
 * @return {Array} Blocks to place in core/post-template.
 */
function extractModalContentBlocks( calendarInnerBlocks = [] ) {
	const modalContent = findBlockByName(
		calendarInnerBlocks,
		'gatherpress/modal-content'
	);

	if ( ! modalContent || ! modalContent.innerBlocks?.length ) {
		// Fallback: look for calendar-entries or return default template blocks
		const entries = findBlockByName(
			calendarInnerBlocks,
			'gatherpress/calendar-entries'
		);
		if ( entries?.innerBlocks?.length ) {
			return entries.innerBlocks.map( ( block ) => cloneBlock( block ) );
		}
		return [
			createBlock( 'core/post-title', { isLink: true } ),
			createBlock( 'core/post-excerpt' ),
		];
	}

	// Filter out the modal's Close button since it is no longer inside a modal
	const preservedBlocks = modalContent.innerBlocks
		.filter( ( block ) => {
			const isCloseButtons =
				block.name === 'core/buttons' &&
				block.innerBlocks?.some( ( btn ) =>
					btn.attributes?.className?.includes(
						'gatherpress-modal--trigger-close'
					)
				);
			return ! isCloseButtons;
		} )
		.map( ( block ) => cloneBlock( block ) );

	return preservedBlocks.length
		? preservedBlocks
		: modalContent.innerBlocks.map( ( block ) => cloneBlock( block ) );
}
/**
 * Transforming core/post-template ➔ gatherpress/calendar:
 *
 * Clicking the block switcher in the toolbar transforms the list into a calendar.
 * The Post Title, Excerpt, Event Date, and custom blocks are moved inside the popover gatherpress/modal-content.
 *
 * Transforming gatherpress/calendar ➔ core/post-template:
 *
 * Clicking the block switcher transforms the calendar back into a standard core/post-template.
 * All blocks configured inside gatherpress/modal-content are extracted
 * and placed directly in the template loop (with the modal close button cleanly stripped).
 */
const transforms = {
	from: [
		{
			type: 'block',
			blocks: [ 'core/post-template' ],
			transform: ( attributes, innerBlocks ) => {
				return createCalendarFromTemplate( innerBlocks );
			},
		},
	],
	to: [
		{
			type: 'block',
			blocks: [ 'core/post-template' ],
			transform: ( attributes, innerBlocks ) => {
				const preservedBlocks = extractModalContentBlocks( innerBlocks );
				return createBlock( 'core/post-template', {}, preservedBlocks );
			},
		},
	],
};

export default transforms;