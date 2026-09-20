import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import './editor.scss';

export default function Edit() {
	const blockProps = useBlockProps( {
		className: 'gatherpress-calendar__events',
	} );

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		templateLock: false,
	} );

	return (
		<div { ...innerBlocksProps }>
			<div className="gatherpress-calendar__event" />
		</div>
	);
}