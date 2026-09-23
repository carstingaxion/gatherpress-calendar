/**
 * Shared helpers for locating the "Day Number" block - a core/paragraph
 * bound to the gatherpress/calendar-day binding source - among a calendar
 * day's real inner blocks, and reading its own visual settings so both the
 * live day and the read-only day previews can stay in sync with it.
 *
 * @package
 * @since 0.4.0
 */

const DAY_NUMBER_BINDING_SOURCE = 'gatherpress/calendar-day';

/**
 * Whether a block's `content` attribute is bound to the Day Number source.
 *
 * @param {Object} block Block object.
 *
 * @return {boolean} Whether the block is the Day Number bound block.
 */
export function isDayNumberBindingBlock( block ) {
	return (
		block?.attributes?.metadata?.bindings?.content?.source ===
		DAY_NUMBER_BINDING_SOURCE
	);
}

/**
 * Finds the Day Number bound block among a day's real inner blocks.
 *
 * @param {Array} blocks Inner blocks.
 *
 * @return {Object|undefined} The Day Number block, if present.
 */
export function findDayNumberBlock( blocks ) {
	return ( blocks ?? [] ).find( isDayNumberBindingBlock );
}

const JUSTIFY_CONTENT_BY_TEXT_ALIGN = {
	left: 'flex-start',
	center: 'center',
	right: 'flex-end',
};

/**
 * Translates the Day Number block's own text alignment into a
 * justify-content value for the flex "events" row it sits in. Text-align
 * alone has no visible effect on a shrink-wrapped flex item's position
 * within its row, so the row's main-axis alignment must follow it instead.
 *
 * @param {Array} blocks Day's real inner blocks.
 *
 * @return {string|undefined} A justify-content value, or undefined to keep the CSS default.
 */
export function getDayNumberJustifyContent( blocks ) {
	const textAlign =
		findDayNumberBlock( blocks )?.attributes?.style?.typography?.textAlign;

	return JUSTIFY_CONTENT_BY_TEXT_ALIGN[ textAlign ];
}


/**
 * Resolves Gutenberg layout attributes (flex, grid, orientation, justification, alignment)
 * into standard Core classes and inline styles for virtual previews.
 *
 * @param {Object} layout - Block's layout attribute object.
 * @return {Object} { className: string, style: Object }
 */
export function getLayoutProps( layout = {} ) {
	const classes = [];
	const style = {};

	const type = layout?.type || 'default';

	if ( type === 'flex' ) {
		classes.push( 'is-layout-flex' );
		style.display = 'flex';

		// Orientation (Row vs Column)
		if ( layout.orientation === 'vertical' ) {
			classes.push( 'is-vertical' );
			style.flexDirection = 'column';
		} else {
			classes.push( 'is-horizontal' );
			style.flexDirection = 'row';
		}

		// Flex Wrap
		if ( layout.flexWrap === 'nowrap' ) {
			classes.push( 'is-nowrap' );
			style.flexWrap = 'nowrap';
		} else {
			style.flexWrap = 'wrap';
		}

		// Justification (Horizontal along main axis)
		const justifyMap = {
			left: { className: 'is-content-justification-left', css: 'flex-start' },
			center: { className: 'is-content-justification-center', css: 'center' },
			right: { className: 'is-content-justification-right', css: 'flex-end' },
			'space-between': { className: 'is-content-justification-space-between', css: 'space-between' },
		};
		if ( layout.justifyContent && justifyMap[ layout.justifyContent ] ) {
			classes.push( justifyMap[ layout.justifyContent ].className );
			style.justifyContent = justifyMap[ layout.justifyContent ].css;
		}

		// Vertical Alignment (Cross axis)
		const alignMap = {
			top: { className: 'is-vertically-aligned-top', css: 'flex-start' },
			center: { className: 'is-vertically-aligned-center', css: 'center' },
			bottom: { className: 'is-vertically-aligned-bottom', css: 'flex-end' },
			stretch: { className: 'is-vertically-aligned-stretch', css: 'stretch' },
		};
		if ( layout.verticalAlignment && alignMap[ layout.verticalAlignment ] ) {
			classes.push( alignMap[ layout.verticalAlignment ].className );
			style.alignItems = alignMap[ layout.verticalAlignment ].css;
		}
	} else if ( type === 'grid' ) {
		classes.push( 'is-layout-grid' );
		style.display = 'grid';
		const columns = layout.columnFields || layout.columns;
		if ( columns ) {
			style.gridTemplateColumns = `repeat(${ columns }, minmax(0, 1fr))`;
		}
	} else if ( type === 'constrained' ) {
		classes.push( 'is-layout-constrained' );
	} else {
		classes.push( 'is-layout-flow' );
	}

	return {
		className: classes.join( ' ' ),
		style,
	};
}