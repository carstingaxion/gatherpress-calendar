/**
 * Query Map Block Registration
 *
 * Registers the Query Map block with WordPress, defining its
 * edit and save functions along with associated metadata.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 *
 * @package QueryMap
 * @since 0.1.0
 */

import { registerBlockType } from '@wordpress/blocks';

/**
 * Style imports
 *
 * Imports SCSS files that contain styles applied to both the frontend
 * and the editor. The webpack configuration processes these files.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './style.scss';

/**
 * Internal dependencies
 */
import Edit from './edit';
import save from './save';
import metadata from './block.json';

/**
 * Register the Query Map block type
 *
 * This registration connects the block metadata with its edit and save
 * implementations. This is a dynamic block that uses render.php for
 * server-side rendering, but the save function preserves the InnerBlocks
 * template structure for the post popup content.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
registerBlockType( metadata.name, {
	/**
	 * Edit function for the block
	 *
	 * Renders the interactive map in the editor with configuration controls.
	 *
	 * @see ./edit.js
	 */
	edit: Edit,

	/**
	 * Save function for the block
	 *
	 * Saves the InnerBlocks template structure that defines how posts
	 * appear in map marker popups.
	 *
	 * @see ./save.js
	 */
	save,
} );