/******/ (() => { // webpackBootstrap
/*!*********************!*\
  !*** ./src/view.js ***!
  \*********************/
/**
 * GatherPress Calendar Block Frontend Script
 *
 * Progressive enhancement for the GatherPress Calendar block.
 * Minimal JavaScript - only for popover interaction.
 * Everything else is handled by CSS.
 *
 * Without JS: Event dots are clickable links that navigate to posts
 * With JS: Event dots show popovers with content overlay
 *
 * @package GatherPressCalendar
 * @since 0.1.0
 */

(function () {
  'use strict';

  let activePopover = null;
  let activeBackdrop = null;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /**
   * Initialize popover functionality
   */
  function init() {
    const calendars = document.querySelectorAll('.gatherpress-calendar');
    if (!calendars.length) return;
    calendars.forEach(setupCalendar);

    // Close on escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && activePopover) {
        closePopover();
      }
    });
  }

  /**
   * Setup calendar event handlers
   */
  function setupCalendar(calendar) {
    const events = calendar.querySelectorAll('.gatherpress-calendar__event');
    events.forEach(function (eventLink) {
      eventLink.setAttribute('role', 'button');
      eventLink.setAttribute('tabindex', '0');

      // Click handler - prevent navigation, show popover
      eventLink.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        showPopover(eventLink);
      });

      // Keyboard support
      eventLink.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          showPopover(eventLink);
        }
      });
    });
  }

  /**
   * Show popover with event content
   */
  function showPopover(eventLink) {
    if (activePopover) closePopover();
    const content = eventLink.innerHTML;
    const customStyle = eventLink.getAttribute('data-popover-style') || '';

    // Create backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'gatherpress-calendar__backdrop';
    backdrop.addEventListener('click', closePopover);
    document.body.appendChild(backdrop);

    // Create popover
    const popover = document.createElement('div');
    popover.className = 'gatherpress-calendar__popover';
    popover.setAttribute('role', 'dialog');
    popover.setAttribute('aria-modal', 'true');
    if (customStyle) {
      popover.setAttribute('style', customStyle);
    }

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'gatherpress-calendar__popover-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.addEventListener('click', closePopover);
    popover.innerHTML = content;
    popover.appendChild(closeBtn);
    document.body.appendChild(popover);

    // Position
    positionPopover(popover, eventLink);

    // Animate in
    setTimeout(function () {
      backdrop.classList.add('is-active');
      popover.classList.add('is-active');
    }, 10);
    activePopover = popover;
    activeBackdrop = backdrop;
    popover.focus();

    // Update position on scroll/resize
    const updatePos = function () {
      if (activePopover) positionPopover(popover, eventLink);
    };
    window.addEventListener('scroll', updatePos);
    window.addEventListener('resize', updatePos);
    popover._cleanup = function () {
      window.removeEventListener('scroll', updatePos);
      window.removeEventListener('resize', updatePos);
    };
  }

  /**
   * Position popover near the event dot
   */
  function positionPopover(popover, eventLink) {
    const linkRect = eventLink.getBoundingClientRect();
    const popRect = popover.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const gap = 10;
    let top = linkRect.bottom + gap;
    let left = linkRect.left + linkRect.width / 2 - popRect.width / 2;

    // Keep in viewport horizontally
    if (left < gap) left = gap;
    if (left + popRect.width > vw - gap) left = vw - popRect.width - gap;

    // Keep in viewport vertically
    if (top + popRect.height > vh - gap) {
      top = linkRect.top - popRect.height - gap;
    }
    if (top < gap) top = gap;
    popover.style.top = top + 'px';
    popover.style.left = left + 'px';
  }

  /**
   * Close popover
   */
  function closePopover() {
    if (!activePopover) return;
    if (activePopover._cleanup) activePopover._cleanup();
    activePopover.classList.remove('is-active');
    if (activeBackdrop) activeBackdrop.classList.remove('is-active');
    setTimeout(function () {
      if (activePopover && activePopover.parentNode) {
        activePopover.parentNode.removeChild(activePopover);
      }
      if (activeBackdrop && activeBackdrop.parentNode) {
        activeBackdrop.parentNode.removeChild(activeBackdrop);
      }
      activePopover = null;
      activeBackdrop = null;
    }, 200);
  }
})();
/******/ })()
;
//# sourceMappingURL=view.js.map