****************
Nebula Framework
****************

Nebula Framework is a small and fast JavaScript+CSS Web framework used to build web-based user interfaces for complex
web sites (not single-page applications). Created by `Merixstudio <http://www.merixstudio.com/>`_ and used as a base for
many of our sites.

.. warning::
   This project is in very early development stage!


Using Nebula
============

To use Nebula just clone it's repository::

   hg clone ssh://hg@bitbucket.org/merixstudio/nebula

Or this one::

   git clone git@github.com:merixstudio/nebula.git

It's recommended to install `node.js <http://nodejs.org/>` and `gulp.js <http://gulpjs.com/>`, if you want to use some
of the features. When node.js and gulp.js are installed, then type this at command line in Nebula directory to install
any additional dependencies::

   npm install

To build project type this at commandline::

   gulp


Running the test suite
======================

Just open the ``scripts/nebula/tests/index.html`` file in any browser.
