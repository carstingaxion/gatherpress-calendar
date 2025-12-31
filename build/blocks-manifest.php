<?php
// This file is generated. Do not modify it manually.
return array(
	'build' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'gatherpress/calendar',
		'version' => '0.1.0',
		'title' => 'GatherPress Calendar',
		'category' => 'gatherpress',
		'icon' => 'calendar-alt',
		'description' => 'Display query loop posts in a monthly calendar format.',
		'ancestor' => array(
			'core/query'
		),
		'usesContext' => array(
			'queryId',
			'query',
			'queryContext',
			'displayLayout',
			'templateSlug',
			'previewPostType'
		),
		'attributes' => array(
			'selectedMonth' => array(
				'type' => 'string',
				'default' => ''
			),
			'monthModifier' => array(
				'type' => 'number',
				'default' => 0
			),
			'templateConfigStyle' => array(
				'type' => 'object',
				'default' => array(
					
				)
			)
		),
		'example' => array(
			
		),
		'supports' => array(
			'reusable' => false,
			'html' => false,
			'align' => true,
			'alignWide' => true,
			'customClassName' => true,
			'typography' => array(
				'fontSize' => true,
				'lineHeight' => true,
				'__experimentalFontFamily' => true,
				'__experimentalFontWeight' => true,
				'__experimentalFontStyle' => true,
				'__experimentalTextTransform' => true,
				'__experimentalTextDecoration' => true,
				'__experimentalLetterSpacing' => true,
				'__experimentalDefaultControls' => array(
					'fontSize' => true
				)
			),
			'color' => array(
				'gradients' => true,
				'link' => true,
				'__experimentalDefaultControls' => array(
					'background' => true,
					'text' => true
				)
			),
			'spacing' => array(
				'margin' => true,
				'padding' => true
			)
		),
		'styles' => array(
			array(
				'name' => 'default',
				'label' => 'Classic',
				'isDefault' => true
			),
			array(
				'name' => 'minimal',
				'label' => 'Minimal'
			),
			array(
				'name' => 'bold',
				'label' => 'Bold'
			),
			array(
				'name' => 'circular',
				'label' => 'Circular'
			),
			array(
				'name' => 'gradient',
				'label' => 'Gradient'
			)
		),
		'textdomain' => 'gatherpress-calendar',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'viewScript' => 'file:./view.js',
		'render' => 'file:./render.php'
	)
);
