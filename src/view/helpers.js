/**
 * Parse inline style string to object
 *
 * Converts "background: #fff; padding: 1rem" to object.
 *
 * @param {string} styleString - CSS style string
 * @return {Object} Styles object
 */
export function parseStyleString( styleString ) {
	const styles = {};

	styleString.split( ';' ).forEach( ( rule ) => {
		const [ property, value ] = rule.split( ':' ).map( ( s ) => s.trim() );
		if ( property && value ) {
			// Convert kebab-case to camelCase
			const camelProperty = property.replace( /-([a-z])/g, ( g ) =>
				g[ 1 ].toUpperCase()
			);
			styles[ camelProperty ] = value;
		}
	} );

	return styles;
}

/**
 * Calculate popover position near trigger element
 *
 * It calculates optimal popover position and applies it directly.
 *
 * @param {HTMLElement} popover        - The event dot element
 * @param {HTMLElement} eventLink      - The popover element
 * @param {Object}      POPOVER_CONFIG - The configuration arguments for popovers
 */
export function applyCalculatedPosition( popover, eventLink, POPOVER_CONFIG ) {
	const linkRect = eventLink.getBoundingClientRect();
	const popRect = popover.getBoundingClientRect() || {
		width: 350,
		height: 200,
	};
	const vw = window.innerWidth;
	const vh = window.innerHeight;
	const { gap, margin } = POPOVER_CONFIG;

	// Start with popover below the dot.
	let top = linkRect.bottom + gap;
	// Center horizontally on the dot.
	let left = linkRect.left + linkRect.width / 2 - popRect.width / 2;

	// Keep in viewport horizontally.
	if ( left < margin ) {
		left = margin;
	}
	if ( left + popRect.width > vw - margin ) {
		left = vw - popRect.width - margin;
	}

	// Keep in viewport vertically.
	// If popover would extend below viewport, show it above the dot instead.
	if ( top + popRect.height > vh - margin ) {
		top = linkRect.top - popRect.height - gap;
	}
	// If still not enough space, clamp to viewport top.
	if ( top < margin ) {
		top = margin;
	}

	// Apply calculated position directly.
	popover.style.top = `${ top }px`;
	popover.style.left = `${ left }px`;
}
