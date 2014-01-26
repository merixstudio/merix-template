*******************
Directory structure
*******************

A brief explanation on what files and directories are included in a project based on Nebula.

:file:`_source/` -- Put "source" files here, like Photoshop/Fireworks designs, specifications, etc. Contents of this
directory should never be versioned.

:file:`fonts/` -- Put font files here, IE. all .ttf, .woff, .svg and .eot files only.


Images
======

:file:`images/` -- Put all images used to *style* the site (PNGs, SVGs, JPGs). Usually most of these files should be
referenced by some style sheets in your project.

:file:`images/placeholders/` -- If your site display user-uploaded content, e.g. avatars, then here should be stored
placeholders for these uploads. If many sizes for one images are needed, name your files like this:
:file:`avatar_32x32.png`, :file:`avatar_64x64.png`, ...

:file:`media/`


JavaScript code
===============

:file:`scripts/_all.js` -- Allows you to choose, which JavaScript code should be loaded in the browser. Good place to
disable unnecessary JS code. This file shouldn't be used in a production environment, it's just a helper file!

:file:`scripts/` -- Directly in this directory you should put own modules. Remember to list them also in the
:file:`_all.js` file.

:file:`scripts/libs/` -- Put third-party libraries and scripts here.

:file:`scripts/nebula/` -- Nebula JavaScript code.

:file:`scripts/widgets/` -- Put complete UI widgets here, like modal windows, date pickers, carousels, etc.

:file:`scripts/polyfills.js` -- Contains required polyfills to run Nebula in IE8. You can add other polyfills here too.

:file:`scripts/settings.js` -- Configuration of your site, IE. constants used by various JS modules.

:file:`scripts/site.js` -- Contains the :js:class:`Site` class definition.


Style sheets
============

:file:`styles/` -- Put own Cascading Style Sheets here. Some are already provided by Nebula, read about them below.

:file:`styles/_all.css` -- Analogously to :file:`_all.js`, allows you to choose, which CSS files should be loaded in
the browser. Do not use this file in a production environment.

:file:`styles/normalize2.css` -- Normalizes styling differences between browsers. Please do not modify.

:file:`styles/base.css` -- A simple CSS reset.

:file:`styles/columns.css`

:file:`styles/forms.css`

:file:`styles/wysiwyg.css`

:file:`styles/main.css`

:file:`styles/ie8.css` -- Put styles dedicated to Internet Explorer 8 here, usually some kind of fixes.


Markup
======

:file:`_empty.html` -- Use this file as a base for own templates.


Documentation
=============

:file:`README.rst`

:file:`docs/` -- Sphinx-based documentation (you are reading it now).

