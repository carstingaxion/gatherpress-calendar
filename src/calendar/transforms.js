/**
 * WordPress dependencies
 */
import { createBlock, cloneBlock } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	ENTRY_MODAL_MANAGER_ATTRIBUTES,
	ENTRY_START_TIME,
	ENTRY_TITLE_TRIGGER,
	EVENT_TEMPLATE_BLOCKS,
} from './edit/constants';

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
 * Instantiates the default event template block list for modal content.
 *
 * @return {Array} Array of instantiated WP_Block objects.
 */
function createDefaultModalBlocks() {
	return EVENT_TEMPLATE_BLOCKS.map( ( [ name, attrs, children ] ) => {
		const childBlocks = Array.isArray( children )
			? children.map( ( [ cName, cAttrs ] ) =>
					createBlock( cName, cAttrs )
				)
			: [];
		return createBlock( name, attrs, childBlocks );
	} );
}

/**
 * Wraps content blocks inside the complete calendar template hierarchy.
 *
 * @param {Array} contentBlocks Blocks to preserve inside gatherpress/modal-content.
 * @return {Object} New gatherpress/calendar block.
 */
function createCalendarFromTemplate( contentBlocks = [] ) {
	const closeButtonBlock = createBlock(
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
	);

	const modalContentBlocks = contentBlocks.length
		? [
				...contentBlocks.map( ( block ) => cloneBlock( block ) ),
				closeButtonBlock,
			]
		: createDefaultModalBlocks();

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

	const startTime = createBlock( ...ENTRY_START_TIME );
	const trigger = createBlock( ...ENTRY_TITLE_TRIGGER );

	const modalManager = createBlock(
		'gatherpress/modal-manager',
		ENTRY_MODAL_MANAGER_ATTRIBUTES,
		[ startTime, trigger, modal ]
	);

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
		className: 'gatherpress-calendar__day-number',
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

	// Filter out the modal's Close button since it is no longer inside a modal.
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
		: [
				createBlock( 'core/post-title', { isLink: true } ),
				createBlock( 'core/post-excerpt' ),
			];
}

/**
 * Block transforms between core/post-template and gatherpress/calendar.
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
				const preservedBlocks =
					extractModalContentBlocks( innerBlocks );
				return createBlock( 'core/post-template', {}, preservedBlocks );
			},
		},
	],
};

export default transforms;
