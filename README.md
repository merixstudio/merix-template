# Merix Studio Web Starter Kit

## Coding guidelines
Detailed merixstudio coding guidelines can be found [here](http://coding-guidelines.next.mrx.gd/)

## Tools and technologies used in this project:

- [Gulp](http://gulpjs.com/)
- [Browserify](http://browserify.org/)
- [Nunjucks template engine](https://mozilla.github.io/nunjucks/)
- [Sass](http://sass-lang.com/)
- [Gridle](http://gridle.org/)
- [Yarn](https://yarnpkg.com/lang/en/)

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

The `-g` flag means that it will be installed in Node.js path and will be available from CLI globally.

#### Installing Yarn

To manage dependencies please use Yarn that can be downloaded [here](https://yarnpkg.com/lang/en/).

#### Dependencies

To install all required local dependencies mentioned above run this command in the project root (where `package.json` file is located):

```
yarn install
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

Compiled and bundled files are stored in `_build` dir that is created when Gulp tasks are started (those files are not versioned).

Gulp tasks are responsible for:

- Copying all static files (fonts, images, html) in the directory to `_build`
- Compiling Nunjucks templates from `templates/` to HTML files in `_build/`
- Compiling `*.scss` Sass files from `styles/` to one CSS file in `_build/styles/main.css`
- Bundling them into one file using Browserify to `Browserify` to `_build/scripts/main.js`

The default command for running gulp tasks is:

```
gulp
```

that needs to be run in project root where `gulpfiles.js` file is located.

This will run gulp in dev mode that additionally starts a dev server on `http://localhost:1337` and watches for file changes so it can reload the page on each save. Dev server is created with [BrowserSync](https://www.browsersync.io/).

There is also another gulp command for compiling files for production environment:

```
gulp production
```

This command does not start a dev server and it minifies all the styles and scripts. This command should be used when building files for backend integration.

## Folder structure

```
├── _build/              * contains built project
├── fonts/               * contains fonts and icon fonts used in the project (without fonts imported from Google Fonts / Typekit)
├── gulp/                * contains gulp tasks definitions
├── images/              * contains images used in the project
|   └── placeholders/    * contains all image placeholders
├── media/               * contains other media files that can be uploaded by the user or admin (documents, videos, etc.)
├── scripts/
|   ├── site.js          * contains Site class with find and parseContent methods
|   ├── components/      * all elements in the website should be divided into independent modules, so all scripts for modules should be defined in separate files in this directory
|   ├── polyfills/       * fill the gap between the browser and technology
|   ├── utils/           * contains common functions
|   └── vendors/         * all scripts required by the external libraries
├── styles/
|   ├── main.scss        * contains only imports of partial files described below
|   ├── base/            * contains all base styles of the website
|   ├── components/      * all elements in the website should be divided into independent modules, so all styles for modules should be defined in separate files in this directory
|   ├── layout/          * styles related with the main elements of the website eg.: footer, header, grid, forms, wysiwyg editor
|   ├── pages/           * styles needed by specific sub page if it can't be put into module
|   ├── utils/           * contains mixins and variables
|   └── vendors/         * all styles required by the external libraries
└── templates            * contains all HTML templates files
```

## Jenkins
To use Merix Jenkins modify file
```
Jenkinsfile
```
Find
```
merix-template
```
and replace it with your project name

## Docker
To build docker image use command
```
docker-compose -f dev.yml build
```
After docker build finishes successfully, run image by command
```
docker-compose -f dev.yml up
```
To open your app use [http://localhost:1337](http://localhost:1337) (also works on your local ip)
