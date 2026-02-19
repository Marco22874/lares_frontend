/**
 * @file font-loader.js
 * @author Marco De Luca
 * @date 2026-02-19
 * @description Async Google Fonts loader.
 *              Avoids render-blocking and CSP
 *              inline script violations.
 */

(function ()
{
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href =
    'https://fonts.googleapis.com/css2'
    + '?family=Onest:wght@300;400;500;600;700'
    + '&display=swap';
  document.head.appendChild(link);
})();
