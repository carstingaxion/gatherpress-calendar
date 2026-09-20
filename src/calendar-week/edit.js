import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import './editor.scss';

export default function Edit() {
	const blockProps = useBlockProps( {
		className: 'gatherpress-calendar__week',
	} );

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		allowedBlocks: [ 'gatherpress/calendar-day' ],
		templateLock: false,
		orientation: 'horizontal',
	} );

	return <div { ...innerBlocksProps } />;
}