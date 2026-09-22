/**
 * Resolve Gutenberg blockGap preset value to standard CSS.
 *
 * @param {string|Object|undefined} blockGap Block gap attribute value.
 * @return {string|undefined} CSS gap string.
 */
export function resolveBlockGapCSS( blockGap ) {
	if ( ! blockGap ) {
		return undefined;
	}

	if ( typeof blockGap === 'string' ) {
		if ( blockGap.startsWith( 'var:preset|' ) ) {
			const parts = blockGap.split( '|' );
			return `var(--wp--preset--${ parts[ 1 ] }--${ parts[ 2 ] })`;
		}
		return blockGap;
	}

	if ( typeof blockGap === 'object' ) {
		const top = resolveBlockGapCSS( blockGap.top ) || '1px';
		const left = resolveBlockGapCSS( blockGap.left ) || '1px';
		return `${ top } ${ left }`;
	}

	return undefined;
}
