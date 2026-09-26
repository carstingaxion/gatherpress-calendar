/**
 * GatherPress Calendar Entries Block Editor Component
 *
 * @package
 * @since 0.4.0
 */

import {
	useBlockProps,
	useInnerBlocksProps,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUseBlockPreview as useBlockPreview,
	BlockContextProvider,
	store as blockEditorStore,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalGetGapCSSValue as getGapCSSValue,
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { useMemo, memo } from '@wordpress/element';

import './editor.scss';

const EMPTY_ARRAY = [];

/**
 * Renders preview copies for the 2nd, 3rd, etc. posts in the day cell.
 */
const EventPreview = memo( function EventPreviewComponent( { blocks } ) {
	const previewProps = useBlockPreview( { blocks } );
	return (
		<div
			{ ...previewProps }
			className={ `gatherpress-calendar__entry-template ${
				previewProps.className || ''
			}` }
		/>
	);
} );

/**
 * Individual event item wrapper that supplies postId and postType context.
 */
const EventItem = memo( function EventItemComponent( {
	post,
	isFirst,
	innerBlocksProps,
	innerBlocks,
} ) {
	// Safely resolve postId and postType whether post is an object or primitive ID
	const postId =
		typeof post === 'object' && typeof post?.id === 'number'
			? post.id
			: typeof post === 'number'
			? post
			: undefined;

	const postType =
		typeof post === 'object' && post?.type
			? post.type
			: 'gatherpress_event';

	const contextValue = useMemo( () => {
		if ( ! postId ) {
			return {};
		}
		return {
			postId,
			postType,
		};
	}, [ postId, postType ] );

	return (
		<BlockContextProvider value={ contextValue }>
			<div className="gatherpress-calendar__entry">
				{ isFirst ? (
					// The primary, editable template container
					<div { ...innerBlocksProps } />
				) : (
					// Cloned previews reflecting the same template for additional posts
					<EventPreview blocks={ innerBlocks } />
				) }
			</div>
		</BlockContextProvider>
	);
} );

export default function Edit( { attributes, clientId, context } ) {
	const dayPosts = context?.[ 'gatherpress/dayPosts' ] ?? EMPTY_ARRAY;
	const isEmpty = context?.[ 'gatherpress/isEmpty' ] ?? false;
	const blockGap = attributes?.style?.spacing?.blockGap;

	const blockProps = useBlockProps( {
		style: {
			gap: blockGap ? getGapCSSValue( blockGap ) : undefined,
		},
	} );

	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'gatherpress-calendar__entry-template',
		},
		{
			renderAppender: false,
		}
	);

	// Retrieve the template blocks so additional items can mirror them in preview
	const innerBlocks = useSelect(
		( select ) =>
			select( blockEditorStore ).getBlock( clientId )?.innerBlocks ??
			EMPTY_ARRAY,
		[ clientId ]
	);

	// Skip rendering if the cell is an empty padding day
	if ( isEmpty ) {
		return null;
	}

	// Show at least one placeholder item so the block template is editable on empty days
	const displayDots =
		dayPosts.length > 0 ? dayPosts : [ { id: 'placeholder' } ];

	return (
		<div { ...blockProps }>
			{ displayDots.map( ( post, index ) => (
				<EventItem
					key={ post?.id ?? index }
					post={ post }
					isFirst={ index === 0 }
					innerBlocksProps={ innerBlocksProps }
					innerBlocks={ innerBlocks }
				/>
			) ) }
		</div>
	);
}
