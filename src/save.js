/**
* Query Map Block Save Component
*
* Saves the InnerBlocks structure for the post template.
*
* @package QueryMap 
* @since 0.1.0
*/

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor'; 

/**
* Save function - preserves InnerBlocks template structure. 
*
* @return {Element} Saved block markup. 
*/
export default function save() {
	const blockProps = useBlockProps.save( {
		className: 'query-map-block', 
	} );

	const innerBlocksProps = useInnerBlocksProps.save( {
		className: 'query-map-template', 
	} );

	return (
		<div { ...blockProps }>
			<div { ...innerBlocksProps } />
		</div>
	);
}