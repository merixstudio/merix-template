*************************************
Style guide for Nebula-based projects
*************************************

This document describes coding convetions for the Nebula itself and all projects based on it.

Readability of source code is very important, as code is more often read than written. The guidelines described here
are intended to improve readability.


Good practices
==============

Below is a list of somewhat good practices, that any developer should follow:

*  **Encoding:** Use UTF-8 encoding for all text files (JavaScript, CSS, SVG, HTML, etc.). Do not use `Byte-order mark
   <http://en.wikipedia.org/wiki/Byte-order_mark>`_.

*  **Line endings:** Use Unix line endings only (``LF``), even on Windows.

*  **Indentation:** Use 4 spaces per indentation level in all of these languages: HTML, CSS and JavaScript.

*  Strip trailing whitespace when saving (usually good code editor can do this for you automatically).


HTML
====

*  Write HTML5 documents (use this doctype: ``<!DOCTYPE html>``). If targeting IE8, ensure that HTML5 Shiv is enabled.

*  HTML code must pass validation. Always.

*  Always use double-quotes around attribute values: ``class="name"``.

*  Use ``&quot;`` inside attribute values: ``title="Tom &quot; Jerry"``.

*  Always write these characters as entities: & (``&amp;``), < (``&lt;``), > (``&gt;``).

   | Yes: ``<li>News &amp; Articles</li>``
   | No: ``<li>News & Articles</li>``

*  There is no need to use other HTML entities except these already mentioned in previous points.

   | Yes: ``<p>© Copyright ACME Corp.</p>``
   | No: ``<p>&copy; Copyright ACME Corp.</p>``

*  Use only lowercase characters for tag names, attribute names and class names.

*  Use the dash character (``-``) to separate multi-word attributes and class names:

   .. code-block:: html

      <div data-some-custom-attribute="...">

      <div class="four-word-class-name">

*  Do not use slash character at the end of self-closing tags.

   | Yes: ``<br>``
   | No: ``<br />``

   | Yes: ``<img src="..." alt="">``
   | No: ``<img src="..." alt="" />``

*  When breaking a single tag to several lines, use this indentation style:

   .. code-block:: html

      <input type="text"
             maxlength="50"
             class="required"
             name="username"
             value="">

*  Do not use empty tags. If you need some additional elements for styling, you can leverage the ``:before`` and
   ``:after`` pseudo-elements or use some extra wrappers (usually divs or spans).

*  It's not recommended to use ``<a>`` elements when generating clickable buttons with JavaScript. Instead it's better
   to use a ``<button>`` element.


CSS
===

*  Always use single-quotes in CSS code.

*  Always quote font names, even when this is not required: ``font-family: 'Arial', sans-serif``. Also capitalize
   correctly font names.

*  Always quote URLs: ``background-image: url('../images/background.png')``

*  Write one selector per line.

   Yes:

   .. code-block:: css

      input,
      select,
      textarea {...}

   No:

   .. code-block:: css

      input, select, textarea {...}

*  Use concise class names, up to three words, no longer. Words should be separated by the dash (``-``) character.
   All characters in lower case.

*  Do not put spaces after an opening brace and before a closing brace.

   | Yes: ``{color: #f00}``
   | No: ``{ color: #f00 }``

*  Skip last semicolon, right before the closing brace.

   | Yes: ``{color: #f00}``
   | No: ``{color: #f00;}``

*  Put a single space after colons and semicolons.

   | Yes: ``{color: #f00; font-size: 18px}``
   | No: ``{color:#f00;font-size:18px}``

*  When possible, use numbers as property values.

   | Yes: ``font-weight: 700``
   | No: ``font-weight: bold``

   | Yes: ``background-position: 0 0``
   | No: ``background-position: left top``

*  There is a dedicated stylesheet for IE8-only styles: :file:`styles/ie8.css`. If not targeting IE8, please delete this
   file.

*  There should be two kinds of block comments:

   .. code-block:: css

      div.page {...}
      p.other {...}


      /*
       * This is a big comment denoting a bigger code block.
       * This comment can span multiple lines.
       * This comment should have two blank lines before it.
       */
      form.contact {...}
      form.contact p {...}
      form.contact ul {...}

      /* This is a small comment, that should have one blank line preceding it */
      form.contact button {...}
      form.contact input {...}

*  All properties for given element should be written in a single line. Order of the properties matters.

   .. raw:: html

      <pre style="white-space: normal">
         {content
         <span style="color: red">position top right bottom left z-index</span>
         <span style="color: blue">overflow float clear</span>
         <span style="color: violet">visibility opacity display</span>
         <span style="color: green">box-sizing width height min-* max-* margin padding</span>
         <span style="color: olive">border-* background-* box-shadow color</span>
         <span style="color: orange">font-* line-height text-*</span> vertical-align ...}
      </pre>

   Properties in the above list are grouped and ordered by importance (most important first).

   Example:

   .. code-block:: css

      div {position: absolute; top: 0; left: 0; background-image: url('images/background.jpg') 0 0; font-size: 18px}


JavaScript
==========

*  Limit all lines to a maximum of 119 or 79 characters.

*  Use ``CamelCase`` when naming classes (and exceptions): ``function Slider() { ... }``

*  Use ``mixedCase`` (initial lowercase character) when naming variables and functions: ``changePage()``

*  Use ``UPPER_CASE_WITH_UNDERSCORES`` when naming constants (or settings in the :file:`settings.js` file):
   ``var DEBUG = true;``, ``var ANIMATION_TIME = 1000;``.

*  Use single quote for strings by default. Use double quote if a string contains single qoute character.

*  Always quote property names when using object literal.

   | Yes: ``{'age': 28}``
   | No: ``{age: 28}``

*  How to wrap long lines:

   Yes:

   .. code-block:: javascript

      context.lineTo(x + midpoint.x + this.normals[i].x*20,
                     y + midpoint.y + this.normals[i].y*20);

      context.lineTo(
          x + midpoint.x + this.normals[i].x*20, y + midpoint.y + this.normals[i].y*20);

      font = new Font('images/640/hud/font_big.png',
                      {'chars': '-x+0123456789 ', 'colors': 4, 'spacing': -3, 'widths': {
                          'x': 21, '+': 18, '0': 18, '1': 14, '2': 18, '3': 18, '4': 19, '5': 18, '6': 18, '7': 17,
                          '8': 18, '9': 18, '-': 17, ' ': 8}});

   No:

   .. code-block:: javascript

      context.lineTo(x + midpoint.x + this.normals[i].x*20,
          y + midpoint.y + this.normals[i].y*20);

      context.lineTo(x + midpoint.x + this.normals[i].x*20, y +
          midpoint.y + this.normals[i].y*20);

      font = new Font('images/640/hud/font_big.png', {'chars': '-x+0123456789 ', 'colors': 4, 'spacing': -3, 'widths':
          {'x': 21, '+': 18, '0': 18, '1': 14, '2': 18, '3': 18, '4': 19, '5': 18, '6': 18, '7': 17, '8': 18, '9': 18,
          '-': 17, ' ': 8}});

*  It's recommended to use named functions instead of anonymous ones. This is more useful for tracebacks, also improves
   readability, if function's name is chosen well.

   Yes:

   .. code-block:: javascript

      function reposition() {
         ...
      }

      jQuery(window).resize(reposition);

   No:

   .. code-block:: javascript

      jQuery(window).resize(function() {
         ...
      });

*  If you're using third-party libraries, e.g. jQuery, or Leaflet, or something else, please do use their full name
   in your code, not shorthands, like ``$`` for jQuery, or ``L`` for Leaflet.

   | Yes: ``jQuery('.slider');``
   | No: ``$('.slider');``

*  Chaining :js:func:`require` call with other code is considered a really bad practice!

   Yes:

   .. code-block:: javascript

      var jQuery = require('jquery');

      jQuery('.slider').each(function() { ...

   No:

   .. code-block:: javascript

      require('jquery')('.slider').each(function() { ...
