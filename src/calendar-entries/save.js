/**
 * GatherPress Calendar Entries Block Save Component
 *
 * Server-side rendering generates the dots and per-event popover markup;
 * this save component only preserves the InnerBlocks template structure.
 *
 * @package
 * @since 0.4.0
 */

import { InnerBlocks } from '@wordpress/block-editor';

export default function save() {
	return <InnerBlocks.Content />;
}
