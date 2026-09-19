import { __ } from '@wordpress/i18n';

/**
 * DayCell Component
 *
 * Renders a single calendar day cell.
 *
 * @since 0.1.0
 *
 * @param {Object} props     - Component props.
 * @param {Object} props.day - Day data object.
 *
 * @return {Element} Day cell component.
 */
export function DayCell( { day } ) {
	return (
		<td
			className={ `gatherpress-calendar__day ${
				day.isEmpty ? 'is-empty' : ''
			} ${ day.posts?.length > 0 ? 'has-posts' : '' }` }
		>
			{ ! day.isEmpty && (
				<>
					<div className="gatherpress-calendar__day-number">
						{ day.day }
					</div>
					{ day.posts?.length > 0 && (
						<div className="gatherpress-calendar__events">
							{ day.posts.map( ( post ) => (
								<div
									key={ post.id }
									className="gatherpress-calendar__event"
									title={
										post.title?.rendered ||
										__(
											'(No title)',
											'gatherpress-calendar'
										)
									}
								/>
							) ) }
						</div>
					) }
				</>
			) }
		</td>
	);
}
