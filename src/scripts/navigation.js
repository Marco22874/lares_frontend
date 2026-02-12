/**
 * @file navigation.js
 * @author Marco De Luca
 * @date 2026-02-11
 * @description Handles mobile navigation toggle and
 *              header scroll shadow effect. Pure JS,
 *              no framework dependencies.
 *
 * @update_history
 *   2026-02-11 - Initial creation
 */

/**
 * @description Navigation controller class. Manages
 *              mobile menu toggle and header scroll
 *              behavior using event delegation.
 * @update 2026-02-11
 */
class NavigationController
{
  /**
   * @description Initializes the navigation controller.
   *              Binds toggle button and scroll listener.
   * @update 2026-02-11
   */
  constructor()
  {
    this.header = document.getElementById('header');
    this.toggle = document.querySelector(
      '.nav__toggle'
    );
    this.navList = document.getElementById(
      'nav-list'
    );
    this.isOpen = false;

    if (this.toggle && this.navList)
    {
      this._bindEvents();
    }
  }

  /**
   * @description Binds click and scroll event listeners.
   * @update 2026-02-11
   */
  _bindEvents()
  {
    this.toggle.addEventListener(
      'click',
      () => this._toggleMenu()
    );

    document.addEventListener(
      'keydown',
      (e) => this._handleKeydown(e)
    );

    window.addEventListener(
      'scroll',
      () => this._handleScroll(),
      { passive: true }
    );
  }

  /**
   * @description Toggles the mobile navigation menu
   *              open or closed.
   * @update 2026-02-11
   */
  _toggleMenu()
  {
    this.isOpen = !this.isOpen;

    this.navList.classList.toggle(
      'nav__list--open',
      this.isOpen
    );

    this.toggle.setAttribute(
      'aria-expanded',
      String(this.isOpen)
    );

    document.body.style.overflow =
      this.isOpen ? 'hidden' : '';
  }

  /**
   * @description Closes menu on Escape key press.
   * @param {KeyboardEvent} event - Keyboard event
   * @update 2026-02-11
   */
  _handleKeydown(event)
  {
    if (event.key === 'Escape' && this.isOpen)
    {
      this._toggleMenu();
      this.toggle.focus();
    }
  }

  /**
   * @description Adds shadow to header when scrolled.
   * @update 2026-02-11
   */
  _handleScroll()
  {
    if (!this.header)
    {
      return;
    }

    const scrolled = window.scrollY > 10;
    this.header.classList.toggle(
      'header--scrolled',
      scrolled
    );
  }
}

document.addEventListener(
  'DOMContentLoaded',
  () => new NavigationController()
);
