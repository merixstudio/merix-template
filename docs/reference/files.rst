*******************
Directory structure
*******************

A brief explanation on what files and directories are included in a project based on Nebula.

:file:`_source/`
   Put "source" files here, like Photoshop/Fireworks designs, specifications, etc. Contents of this
   directory should not be versioned.

:file:`fonts/`
   Put font files here, IE. .ttf, .woff, .svg and .eot files only.


Images
======

:file:`images/`
   Put all images used to *style* the site (PNGs, SVGs, JPGs). Usually most of these files should be
   referenced by some style sheets in your project.

:file:`images/placeholders/`
   If your site displays user-uploaded pictures, e.g. avatars, here should be stored placeholders for these uploads. If
   many sizes for one images are needed, name your files like this: :file:`avatar_32x32.png`, :file:`avatar_64x64.png`,
   etc.

:file:`media/`
   Images, which are examples of content managed by site admins or uploaded by site users. Examples:
   user avatars, article illustrations, photo gallery, etc. Recommended is to append the resolution of an image to
   filename, just for readability (:file:`article_200x400.jpg`). If there are many images in the same size and of the
   same kind, number these images like this: :file:`article_200x400_1.jpg`, :file:`article_200x400_2.jpg`, etc.


JavaScript code
===============

:file:`scripts/_all.js`
   Allows you to choose, which JavaScript code should be loaded in the browser. Good place to
   disable unnecessary JavaScript. This file shouldn't be used in a production environment, it's just a helper file!

:file:`scripts/`
   Directly in this directory you should put own modules. Remember to list them also in the :file:`_all.js` file.

:file:`scripts/libs/`
   Put third-party libraries and scripts here.

:file:`scripts/nebula/`
   Nebula JavaScript code.

:file:`scripts/widgets/`
   Put complete UI widgets here, like modal windows, date pickers, carousels, etc.

:file:`scripts/polyfills.js`
   Contains required polyfills to run Nebula in IE8. You can add other polyfills here too.

:file:`scripts/settings.js`
   Configuration of your site, IE. constants used by various JS modules. See :doc:`settings reference
   </reference/settings>` of all Nebula configuration options.

:file:`scripts/site.js`
   Contains the :js:class:`Site` class definition.


Style sheets
============

:file:`styles/`
   Put own Cascading Style Sheets here. Some are already provided by Nebula, read about them below.

:file:`styles/_all.css`
   Analogously to :file:`_all.js`, allows you to choose, which CSS files should be loaded in
   the browser. Do not use this file in a production environment.

:file:`styles/normalize2.css`
   Normalizes styling differences between browsers. Please do not modify.

:file:`styles/base.css`
   A simple CSS reset.

:file:`styles/columns.css`
   Responsive columns used layout page contents.

:file:`styles/forms.css`
   Put form-related styles here, usually various form widgets styling.

:file:`styles/wysiwyg.css`
   Contains styles usually applied to content that is an output of a WYSIWYG editor. Useful if your site contains
   editable pages and/or articles.

:file:`styles/main.css`
   Put any styles here that doesn't fit into style sheets described above.

:file:`styles/ie8.css`
   Put styles dedicated to Internet Explorer 8 here, usually some kind of fixes.


Markup
======

:file:`_empty.html`
   Use this file as a base for own templates.


Documentation
=============

:file:`README.rst`

:file:`docs/`
   Sphinx-based documentation (you are reading it now).
