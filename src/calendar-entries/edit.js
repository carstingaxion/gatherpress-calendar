/**
 * GatherPress Calendar Entries Block Editor Component
 *
 * @package
 * @since 0.4.0
 */

import {
	useBlockProps,
	useInnerBlocksProps,
	BlockContextProvider,
	store as blockEditorStore,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUseColorProps as useColorProps,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUseBorderProps as useBorderProps,

	// __experimentalGetSpacingClassesAndStyles as getSpacingClassesAndStyles,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalGetShadowClassesAndStyles as getShadowClassesAndStyles,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalUseBlockPreview as useBlockPreview,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalGetGapCSSValue as getGapCSSValue,
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { useMemo, memo } from '@wordpress/element';

const EMPTY_ARRAY = [];

/**
 * Filter out top-level event-date blocks outside modals on multi-day events.
 *
 * @param {Array} blocks Template inner blocks.
 * @return {Array} Filtered blocks.
 */
function filterMultiDayBlocks( blocks = [] ) {
	return blocks
		.filter( ( block ) => block.name !== 'gatherpress/event-date' )
		.map( ( block ) => {
			if (
				block.name === 'gatherpress/modal-manager' &&
				block.innerBlocks
			) {
				return {
					...block,
					innerBlocks: block.innerBlocks.filter(
						( inner ) => inner.name !== 'gatherpress/event-date'
					),
				};
			}
			return block;
		} );
}

/**
 * Renders preview copies for the 2nd, 3rd, etc. posts in the day cell.
 */
const EventPreview = memo( function EventPreviewComponent( {
	blocks,
	isMultiDay = false,
} ) {
	const previewBlocks = useMemo( () => {
		return isMultiDay ? filterMultiDayBlocks( blocks ) : blocks;
	}, [ blocks, isMultiDay ] );

	const previewProps = useBlockPreview( { blocks: previewBlocks } );

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
 * Individual event item wrapper that supplies event context, span classes, and slot variables.
 */
const EventItem = memo( function EventItemComponent( {
	post,
	isFirst,
	innerBlocksProps,
	innerBlocks,
	parentAttributes,
	defaultPostType = 'post',
} ) {
	// Safely resolve postId.
	let postId;
	if ( typeof post === 'object' && typeof post?.id === 'number' ) {
		postId = post.id;
	} else if ( typeof post === 'number' ) {
		postId = post;
	}

	const postType =
		typeof post === 'object' && post?.type ? post.type : defaultPostType;

	const isAllDay = Boolean(
		typeof post === 'object' &&
		( post?.isAllDay ||
			post?.meta?.gatherpress_is_all_day === true ||
			post?.meta?.gatherpress_is_all_day === '1' ||
			post?.meta?.gatherpress_is_all_day === 1 ||
			post?.meta?.gatherpress_is_all_day === 'true' )
	);
	const totalDays = typeof post === 'object' ? ( post?.totalDays ?? 1 ) : 1;
	const isMultiDay = totalDays > 1 || isAllDay;
	const dayIndex = typeof post === 'object' ? ( post?.dayIndex ?? 1 ) : 1;
	const slot = typeof post === 'object' ? ( post?.slot ?? 0 ) : 0;
	const span =
		typeof post === 'object' ? ( post?.span ?? 'single' ) : 'single';
	const isContinued = Boolean(
		typeof post === 'object' && post?.isContinued
	);
	const isContinues = Boolean(
		typeof post === 'object' && post?.isContinues
	);

	const contextValue = useMemo( () => {
		// The placeholder item on an empty day has no event. Clear the post
		// context, so blocks like core/post-title do not show the post that
		// holds the calendar, but their own placeholder.
		if ( ! postId ) {
			return { postId: undefined, postType: undefined };
		}
		return {
			postId,
			postType,
			'gatherpress/eventSpan': span,
			'gatherpress/eventDayIndex': dayIndex,
			'gatherpress/eventTotalDays': totalDays,
			'gatherpress/isAllDay': isAllDay,
			'gatherpress/eventSlot': slot,
		};
	}, [ postId, postType, span, dayIndex, totalDays, isAllDay, slot ] );

	const colorProps = useColorProps( parentAttributes ?? {} );
	const borderProps = useBorderProps( parentAttributes ?? {} );
	// const spacingProps = getSpacingClassesAndStyles( parentAttributes ?? {} );
	const shadowProps = getShadowClassesAndStyles( parentAttributes ?? {} );

	const rowSpan = typeof post === 'object' ? ( post?.rowSpan ?? 1 ) : 1;

	const classNames = [
		'gatherpress-calendar__entry',
		postId ? `post-${ postId }` : '',
		isAllDay ? 'is-all-day' : '',
		isMultiDay ? 'is-multi-day' : '',
		span ? `is-span-${ span }` : '',
		isContinued ? 'is-span-continued' : '',
		isContinues ? 'is-span-continues' : '',
		rowSpan >= 2 ? 'has-multi-col-span' : '',
		colorProps.className,
		borderProps.className,
	]
		.filter( Boolean )
		.join( ' ' );

	const style = {
		...colorProps.style,
		'--gatherpress-calendar-dot-color': colorProps.style?.color,
		'--gatherpress-calendar-entry-slot': slot,
		'--gatherpress-calendar-row-span': rowSpan,
		...borderProps.style,
		// ...spacingProps.style,
		...shadowProps.style,
	};

	return (
		<BlockContextProvider value={ contextValue }>
			<div
				className={ classNames }
				style={ style }
				data-slot={ slot }
				data-span={ span }
				data-day-index={ dayIndex }
				data-total-days={ totalDays }
				data-row-span={ rowSpan }
			>
				{ isFirst ? (
					// The primary, editable template container
					<div { ...innerBlocksProps } />
				) : (
					// Cloned previews reflecting the same template for additional posts
					<EventPreview
						blocks={ innerBlocks }
						isMultiDay={ isMultiDay }
					/>
				) }
			</div>
		</BlockContextProvider>
	);
} );

export default function Edit( { attributes, clientId, context } ) {
	const dayPosts = context?.[ 'gatherpress/dayPosts' ] ?? EMPTY_ARRAY;
	const isEmpty = context?.[ 'gatherpress/isEmpty' ] ?? false;
	const defaultPostType = context?.postType || 'post';
	const blockGap = attributes?.style?.spacing?.blockGap;

	const blockProps = useBlockProps( {
		className: 'wp-block-gatherpress-calendar-entries',
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

	// Retrieve template blocks so additional items can mirror them in preview.
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
					parentAttributes={ attributes }
					defaultPostType={ defaultPostType }
				/>
			) ) }
		</div>
	);
}
