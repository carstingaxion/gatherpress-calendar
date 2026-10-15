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

const JUSTIFY_MAP = {
	left: {
		className: 'is-content-justification-left',
		css: 'flex-start',
	},
	center: {
		className: 'is-content-justification-center',
		css: 'center',
	},
	right: {
		className: 'is-content-justification-right',
		css: 'flex-end',
	},
	'space-between': {
		className: 'is-content-justification-space-between',
		css: 'space-between',
	},
};

const ALIGN_MAP = {
	top: {
		className: 'is-vertically-aligned-top',
		css: 'flex-start',
	},
	center: {
		className: 'is-vertically-aligned-center',
		css: 'center',
	},
	bottom: {
		className: 'is-vertically-aligned-bottom',
		css: 'flex-end',
	},
	stretch: {
		className: 'is-vertically-aligned-stretch',
		css: 'stretch',
	},
};

/**
 * Resolves flex layout properties and alignment styles.
 *
 * @param {Object} layout Block layout attribute.
 * @return {Object} { classes: Array<string>, style: Object }
 */
function resolveFlexProps( layout ) {
	const classes = [ 'is-layout-flex' ];
	const style = { display: 'flex' };
	const isVertical = layout.orientation === 'vertical';

	if ( isVertical ) {
		classes.push( 'is-vertical' );
		style.flexDirection = 'column';
	} else {
		classes.push( 'is-horizontal' );
		style.flexDirection = 'row';
	}

	if ( layout.flexWrap === 'nowrap' ) {
		classes.push( 'is-nowrap' );
		style.flexWrap = 'nowrap';
	} else {
		style.flexWrap = 'wrap';
	}

	if ( layout.justifyContent && JUSTIFY_MAP[ layout.justifyContent ] ) {
		classes.push( JUSTIFY_MAP[ layout.justifyContent ].className );
		const cssVal = JUSTIFY_MAP[ layout.justifyContent ].css;
		if ( isVertical ) {
			style.alignItems = cssVal === 'space-between' ? 'stretch' : cssVal;
		} else {
			style.justifyContent = cssVal;
		}
	}

	if ( layout.verticalAlignment && ALIGN_MAP[ layout.verticalAlignment ] ) {
		classes.push( ALIGN_MAP[ layout.verticalAlignment ].className );
		const cssVal = ALIGN_MAP[ layout.verticalAlignment ].css;
		if ( isVertical ) {
			style.justifyContent = cssVal === 'stretch' ? 'flex-start' : cssVal;
		} else {
			style.alignItems = cssVal;
		}
	}

	return { classes, style };
}

/**
 * Resolves Gutenberg layout attributes (flex, grid, orientation, justification, alignment)
 * into standard Core classes and inline styles for virtual previews.
 *
 * @param {Object} layout - Block's layout attribute object.
 * @return {Object} { className: string, style: Object }
 */
export function getLayoutProps( layout = {} ) {
	const type = layout?.type || 'default';

	if ( type === 'flex' ) {
		const { classes, style } = resolveFlexProps( layout );
		return {
			className: classes.join( ' ' ),
			style,
		};
	}

	if ( type === 'grid' ) {
		const style = { display: 'grid' };
		const columns = layout.columnFields || layout.columns;
		if ( columns ) {
			style.gridTemplateColumns = `repeat(${ columns }, minmax(0, 1fr))`;
		}
		return {
			className: 'is-layout-grid',
			style,
		};
	}

	if ( type === 'constrained' ) {
		return {
			className: 'is-layout-constrained',
			style: {},
		};
	}

	return {
		className: 'is-layout-flow',
		style: {},
	};
}
