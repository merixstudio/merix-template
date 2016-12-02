# Merix Studio Web Starter Kit

## Tools and technologies used in this project:

- [Gulp](http://gulpjs.com/)
- [Browserify](http://browserify.org/)
- [Nunjucks template engine](https://mozilla.github.io/nunjucks/)
- [Sass](http://sass-lang.com/)
- [Gridle](http://gridle.org/)

## Getting started

### Installing Node.js

Only requirement is to install [Node.js](https://nodejs.org/).

Please be sure you have Node.js and npm (node package manager that comes along with Node) in your OS enviroment path so it can be run from command line interface.

If you work on Windows the default paths are:

`C:\Program Files\nodejs\`

`C:\Users\<user_name>\AppData\Roaming\npm\`

When installing Node you can choose to add them for you automatically.

### Installing other tools

Gulp is needed to be installed globally (one time installation) with commands:

```
npm install -g gulp
```

_The `-g` flag means that it will be installed in Node.js path and will be available from CLI globally._

To install all required local dependencies mentioned above run this command in the project root (where `package.json` file is located):

```
npm install
```

This will install all the required modules in `node_modules` folder. This folder is not versioned and has to be installed manually by everyone working on the project.

### Running

To run build process and start development server simply run:

```
gulp
```

To automatically open the page in a default browser you can add parameter:

```
gulp --open
```

Also you can choose the browser (`--open` parameter is unnecessary):

```
gulp --chrome
gulp --firefox
```

Gulp is finding `icons.zip` file to add them to project. You can change options in `config.js` file. Also you can change path to zip in console:

```
gulp --icons new/path/to/icons.zip
```

## Gulp tasks

Gulp is responsible for the whole compiling and bundling process. All Gulp tasks are defined in the `gulp` folder.

Compiled and bundled files are stored in `_build` dir that is created when Gulp task are started (those files are not versioned).

Gulp tasks are responsible for:

- Copy all static files (fonts, images, html) in the directory to `_build`
- Compile Nunjucks templates from `templates/` to HTML files in `_build/`
- Compile `*.scss` Sass files from `styles/` to one CSS file in `_build/styles/main.css`
- Bundles them into one file using `Browserify` to `_build/scripts/main.js`

The default command for running gulp tasks is:

```
gulp
```

that needs to be run in project root where `gulpfiles.js` file is located.

This will run gulp in `dev` mode that additionally starts a dev server on `http://localhost:1337` and watches for file changes so it can reload the page on each save. Dev server is created with [BrowserSync](https://www.browsersync.io/).

There is also another gulp command for compiling files for production environment:

```
gulp production
```

this command doesn't start a dev server and it minifies all the styles and scripts. This command should be used when build files for backend integration.

## Folder structure

```
├── _build  # Contains builded project
├── fonts   # Contains fonts and icon fonts used in the project
│           # (without fonts imported from Google Fonts/Typekit etc.)
├── gulp    # Contains Gulp tasks definitions
├── images  # Contains images used in the project
├── media   # Contains other media files used in project (documents, videos etc.)
├── scripts         # Contains all script files
├── styles          # Contains all styles used in the project
│   ├── base        # Base styles
│   ├── components  # Styles for specific components
│   ├── layout      # Layout styles
│   ├── pages       # Page specific styles
│   └── utils       # Utilities, helpers styles
└── templates       # Contains all HTML templates files
```