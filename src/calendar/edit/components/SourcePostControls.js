/**
 * Inspector controls for date range source selection.
 *
 * @package
 * @since 0.9.0
 */

import { __ } from '@wordpress/i18n';
/* eslint-disable @wordpress/no-unsafe-wp-apis */
import {
	SelectControl,
	ComboboxControl,
	BaseControl,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { useState, useMemo } from '@wordpress/element';

import { useEventPostTypes } from '../hooks/useEventPostTypes';

const EMPTY_RECORDS = [];

/**
 * SourcePostControls component.
 *
 * @param {Object}   props                   Component props.
 * @param {string}   props.dateRangeSource   Source mode ('default', 'context', 'selected').
 * @param {Function} props.onSourceChange    Callback when source changes.
 * @param {number}   props.postId            Selected post ID.
 * @param {Function} props.onPostIdChange    Callback when post ID changes.
 * @param {string}   props.sourcePostType    Selected source post type.
 * @param {Function} props.onPostTypeChange  Callback when post type changes.
 * @param {boolean}  props.hasCurrentSupport Whether context post type supports events.
 *
 * @return {Element} Source controls component.
 */
export function SourcePostControls( {
	dateRangeSource = 'default',
	onSourceChange,
	postId = 0,
	onPostIdChange,
	sourcePostType = '',
	onPostTypeChange,
	hasCurrentSupport = false,
} ) {
	const [ searchFilter, setSearchFilter ] = useState( '' );
	const eventPostTypes = useEventPostTypes();

	const isSelected =
		'selected' === dateRangeSource || 'specific_post' === dateRangeSource;

	let activeValue = 'default';
	if ( 'context' === dateRangeSource ) {
		activeValue = 'context';
	} else if ( isSelected ) {
		activeValue = 'selected';
	}

	let activePostType = 'gatherpress_event';
	if ( sourcePostType ) {
		activePostType = sourcePostType;
	} else if ( eventPostTypes.length > 0 ) {
		activePostType = eventPostTypes[ 0 ].slug;
	}

	const query = useMemo( () => {
		const baseQuery = {
			per_page: 100,
			// context: 'edit',
			status: [ 'publish' ],
			// gatherpress_event_query: 'all',
			orderby: 'title',
			order: 'asc',
		};

		if ( searchFilter ) {
			return { ...baseQuery, search: searchFilter };
		}

		return baseQuery;
	}, [ searchFilter ] );

	const { records, isLoading } = useSelect(
		( select ) => {
			if ( ! isSelected || ! activePostType ) {
				return { records: EMPTY_RECORDS, isLoading: false };
			}

			const { getEntityRecords, isResolving } = select( coreStore );
			const items = getEntityRecords( 'postType', activePostType, query );

			let resultRecords = EMPTY_RECORDS;
			if ( items ) {
				resultRecords = items;
			}

			return {
				records: resultRecords,
				isLoading: isResolving( 'getEntityRecords', [
					'postType',
					activePostType,
					query,
				] ),
			};
		},
		[ isSelected, activePostType, query ]
	);

	const postOptions = useMemo( () => {
		return records.map( ( post ) => {
			let title = `#${ post.id }`;
			if ( post.title?.raw ) {
				title = post.title.raw;
			} else if ( post.title?.rendered ) {
				title = post.title.rendered;
			}

			let statusSuffix = '';
			if ( post.status && 'publish' !== post.status ) {
				statusSuffix = ` (${ post.status })`;
			}

			return {
				value: String( post.id ),
				label: `${ title }${ statusSuffix }`,
			};
		} );
	}, [ records ] );

	const handlePostTypeSelect = ( newType ) => {
		onPostTypeChange( newType );
	};

	const handleSourceChange = ( nextValue ) => {
		if ( nextValue ) {
			onSourceChange( nextValue );
		}
	};

	return (
		<div style={ { marginBottom: '16px' } }>
			<BaseControl
				label={ __( 'Date Range Source', 'gatherpress-calendar' ) }
				id="gatherpress-calendar-date-source"
			>
				<ToggleGroupControl
					__nextHasNoMarginBottom
					label={ __( 'Date Range Source', 'gatherpress-calendar' ) }
					hideLabelFromVision
					value={ activeValue }
					onChange={ handleSourceChange }
					isBlock
					isDeselectable={ false }
				>
					<ToggleGroupControlOption
						value="default"
						label={ __( 'Default', 'gatherpress-calendar' ) }
					/>
					{ hasCurrentSupport && (
						<ToggleGroupControlOption
							value="context"
							label={ __( 'Current', 'gatherpress-calendar' ) }
						/>
					) }
					<ToggleGroupControlOption
						value="selected"
						label={ __( 'Specific', 'gatherpress-calendar' ) }
					/>
				</ToggleGroupControl>
			</BaseControl>

			{ isSelected && (
				<div style={ { marginTop: '12px' } }>
					{ eventPostTypes.length > 1 && (
						<SelectControl
							label={ __( 'Post Type', 'gatherpress-calendar' ) }
							value={ activePostType }
							options={ eventPostTypes.map( ( type ) => ( {
								label: type.name || type.slug,
								value: type.slug,
							} ) ) }
							onChange={ handlePostTypeSelect }
						/>
					) }

					<ComboboxControl
						label={ __( 'Source Post', 'gatherpress-calendar' ) }
						value={ postId ? String( postId ) : '' }
						options={ postOptions }
						onChange={ ( val ) =>
							onPostIdChange( val ? Number( val ) : 0 )
						}
						onFilterValueChange={ setSearchFilter }
						isLoading={ isLoading }
					/>
				</div>
			) }
		</div>
	);
}
