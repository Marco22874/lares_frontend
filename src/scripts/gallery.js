/**
 * @file gallery.js
 * @author Marco De Luca
 * @date 2026-02-11
 * @description Lightbox controller for the gallery
 *              page. Opens full-size images in overlay.
 *              Pure JS, keyboard accessible.
 *
 * @update_history
 *   2026-02-11 - Initial creation
 */

/**
 * @description Gallery lightbox controller class.
 *              Handles image click to open, close
 *              on overlay click or Escape key.
 * @update 2026-02-11
 */
class GalleryController
{
  /**
   * @description Initializes lightbox and binds
   *              events to gallery items.
   * @update 2026-02-11
   */
  constructor()
  {
    this.lightbox = document.getElementById(
      'lightbox'
    );
    this.lightboxImg = document.getElementById(
      'lightbox-img'
    );
    this.gallery = document.getElementById(
      'gallery'
    );

    if (
      !this.lightbox ||
      !this.lightboxImg ||
      !this.gallery
    )
    {
      return;
    }

    this._bindEvents();
  }

  /**
   * @description Binds click and keyboard events
   *              for opening and closing lightbox.
   * @update 2026-02-11
   */
  _bindEvents()
  {
    this.gallery.addEventListener('click', (e) =>
    {
      const item = e.target.closest('.gallery-item');
      if (item)
      {
        this._open(item);
      }
    });

    this.gallery.addEventListener('keydown', (e) =>
    {
      if (e.key === 'Enter' || e.key === ' ')
      {
        const item = e.target.closest(
          '.gallery-item'
        );
        if (item)
        {
          e.preventDefault();
          this._open(item);
        }
      }
    });

    this.lightbox.querySelector(
      '.lightbox__close'
    ).addEventListener(
      'click',
      () => this._close()
    );

    this.lightbox.addEventListener('click', (e) =>
    {
      if (e.target === this.lightbox)
      {
        this._close();
      }
    });

    document.addEventListener('keydown', (e) =>
    {
      if (
        e.key === 'Escape' &&
        this.lightbox.classList.contains(
          'lightbox--open'
        )
      )
      {
        this._close();
      }
    });
  }

  /**
   * @description Opens the lightbox with the full
   *              image from the clicked gallery item.
   * @param {HTMLElement} item - Gallery item element
   * @update 2026-02-11
   */
  _open(item)
  {
    const src = item.dataset.fullSrc;
    const caption = item.dataset.caption || '';

    if (!src)
    {
      return;
    }

    this.lightboxImg.src = src;
    this.lightboxImg.alt = caption;
    this.lightbox.classList.add('lightbox--open');
    this.lightbox.setAttribute(
      'aria-hidden',
      'false'
    );
    document.body.style.overflow = 'hidden';
  }

  /**
   * @description Closes the lightbox overlay and
   *              restores page scrolling.
   * @update 2026-02-11
   */
  _close()
  {
    this.lightbox.classList.remove('lightbox--open');
    this.lightbox.setAttribute(
      'aria-hidden',
      'true'
    );
    this.lightboxImg.src = '';
    document.body.style.overflow = '';
  }
}

document.addEventListener(
  'DOMContentLoaded',
  () => new GalleryController()
);
