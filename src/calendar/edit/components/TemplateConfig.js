import { __ } from '@wordpress/i18n';

/**
 * TemplateConfig Component
 *
 * Renders the template configuration area with styling.
 *
 * @since 0.1.0
 *
 * @param {Object} props                      - Component props.
 * @param {Object} props.templateConfigStyles - Inline styles object.
 * @param {Object} props.innerBlocksProps     - Inner blocks props.
 *
 * @return {Element} Template config component.
 */
export function TemplateConfig( { templateConfigStyles, innerBlocksProps } ) {
	return (
		<div
			className="gatherpress-calendar__template-config"
			style={ templateConfigStyles }
		>
			<p className="gatherpress-calendar__template-label">
				{ __(
					'Configure how events appear in the calendar by adding blocks below:',
					'gatherpress-calendar'
				) }
			</p>
			<div { ...innerBlocksProps } />
		</div>
	);
}
