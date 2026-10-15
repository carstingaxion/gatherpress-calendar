<?php
/**
 * The "Calendar_Entries" class handles rendering of the Calendar Entries block.
 *
 * Works like core/post-template: renders one entry per event in the day
 * (from the `gatherpress/dayPosts` context), using this block's own inner
 * blocks as the template for each event.
 *
 * @package GatherPressCalendar
 * @since 0.4.0
 */

declare(strict_types=1);

namespace GatherPress_Calendar;

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit; // @codeCoverageIgnore

use GatherPress\Core\Traits\Singleton;
use WP_Block;
use WP_Post;

/**
 * Class Calendar_Entries.
 */
class Calendar_Entries {

	/**
	 * Enforces a single instance of this class.
	 */
	use Singleton;

	/**
	 * Constant representing the Block Name.
	 *
	 * @var string
	 */
	const BLOCK_NAME = 'gatherpress/calendar-entries';

	/**
	 * ID of the event whose entry renders now; 0 between entries.
	 *
	 * The public filter methods below read it, so they can be static and
	 * other code can remove them by name.
	 *
	 * @var int
	 */
	private static int $current_post_id = 0;

	/**
	 * Post type of the event whose entry renders now; '' between entries.
	 *
	 * @var string
	 */
	private static string $current_post_type = '';

	/**
	 * Span data of the event whose entry renders now; empty between entries.
	 *
	 * @var array<string, mixed>
	 */
	private static array $current_span_data = array();

	/**
	 * Current modal nesting depth to distinguish triggers from modal-content.
	 *
	 * @var int
	 */
	private static int $modal_depth = 0;

	/**
	 * Constructor.
	 */
	protected function __construct() {
		$this->setup_hooks();
	}

	/**
	 * Register block render filter.
	 *
	 * @return void
	 */
	protected function setup_hooks(): void {
		add_filter( 'register_block_type_args', array( $this, 'filter_block_type_args' ), 10, 2 );
	}

	/**
	 * Inject render_callback into block registration arguments.
	 *
	 * @param array<string, mixed> $args       Block registration arguments.
	 * @param string               $block_type Block type name (e.g. 'gatherpress/calendar-entries').
	 *
	 * @return array<string, mixed> Filtered arguments.
	 */
	public function filter_block_type_args( array $args, string $block_type ): array {
		if ( self::BLOCK_NAME === $block_type ) {
			$args['render_callback'] = array( $this, 'render_callback' );
		}

		return $args;
	}

	/**
	 * Render callback for the calendar entries list.
	 *
	 * @param array<string, mixed> $attributes Block attributes.
	 * @param string               $content    Block inner content (unused; markup is built manually).
	 * @param WP_Block             $block      Block instance.
	 *
	 * @return string Rendered HTML.
	 */
	public function render_callback( array $attributes, string $content, WP_Block $block ): string {
		$day_posts = isset( $block->context['gatherpress/dayPosts'] ) && is_array( $block->context['gatherpress/dayPosts'] )
			? $block->context['gatherpress/dayPosts']
			: array();

		$grid_config  = $block->context['gatherpress/timeGridConfig'] ?? array();
		$is_time_grid = ! empty( $grid_config['enabled'] );
		$day_number   = $block->context['gatherpress/dayNumber'] ?? 0;

		// Only return early if empty AND not in time-grid mode
		if ( empty( $day_posts ) && ! $is_time_grid ) {
			return '';
		}

		$entries_styles = array();
		$grid_gap       = Style_Processor::get_block_gap_value( $attributes );
		if ( '' !== $grid_gap ) {
			$entries_styles[] = sprintf( 'gap: %s', esc_attr( $grid_gap ) );
		}

		$extra_classes = array();
		if ( $is_time_grid ) {
			$extra_classes[] = 'has-time-grid';
		}

		$wrapper_attributes = get_block_wrapper_attributes(
			array(
				'class' => implode( ' ', $extra_classes ),
				'style' => esc_attr( implode( '; ', $entries_styles ) ),
			)
		);

		$items_html = '';
		foreach ( $day_posts as $entry ) {
			$post_id   = is_array( $entry ) ? ( $entry['id'] ?? 0 ) : $entry;
			/** @var array<string, mixed> $span_data */
			$span_data = is_array( $entry ) ? $entry : array();

			if ( is_int( $post_id ) && $post_id > 0 ) {
				$items_html .= $this->render_entry( $post_id, $block, $span_data );
			}
		}

		return sprintf(
			'<div %1$s>%2$s</div>',
			$wrapper_attributes, // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			$items_html // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		);
	}

	/**
	 * Render a single entry with its innerBlocks content.
	 *
	 * @param int                  $post_id   Post ID.
	 * @param WP_Block             $block     The Calendar Entries block instance.
	 * @param array<string, mixed> $span_data Multi-day span descriptors.
	 *
	 * @return string Event HTML with innerBlocks rendered.
	 */
	private function render_entry( int $post_id, WP_Block $block, array $span_data = array() ): string {
		$post = get_post( $post_id );
		if ( ! $post instanceof WP_Post ) {
			return '';
		}

		$inner_content = $this->render_entry_inner_content( $post, $block, $span_data );

		/**
		 * Type safety.
		 *
		 * @var array<string, mixed> $attributes
		 */
		$attributes   = isset( $block->parsed_block['attrs'] ) && is_array( $block->parsed_block['attrs'] ) ? $block->parsed_block['attrs'] : array();
		$entry_styles = $this->get_entry_styles_and_classes( $attributes );

		$row_span_raw  = $span_data['row_span'] ?? 1;
		$row_span      = is_numeric( $row_span_raw ) ? (int) $row_span_raw : 1;
		$extra_classes = $this->build_span_classes( $span_data, $row_span );

		$timed_style = '';
		if ( ! empty( $span_data['is_timed'] ) && isset( $span_data['time_row_start'], $span_data['time_row_end'] ) ) {
			$extra_classes[] = 'is-timed-event';
			$timed_style     = sprintf(
				'--gatherpress-event-time-row-start: %d; --gatherpress-event-time-row-end: %d; --gatherpress-overlap-total: %d; --gatherpress-overlap-index: %d;',
				(int) $span_data['time_row_start'],
				(int) $span_data['time_row_end'],
				(int) ( $span_data['overlap_total'] ?? 1 ),
				(int) ( $span_data['overlap_index'] ?? 0 )
			);
		}

		$classnames    = trim( $entry_styles['classnames'] . ' ' . implode( ' ', $extra_classes ) );
		$entry_classes = implode( ' ', get_post_class( $classnames, $post_id ) );

		$slot_raw        = $span_data['slot'] ?? null;
		$slot_style      = is_numeric( $slot_raw ) ? sprintf( '--gatherpress-calendar-entry-slot: %d;', (int) $slot_raw ) : '';
		$row_span_style  = sprintf( '--gatherpress-calendar-row-span: %d;', $row_span );
		$combined_style  = trim( $entry_styles['inline_styles'] . ' ' . $slot_style . ' ' . $row_span_style . ' ' . $timed_style );
		$style_attribute = '' !== $combined_style ? sprintf( ' style="%s"', esc_attr( $combined_style ) ) : '';

		$data_attributes = $this->build_entry_data_attributes( $span_data, $row_span );
		$iapi_directives = $this->build_entry_iapi_directives( $post_id );

		return sprintf(
			'<div class="%1$s"%2$s%3$s%4$s>%5$s</div>',
			esc_attr( $entry_classes ),
			$style_attribute,
			$data_attributes,
			$iapi_directives,
			$inner_content
		);
	}

	/**
	 * Render entry inner template while managing global post state.
	 *
	 * @param WP_Post              $post      Post object.
	 * @param WP_Block             $block     Calendar Entries block instance.
	 * @param array<string, mixed> $span_data Multi-day span descriptors.
	 *
	 * @return string Rendered inner content.
	 */
	private function render_entry_inner_content( WP_Post $post, WP_Block $block, array $span_data ): string {
		$original_post = ( isset( $GLOBALS['post'] ) && $GLOBALS['post'] instanceof WP_Post ) ? $GLOBALS['post'] : null;

		if ( isset( $GLOBALS['post'] ) ) {
			$GLOBALS['post'] = $post; // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited
		}
		setup_postdata( $post );

		$post_type = get_post_type( $post );
		if ( ! is_string( $post_type ) ) {
			$post_type = 'post';
		}

		$inner_blocks_raw = isset( $block->parsed_block['innerBlocks'] ) && is_array( $block->parsed_block['innerBlocks'] ) ? $block->parsed_block['innerBlocks'] : array();
		/**
		 * Type safety.
		 *
		 * @var array<int, array<string, mixed>> $inner_blocks
		 */
		$inner_blocks  = $inner_blocks_raw;
		$inner_content = $this->render_entry_template( $inner_blocks, (int) $post->ID, $post_type, $span_data );

		wp_reset_postdata();
		if ( isset( $GLOBALS['post'] ) ) {
			$GLOBALS['post'] = $original_post; // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited
		}

		return $inner_content;
	}

	/**
	 * Build CSS class list from span data.
	 *
	 * @param array<string, mixed> $span_data Multi-day span descriptors.
	 * @param int                  $row_span  Row span count.
	 *
	 * @return list<string> Extra CSS classes.
	 */
	private function build_span_classes( array $span_data, int $row_span ): array {
		$total_days_raw = $span_data['total_days'] ?? 1;
		$total_days     = is_numeric( $total_days_raw ) ? (int) $total_days_raw : 1;
		$is_multi_day   = ( $total_days > 1 ) || ! empty( $span_data['is_all_day'] );
		$is_all_day     = ! empty( $span_data['is_all_day'] );

		$classes = array();
		if ( ! empty( $span_data['span'] ) && is_string( $span_data['span'] ) ) {
			$classes[] = 'is-span-' . sanitize_html_class( $span_data['span'] );
		}
		if ( $is_all_day ) {
			$classes[] = 'is-all-day';
		}
		if ( $is_multi_day ) {
			$classes[] = 'is-multi-day';
		}
		if ( ! empty( $span_data['is_continued'] ) ) {
			$classes[] = 'is-span-continued';
		}
		if ( ! empty( $span_data['is_continues'] ) ) {
			$classes[] = 'is-span-continues';
		}
		if ( $row_span >= 2 ) {
			$classes[] = 'has-multi-col-span';
		}

		return $classes;
	}

	/**
	 * Build data-* attributes for entry markup.
	 *
	 * @param array<string, mixed> $span_data Multi-day span descriptors.
	 * @param int                  $row_span  Row span count.
	 *
	 * @return string Data attributes string.
	 */
	private function build_entry_data_attributes( array $span_data, int $row_span ): string {
		$attrs = '';
		if ( ! empty( $span_data['span'] ) && is_scalar( $span_data['span'] ) ) {
			$attrs .= sprintf( ' data-span="%s"', esc_attr( (string) $span_data['span'] ) );
		}
		if ( isset( $span_data['day_index'] ) && is_numeric( $span_data['day_index'] ) ) {
			$attrs .= sprintf( ' data-day-index="%d"', (int) $span_data['day_index'] );
		}
		if ( isset( $span_data['total_days'] ) && is_numeric( $span_data['total_days'] ) ) {
			$attrs .= sprintf( ' data-total-days="%d"', (int) $span_data['total_days'] );
		}
		if ( isset( $span_data['slot'] ) && is_numeric( $span_data['slot'] ) ) {
			$attrs .= sprintf( ' data-slot="%d"', (int) $span_data['slot'] );
		}
		$attrs .= sprintf( ' data-row-span="%d"', $row_span );

		return $attrs;
	}

	/**
	 * Build Interactivity API directives for synchronized hover/focus.
	 *
	 * @param int $post_id Post ID.
	 *
	 * @return string Directives string.
	 */
	private function build_entry_iapi_directives( int $post_id ): string {
		$context_json = wp_json_encode( array( 'eventId' => $post_id ) );

		$directives  = ' data-wp-interactive="gatherpress/calendar"';
		$directives .= sprintf( ' data-wp-context=\'%s\'', is_string( $context_json ) ? esc_attr( $context_json ) : '{}' );
		$directives .= ' data-wp-on--mouseenter="actions.hoverEvent"';
		$directives .= ' data-wp-on--mouseleave="actions.unhoverEvent"';
		$directives .= ' data-wp-on--focusin="actions.focusEvent"';
		$directives .= ' data-wp-on--focusout="actions.unfocusEvent"';
		$directives .= ' data-wp-class--is-js-hovered="callbacks.isEventHovered"';
		$directives .= ' data-wp-class--is-js-focused="callbacks.isEventFocused"';

		return $directives;
	}

	/**
	 * Track when modal rendering begins.
	 *
	 * @param mixed                $pre_render   Pre-render value.
	 * @param array<string, mixed> $parsed_block Block data.
	 *
	 * @return mixed
	 */
	public static function track_modal_depth_pre( $pre_render, array $parsed_block ) {
		$name = $parsed_block['blockName'] ?? '';
		if ( 'gatherpress/modal' === $name || 'gatherpress/modal-content' === $name ) {
			++self::$modal_depth;
		}

		return $pre_render;
	}

	/**
	 * Track when modal rendering ends.
	 *
	 * @param string               $block_content Rendered HTML.
	 * @param array<string, mixed> $parsed_block  Block data.
	 *
	 * @return string
	 */
	public static function track_modal_depth_post( string $block_content, array $parsed_block ): string {
		$name = $parsed_block['blockName'] ?? '';
		if ( ( 'gatherpress/modal' === $name || 'gatherpress/modal-content' === $name ) && self::$modal_depth > 0 ) {
			--self::$modal_depth;
		}

		return $block_content;
	}

	/**
	 * Suppress event-date block outside modal-content on multi-day events.
	 *
	 * @param string $block_content Rendered block HTML.
	 *
	 * @return string
	 */
	public static function filter_multiday_event_date( string $block_content ): string {
		// Inside modal-content: render the full date normally.
		if ( self::$modal_depth > 0 ) {
			return $block_content;
		}

		// Outside modal-content (inside trigger/ribbon): return empty string for multi-day and all-day events.
		$total_days_raw = self::$current_span_data['total_days'] ?? 1;
		$total_days     = is_numeric( $total_days_raw ) ? (int) $total_days_raw : 1;
		$is_all_day     = ! empty( self::$current_span_data['is_all_day'] );
		if ( $total_days > 1 || $is_all_day ) {
			return '';
		}

		return $block_content;
	}

	/**
	 * Render the entry template for one event.
	 *
	 * While the template renders, the filters below give its blocks this
	 * event's context, a placeholder for an empty title, and, when the
	 * template shows no Post Title, the hidden title in the Event Date link.
	 *
	 * @param array<int, array<string, mixed>> $inner_blocks Parsed blocks of the entry template.
	 * @param int                              $post_id      Event post ID.
	 * @param string                           $post_type    Event post type.
	 * @param array<string, mixed>             $span_data    Multi-day span descriptors.
	 *
	 * @return string Rendered HTML.
	 */
	private function render_entry_template( array $inner_blocks, int $post_id, string $post_type, array $span_data = array() ): string {
		// Keep the outer values, in case an entry template renders a calendar.
		$previous_post_id   = self::$current_post_id;
		$previous_post_type = self::$current_post_type;
		$previous_span_data = self::$current_span_data;

		self::$current_post_id   = $post_id;
		self::$current_post_type = $post_type;
		self::$current_span_data = $span_data;
		self::$modal_depth       = 0;

		add_filter( 'render_block_context', array( self::class, 'filter_entry_context' ), 1 );
		add_filter( 'the_title', array( self::class, 'filter_empty_title' ), 10, 2 );

		// Filter event-date on multi-day events.
		add_filter( 'pre_render_block', array( self::class, 'track_modal_depth_pre' ), 10, 2 );
		add_filter( 'render_block', array( self::class, 'track_modal_depth_post' ), 999, 2 );
		add_filter( 'render_block_gatherpress/event-date', array( self::class, 'filter_multiday_event_date' ) );

		// A template that already shows the title needs no hidden copy of it.
		if ( ! self::template_shows_post_title( $inner_blocks ) ) {
			add_filter( 'render_block_gatherpress/event-date', array( self::class, 'filter_event_date_link' ), 10, 2 );
		}

		/**
		 * Fires before the calendar renders the entry template of one event.
		 *
		 * The calendar has added its filters for this event. Callbacks can
		 * add their own filters, or remove one of the calendar's, for example:
		 * remove_filter( 'the_title', array( Calendar_Entries::class, 'filter_empty_title' ), 10 );
		 * The calendar removes its own filters after the entry renders. The
		 * action can fire more than once for the same event while a day renders.
		 *
		 * @since 0.6.1
		 *
		 * @param int                              $post_id      Event post ID.
		 * @param string                           $post_type    Event post type.
		 * @param array<int, array<string, mixed>> $inner_blocks Parsed blocks of the entry template.
		 * @param array<string, mixed>             $span_data    Multi-day span descriptors.
		 */
		do_action( 'gatherpress_calendar_before_render_entry', $post_id, $post_type, $inner_blocks, $span_data );

		$inner_content = $this->render_template( $inner_blocks );

		remove_filter( 'render_block_gatherpress/event-date', array( self::class, 'filter_event_date_link' ), 10 );
		remove_filter( 'render_block_gatherpress/event-date', array( self::class, 'filter_multiday_event_date' ), 10 );
		remove_filter( 'render_block', array( self::class, 'track_modal_depth_post' ), 999 );
		remove_filter( 'pre_render_block', array( self::class, 'track_modal_depth_pre' ), 10 );
		remove_filter( 'the_title', array( self::class, 'filter_empty_title' ), 10 );
		remove_filter( 'render_block_context', array( self::class, 'filter_entry_context' ), 1 );

		self::$current_post_id   = $previous_post_id;
		self::$current_post_type = $previous_post_type;
		self::$current_span_data = $previous_span_data;
		self::$modal_depth       = 0;

		return $inner_content;
	}

	/**
	 * Give the blocks of an entry the context of its event.
	 *
	 * Hooked to render_block_context only while an entry renders.
	 *
	 * @param array<string, mixed> $context Block context.
	 *
	 * @return array<string, mixed> Context with this event's postId and postType.
	 */
	public static function filter_entry_context( array $context ): array {
		$context['postType'] = self::$current_post_type;
		$context['postId']   = self::$current_post_id;

		if ( ! empty( self::$current_span_data ) ) {
			$context['gatherpress/eventSpan']      = self::$current_span_data['span'] ?? 'single';
			$context['gatherpress/eventDayIndex']  = self::$current_span_data['day_index'] ?? 1;
			$context['gatherpress/eventTotalDays'] = self::$current_span_data['total_days'] ?? 1;
			$context['gatherpress/isAllDay']       = ! empty( self::$current_span_data['is_all_day'] );
			if ( isset( self::$current_span_data['slot'] ) ) {
				$context['gatherpress/eventSlot'] = self::$current_span_data['slot'];
			}
		}

		return $context;
	}

	/**
	 * Add the event title to the Event Date link of an entry.
	 *
	 * Hooked to render_block_gatherpress/event-date only while an entry
	 * renders, and only when its template shows no Post Title.
	 *
	 * @param string              $block_content Rendered gatherpress/event-date block HTML.
	 * @param array<mixed, mixed> $parsed_block  Parsed gatherpress/event-date block.
	 *
	 * @return string Block HTML with the hidden title in the link.
	 */
	public static function filter_event_date_link( string $block_content, array $parsed_block ): string {
		return self::add_title_to_event_link( $block_content, $parsed_block, self::$current_post_id );
	}

	/**
	 * Give an untitled event a placeholder title.
	 *
	 * The core/post-title block renders nothing for an empty title. When the
	 * title is the modal trigger, an untitled event would have no link to
	 * open it. Hooked to the_title only while an entry renders, and only the
	 * title of that entry's event changes.
	 *
	 * Other code can call the_title with any types, so the arguments are
	 * checked, not typed.
	 *
	 * @param mixed $title Title from the_title.
	 * @param mixed $id    Post ID from the_title.
	 *
	 * @return mixed The title, or the placeholder for this event's empty title.
	 */
	public static function filter_empty_title( $title, $id = 0 ) {
		$is_this_post = is_numeric( $id ) && (int) $id === self::$current_post_id;
		$is_empty     = ! is_string( $title ) || '' === trim( wp_strip_all_tags( $title ) );

		return $is_this_post && $is_empty ? __( '(no title)', 'gatherpress-calendar' ) : $title;
	}

	/**
	 * Add the event title to an Event Date link as screen reader text.
	 *
	 * In a calendar cell the Event Date link shows only the time, so screen
	 * readers cannot tell the events of one day apart. In the default template
	 * the link is also the modal trigger, and GatherPress gives it
	 * role="button", so this names a link or a button (WCAG 4.1.2, and 2.4.4
	 * for templates without the modal). This puts a visually hidden title
	 * inside the link, the same way core/read-more does. Where the time is
	 * visible, it stays first in the name (WCAG 2.5.3); the Dots style hides
	 * the time, so there the title is the only useful part of the name.
	 *
	 * The title comes from the same post the Event Date block shows, so a
	 * block with its own `postId` attribute gets that event's title, not
	 * the title of the calendar entry.
	 *
	 * Only links get the title. A link or button needs a name that says where
	 * it goes (WCAG 2.4.4, 4.1.2). A date without a link is plain text: it
	 * shows the same time to everyone, so a hidden title would give screen
	 * reader users content that the visible calendar does not show.
	 *
	 * The Event Date block limits its output to a single `<a href>` element,
	 * so the first `</a>` closes that link. Without a link, or without a
	 * title, the content is returned unchanged.
	 *
	 * @param string              $block_content   Rendered gatherpress/event-date block HTML.
	 * @param array<mixed, mixed> $parsed_block    Parsed gatherpress/event-date block.
	 * @param int                 $default_post_id ID of the event this calendar entry renders.
	 *
	 * @return string Block HTML with the hidden title in the link.
	 */
	private static function add_title_to_event_link( string $block_content, array $parsed_block, int $default_post_id ): string {
		$link_close = stripos( $block_content, '</a>' );

		if ( false === $link_close ) {
			return $block_content;
		}

		// Mirror GatherPress\Core\Blocks\Setup::get_post_id(): a postId attribute wins.
		$attrs   = isset( $parsed_block['attrs'] ) && is_array( $parsed_block['attrs'] ) ? $parsed_block['attrs'] : array();
		$post_id = isset( $attrs['postId'] ) && is_numeric( $attrs['postId'] ) && (int) $attrs['postId'] > 0 ? (int) $attrs['postId'] : $default_post_id;
		$post    = get_post( $post_id );

		if ( ! $post instanceof WP_Post ) {
			return $block_content;
		}

		$post_title = (string) the_title_attribute(
			array(
				'post' => $post,
				'echo' => false,
			)
		);

		if ( '' === trim( $post_title ) ) {
			return $block_content;
		}

		$screen_reader_text = sprintf(
			/* translators: %s: Event title. Read by screen readers after the event time. */
			__( ', %s', 'gatherpress-calendar' ),
			$post_title
		);

		// The class is GatherPress core's General_Block::SCREEN_READER_CLASS.
		return substr_replace(
			$block_content,
			sprintf( '<span class="gatherpress--screen-reader-text">%s</span>', esc_html( $screen_reader_text ) ),
			$link_close,
			0
		);
	}

	/**
	 * Check whether an entry template shows a Post Title outside the modal.
	 *
	 * When it does, the title is already on screen and read by screen
	 * readers, so a hidden title in the Event Date link would be read twice.
	 * A Post Title inside gatherpress/modal does not count: the modal stays
	 * hidden until the trigger opens it.
	 *
	 * @param array<mixed> $blocks Parsed blocks of the entry template.
	 *
	 * @return bool True if a core/post-title block is outside every modal.
	 */
	private static function template_shows_post_title( array $blocks ): bool {
		foreach ( $blocks as $block ) {
			if ( ! is_array( $block ) ) {
				continue;
			}

			$block_name = $block['blockName'] ?? '';
			if ( 'core/post-title' === $block_name ) {
				return true;
			}

			$inner_blocks = isset( $block['innerBlocks'] ) && is_array( $block['innerBlocks'] ) ? $block['innerBlocks'] : array();
			if ( 'gatherpress/modal' !== $block_name && self::template_shows_post_title( $inner_blocks ) ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Resolve a preset or inline color value from attributes or styles.
	 *
	 * @param array<string, mixed> $attributes  Block attributes.
	 * @param array<mixed>         $style_color Inline color style array.
	 * @param string               $named_attr  Named attribute key (e.g. 'textColor').
	 * @param string               $style_prop  Style property key (e.g. 'text').
	 * @param string               $preset_type Preset type ('color' or 'gradient').
	 *
	 * @return string Resolved CSS value or empty string.
	 */
	private function resolve_color_value( array $attributes, array $style_color, string $named_attr, string $style_prop, string $preset_type = 'color' ): string {
		$named_val = isset( $attributes[ $named_attr ] ) && is_string( $attributes[ $named_attr ] ) ? $attributes[ $named_attr ] : '';
		if ( '' !== $named_val ) {
			return "var:preset|{$preset_type}|{$named_val}";
		}

		$style_val = isset( $style_color[ $style_prop ] ) && is_string( $style_color[ $style_prop ] ) ? $style_color[ $style_prop ] : '';
		return '' !== $style_val ? $style_val : '';
	}

	/**
	 * Extract color styles from attributes.
	 *
	 * @param array<string, mixed> $attributes Block attributes.
	 *
	 * @return array<string, string>
	 */
	private function extract_color_styles( array $attributes ): array {
		$color_styles = array();
		$style        = isset( $attributes['style'] ) && is_array( $attributes['style'] ) ? $attributes['style'] : array();
		$style_color  = isset( $style['color'] ) && is_array( $style['color'] ) ? $style['color'] : array();

		$mapping = array(
			'text'       => array( 'textColor', 'text', 'color' ),
			'background' => array( 'backgroundColor', 'background', 'color' ),
			'gradient'   => array( 'gradient', 'gradient', 'gradient' ),
		);

		foreach ( $mapping as $prop => $config ) {
			$value = $this->resolve_color_value( $attributes, $style_color, $config[0], $config[1], $config[2] );
			if ( '' !== $value ) {
				$color_styles[ $prop ] = $value;
			}
		}

		return $color_styles;
	}

	/**
	 * Checks whether link color is specified in attributes.
	 *
	 * @param array<string, mixed> $attributes Block attributes.
	 *
	 * @return bool True if link color is set.
	 */
	private function has_link_color( array $attributes ): bool {
		$style      = isset( $attributes['style'] ) && is_array( $attributes['style'] ) ? $attributes['style'] : array();
		$elements   = isset( $style['elements'] ) && is_array( $style['elements'] ) ? $style['elements'] : array();
		$link       = isset( $elements['link'] ) && is_array( $elements['link'] ) ? $elements['link'] : array();
		$link_color = isset( $link['color'] ) && is_array( $link['color'] ) ? $link['color'] : array();

		return ! empty( $link_color['text'] );
	}

	/**
	 * Extract border styles from attributes.
	 *
	 * @param array<string, mixed> $attributes Block attributes.
	 *
	 * @return array<string, mixed>
	 */
	private function extract_border_styles( array $attributes ): array {
		$border_styles = array();
		$border_color  = isset( $attributes['borderColor'] ) && is_string( $attributes['borderColor'] ) ? $attributes['borderColor'] : '';

		if ( '' !== $border_color ) {
			$border_styles['color'] = "var:preset|color|{$border_color}";
		}

		$style  = isset( $attributes['style'] ) && is_array( $attributes['style'] ) ? $attributes['style'] : array();
		$border = isset( $style['border'] ) && is_array( $style['border'] ) ? $style['border'] : array();

		foreach ( $border as $key => $val ) {
			if ( is_string( $key ) ) {
				$border_styles[ $key ] = $val;
			}
		}

		return $border_styles;
	}

	/**
	 * Extract shadow style from attributes.
	 *
	 * @param array<string, mixed> $attributes Block attributes.
	 *
	 * @return string|null Resolved shadow style or null.
	 */
	private function extract_shadow_style( array $attributes ): ?string {
		$style  = isset( $attributes['style'] ) && is_array( $attributes['style'] ) ? $attributes['style'] : array();
		$shadow = isset( $style['shadow'] ) && is_string( $style['shadow'] )
			? $style['shadow']
			: ( isset( $attributes['shadow'] ) && is_string( $attributes['shadow'] ) ? $attributes['shadow'] : null );

		if ( null === $shadow || '' === $shadow ) {
			return null;
		}

		if ( 0 === strpos( $shadow, 'var:preset|' ) || false !== strpos( $shadow, ' ' ) ) {
			return $shadow;
		}

		return "var:preset|shadow|{$shadow}";
	}

	/**
	 * Extract spacing styles from attributes.
	 *
	 * @param array<string, mixed> $attributes Block attributes.
	 *
	 * @return array<string, mixed> Spacing styles.
	 */
	private function extract_spacing_styles( array $attributes ): array {
		$spacing_styles = array();
		$style          = isset( $attributes['style'] ) && is_array( $attributes['style'] ) ? $attributes['style'] : array();
		$spacing        = isset( $style['spacing'] ) && is_array( $style['spacing'] ) ? $style['spacing'] : array();

		if ( ! empty( $spacing['padding'] ) ) {
			$spacing_styles['padding'] = $spacing['padding'];
		}
		if ( ! empty( $spacing['margin'] ) ) {
			$spacing_styles['margin'] = $spacing['margin'];
		}

		return $spacing_styles;
	}

	/**
	 * Builds CSS styles and classnames for an entry using wp_style_engine_get_styles.
	 *
	 * @param array<string, mixed> $attributes Block attributes.
	 *
	 * @return array{classnames: string, inline_styles: string} Resolved CSS class names and inline style values.
	 */
	private function get_entry_styles_and_classes( array $attributes ): array {
		$block_styles  = array();
		$extra_classes = array( 'gatherpress-calendar__entry' );

		if ( $this->has_link_color( $attributes ) ) {
			$extra_classes[] = 'has-link-color';
		}

		$color_styles = $this->extract_color_styles( $attributes );
		if ( ! empty( $color_styles ) ) {
			$block_styles['color'] = $color_styles;
		}

		$border_styles = $this->extract_border_styles( $attributes );
		if ( ! empty( $border_styles ) ) {
			$block_styles['border'] = $border_styles;
		}

		$shadow = $this->extract_shadow_style( $attributes );
		if ( null !== $shadow ) {
			$block_styles['shadow'] = $shadow;
		}

		$spacing_styles = $this->extract_spacing_styles( $attributes );
		if ( ! empty( $spacing_styles ) ) {
			$block_styles['spacing'] = $spacing_styles;
		}

		$styles = wp_style_engine_get_styles(
			$block_styles,
			array( 'convert_vars_to_classnames' => false )
		);

		$classnames = trim(
			implode(
				' ',
				array_filter(
					array_merge(
						$extra_classes,
						// @phpstan-ignore-next-line
						explode( ' ', $styles['classnames'] ?? '' )
					)
				)
			)
		);

		// @phpstan-ignore-next-line
		$inline_styles = $styles['css'] ?? '';

		// The dot of the "Colored Dots" style has no visible text, so it uses the text color as its background.
		if ( ! empty( $styles['declarations']['color'] ) ) {
			$dot_color = safecss_filter_attr( '--gatherpress-calendar-dot-color:' . $styles['declarations']['color'] );
			if ( '' !== $dot_color ) {
				$inline_styles .= $dot_color . ';';
			}
		}

		return array(
			'classnames'    => $classnames,
			'inline_styles' => $inline_styles,
		);
	}

	/**
	 * Renders a set of parsed blocks (this block's own template) with
	 * whatever `render_block_context` filters are currently active - used
	 * to render the calendar-entries template once per event, with that event's
	 * postId/postType injected via the filter set up by the caller.
	 *
	 * @param array<int, array<string, mixed>> $parsed_blocks Parsed inner blocks (the template).
	 *
	 * @return string Rendered HTML.
	 */
	private function render_template( array $parsed_blocks ): string {
		if ( empty( $parsed_blocks ) ) {
			return '';
		}

		// Wrap the template blocks as the inner blocks of a no-op parent so
		// that WP_Block::render()'s own inner-blocks loop applies the
		// `render_block_context` filter to each of them.
		$wrapper_block = array(
			'blockName'    => 'core/null',
			'attrs'        => array(),
			'innerBlocks'  => $parsed_blocks,
			'innerHTML'    => '',
			'innerContent' => array_fill( 0, count( $parsed_blocks ), null ),
		);

		$output = ( new WP_Block( $wrapper_block ) )->render( array( 'dynamic' => false ) );

		// @phpstan-ignore-next-line
		return is_string( $output ) ? $output : '';
	}
}
