/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	BlockControls,
	InspectorControls,
} from '@wordpress/block-editor';
import {
	ToolbarGroup,
	ToolbarButton,
	PanelBody,
	RangeControl,
} from '@wordpress/components';
import { list, grid } from '@wordpress/icons';

const ENTRY_TEMPLATE = [
	[ 'core/post-title', { level: 3, isLink: true } ],
	[ 'core/post-excerpt', {} ],
];

export default function Edit( { attributes, setAttributes, context, isSelected } ) {
	const { layout = { type: 'default', columns: 3 } } = attributes;
	const isGrid = layout?.type === 'grid';
	const isList = layout?.type === 'list';
	const columns = layout?.columns || 3;

	const setDisplayLayout = ( newType ) => {
		setAttributes( {
			layout: {
				...layout,
				type: newType,
			},
		} );
	};

	const setColumns = ( newColumns ) => {
		setAttributes( {
			layout: {
				...layout,
				columns: newColumns,
			},
		} );
	};

	const classes = [
		'gatherpress-calendar__events',
		isGrid ? 'is-layout-grid' : '',
		isGrid ? `columns-${ columns }` : '',
		isList ? 'is-layout-list' : '',
		! isGrid && ! isList ? 'is-layout-flex' : '',
	]
		.filter( Boolean )
		.join( ' ' );

	const blockProps = useBlockProps( {
		className: classes,
		style: isGrid ? { '--gatherpress--columns': columns } : undefined,
	} );

	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'gatherpress-calendar__template-preview',
		},
		{
			template: ENTRY_TEMPLATE,
			templateLock: false,
		}
	);

	// Determine how many preview dots to show in the editor
	const postCount = Array.isArray( context?.[ 'gatherpress/dayPosts' ] )
		? context[ 'gatherpress/dayPosts' ].length
		: 1;
	const extraDots = Array.from( { length: Math.max( 0, postCount - 1 ) } );

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						icon={ list }
						label={ __( 'List view', 'gatherpress-calendar' ) }
						isPressed={ ! isGrid }
						onClick={ () => setDisplayLayout( isList ? 'default' : 'list' ) }
					/>
					<ToolbarButton
						icon={ grid }
						label={ __( 'Grid view', 'gatherpress-calendar' ) }
						isPressed={ isGrid }
						onClick={ () => setDisplayLayout( 'grid' ) }
					/>
				</ToolbarGroup>
			</BlockControls>

			<InspectorControls>
				<PanelBody title={ __( 'Layout', 'gatherpress-calendar' ) }>
					{ isGrid && (
						<RangeControl
							label={ __( 'Columns', 'gatherpress-calendar' ) }
							value={ columns }
							onChange={ setColumns }
							min={ 2 }
							max={ 6 }
						/>
					) }
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				{ /* First event item houses the editable InnerBlocks */ }
				<div className="gatherpress-calendar__event-item">
					<span className="gatherpress-calendar__event" aria-hidden="true" />
					<div { ...innerBlocksProps } />
				</div>

				{ /* Additional preview dots on multi-post days are also direct children */ }
				{ extraDots.map( ( _, idx ) => (
					<div key={ idx } className="gatherpress-calendar__event-item">
						<span className="gatherpress-calendar__event" aria-hidden="true" />
					</div>
				) ) }
			</div>
		</>
	);
}