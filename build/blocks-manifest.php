<?php
// This file is generated. Do not modify it manually.
return array(
	'build' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'gatherpress/query-map',
		'version' => '0.1.0',
		'title' => 'Query Map',
		'category' => 'gatherpress',
		'icon' => 'location-alt',
		'description' => 'Display query loop posts on an interactive OpenStreetMap based on their geo coordinates.',
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
			'mapHeight' => array(
				'type' => 'string',
				'default' => '500px'
			),
			'defaultZoom' => array(
				'type' => 'number',
				'default' => 10
			)
		),
		'example' => array(
			
		),
		'supports' => array(
			'reusable' => false,
			'html' => false,
			'align' => true,
			'alignWide' => true,
			'customClassName' => true
		),
		'textdomain' => 'gatherpress-calendar',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'viewScript' => 'file:./view.js',
		'render' => 'file:./render.php'
	)
);
